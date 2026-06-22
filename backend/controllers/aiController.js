const {
  generateTripPlan,
} = require("../services/geminiService");

const generateAITrip = async (req, res) => {
  try {
    const {
      destination,
      durationDays,
      budgetTier,
      interests,
    } = req.body;

    const result =
      await generateTripPlan(
        destination,
        durationDays,
        budgetTier,
        interests
      );

    res.json(result);

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "AI Error",
    });
  }
};

module.exports = {
  generateAITrip,
};