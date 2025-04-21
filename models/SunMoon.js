const mongoose = require('mongoose')

const sunMoonSchema = new mongoose.Schema({
  location: String,
  country: String,
  date: String,
  sunrise: String,
  sunset: String,
  dayLength: String,
  nightLength: String,
  moonrise: String,
  moonset: String,
  moonPhase: String,
  moonPhasePercentage: String,
  coordinates: {
    lat: Number,
    lon: Number
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
})

module.exports = mongoose.model('SunMoon', sunMoonSchema)
