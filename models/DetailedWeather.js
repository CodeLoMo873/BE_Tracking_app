const mongoose = require('mongoose');

const detailedWeatherSchema = new mongoose.Schema({
  location: String,
  country: String,
  temperature: Number,
  condition: String,
  date: String,
  day: String,
  night: String,
  
  airQuality: {
    index: Number,
    level: String,
    color: [String]
  },
  uvIndex: {
    value: Number,
    level: String,
    color: [String]
  },
  pressure: {
    value: Number,
    unit: String,
    normal: Boolean,
    rotation: String
  },
  wind: {
    speed: Number,
    unit: String,
    direction: String,
    directionDeg: Number
  },
  rainfall: {
    current: Number,
    unit: String,
    forecast: String
  },
  feelsLike: {
    temperature: Number,
    unit: String,
    description: String
  },
  humidity: {
    value: Number,
    unit: String,
    description: String
  },
  warnings: [String],
  lastUpdated: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('DetailedWeather', detailedWeatherSchema);