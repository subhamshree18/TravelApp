const express = require("express");
const router = express.Router();
const tripsController = require("../controllers/trips");

router.post("/trips", tripsController.createTrip);
router.get("/trips", tripsController.getTrips);


module.exports = router;