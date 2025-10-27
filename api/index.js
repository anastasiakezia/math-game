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

// Routes
app.use('/api', routes);

// DB Connect sekali
(async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connected (Vercel)');
  } catch (err) {
    console.error('❌ Unable to connect to DB:', err.message);
  }
})();

module.exports = (req, res) => {
  app(req, res);
};
