// models/Artist.js
const mongoose = require('mongoose');

const artistSchema = new mongoose.Schema({
  spotifyId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  genres: [String],
  popularity: Number,
  followers: {
    href: String,
    total: Number
  },
  external_urls: {
    spotify: String
  },
  images: [
    {
      url: String,
      height: Number,
      width: Number
    }
  ],
  uri: String,
  href: String,
  type: String
});

module.exports = mongoose.model('Artist', artistSchema);
