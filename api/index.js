const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();

const { sequelize } = require("../models");
const routes = require("../routes");

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.use("/api", routes);

sequelize
  .authenticate()
  .then(() => console.log("✅ Database connected (Vercel Serverless)"))
  .catch((err) => console.error("❌ DB error:", err.message));

module.exports = app;
