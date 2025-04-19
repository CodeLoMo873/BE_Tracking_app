const axios = require('axios');
const SunMoon = require('../models/SunMoon');

// Helper to format time in Vietnamese format
const formatTime = (timestamp) => {
  const date = new Date(timestamp * 1000);
  return date.toLocaleTimeString('vi-VN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });
};

// Helper to format date in Vietnamese format
const formatDate = (timestamp) => {
  const date = new Date(timestamp * 1000);
  return date.toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};

// Calculate moon phase based on date
const calculateMoonPhase = () => {
  const date = new Date();
  const synodic = 29.5; // days in lunar cycle
  
  // Calculate days since new moon on Jan 6, 2000
  const newMoon = new Date(2000, 0, 6).getTime();
  const daysSinceNewMoon = (date.getTime() - newMoon) / (1000 * 60 * 60 * 24);
  
  // Calculate current position in cycle (0 to 1)
  const phase = (daysSinceNewMoon % synodic) / synodic;
  const phasePercent = Math.round(phase * 100);
  
  // Determine moon phase name based on percentage
  let moonPhase = 'Trăng mới';
  if (phase > 0 && phase < 0.25) {
    moonPhase = 'Trăng lưỡi liềm đầu tháng';
  } else if (phase >= 0.25 && phase < 0.45) {
    moonPhase = 'Trăng bán nguyệt đầu tháng';
  } else if (phase >= 0.45 && phase < 0.55) {
    moonPhase = 'Trăng tròn';
  } else if (phase >= 0.55 && phase < 0.75) {
    moonPhase = 'Trăng bán nguyệt cuối tháng';
  } else if (phase >= 0.75) {
    moonPhase = 'Trăng lưỡi liềm cuối tháng';
  }
  
  return {
    moonPhase,
    phasePercent
  };
};

// Fetch sun and moon data from OpenWeatherMap API
const fetchSunMoonData = async (city = 'Hanoi') => {
  try {
    const url = `${process.env.WEATHER_BASE_URL}weather?q=${city}&appid=${process.env.WEATHER_API_KEY_STUDENT_PACKAGE}`;
    const response = await axios.get(url);
    const data = response.data;

    // Process sunrise and sunset times
    const sunriseDate = new Date(data.sys.sunrise * 1000);
    const sunsetDate = new Date(data.sys.sunset * 1000);
    
    // Format times
    const sunrise = formatTime(data.sys.sunrise);
    const sunset = formatTime(data.sys.sunset);
    
    // Calculate day length
    const dayLengthMs = data.sys.sunset * 1000 - data.sys.sunrise * 1000;
    const dayLengthHours = Math.floor(dayLengthMs / (1000 * 60 * 60));
    const dayLengthMinutes = Math.floor((dayLengthMs % (1000 * 60 * 60)) / (1000 * 60));
    const dayLength = `${dayLengthHours}:${dayLengthMinutes.toString().padStart(2, '0')}`;
    
    // Calculate night length (24h - day length)
    const nightLengthHours = 23 - dayLengthHours;
    const nightLengthMinutes = 60 - dayLengthMinutes;
    const nightLength = `${nightLengthHours}:${nightLengthMinutes.toString().padStart(2, '0')}`;
    
    // Generate moonrise and moonset data
    // This is a simplified approximation - in reality, you would use an astronomical API
    const moonrise = formatTime(data.sys.sunset + 1800); // 30 minutes after sunset
    const moonset = formatTime(data.sys.sunrise - 1800); // 30 minutes before sunrise
    
    // Calculate moon phase
    const { moonPhase, phasePercent } = calculateMoonPhase();
    
    const sunMoonData = {
      location: `${data.name}, ${data.sys.country}`,
      date: formatDate(data.dt),
      sunrise,
      sunset,
      dayLength,
      nightLength,
      moonrise,
      moonset,
      moonPhase,
      moonPhasePercentage: `${phasePercent}%`,
      lastUpdated: new Date()
    };
    
    return sunMoonData;
  } catch (error) {
    console.error('Error fetching sun-moon data:', error);
    throw error;
  }
};

// Update sun and moon data in database
exports.updateSunMoonData = async (req, res) => {
  try {
    const city = req.query.city || 'Hanoi';
    const sunMoonData = await fetchSunMoonData(city);
    
    // Find and update or create new document
    const sunMoon = await SunMoon.findOneAndUpdate(
      { location: { $regex: new RegExp(city, 'i') } },
      sunMoonData,
      { new: true, upsert: true }
    );
    
    if (res) {
      res.status(200).json(sunMoon);
    }
    return sunMoon;
  } catch (error) {
    console.error('Error updating sun-moon data:', error);
    if (res) {
      res.status(500).json({ message: error.message });
    }
    throw error;
  }
};

// Get current sun and moon data
exports.getSunMoonData = async (req, res) => {
  try {
    const city = req.query.city || 'Hanoi';
    
    // Find the latest sun-moon data
    let sunMoon = await SunMoon.findOne({ 
      location: { $regex: new RegExp(city, 'i') } 
    });

    // If no data or it's older than a day, update it
    // (Sun/moon data doesn't need to update as frequently as weather)
    if (!sunMoon || 
        (new Date() - new Date(sunMoon.lastUpdated)) > 24 * 60 * 60 * 1000) {
      sunMoon = await this.updateSunMoonData({ query: { city } });
    }
    
    res.status(200).json(sunMoon);
  } catch (error) {
    console.error('Error getting sun-moon data:', error);
    res.status(500).json({ message: error.message });
  }
};