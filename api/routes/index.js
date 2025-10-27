// api/index.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

const { sequelize } = require('./models');
const routes = require('./routes');

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


async function ensureDB() {
  try {
    await sequelize.authenticate();
  } catch (err) {
    console.error("DB error:", err.message);
  }
}

app.use(async (req, res, next) => {
  await ensureDB();
  next();
});

// API Routes
app.use('/api', routes);


module.exports = (req, res) => {
  app(req, res);
};
