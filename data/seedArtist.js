// data/seedArtists.js
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Artist = require('../models/Artist');
const fs = require('fs');
dotenv.config();

const seedData = require('./artists.json'); // bạn nên copy dữ liệu JSON vào file này

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(async () => {
  console.log("Connected to MongoDB");

  await Artist.deleteMany();

  const artists = seedData.artists.map(a => ({
    spotifyId: a.id,
    name: a.name,
    genres: a.genres,
    popularity: a.popularity,
    followers: a.followers,
    external_urls: a.external_urls,
    images: a.images,
    uri: a.uri,
    href: a.href,
    type: a.type
  }));

  await Artist.insertMany(artists);
  console.log("🎉 Seeded artists successfully!");

  mongoose.connection.close();
})
.catch(err => {
  console.error(err);
  mongoose.connection.close();
});
