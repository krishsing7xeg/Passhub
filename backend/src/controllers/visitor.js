const Pass = require("../models/pass");
const Booking = require("../models/booking");
const Place = require("../models/place");
const mongoose = require("mongoose");
const { generateQR } = require("../services/qr");
const crypto = require("crypto");
const { sendPassEmail } = require("../services/email");
const { passEmailTemplate } = require("../templates/passEmail");

exports.createBooking = async (req, res) => {
  try {
    const { placeId, visitDate, guests } = req.body;
    const visitorId = req.user.id;

    if (!placeId || !visitDate || !guests || guests.length === 0) {
      return res.status(400).json({ 
        success: false,
        message: "Place, visit date, and guest details required" 
      });
    }

    if (guests.length > 6) {
      return res.status(400).json({ 
        success: false,
        message: "Maximum 6 guests allowed per booking. Please create multiple bookings if you need more passes." 
      });
    }

    const place = await Place.findById(placeId).populate("host");

    if (!place) {
      return res.status(404).json({ 
        success: false,
        message: "Place not found" 
      });
    }

    if (!place.isBookingEnabled) {
      return res.status(400).json({ 
        success: false,
        message: "Booking is disabled for this place" 
      });
    }

    const vDate = new Date(visitDate);
    vDate.setHours(0, 0, 0, 0);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (vDate < today) {
      return res.status(400).json({ 
        success: false,
        message: "Cannot book for past dates" 
      });
    }

    const eventStart = new Date(place.eventDates.start);
    const eventEnd = new Date(place.eventDates.end);
    eventStart.setHours(0, 0, 0, 0);
    eventEnd.setHours(0, 0, 0, 0);

    if (vDate < eventStart || vDate > eventEnd) {
      return res.status(400).json({ 
        success: false,
        message: "Visit date is outside event dates" 
      });
    }

    const approvedCount = await Pass.countDocuments({
      place: placeId,
      visitDate: vDate,
      status: "APPROVED"
    });

    if (approvedCount + guests.length > place.dailyCapacity) {
      return res.status(400).json({ 
        success: false,
        message: `Only ${place.dailyCapacity - approvedCount} slots available` 
      });
    }

    const booking = await Booking.create({
      visitor: visitorId,
      place: placeId,
      visitDate: vDate,
      guestCount: guests.length,
      totalAmount: place.price * guests.length,
      status: "PENDING",
      paymentStatus: place.price === 0 ? "FREE" : "PENDING"
    });

    const passes = [];

    // ✅ Get visitor info for email
    const User = require("../models/user");
    const visitor = await User.findById(visitorId).select("name email");

    // Create passes WITHOUT qrToken (will be null initially)
    for (const guest of guests) {
      const pass = await Pass.create({
        bookingId: booking._id,
        bookedBy: visitorId,
        host: place.host._id,
        place: placeId,
        visitDate: vDate,
        guest: {
          name: guest.name,
          email: guest.email || null,
          phone: guest.phone || null
        },
        amountPaid: place.price,
        status: place.price === 0 ? "APPROVED" : "PENDING",
        paymentStatus: place.price === 0 ? "FREE" : "PENDING",
        qrActive: false,
        qrToken: null
      });

      passes.push(pass);
    }

    // If free event, generate QR codes immediately
    if (place.price === 0) {
      const approvedCountNow = await Pass.countDocuments({
        place: placeId,
        visitDate: vDate,
        status: "APPROVED"
      });

      for (let i = 0; i < passes.length; i++) {
        const pass = passes[i];
        const qrToken = crypto.randomUUID();

        pass.status = "APPROVED";
        pass.paymentStatus = "FREE";
        pass.slotNumber = approvedCountNow + i + 1;
        pass.qrToken = qrToken;
        pass.qrActive = true;

        pass.refundSnapshot = {
          isRefundable: place.refundPolicy.isRefundable,
          beforeVisitPercent: place.refundPolicy.beforeVisitPercent,
          sameDayPercent: place.refundPolicy.sameDayPercent,
          description: place.refundPolicy.description
        };

        const qrImage = await generateQR({
          passId: pass._id.toString(),
          bookingId: pass.bookingId.toString(),
          qrToken,
          guest: pass.guest.name,
          place: place.name,
          visitDate: vDate.toISOString()
        });

        pass.qrImage = qrImage;
        await pass.save();

        // ✅ Send email to each guest
        if (pass.guest.email) {
          try {
            await sendPassEmail({
              to: pass.guest.email,
              subject: `Your Free Pass for ${place.name}`,
              html: passEmailTemplate({
                guest: pass.guest,
                place,
                visitDate: vDate,
                passes: [pass]
              })
            });
            console.log(`✅ Email sent to guest: ${pass.guest.email}`);
          } catch (emailError) {
            console.error(`❌ Failed to send email to ${pass.guest.email}:`, emailError);
          }
        }
      }

      booking.status = "CONFIRMED";
      booking.paymentStatus = "FREE";
      await booking.save();

      // ✅ NEW: Send summary email to visitor who booked
      if (visitor && visitor.email) {
        try {
          await sendPassEmail({
            to: visitor.email,
            subject: `Booking Confirmed - ${place.name}`,
            html: passEmailTemplate({
              guest: { name: visitor.name, email: visitor.email },
              place,
              visitDate: vDate,
              passes: passes // Send all passes
            })
          });
          console.log(`✅ Summary email sent to visitor: ${visitor.email}`);
        } catch (emailError) {
          console.error(`❌ Failed to send summary email to ${visitor.email}:`, emailError);
        }
      }

      return res.json({
        success: true,
        message: "Free booking confirmed! Passes generated and emails sent.",
        bookingId: booking._id,
        passes: passes.map(p => ({
          passId: p._id,
          guest: p.guest.name,
          slotNumber: p.slotNumber,
          qrImage: p.qrImage,
          status: p.status
        }))
      });
    }

    if (visitor && visitor.email) {
      try {
        const pendingEmailTemplate = `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Booking Pending Payment</title>
          </head>
          <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f3f4f6;">
            <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f3f4f6; padding: 20px;">
              <tr>
                <td align="center">
                  <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                    
                    <!-- Header -->
                    <tr>
                      <td style="background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); padding: 30px; text-align: center;">
                        <h1 style="margin: 0; color: #ffffff; font-size: 28px;">⏳ Payment Pending</h1>
                      </td>
                    </tr>

                    <!-- Content -->
                    <tr>
                      <td style="padding: 30px;">
                        <h2 style="margin: 0 0 15px 0; color: #1f2937;">Hello ${visitor.name}! 👋</h2>
                        <p style="margin: 0 0 15px 0; color: #4b5563; font-size: 16px; line-height: 1.6;">
                          Your booking for <strong>${place.name}</strong> has been created successfully. Please complete the payment to confirm your passes.
                        </p>

                        <div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0; border-radius: 4px;">
                          <p style="margin: 0; color: #92400e; font-weight: bold;">📋 Booking Details:</p>
                          <ul style="margin: 10px 0 0 0; padding-left: 20px; color: #78350f;">
                            <li><strong>Booking ID:</strong> ${booking._id}</li>
                            <li><strong>Place:</strong> ${place.name}</li>
                            <li><strong>Location:</strong> ${place.location}</li>
                            <li><strong>Visit Date:</strong> ${vDate.toDateString()}</li>
                            <li><strong>Number of Guests:</strong> ${guests.length}</li>
                            <li><strong>Total Amount:</strong> ₹${booking.totalAmount}</li>
                          </ul>
                        </div>

                        <div style="background-color: #eff6ff; border-left: 4px solid #3b82f6; padding: 15px; margin: 20px 0; border-radius: 4px;">
                          <p style="margin: 0; color: #1e40af; font-weight: bold;">👥 Guests:</p>
                          <ul style="margin: 10px 0 0 0; padding-left: 20px; color: #1e3a8a;">
                            ${guests.map(g => `<li>${g.name} - ${g.email || 'No email'}</li>`).join('')}
                          </ul>
                        </div>

                        <div style="background-color: #fee2e2; border-left: 4px solid #dc2626; padding: 15px; margin: 20px 0; border-radius: 4px;">
                          <p style="margin: 0; color: #991b1b; font-weight: bold;">⚠️ Action Required:</p>
                          <p style="margin: 10px 0 0 0; color: #7f1d1d;">Please complete the payment to receive your QR codes. Your booking will expire if payment is not completed within 24 hours.</p>
                        </div>
                      </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                      <td style="background-color: #f9fafb; padding: 20px; text-align: center; border-top: 1px solid #e5e7eb;">
                        <p style="margin: 0; color: #6b7280; font-size: 14px;">
                          Need help? Contact us at <a href="mailto:support@visitorpass.com" style="color: #3b82f6; text-decoration: none;">support@visitorpass.com</a>
                        </p>
                      </td>
                    </tr>

                  </table>
                </td>
              </tr>
            </table>
          </body>
          </html>
        `;

        await sendPassEmail({
          to: visitor.email,
          subject: `Booking Created - Payment Pending - ${place.name}`,
          html: pendingEmailTemplate
        });
        console.log(`✅ Pending payment email sent to visitor: ${visitor.email}`);
      } catch (emailError) {
        console.error(`❌ Failed to send pending email to ${visitor.email}:`, emailError);
      }
    }

    res.json({
      success: true,
      message: "Booking created. Please proceed to payment. Confirmation email sent.",
      bookingId: booking._id,
      amountToPay: booking.totalAmount,
      passes: passes.map(p => ({
        passId: p._id,
        guest: p.guest.name,
        status: p.status
      }))
    });
  } catch (error) {
    console.error("Create booking error:", error);
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
};
//returns all active upcoming event's passes
exports.getMyPasses = async (req, res) => {
  try {
    const passes = await Pass.find({ bookedBy: req.user.id })
      .populate("place", "name location image")
      .populate("host", "name email")
      .sort({ createdAt: -1 });

    res.json({ 
      success: true,
      count: passes.length,
      passes 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
};
//returns all passes booked by visitor
exports.getAllBookingsByVisitor = async (req, res) => {
  try {
    const bookings = await Booking.find({ visitor: req.user.id })
      .populate("place", "name location image price")
      .sort({ createdAt: -1 });

    const enriched = await Promise.all(
      bookings.map(async booking => {
        const passes = await Pass.find({ bookingId: booking._id })
          .select("guest status slotNumber qrImage");

        return {
          ...booking.toObject(),
          passes
        };
      })
    );

    res.json({ 
      success: true,
      count: enriched.length,
      bookings: enriched 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
};
// get details of it's specific booking
exports.getBookingDetails = async (req, res) => {
  try {
    const { bookingId } = req.params;

    const booking = await Booking.findById(bookingId)
      .populate("place")
      .populate("visitor", "name email");

    if (!booking) {
      return res.status(404).json({ 
        success: false,
        message: "Booking not found" 
      });
    }

    if (booking.visitor._id.toString() !== req.user.id) {
      return res.status(403).json({ 
        success: false,
        message: "Not authorized" 
      });
    }

    const passes = await Pass.find({ bookingId });

    res.json({ 
      success: true,
      booking: {
        ...booking.toObject(),
        passes
      }
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
};