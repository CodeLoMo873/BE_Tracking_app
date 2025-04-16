const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Album = require('../models/Album');

dotenv.config();

const weatherConditions = ['sunny', 'rainy', 'cloudy', 'cold', 'windy', 'hot', 'foggy'];

function getRandomWeather() {
  return weatherConditions[Math.floor(Math.random() * weatherConditions.length)];
}

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(async () => {
  console.log('✅ Connected to MongoDB');

  const albums = await Album.find();
  if (albums.length === 0) {
    console.log('⚠️ No albums found.');
    return mongoose.connection.close();
  }

  for (const album of albums) {
    album.weatherCondition = getRandomWeather();
    await album.save();
  }

  console.log(`🌦️ Updated ${albums.length} albums with random weather conditions.`);
  mongoose.connection.close();
})
.catch(err => {
  console.error(err);
  mongoose.connection.close();
});
