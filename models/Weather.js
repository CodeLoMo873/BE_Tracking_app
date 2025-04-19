const mongoose = require('mongoose');

const weatherSchema = new mongoose.Schema({
  location: String,
  country: String,
  temperature: Number,
  condition: String,
  date: String,
  day: String,
  night: String,
  humidity: Number,
  windSpeed: Number,
  feelsLike: Number,
  lastUpdated: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Weather', weatherSchema);