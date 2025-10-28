// api/index.js
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();

const { sequelize } = require("./models");
const routes = require("./routes");

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Tes koneksi DB sekali saja di awal (bukan tiap request)
sequelize
  .authenticate()
  .then(() => console.log("✅ Database connected"))
  .catch((err) => console.error("❌ DB error:", err.message));

// Routes tanpa prefix tambahan
app.use("/", routes);

// Export app sebagai handler untuk serverless
module.exports = app;
