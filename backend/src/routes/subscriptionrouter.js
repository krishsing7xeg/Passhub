const router = require("express").Router();
const { createPlan, getPlans, togglePlan, getApplicablePlans } = require("../controllers/subscription");
const auth = require("../middlewares/auth");
const authorize = require("../middlewares/role");

// Create plan (SUPER_ADMIN only)
router.post("/", auth, authorize("SUPER_ADMIN"), createPlan);

// Get all active plans (public)
router.get("/", getPlans);

// Get applicable plans for specific event duration
router.get("/applicable", auth, getApplicablePlans);

// toggle plan active/inactive (SUPER_ADMIN only)
router.patch("/:planId/toggle", auth, authorize("SUPER_ADMIN"), togglePlan);

module.exports = router;