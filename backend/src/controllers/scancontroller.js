const Pass = require("../models/pass");
const ScanLog = require("../models/scanlog");
const { isHostingActive } = require("../utils/hostingvalidity");

exports.scanPass = async (req, res) => {
  try {
    const { qrCode, eventId } = req.body; 
    const security = req.security;

    if (!qrCode) {
      return res.status(400).json({ 
        success: false,
        message: "QR code required" 
      });
    }

    const qrParts = qrCode.split('|');
    
    if (qrParts.length !== 2) {
      await ScanLog.create({
        place: security.place._id,
        scannedBy: security._id,
        scanType: "ENTRY",
        status: "FAILED",
        failureReason: "Invalid QR code format"
      });

      return res.status(400).json({
        success: false,
        valid: false,
        message: "Invalid QR code format"
      });
    }

    const [passId, qrToken] = qrParts;
    
    const pass = await Pass.findById(passId)
      .populate("place")
      .populate("bookedBy", "name email")
      .populate("guest");

    if (!pass) {
      await ScanLog.create({
        pass: passId,
        place: security.place._id,
        scannedBy: security._id,
        scanType: "ENTRY",
        status: "FAILED",
        failureReason: "Pass not found"
      });

      return res.status(404).json({ 
        success: false,
        valid: false,
        message: "Pass not found" 
      });
    }

    // Verify place matches
    if (pass.place._id.toString() !== security.place._id.toString()) {
      console.log('❌ Place mismatch');
      
      await ScanLog.create({
        pass: passId,
        visitor: pass.bookedBy._id,
        place: security.place._id,
        scannedBy: security._id,
        scanType: "ENTRY",
        status: "FAILED",
        failureReason: "Pass not for this place"
      });

      return res.status(403).json({ 
        success: false,
        valid: false,
        message: "Pass not for this place" 
      });
    }

    // Verify QR token
    if (pass.qrToken !== qrToken) {
      console.log('❌ Invalid QR token');
      
      await ScanLog.create({
        pass: passId,
        visitor: pass.bookedBy._id,
        place: security.place._id,
        scannedBy: security._id,
        scanType: "ENTRY",
        status: "FAILED",
        failureReason: "Invalid QR token"
      });

      return res.status(400).json({ 
        success: false,
        valid: false,
        message: "Invalid or tampered QR code" 
      });
    }

    // Check if QR is active
    if (!pass.qrActive) {
      console.log('❌ QR inactive');
      
      await ScanLog.create({
        pass: passId,
        visitor: pass.bookedBy._id,
        place: security.place._id,
        scannedBy: security._id,
        scanType: "ENTRY",
        status: "FAILED",
        failureReason: "QR code inactive"
      });

      return res.status(400).json({ 
        success: false,
        valid: false,
        message: "QR code is inactive or cancelled" 
      });
    }

    // Check pass status
    if (pass.status !== "APPROVED") {
      await ScanLog.create({
        pass: passId,
        visitor: pass.bookedBy._id,
        place: security.place._id,
        scannedBy: security._id,
        scanType: "ENTRY",
        status: "FAILED",
        failureReason: `Pass status: ${pass.status}`
      });

      return res.status(400).json({ 
        success: false,
        valid: false,
        message: `Pass is ${pass.status}` 
      });
    }

    // Check visit date
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const visitDate = new Date(pass.visitDate);
    visitDate.setHours(0, 0, 0, 0);

    if (visitDate.getTime() !== today.getTime()) {
      await ScanLog.create({
        pass: passId,
        visitor: pass.bookedBy._id,
        place: security.place._id,
        scannedBy: security._id,
        scanType: "ENTRY",
        status: "FAILED",
        failureReason: "Visit date mismatch"
      });

      return res.status(400).json({ 
        success: false,
        valid: false,
        message: `Pass is valid for ${visitDate.toLocaleDateString()}, not today` 
      });
    }

    // Check if already checked in
    if (pass.checkInTime) {
      return res.status(400).json({ 
        success: false,
        valid: false,
        message: "Already checked in",
        alreadyCheckedIn: true,
        usedAt: pass.checkInTime
      });
    }

    // Check if already exited
    if (pass.checkOutTime) {
      return res.status(400).json({ 
        success: false,
        valid: false,
        message: "Visitor already exited. Cannot re-enter." 
      });
    }

    pass.checkInTime = new Date();
    await pass.save();

    console.log('✅ Check-in successful for:', pass.guest.name);

    // Create success log
    await ScanLog.create({
      pass: passId,
      visitor: pass.bookedBy._id,
      host: pass.host,
      place: pass.place._id,
      scannedBy: security._id,
      scanType: "ENTRY",
      status: "SUCCESS"
    });

    res.json({ 
      success: true,
      valid: true,
      message: "Pass verified successfully",
      visitor: {
        name: pass.guest.name,
        email: pass.guest.email,
        passType: pass.amountPaid > 0 ? "PAID" : "FREE"
      },
      event: {
        title: pass.place.name,
        date: pass.visitDate,
        time: "10:00 AM"
      },
      checkInTime: pass.checkInTime,
      slotNumber: pass.slotNumber,
      alreadyCheckedIn: false
    });
    
  } catch (error) {
    console.error("❌ Scan error:", error);
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
};

exports.getSecurityDashboard = async (req, res) => {
  try {
    const security = req.security;

    const totalScans = await ScanLog.countDocuments({
      scannedBy: security._id,
      place: security.place._id
    });

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const todayScans = await ScanLog.countDocuments({
      scannedBy: security._id,
      place: security.place._id,
      scannedAt: { $gte: todayStart }
    });

    const validScans = await ScanLog.countDocuments({
      scannedBy: security._id,
      place: security.place._id,
      scannedAt: { $gte: todayStart },
      status: "SUCCESS"
    });

    const invalidScans = await ScanLog.countDocuments({
      scannedBy: security._id,
      place: security.place._id,
      scannedAt: { $gte: todayStart },
      status: "FAILED"
    });

    const currentOccupancy = await Pass.countDocuments({
      place: security.place._id,
      visitDate: todayStart,
      checkInTime: { $ne: null },
      checkOutTime: null
    });

    const scansByType = await ScanLog.aggregate([
      {
        $match: {
          scannedBy: security._id,
          place: security.place._id,
          scannedAt: { $gte: todayStart }
        }
      },
      {
        $group: {
          _id: "$scanType",
          count: { $sum: 1 }
        }
      }
    ]);

    const recentScans = await ScanLog.find({
      scannedBy: security._id,
      place: security.place._id
    })
    .populate("visitor", "name")
    .sort({ scannedAt: -1 })
    .limit(10);

    const Place = require("../models/place");
    const currentEvents = await Place.find({
      _id: security.place._id,
      "eventDates.start": { $lte: new Date() },
      "eventDates.end": { $gte: new Date() }
    });

    res.json({
      success: true,
      todayStats: {
        totalScans: todayScans,
        uniqueVisitors: validScans,
        invalidScans,
        currentOccupancy
      },
      currentEvents: currentEvents.map(place => ({
        _id: place._id,
        title: place.name,
        expectedAttendees: place.dailyCapacity,
        checkedIn: currentOccupancy,
        startTime: "10:00 AM",
        status: "ongoing"
      })),
      recentScans: recentScans.map(scan => ({
        visitorName: scan.visitor?.name || "Unknown",
        time: scan.scannedAt,
        status: scan.status === "SUCCESS" ? "valid" : "invalid"
      }))
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
};

exports.getSecurityActivity = async (req, res) => {
  try {
    const security = req.security;
    const { date } = req.query;

    const targetDate = date ? new Date(date) : new Date();
    targetDate.setHours(0, 0, 0, 0);
    const nextDay = new Date(targetDate);
    nextDay.setDate(nextDay.getDate() + 1);

    const totalScans = await ScanLog.countDocuments({
      scannedBy: security._id,
      place: security.place._id,
      scannedAt: { $gte: targetDate, $lt: nextDay }
    });

    const validScans = await ScanLog.countDocuments({
      scannedBy: security._id,
      place: security.place._id,
      scannedAt: { $gte: targetDate, $lt: nextDay },
      status: "SUCCESS"
    });

    const invalidScans = await ScanLog.countDocuments({
      scannedBy: security._id,
      place: security.place._id,
      scannedAt: { $gte: targetDate, $lt: nextDay },
      status: "FAILED"
    });

    const timeline = await ScanLog.aggregate([
      {
        $match: {
          scannedBy: security._id,
          place: security.place._id,
          scannedAt: { $gte: targetDate, $lt: nextDay }
        }
      },
      {
        $group: {
          _id: { $hour: "$scannedAt" },
          scans: { $sum: 1 }
        }
      },
      { $sort: { "_id": 1 } }
    ]);

    const invalidAttempts = await ScanLog.find({
      scannedBy: security._id,
      place: security.place._id,
      scannedAt: { $gte: targetDate, $lt: nextDay },
      status: "FAILED"
    })
    .populate("pass", "qrCode")
    .limit(20);

    res.json({
      success: true,
      date: targetDate.toDateString(),
      totalScans,
      validScans,
      invalidScans,
      timeline: timeline.map(t => ({
        hour: `${t._id}:00`,
        scans: t.scans
      })),
      invalidAttempts: invalidAttempts.map(attempt => ({
        time: attempt.scannedAt,
        qrCode: attempt.pass?.qrCode || "Unknown",
        reason: attempt.failureReason
      }))
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
};