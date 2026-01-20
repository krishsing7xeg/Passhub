const jwt = require("jsonwebtoken");
const User = require("../models/user");

const authMiddleware = async (req, res, next) => { 
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ 
        success: false,
        message: "No token provided" 
      });
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({ 
        success: false,
        message: "Invalid token format" 
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Check if it's super admin hardcoded login
    if (decoded.id === "SUPER_ADMIN" && decoded.role === "SUPER_ADMIN") {
      req.user = {
        id: "SUPER_ADMIN",
        role: "SUPER_ADMIN"
      };
      return next();
    }

    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({ 
        success: false,
        message: "User not found" 
      });
    }

    if (!user.isActive) {
      return res.status(403).json({ 
        success: false,
        message: "Account is disabled" 
      });
    }

    req.user = {
      id: user._id.toString(),
      role: user.role,
      email: user.email,
      name: user.name
    };

    next();  
  } catch (error) {
    console.error("Auth middleware error:", error);
    
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ 
        success: false,
        message: "Invalid token" 
      });
    }
    
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ 
        success: false,
        message: "Token expired" 
      });
    }

    return res.status(500).json({ 
      success: false,
      message: "Authentication failed" 
    });
  }
};

module.exports = authMiddleware;