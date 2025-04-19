const axios = require('axios');
const DetailedWeather = require('../models/DetailedWeather');

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

// Function to determine Air Quality Index level and color
const getAQIInfo = (aqi) => {
  if (aqi <= 50) {
    return { level: 'Tốt', color: ['#4CAF50', '#8BC34A'] };
  } else if (aqi <= 100) {
    return { level: 'Trung bình', color: ['#FFEB3B', '#FFC107'] };
  } else if (aqi <= 150) {
    return { level: 'Không tốt cho nhóm nhạy cảm', color: ['#FF9800', '#F57C00'] };
  } else {
    return { level: 'Không lành mạnh', color: ['#F44336', '#D32F2F'] };
  }
};

// Function to determine UV Index level and color
const getUVInfo = (uv) => {
  if (uv <= 2) {
    return { level: 'Thấp', color: ['#4CAF50', '#8BC34A'] };
  } else if (uv <= 5) {
    return { level: 'Trung bình', color: ['#FFEB3B', '#FFC107'] };
  } else if (uv <= 7) {
    return { level: 'Cao', color: ['#FF9800', '#F57C00'] };
  } else {
    return { level: 'Rất cao', color: ['#F44336', '#D32F2F'] };
  }
};

// Function to determine wind direction from degrees
const getWindDirection = (degrees) => {
  if ((degrees >= 0 && degrees <= 45) || (degrees > 315 && degrees <= 360)) {
    return 'B'; // Bắc
  } else if (degrees > 45 && degrees <= 135) {
    return 'Đ'; // Đông
  } else if (degrees > 135 && degrees <= 225) {
    return 'N'; // Nam
  } else {
    return 'T'; // Tây
  }
};

// Function to determine humidity description
const getHumidityDescription = (humidity) => {
  if (humidity > 70) {
    return 'Độ ẩm cao, cảm giác oi bức.';
  } else if (humidity < 30) {
    return 'Độ ẩm thấp, không khí khô.';
  } else {
    return 'Độ ẩm bình thường.';
  }
};

// Function to determine feels like description
const getFeelsLikeDescription = (feelsLike, temperature) => {
  if (feelsLike > temperature + 2) {
    return 'Cảm giác nóng hơn nhiệt độ thực tế.';
  } else if (feelsLike < temperature - 2) {
    return 'Cảm giác lạnh hơn nhiệt độ thực tế.';
  } else {
    return 'Tương tự nhiệt độ thực tế.';
  }
};

// Function to analyze weather warnings
const analyzeWeatherWarnings = (weatherData) => {
  const warnings = [];
  
  // Check wind speed
  if (weatherData.wind.speed > 20) {
    warnings.push(`Cảnh báo gió mạnh: ${weatherData.wind.speed}km/h. Hạn chế ra ngoài.`);
  }
  
  // Check UV index
  if (weatherData.uvIndex.value > 8) {
    warnings.push(`Chỉ số UV rất cao (${weatherData.uvIndex.value}). Tránh tiếp xúc trực tiếp với ánh nắng.`);
  }
  
  // Check rainfall
  if (weatherData.rainfall.current > 10) {
    warnings.push(`Mưa to: ${weatherData.rainfall.current}mm. Có thể gây ngập lụt cục bộ.`);
  }
  
  // Check air quality
  if (weatherData.airQuality.index > 150) {
    warnings.push(`Chất lượng không khí kém (${weatherData.airQuality.index}). Hạn chế hoạt động ngoài trời.`);
  }
  
  return warnings;
};

// Fetch detailed weather data from OpenWeatherMap API
const fetchDetailedWeatherData = async (city = 'Hanoi') => {
  try {
    // Get basic weather data
    const weatherUrl = `${process.env.WEATHER_BASE_URL}weather?q=${city}&appid=${process.env.WEATHER_API_KEY_STUDENT_PACKAGE}`;
    const weatherResponse = await axios.get(weatherUrl);
    const weatherData = weatherResponse.data;

    // Calculate basic metrics
    const temperature = kelvinToCelsius(weatherData.main.temp);
    const feelsLike = kelvinToCelsius(weatherData.main.feels_like);
    const dayTemp = kelvinToCelsius(weatherData.main.temp_max);
    const nightTemp = kelvinToCelsius(weatherData.main.temp_min);
    const condition = weatherConditionMap[weatherData.weather[0].main] || weatherData.weather[0].description;

    // Simulate AQI (in real app, you'd use an AQI API)
    const aqi = Math.floor(Math.random() * 200);
    const aqiInfo = getAQIInfo(aqi);

    // Simulate UV index based on temperature and time of day
    const uv = Math.min(11, Math.floor(temperature / 10 * 3));
    const uvInfo = getUVInfo(uv);

    // Extract pressure info
    const pressure = weatherData.main.pressure;
    const pressureNormal = pressure >= 1000 && pressure <= 1020;
    const pressureRotation = pressure < 1000 ? '-45deg' : pressure > 1020 ? '45deg' : '0deg';

    // Extract wind info
    const windSpeed = Math.round(weatherData.wind.speed * 3.6); // Convert m/s to km/h
    const windDirection = getWindDirection(weatherData.wind.deg);
    
    // Extract rainfall info
    let rainfallCurrent = 0;
    let rainfallForecast = 'Không có mưa trong 24h tới.';
    
    if (weatherData.rain && weatherData.rain['1h']) {
      rainfallCurrent = weatherData.rain['1h'];
      rainfallForecast = `Dự kiến còn mưa ${Math.round(rainfallCurrent * 0.7)} mm trong 24h tới.`;
    } else if (weatherData.weather[0].main.toLowerCase().includes('rain')) {
      rainfallCurrent = 0.5;
      rainfallForecast = 'Có thể có mưa nhẹ trong 24h tới.';
    }

    // Get other descriptive fields
    const humidityDesc = getHumidityDescription(weatherData.main.humidity);
    const feelsLikeDesc = getFeelsLikeDescription(feelsLike, temperature);

    // Create detailed weather object
    const detailedWeather = {
      location: `${weatherData.name}, ${weatherData.sys.country}`,
      country: weatherData.sys.country === 'VN' ? 'Việt Nam' : weatherData.sys.country,
      temperature: temperature,
      condition: condition,
      date: formatDate(weatherData.dt),
      day: `Ngày ${dayTemp}°`,
      night: `Tối ${nightTemp}°`,
      
      airQuality: {
        index: aqi,
        level: aqiInfo.level,
        color: aqiInfo.color
      },
      uvIndex: {
        value: uv,
        level: uvInfo.level,
        color: uvInfo.color
      },
      pressure: {
        value: pressure,
        unit: 'hPa',
        normal: pressureNormal,
        rotation: pressureRotation
      },
      wind: {
        speed: windSpeed,
        unit: 'km/h',
        direction: windDirection,
        directionDeg: weatherData.wind.deg
      },
      rainfall: {
        current: rainfallCurrent,
        unit: 'mm',
        forecast: rainfallForecast
      },
      feelsLike: {
        temperature: feelsLike,
        unit: '°',
        description: feelsLikeDesc
      },
      humidity: {
        value: weatherData.main.humidity,
        unit: '%',
        description: humidityDesc
      },
      lastUpdated: new Date()
    };

    // Analyze warnings
    detailedWeather.warnings = analyzeWeatherWarnings(detailedWeather);

    return detailedWeather;
  } catch (error) {
    console.error('Error fetching detailed weather data:', error);
    throw error;
  }
};

// Update detailed weather data in database
exports.updateDetailedWeatherData = async (req, res) => {
  try {
    const city = req.query.city || 'Hanoi';
    const weatherData = await fetchDetailedWeatherData(city);
    
    // Find and update or create new document
    const weather = await DetailedWeather.findOneAndUpdate(
      { location: { $regex: new RegExp(city, 'i') } },
      weatherData,
      { new: true, upsert: true }
    );
    
    if (res) {
      res.status(200).json(weather);
    }
    return weather;
  } catch (error) {
    console.error('Error updating detailed weather data:', error);
    if (res) {
      res.status(500).json({ message: error.message });
    }
    throw error;
  }
};

// Get current detailed weather data
exports.getBadWeather = async (req, res) => {
  try {
    const city = req.query.city || 'Hanoi';
    
    // Find the latest weather data
    let weather = await DetailedWeather.findOne({ 
      location: { $regex: new RegExp(city, 'i') } 
    });

    // If no weather data or it's older than 15 minutes, update it
    if (!weather || 
        (new Date() - new Date(weather.lastUpdated)) > 15 * 60 * 1000) {
      weather = await this.updateDetailedWeatherData({ query: { city } });
    }
    
    res.status(200).json(weather);
  } catch (error) {
    console.error('Error getting detailed weather data:', error);
    res.status(500).json({ message: error.message });
  }
};