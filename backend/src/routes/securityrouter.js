const express = require("express");
const router = express.Router();

const requireSecurity = require("../middlewares/securityauth");
const securityLoginController = require("../controllers/security-login");
const scanController = require("../controllers/scancontroller");
// Security login
router.post("/login", securityLoginController.loginAsSecurity);

// Accept security invite
router.get("/accept/:securityId", securityLoginController.acceptSecurityInvite);

// Also accept token-based invite
router.post("/accept-invite/:inviteToken", securityLoginController.acceptSecurityInvite);

// Change password
router.post("/change-password", requireSecurity, securityLoginController.changePassword);

// Scan pass
router.post("/scan-pass", requireSecurity, scanController.scanPass);

// Security dashboard
router.get("/dashboard", requireSecurity, scanController.getSecurityDashboard);
// Security activity logs
router.get("/activity", requireSecurity, scanController.getSecurityActivity);

module.exports = router;