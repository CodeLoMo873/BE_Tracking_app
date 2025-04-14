// models/Song.js
const mongoose = require('mongoose');

const songSchema = new mongoose.Schema({
  title: { type: String, required: true },
  artist: { type: String, required: true },
  genre: String,
  url: { type: String, required: true }, // link bài hát (YouTube, mp3, Spotify...)
  weatherTags: [String], // ví dụ: ["sunny", "rainy", "cloudy", "cold"]
  mood: String, // optional: happy, chill, sad, energetic,...
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Song', songSchema);
