below are the models files

adminactionlog.js

const mongoose = require("mongoose");

const adminActionLogSchema = new mongoose.Schema(
  {
    admin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    action: {
      type: String,
      enum: ["DISABLE_HOST", "CANCEL_EVENT", "INVITE_ADMIN", "DISABLE_ADMIN"],
      required: true
    },
    targetId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true
    },
    reason: {
      type: String,
      default: null
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: null
    }
  },
  {
    timestamps: true
  }
);

adminActionLogSchema.index({ admin: 1, createdAt: -1 });
adminActionLogSchema.index({ action: 1, createdAt: -1 });
adminActionLogSchema.index({ targetId: 1 });

const AdminActionLog = mongoose.model("AdminActionLog", adminActionLogSchema);

module.exports = AdminActionLog;

booking.js

const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    visitor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    place: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Place",
      required: true
    },
    visitDate: {
      type: Date,
      required: true
    },
    guestCount: {
      type: Number,
      required: true,
      min: 1
    },
    totalAmount: {
      type: Number,
      required: true,
      default: 0
    },
    status: {
      type: String,
      enum: ["PENDING", "CONFIRMED", "CANCELLED", "COMPLETED"],
      default: "PENDING"
    },
    paymentStatus: {
      type: String,
      enum: ["PENDING", "PAID", "FREE", "REFUNDED", "FAILED"],
      default: "PENDING"
    }
  },
  {
    timestamps: true
  }
);

bookingSchema.index({ visitor: 1 });
bookingSchema.index({ place: 1, visitDate: 1 });
bookingSchema.index({ status: 1 });

const Booking = mongoose.model("Booking", bookingSchema);

module.exports = Booking;

hostsubscription.js

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

pass.js

const mongoose = require("mongoose");

const passSchema = new mongoose.Schema(
  {
    bookingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
      required: true
    },
    bookedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    host: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    place: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Place",
      required: true
    },
    visitDate: {
      type: Date,
      required: true
    },
    guest: {
      name: {
        type: String,
        required: true,
        trim: true
      },
      email: {
        type: String,
        trim: true,
        lowercase: true,
        default: null
      },
      phone: {
        type: String,
        trim: true,
        default: null
      }
    },
    slotNumber: {
      type: Number,
      default: null
    },
    qrToken: {
      type: String,
      default: null
    },
    qrImage: {
      type: String,
      default: null
    },
    qrActive: {
      type: Boolean,
      default: false
    },
    status: {
      type: String,
      enum: ["PENDING", "APPROVED", "CANCELLED", "EXPIRED"],
      default: "PENDING"
    },
    amountPaid: {
      type: Number,
      required: true,
      default: 0
    },
    paymentStatus: {
      type: String,
      enum: ["PENDING", "PAID", "FREE", "REFUNDED", "FAILED"],
      default: "PENDING"
    },
    refundAmount: {
      type: Number,
      default: 0
    },
    refundStatus: {
      type: String,
      enum: ["NONE", "INITIATED", "COMPLETED", "FAILED"],
      default: "NONE"
    },
    refundSnapshot: {
      isRefundable: Boolean,
      beforeVisitPercent: Number,
      sameDayPercent: Number,
      description: String
    },
    checkInTime: {
      type: Date,
      default: null
    },
    checkOutTime: {
      type: Date,
      default: null
    },
    cancelledAt: {
      type: Date,
      default: null
    },
    cancellationReason: {
      type: String,
      default: null
    }
  },
  {
    timestamps: true
  }
);

passSchema.index({ bookingId: 1 });
passSchema.index({ bookedBy: 1 });
passSchema.index({ place: 1, visitDate: 1 });
passSchema.index({ status: 1 });
passSchema.index({ qrToken: 1 }, { sparse: true }); 

// Virtual for visit duration
passSchema.virtual("visitDuration").get(function() {
  if (!this.checkInTime || !this.checkOutTime) {
    return null;
  }
  
  const duration = this.checkOutTime - this.checkInTime;
  return Math.round(duration / 60000); 
});

const Pass = mongoose.model("Pass", passSchema);

module.exports = Pass;

payment.js

const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true
  },
  bookingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Booking",
    required: true,
    index: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  currency: {
    type: String,
    required: true,
    uppercase: true,
    default: "INR"
  },
  gateway: {
    type: String,
    enum: ["RAZORPAY", "STRIPE", "UPI"],
    default: "RAZORPAY",
    index: true
  },
  status: {
    type: String,
    enum: ["CREATED", "PAID", "FAILED", "REFUNDED"],
    default: "CREATED"
  },
  transactionId: {
    type: String,
    sparse: true
  },
  paymentDate: Date,
  refundDate: Date
}, { timestamps: true });

module.exports = mongoose.model('Payment', paymentSchema);

place.js

const mongoose = require("mongoose");

const placeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    location: {
      type: String,
      required: true,
      trim: true
    },
    image: {
      type: String,
      default: null
    },
    host: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    eventDates: {
      start: {
        type: Date,
        required: true
      },
      end: {
        type: Date,
        required: true
      }
    },
    hostingValidity: {
      start: {
        type: Date,
        required: true
      },
      end: {
        type: Date,
        required: true
      }
    },
    price: {
      type: Number,
      required: true,
      min: 0,
      default: 0
    },
    dailyCapacity: {
      type: Number,
      required: true,
      min: 1
    },
    refundPolicy: {
      isRefundable: {
        type: Boolean,
        default: true
      },
      beforeVisitPercent: {
        type: Number,
        min: 0,
        max: 100,
        default: 80
      },
      sameDayPercent: {
        type: Number,
        min: 0,
        max: 100,
        default: 50
      },
      description: {
        type: String,
        default: "Standard refund policy"
      }
    },
    isBookingEnabled: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

// Index for faster queries
placeSchema.index({ host: 1 });
placeSchema.index({ "eventDates.start": 1, "eventDates.end": 1 });
placeSchema.index({ isBookingEnabled: 1 });

// Virtual for checking if event is active
placeSchema.virtual("isEventActive").get(function() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const start = new Date(this.eventDates.start);
  const end = new Date(this.eventDates.end);
  start.setHours(0, 0, 0, 0);
  end.setHours(0, 0, 0, 0);
  
  return today >= start && today <= end;
});

// Virtual for checking if hosting is valid
placeSchema.virtual("isHostingValid").get(function() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const start = new Date(this.hostingValidity.start);
  const end = new Date(this.hostingValidity.end);
  start.setHours(0, 0, 0, 0);
  end.setHours(0, 0, 0, 0);
  
  return today >= start && today <= end;
});

const Place = mongoose.model("Place", placeSchema);

module.exports = Place;

scanlog.js

onst mongoose = require("mongoose");

const scanLogSchema = new mongoose.Schema(
  {
    pass: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Pass",
      required: true
    },
    visitor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    host: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null
    },
    place: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Place",
      required: true
    },
    scannedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    scanType: {
      type: String,
      enum: ["ENTRY", "EXIT"],
      required: true
    },
    scannedAt: {
      type: Date,
      default: Date.now
    },
    status: {
      type: String,
      enum: ["SUCCESS", "FAILED"],
      required: true
    },
    failureReason: {
      type: String,
      default: null
    }
  },
  {
    timestamps: true
  }
);

scanLogSchema.index({ place: 1, scannedAt: -1 });
scanLogSchema.index({ scannedBy: 1, scannedAt: -1 });
scanLogSchema.index({ pass: 1 });
scanLogSchema.index({ scanType: 1, scannedAt: -1 });

const ScanLog = mongoose.model("ScanLog", scanLogSchema);

module.exports = ScanLog;

security.js

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const securitySchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true
    },
    passwordHash: {
      type: String,
      required: true
    },
    place: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Place",
      required: true
    },
    assignedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    assignmentPeriod: {
      start: {
        type: Date,
        required: true
      },
      end: {
        type: Date,
        required: true
      }
    },
    status: {
      type: String,
      enum: ["PENDING", "ACCEPTED", "REJECTED"],
      default: "PENDING"
    },
    isActive: {
      type: Boolean,
      default: false
    },
    invitationSentAt: {
      type: Date,
      default: Date.now
    },
    invitationAcceptedAt: {
      type: Date,
      default: null
    },
    firstLoginAt: {
      type: Date,
      default: null
    },
    lastLoginAt: {
      type: Date,
      default: null
    },
    loginCount: {
      type: Number,
      default: 0
    },
    passwordChangedAt: {
      type: Date,
      default: null
    },
    removedAt: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: true
  }
);

// Indexes defined ONLY here
securitySchema.index({ email: 1, place: 1 }, { unique: true });
securitySchema.index({ place: 1, isActive: 1 });

// Method to compare passwords
securitySchema.methods.comparePassword = async function(candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.passwordHash);
  } catch (error) {
    throw new Error("Password comparison failed");
  }
};

module.exports = mongoose.model("Security", securitySchema);

subscriptionplan.js

const mongoose = require("mongoose");

const subscriptionPlanSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    price: {
      type: Number,
      required: true,
      min: 0
    },
    durationDays: {
      type: Number,
      required: true,
      min: 1
    },
    description: {
      type: String,
      default: ""
    },
    features: {
      type: [String],
      default: []
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

subscriptionPlanSchema.index({ isActive: 1, price: 1 });

const SubscriptionPlan = mongoose.model("SubscriptionPlan", subscriptionPlanSchema);

module.exports = SubscriptionPlan;

user.js

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true,  
      lowercase: true,
      trim: true
    },
    password: {
      type: String,
      required: true
    },
    role: {
      type: String,
      enum: ["VISITOR", "HOST", "ADMIN", "SUPER_ADMIN"],
      default: "VISITOR"
    },
    isActive: {
      type: Boolean,
      default: true
    },
    isHostingDisabled: {
      type: Boolean,
      default: false
    },
    subscription: {
      planId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "SubscriptionPlan",
        default: null
      },
      isActive: {
        type: Boolean,
        default: false
      },
      startDate: {
        type: Date,
        default: null
      },
      endDate: {
        type: Date,
        default: null
      },
      amountPaid: {
        type: Number,
        default: 0
      },
      paymentStatus: {
        type: String,
        enum: ["PENDING", "PAID", "FREE", "FAILED"],
        default: "PENDING"
      }
    }
  },
  {
    timestamps: true
  }
);

// Method to compare passwords
userSchema.methods.comparePassword = async function(candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw new Error("Password comparison failed");
  }
};

// Method to check if subscription is active
userSchema.methods.hasActiveSubscription = function() {
  if (!this.subscription || !this.subscription.isActive) {
    return false;
  }
  
  const now = new Date();
  const endDate = new Date(this.subscription.endDate);
  
  return now <= endDate;
};

// Method to get subscription days remaining
userSchema.methods.getSubscriptionDaysRemaining = function() {
  if (!this.subscription || !this.subscription.endDate) {
    return 0;
  }
  
  const now = new Date();
  const endDate = new Date(this.subscription.endDate);
  
  if (now > endDate) {
    return 0;
  }
  
  const diffTime = Math.abs(endDate - now);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays;
};

module.exports = mongoose.model("User", userSchema);

