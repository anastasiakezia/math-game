// api/index.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

const { sequelize } = require('./models');
const routes = require('./routes');
const path = require('path');

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// API routes
app.use('/api', routes);

// Serve static frontend (optional)
app.use('/', express.static(path.join(__dirname, 'public')));

// Jalankan koneksi DB hanya sekali
(async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connected (Vercel)');
  } catch (err) {
    console.error('❌ Unable to connect to DB:', err.message);
  }
})();

// Export untuk Vercel
module.exports = app;
