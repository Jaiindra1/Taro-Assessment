const express = require("express");

const router = express.Router();

const authMiddleware = require(
  "../middleware/authMiddleware"
);

const {
  generateAITrip,
} = require("../controllers/aiController");

router.post(
  "/generate",
  authMiddleware,
  generateAITrip
);

module.exports = router;
