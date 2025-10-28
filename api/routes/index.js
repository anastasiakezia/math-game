// // api/index.js
// const express = require("express");
// const bodyParser = require("body-parser");
// const cors = require("cors");
// require("dotenv").config();

// const { sequelize } = require("../models");
// const routes = require("./routes");

// const app = express();

// // Middleware
// app.use(cors());
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));

// // Tes koneksi DB sekali saja di awal (bukan tiap request)
// sequelize
//   .authenticate()
//   .then(() => console.log("✅ Database connected"))
//   .catch((err) => console.error("❌ DB error:", err.message));

// // Routes tanpa prefix tambahan
// app.use("/", routes);

// // Export app sebagai handler untuk serverless
// module.exports = app;

// api/routes/index.js
const express = require("express");
const router = express.Router();
const { models } = require("../models"); // ✅ ini benar, models dari ../models

// Tes route dasar
router.get("/", (req, res) => {
  res.json({ message: "Math Game API is running 🚀" });
});

// Contoh route ambil data pemain
router.get("/players", async (req, res) => {
  try {
    const players = await models.Players.findAll();
    res.json(players);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch players" });
  }
});

module.exports = router;
