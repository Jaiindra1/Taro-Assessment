require("dotenv").config();

require("./database/schema");

const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Trao AI Travel Planner API");
});

app.use("/api/auth", authRoutes);
const tripRoutes = require("./routes/tripRoutes");
app.use("/api/trips", tripRoutes);
const aiRoutes =
require("./routes/aiRoutes");

app.use("/api/ai", aiRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});
