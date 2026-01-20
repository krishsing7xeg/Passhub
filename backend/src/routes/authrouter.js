const express = require("express");
const router = express.Router();
const { registerUser, loginUser,getMe } = require("../controllers/auth");
const authMiddleware = require("../middlewares/auth");
const User = require("../models/user");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/me", authMiddleware, getMe);
// router.get("/me", authMiddleware, async (req, res) => {
//   try {
//     const user = await User.findById(req.user.id)
//       .select("-password")
//       .populate("subscription.planId");
    
//     res.json({ 
//       success: true,
//       user 
//     });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// });

module.exports = router;