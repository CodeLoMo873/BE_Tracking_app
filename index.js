const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;
const User = require('./models/User');
const songRoutes = require('./routes/songRoutes');
const userRoutes = require('./routes/userRoutes');
const weatherRoutes = require('./routes/weatherRoutes');
const badWeatherRoutes = require('./routes/badWeatherRoutes');
const sunMoonRoutes = require('./routes/sunMoonRoutes');
const weatherScheduler = require('./services/weatherScheduler');
const badWeatherScheduler = require('./services/badWeatherScheduler');
const sunMoonScheduler = require('./services/sunMoonScheduler');

// Middleware
app.use(express.json());

app.use('/api/songs', songRoutes);
app.use('/api/artists', require('./routes/artistRoutes'));
app.use('/api/albums', require('./routes/albumRoutes'));
app.use('/api/tracks', require('./routes/trackRoutes'));
app.use('/api/playlists', require('./routes/playlistRoutes'));
app.use('/api/weather', weatherRoutes);
app.use('/api/bad-weather', badWeatherRoutes);
app.use('/api/sun-moon', sunMoonRoutes);
app.use('/api/user', userRoutes);

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ Connected to MongoDB'))
.catch((err) => console.error('❌ MongoDB connection error:', err));

// Initialize the weather scheduler when the app starts
weatherScheduler.initWeatherScheduler();
badWeatherScheduler.initBadWeatherScheduler();
sunMoonScheduler.initSunMoonScheduler();

// Routes
app.get('/', (req, res) => {
  res.send('Express + MongoDB Backend!');
});

app.post('/users', async (req, res) => {
    try {
      const user = new User(req.body);
      const saved = await user.save();
      res.status(201).json(saved);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
