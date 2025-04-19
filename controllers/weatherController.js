const axios = require('axios');
const Weather = require('../models/Weather');

// Helper function to convert Kelvin to Celsius
const kelvinToCelsius = (kelvin) => Math.round(kelvin - 273.15);

// Helper to format date to local Vietnamese format
const formatDate = (timestamp) => {
  const date = new Date(timestamp * 1000);
  return date.toLocaleString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// Weather condition mapping from English to Vietnamese
const weatherConditionMap = {
  'Clear': 'Quang đãng',
  'Clouds': 'Có mây',
  'Rain': 'Mưa',
  'Drizzle': 'Mưa phùn',
  'Thunderstorm': 'Giông bão',
  'Snow': 'Tuyết',
  'Mist': 'Sương mù',
  'Smoke': 'Khói',
  'Haze': 'Sương mờ',
  'Dust': 'Bụi',
  'Fog': 'Sương mù dày đặc',
  'Sand': 'Cát',
  'Ash': 'Tro bụi',
  'Squall': 'Mưa đá',
  'Tornado': 'Lốc xoáy'
};

// Fetch weather data from OpenWeatherMap API
const fetchWeatherData = async (city = 'Hanoi,vn') => {
  try {
    const url = `${process.env.WEATHER_BASE_URL}weather?q=${city}&appid=${process.env.WEATHER_API_KEY_STUDENT_PACKAGE}`;
    const response = await axios.get(url);
    const data = response.data;

    // Get day and night temperatures (approximation using min/max)
    const dayTemp = kelvinToCelsius(data.main.temp_max);
    const nightTemp = kelvinToCelsius(data.main.temp_min);

    // Map the weather condition to Vietnamese
    const condition = weatherConditionMap[data.weather[0].main] || data.weather[0].description;

    const weatherData = {
      location: `${data.name}, ${data.sys.country}`,
      country: data.sys.country === 'VN' ? 'Việt Nam' : data.sys.country,
      temperature: kelvinToCelsius(data.main.temp),
      condition: condition,
      date: formatDate(data.dt),
      day: `Ngày ${dayTemp}°`,
      night: `Tối ${nightTemp}°`,
      humidity: data.main.humidity,
      windSpeed: Math.round(data.wind.speed),
      feelsLike: kelvinToCelsius(data.main.feels_like),
      lastUpdated: new Date()
    };

    return weatherData;
  } catch (error) {
    console.error('Error fetching weather data:', error);
    throw error;
  }
};

// Update weather data in database
exports.updateWeatherData = async (req, res) => {
  try {
    const city = req.query.city || 'Hanoi';
    const weatherData = await fetchWeatherData(city);
    
    // Find and update or create new document
    const weather = await Weather.findOneAndUpdate(
      { location: { $regex: new RegExp(city, 'i') } },
      weatherData,
      { new: true, upsert: true }
    );
    
    if (res) {
      res.status(200).json(weather);
    }
    return weather;
  } catch (error) {
    console.error('Error updating weather data:', error);
    if (res) {
      res.status(500).json({ message: error.message });
    }
    throw error;
  }
};

// Get current weather data
exports.getCurrentWeather = async (req, res) => {
  try {
    const city = req.query.city || 'Hanoi';
    
    // Find the latest weather data
    let weather = await Weather.findOne({ 
      location: { $regex: new RegExp(city, 'i') } 
    });

    // If no weather data or it's older than 15 minutes, update it
    if (!weather || 
        (new Date() - new Date(weather.lastUpdated)) > 15 * 60 * 1000) {
      weather = await this.updateWeatherData({ query: { city } });
    }
    
    res.status(200).json(weather);
  } catch (error) {
    console.error('Error getting weather data:', error);
    res.status(500).json({ message: error.message });
  }
};