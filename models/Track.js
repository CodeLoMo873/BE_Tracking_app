const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const trackSchema = new Schema({
  artists: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Artist',
    }
  ],
  album: {
    type: Schema.Types.ObjectId,
    ref: 'Album',
  },
  disc_number: Number,
  duration_ms: Number,
  explicit: Boolean,
  external_urls: {
    spotify: String,
  },
  href: String,
  id: String,
  name: String,
  preview_url: String,
  track_number: Number,
  type: String,
  uri: String,
  is_local: Boolean
});

module.exports = mongoose.model('Track', trackSchema);
