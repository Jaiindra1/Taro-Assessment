const db = require("../database/database");

const normalizeTripPayload = (body = {}) => {
  const rawDuration = body.durationDays ?? body.duration_days ?? body.days;
  const durationDays = Number.parseInt(rawDuration, 10);
  const interests = Array.isArray(body.interests)
    ? body.interests
    : [];

  return {
    destination: body.destination?.trim(),
    durationDays,
    budgetTier: body.budgetTier ?? body.budgetType,
    interests
  };
};

const validateTripPayload = ({
  destination,
  durationDays,
  budgetTier,
  interests
}) => {
  if (!destination) {
    return "Destination is required";
  }

  if (!Number.isInteger(durationDays) || durationDays < 1) {
    return "A valid trip duration is required";
  }

  if (!budgetTier) {
    return "Budget tier is required";
  }

  if (!Array.isArray(interests)) {
    return "Interests must be an array";
  }

  return null;
};

const normalizeActivityTitle = (activity) => {
  if (typeof activity === "string") {
    return activity.trim();
  }

  if (activity && typeof activity === "object") {
    return (activity.title ?? activity.name ?? "").trim();
  }

  return "";
};

const normalizeAiTripData = (aiData = {}) => ({
  itinerary: Array.isArray(aiData.itinerary)
    ? aiData.itinerary.map((day, index) => ({
        day: Number.parseInt(day?.day, 10) || index + 1,
        activities: Array.isArray(day?.activities)
          ? day.activities
              .map(normalizeActivityTitle)
              .filter(Boolean)
          : []
      }))
    : [],
  budget: aiData.budget && typeof aiData.budget === "object"
    ? aiData.budget
    : {},
  hotels: Array.isArray(aiData.hotels)
    ? aiData.hotels
        .map((hotel) => {
          const name = (hotel?.name ?? hotel?.hotel_name ?? hotel?.title ?? "").trim();

          if (!name) {
            return null;
          }

          return {
            name,
            tier: (hotel?.budget_range ?? hotel?.tier ?? "").trim(),
            rating: String(hotel?.rating ?? hotel?.area ?? "").trim()
          };
        })
        .filter(Boolean)
    : []
});

const createTrip = (req, res) => {
  try {
    const tripPayload = normalizeTripPayload(req.body);
    const validationError = validateTripPayload(tripPayload);

    if (validationError) {
      return res.status(400).json({
        message: validationError
      });
    }

    const {
      destination,
      durationDays,
      budgetTier,
      interests
    } = tripPayload;

    const result = db.prepare(`
      INSERT INTO trips (
        user_id,
        destination,
        duration_days,
        budget_tier,
        interests
      )
      VALUES (?, ?, ?, ?, ?)
    `).run(
      req.user.id,
      destination,
      durationDays,
      budgetTier,
      JSON.stringify(interests)
    );

    res.status(201).json({
      message: "Trip created",
      tripId: result.lastInsertRowid,
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

const getTrips = (req, res) => {
  try {
    const trips = db.prepare(`
      SELECT *
      FROM trips
      WHERE user_id = ?
      ORDER BY created_at DESC
    `).all(req.user.id);

    res.json(trips);

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

const { generateTripPlan } = require("../services/geminiService");

const generateTrip = async (req, res) => {
  try {
    const tripPayload = normalizeTripPayload(req.body);
    const validationError = validateTripPayload(tripPayload);

    if (validationError) {
      return res.status(400).json({
        message: validationError
      });
    }

    const {
      destination,
      durationDays,
      budgetTier,
      interests
    } = tripPayload;

    const aiData = await generateTripPlan(
      destination,
      durationDays,
      budgetTier,
      interests
    );

    const normalizedAiData = normalizeAiTripData(aiData);

    const saveGeneratedTrip = db.transaction(() => {
      const tripResult = db.prepare(`
        INSERT INTO trips (
          user_id,
          destination,
          duration_days,
          budget_tier,
          interests,
          estimated_budget
        )
        VALUES (?, ?, ?, ?, ?, ?)
      `).run(
        req.user.id,
        destination,
        durationDays,
        budgetTier,
        JSON.stringify(interests),
        JSON.stringify(normalizedAiData.budget)
      );

      const tripId = tripResult.lastInsertRowid;

      for (const day of normalizedAiData.itinerary) {
        const dayResult = db.prepare(`
          INSERT INTO itinerary_days (
            trip_id,
            day_number
          )
          VALUES (?, ?)
        `).run(
          tripId,
          day.day
        );

        const dayId = dayResult.lastInsertRowid;

        for (const activityTitle of day.activities) {
          db.prepare(`
            INSERT INTO activities (
              itinerary_day_id,
              title
            )
            VALUES (?, ?)
          `).run(
            dayId,
            activityTitle
          );
        }
      }

      for (const hotel of normalizedAiData.hotels) {
        db.prepare(`
          INSERT INTO hotels (
            trip_id,
            name,
            tier,
            rating
          )
          VALUES (?, ?, ?, ?)
        `).run(
          tripId,
          hotel.name,
          hotel.tier,
          hotel.rating
        );
      }

      return tripId;
    });

    const tripId = saveGeneratedTrip();

    res.status(201).json({
      message: "Trip generated successfully",
      tripId,
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to generate trip",
    });
  }
};

const getTripById = (req, res) => {
  try {
    const tripId = req.params.id;

    // User isolation check
    const trip = db.prepare(`
      SELECT *
      FROM trips
      WHERE id = ?
      AND user_id = ?
    `).get(
      tripId,
      req.user.id
    );

    if (!trip) {
      return res.status(404).json({
        message: "Trip not found"
      });
    }

    const days = db.prepare(`
      SELECT *
      FROM itinerary_days
      WHERE trip_id = ?
      ORDER BY day_number
    `).all(tripId);

    const itinerary = days.map(day => {
      const activities = db.prepare(`
        SELECT *
        FROM activities
        WHERE itinerary_day_id = ?
      `).all(day.id);

      return {
        dayNumber: day.day_number,
        activities
      };
    });

    const hotels = db.prepare(`
      SELECT *
      FROM hotels
      WHERE trip_id = ?
    `).all(tripId);

    const packingList = db.prepare(`
      SELECT *
      FROM packing_items
      WHERE trip_id = ?
    `).all(tripId);

    res.json({
      trip: {
        ...trip,
        estimated_budget: trip.estimated_budget
          ? JSON.parse(trip.estimated_budget)
          : {}
      },
      itinerary,
      hotels,
      packingList
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server Error"
    });
  }
};

const deleteTrip = (req, res) => {
  try {
    const tripId = req.params.id;

    const trip = db.prepare(`
      SELECT id
      FROM trips
      WHERE id = ?
      AND user_id = ?
    `).get(
      tripId,
      req.user.id
    );

    if (!trip) {
      return res.status(404).json({
        message: "Trip not found"
      });
    }

    const removeTrip = db.transaction(() => {
      const itineraryDays = db.prepare(`
        SELECT id
        FROM itinerary_days
        WHERE trip_id = ?
      `).all(tripId);

      for (const day of itineraryDays) {
        db.prepare(`
          DELETE FROM activities
          WHERE itinerary_day_id = ?
        `).run(day.id);
      }

      db.prepare(`
        DELETE FROM itinerary_days
        WHERE trip_id = ?
      `).run(tripId);

      db.prepare(`
        DELETE FROM hotels
        WHERE trip_id = ?
      `).run(tripId);

      db.prepare(`
        DELETE FROM packing_items
        WHERE trip_id = ?
      `).run(tripId);

      db.prepare(`
        DELETE FROM trips
        WHERE id = ?
        AND user_id = ?
      `).run(
        tripId,
        req.user.id
      );
    });

    removeTrip();

    res.json({
      message: "Trip deleted successfully"
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Server Error"
    });
  }
};

module.exports = {
  createTrip,
  getTrips,
  generateTrip,
  getTripById,
  deleteTrip
};
