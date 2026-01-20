const express = require("express");
const router = express.Router();

const authMiddleware = require("../middlewares/auth");
const authorize = require("../middlewares/role");

const adminController = require("../controllers/admin");
const adminEmergency = require("../controllers/adminemergency");

// Admin getting users and passes data
router.get("/users", authMiddleware, authorize("ADMIN", "SUPER_ADMIN"), adminController.getAllUsers);
router.get("/passes", authMiddleware, authorize("ADMIN", "SUPER_ADMIN"), adminController.getAllPasses);

// Invite admin (SUPER_ADMIN only)
router.post("/invite", authMiddleware, authorize("SUPER_ADMIN"), adminController.inviteAdmin);

// Disable admin (SUPER_ADMIN only)
router.post("/disable/:adminId", authMiddleware, authorize("SUPER_ADMIN"), adminController.disableAdmin);

// Added disable user route
router.patch("/users/:userId/disable", authMiddleware, authorize("ADMIN", "SUPER_ADMIN"), adminController.disableUser);

// Emergency actions
router.post("/hosts/:hostId/disable", authMiddleware, authorize("ADMIN", "SUPER_ADMIN"), adminEmergency.disableHost);
router.post("/places/:placeId/cancel", authMiddleware, authorize("ADMIN", "SUPER_ADMIN"), adminEmergency.cancelEvent);

module.exports = router;