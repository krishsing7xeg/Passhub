const User = require("../models/user");
const Pass = require("../models/pass");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const { sendAdminInviteMail } = require("../services/admininvitemail");

exports.getAllUsers = async (req, res) => {
  try {
    const { role, status, page = 1, limit = 20 } = req.query;
    
    let query = {};
    if (role) query.role = role;
    if (status) query.isActive = status === 'active';
    
    const users = await User.find(query)
      .select("-password")
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const total = await User.countDocuments(query);
    
    res.json({
      success: true,
      users,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getAllPasses = async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    
    let query = {};
    if (status) query.status = status;
    
    const passes = await Pass.find(query)
      .populate("bookedBy", "name email phone")
      .populate("host", "name email")
      .populate("place", "name location")
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const total = await Pass.countDocuments(query);
    
    res.json({
      success: true,
      passes,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.inviteAdmin = async (req, res) => {
  try {
    if (req.user.role !== "SUPER_ADMIN") {
      return res.status(403).json({ 
        success: false,
        message: "Access denied" 
      });
    }

    const { email, name } = req.body;

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ 
        success: false,
        message: "User already exists" 
      });
    }

    const tempPassword = crypto.randomBytes(8).toString("hex");
    const passwordHash = await bcrypt.hash(tempPassword, 10);

    const admin = await User.create({
      name: name || "Admin User",
      email,
      password: passwordHash,
      role: "ADMIN",
      isActive: true
    });

    await sendAdminInviteMail({ email, tempPassword });

    res.status(201).json({ 
      success: true,
      message: "Admin invited successfully",
      admin: {
        _id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role
      }
    });
  } catch (err) {
    res.status(500).json({ 
      success: false,
      message: err.message 
    });
  }
};

exports.disableAdmin = async (req, res) => {
  try {
    if (req.user.role !== "SUPER_ADMIN") {
      return res.status(403).json({ 
        success: false,
        message: "Access denied" 
      });
    }

    const { adminId } = req.params;
    const { reason } = req.body;

    const admin = await User.findOne({
      _id: adminId,
      role: "ADMIN"
    });

    if (!admin) {
      return res.status(404).json({ 
        success: false,
        message: "Admin not found" 
      });
    }

    admin.isActive = false;
    admin.disabledAt = new Date();
    admin.disabledReason = reason || "Disabled by Super Admin";
    await admin.save();

    res.json({ 
      success: true,
      message: "Admin disabled successfully",
      admin: {
        _id: admin._id,
        email: admin.email,
        isActive: admin.isActive,
        disabledAt: admin.disabledAt,
        disabledReason: admin.disabledReason
      }
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
};

exports.disableUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const { reason } = req.body;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: "User not found" 
      });
    }

    if (user.role === "SUPER_ADMIN") {
      return res.status(403).json({ 
        success: false,
        message: "Cannot disable Super Admin" 
      });
    }

    user.isActive = false;
    user.disabledAt = new Date();
    user.disabledReason = reason || "Disabled by Admin";
    await user.save();

    res.json({ 
      success: true,
      message: "User disabled successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        isActive: user.isActive,
        disabledAt: user.disabledAt,
        disabledReason: user.disabledReason
      }
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
};