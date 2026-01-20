const Security = require("../models/security");
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { generateSecurityToken } = require("../services/token");

exports.loginAsSecurity = async (req, res) => {
  try {
    const { email, password, placeId } = req.body; 

    if (!email || !password || !placeId) {
      return res.status(400).json({ 
        success: false,
        message: "Email, password, and placeId required" 
      });
    }

    const security = await Security.findOne({
      email: email.toLowerCase(),
      place: placeId,
      isActive: true
    }).populate("place");

    if (!security) {
      return res.status(404).json({ 
        success: false,
        message: "Security assignment not found or inactive" 
      });
    }

    const isMatch = await bcrypt.compare(password, security.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ 
        success: false,
        message: "Invalid credentials" 
      });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const start = new Date(security.assignmentPeriod.start);
    const end = new Date(security.assignmentPeriod.end);
    start.setHours(0, 0, 0, 0);
    end.setHours(0, 0, 0, 0);

    if (today < start || today > end) {
      return res.status(403).json({ 
        success: false,
        message: "Security access expired or not yet started" 
      });
    }

    security.lastLoginAt = new Date();
    if (!security.firstLoginAt) {
      security.firstLoginAt = new Date();
    }
    security.loginCount = (security.loginCount || 0) + 1;
    await security.save();

    const token = generateSecurityToken(security);

    res.json({
      success: true,
      message: "Security login successful",
      token,
      security: {
        id: security._id,
        email: security.email,
        place: {
          id: security.place._id,
          name: security.place.name,
          location: security.place.location
        },
        assignmentPeriod: security.assignmentPeriod
      }
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
};

exports.acceptSecurityInvite = async (req, res) => {
  try {
    const { securityId, inviteToken } = req.params;
    const { password, confirmPassword } = req.body;

    let security;

    if (securityId) {
      security = await Security.findById(securityId).populate("place");
    } else if (inviteToken) {
      security = await Security.findOne({ inviteToken }).populate("place");
    }

    if (!security) {
      return res.status(404).json({ 
        success: false,
        message: "Security invitation not found" 
      });
    }

    if (security.status === "ACCEPTED") {
      return res.status(400).json({ 
        success: false,
        message: "Invitation already accepted" 
      });
    }

    // If password provided, update it
    if (password && confirmPassword) {
      if (password !== confirmPassword) {
        return res.status(400).json({ 
          success: false,
          message: "Passwords do not match" 
        });
      }

      const newHash = await bcrypt.hash(password, 10);
      security.passwordHash = newHash;
    }

    security.status = "ACCEPTED";
    security.isActive = true;
    security.invitationAcceptedAt = new Date();
    await security.save();

    res.json({
      success: true,
      message: "Security invitation accepted successfully",
      security: {
        id: security._id,
        email: security.email,
        place: {
          id: security.place._id,
          name: security.place.name
        }
      }
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
};

exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword, confirmPassword } = req.body;
    const security = req.security;

    if (!currentPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({ 
        success: false,
        message: "All password fields required" 
      });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ 
        success: false,
        message: "New passwords do not match" 
      });
    }

    const isMatch = await bcrypt.compare(currentPassword, security.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ 
        success: false,
        message: "Current password is incorrect" 
      });
    }

    const newHash = await bcrypt.hash(newPassword, 10);
    security.passwordHash = newHash;
    security.passwordChangedAt = new Date();
    await security.save();

    res.json({
      success: true,
      message: "Password changed successfully"
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
};