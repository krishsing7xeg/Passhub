const express = require("express");
const router = express.Router();

const authMiddleware = require("../middlewares/auth");
const hostAnalytics = require("../controllers/hostanalytics");
const hostController = require("../controllers/host");
const hostingActive = require("../middlewares/hostingactive");
const isPlaceHost = require("../middlewares/isplacehost");

// Create place (requires active subscription)
router.post("/place", authMiddleware, hostingActive, hostController.createPlace);

// Get all hosted places/events
router.get("/places", authMiddleware, hostController.getMyPlaces);
router.get("/events", authMiddleware, hostController.getMyHostedEvents);

// Place management
router.get("/places/:placeId/dashboard", authMiddleware, isPlaceHost, hostController.getPlaceDashboard);
router.put("/places/:placeId", authMiddleware, isPlaceHost, hostingActive, hostController.editPlace);
router.patch("/places/:placeId/capacity", authMiddleware, isPlaceHost, hostController.updateCapacity);
router.post("/places/:placeId/toggle-booking", authMiddleware, isPlaceHost, hostController.toggleBooking);

router.patch("/events/:eventId/dates", authMiddleware, hostController.updateEventDates);

// Security management
router.post("/places/:placeId/invite-security", authMiddleware, isPlaceHost, hostController.inviteSecurity);
router.delete("/places/:placeId/security/:securityId", authMiddleware, isPlaceHost, hostController.removeSecurity);

// Slot management
router.get("/places/:placeId/slots", authMiddleware, isPlaceHost, hostController.getSlots);
router.get('/places/:placeId/security', authMiddleware, hostController.getSecurityForPlace);
router.post("/events/:eventId/manual-override", authMiddleware, hostController.manualOverride);
router.post("/places/:placeId/cancel",isPlaceHost, hostController.cancelMyEvent);

// Host analytics 
router.get("/events/:eventId/bookings-per-day", authMiddleware, hostAnalytics.getBookingsPerDay);
router.get("/events/:eventId/peak-checkin-hours", authMiddleware, hostAnalytics.getPeakCheckInHours);
router.get("/places/:placeId/analytics/security-activity", authMiddleware, isPlaceHost, hostAnalytics.getSecurityActivity);

module.exports = router;