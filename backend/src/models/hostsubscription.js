const mongoose = require("mongoose");

const hostSubscriptionSchema = new mongoose.Schema(
  {
    host: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    plan: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SubscriptionPlan",
      required: true
    },
    startDate: {
      type: Date,
      required: true
    },
    endDate: {
      type: Date,
      required: true
    },
    amountPaid: {
      type: Number,
      required: true,
      default: 0
    },
    paymentStatus: {
      type: String,
      enum: ["PENDING", "PAID", "FREE", "FAILED"],
      default: "PENDING"
    },
    isActive: {
      type: Boolean,
      default: false
    },
    autoRenew: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

hostSubscriptionSchema.index({ host: 1, isActive: 1 });
hostSubscriptionSchema.index({ endDate: 1 });

const HostSubscription = mongoose.model("HostSubscription", hostSubscriptionSchema);

module.exports = HostSubscription;