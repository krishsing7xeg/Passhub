const Place = require("../models/place");

const isPlaceHost = async (req, res, next) => {  
  try {
    const { placeId } = req.params;
    const userId = req.user.id;

    if (!placeId) {
      return res.status(400).json({ 
        success: false,
        message: "Place ID required" 
      });
    }

    const place = await Place.findById(placeId);

    if (!place) {
      return res.status(404).json({ 
        success: false,
        message: "Place not found" 
      });
    }

    if (place.host.toString() !== userId) {
      return res.status(403).json({ 
        success: false,
        message: "You are not authorized to access this place" 
      });
    }

    // Attach place to request for later use
    req.place = place;

    next();  
  } catch (error) {
    console.error("Is place host middleware error:", error);
    return res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
};

module.exports = isPlaceHost;