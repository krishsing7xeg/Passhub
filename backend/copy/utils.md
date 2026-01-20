below are the files in util folder

adminemergencyhelper.js

const Pass = require("../models/pass");
const { initiateAutoRefund } = require("./refundhelper");
const { sendBulkCancellationMail } = require("../services/admincancelmail");

exports.cancelFuturePasses = async ({ filter, reason, cancelledBy }) => {
  try {
    const passes = await Pass.find(filter).populate("bookedBy place");

    console.log(`📊 Found ${passes.length} passes to cancel`);

    for (const pass of passes) {
      if (pass.status === "CANCELLED") {
        console.log(`⏭️ Pass ${pass._id} already cancelled, skipping`);
        continue;
      }

      pass.status = "CANCELLED";
      pass.qrActive = false;
      pass.cancelledAt = new Date();
      pass.cancellationReason = reason;
      await pass.save();

      console.log(`✅ Pass ${pass._id} cancelled`);

      await initiateAutoRefund(pass);

      if (pass.bookedBy?.email) {
        await sendBulkCancellationMail({
          to: pass.bookedBy.email,
          placeName: pass.place?.name || 'Unknown Place',
          visitDate: pass.visitDate,
          reason
        });
        console.log(`📧 Cancellation email sent to ${pass.bookedBy.email}`);
      }
    }

    console.log(`✅ All ${passes.length} passes cancelled and refunded`);
  } catch (error) {
    console.error("❌ Error in cancelFuturePasses:", error);
    throw error;
  }
};

hostingvalidity.js

exports.isHostingActive = (place) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const start = new Date(place.hostingValidity.start);
  const end = new Date(place.hostingValidity.end);
  start.setHours(0, 0, 0, 0);
  end.setHours(0, 0, 0, 0);

  return today >= start && today <= end;
};

exports.isEventActive = (place) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const start = new Date(place.eventDates.start);
  const end = new Date(place.eventDates.end);
  start.setHours(0, 0, 0, 0);
  end.setHours(0, 0, 0, 0);

  return today >= start && today <= end;
};

refundhelper.js

const Pass = require("../models/pass");
const { calculateRefundAmount } = require("./refundpolicy");

exports.initiateAutoRefund = async (pass) => {
  try {
    if (pass.paymentStatus !== "PAID") {
      console.log(`⏭️ Pass ${pass._id} not paid, skipping refund`);
      return;
    }

    if (pass.refundStatus !== "NONE") {
      console.log(`⏭️ Pass ${pass._id} already has refund status ${pass.refundStatus}`);
      return;
    }

    const refundAmount = calculateRefundAmount(pass, pass.place);

    pass.refundAmount = refundAmount;
    pass.refundStatus = refundAmount > 0 ? "INITIATED" : "NONE";
    pass.paymentStatus = refundAmount > 0 ? "REFUNDED" : pass.paymentStatus;

    await pass.save();

    console.log(`✅ Refund initiated for pass ${pass._id}: ₹${refundAmount}`);
  } catch (error) {
    console.error(`❌ Error initiating refund for pass ${pass._id}:`, error);
    throw error;
  }
};


refundpolicy.js

function calculateRefundAmount(pass, place) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const visitDate = new Date(pass.visitDate);
  visitDate.setHours(0, 0, 0, 0);

  if (!place.refundPolicy?.isRefundable) {
    console.log(`❌ Non-refundable policy for place ${place._id}`);
    return 0;
  }

  if (pass.checkInTime) {
    console.log(`❌ Pass ${pass._id} already checked in`);
    return 0;
  }

  if (visitDate < today) {
    console.log(`❌ Visit date ${visitDate} is in the past`);
    return 0;
  }

  if (pass.status === "EXPIRED") {
    console.log(`❌ Pass ${pass._id} is expired`);
    return 0;
  }

  if (visitDate.getTime() === today.getTime()) {
    const refund = Math.floor(pass.amountPaid * (place.refundPolicy.sameDayPercent || 50) / 100);
    console.log(`📅 Same day cancellation: ${place.refundPolicy.sameDayPercent}% = ₹${refund}`);
    return refund;
  }

  const refund = Math.floor(pass.amountPaid * (place.refundPolicy.beforeVisitPercent || 80) / 100);
  console.log(`📅 Before visit cancellation: ${place.refundPolicy.beforeVisitPercent}% = ₹${refund}`);
  return refund;
}

module.exports = { calculateRefundAmount };