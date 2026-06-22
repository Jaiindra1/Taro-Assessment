const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
  createTrip,
  getTrips,
  generateTrip,
  getTripById,
  deleteTrip
} = require("../controllers/tripController");

router.post(
  "/",
  authMiddleware,
  createTrip
);

router.get(
  "/",
  authMiddleware,
  getTrips
);

router.post(
  "/generate",
  authMiddleware,
  generateTrip
);

router.get(
  "/:id",
  authMiddleware,
  getTripById
);

router.delete(
  "/:id",
  authMiddleware,
  deleteTrip
);

module.exports = router;
