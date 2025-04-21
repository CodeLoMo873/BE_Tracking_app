const axios = require('axios')
const Weather = require('../models/Weather')

// Helper function to convert Kelvin to Celsius
const kelvinToCelsius = (kelvin) => Math.round(kelvin - 273.15)

// Helper to format date to local Vietnamese format
const formatDate = (timestamp) => {
  const date = new Date(timestamp * 1000)
  return date.toLocaleString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// Weather condition mapping from English to Vietnamese
const weatherConditionMap = {
  Clear: 'Quang đãng',
  Clouds: 'Có mây',
  Rain: 'Mưa',
  Drizzle: 'Mưa phùn',
  Thunderstorm: 'Giông bão',
  Snow: 'Tuyết',
  Mist: 'Sương mù',
  Smoke: 'Khói',
  Haze: 'Sương mờ',
  Dust: 'Bụi',
  Fog: 'Sương mù dày đặc',
  Sand: 'Cát',
  Ash: 'Tro bụi',
  Squall: 'Mưa đá',
  Tornado: 'Lốc xoáy'
}

// Default location if none is provided
const DEFAULT_LOCATION = 'Hanoi,vn'

// Fetch weather data from OpenWeatherMap API with support for coordinates or location name
const fetchWeatherData = async (params) => {
  try {
    let url = `${process.env.WEATHER_BASE_URL}weather`

    // Handle different location parameter types
    if (params.lat && params.lon) {
      // Use coordinates if provided
      url += `?lat=${params.lat}&lon=${params.lon}`
    } else {
      // Use location name (default or provided)
      const location = params.location || DEFAULT_LOCATION
      url += `?q=${location}`
    }

    // Add API key
    url += `&appid=${process.env.WEATHER_API_KEY_STUDENT_PACKAGE}`

    const response = await axios.get(url)
    const data = response.data

    // Get day and night temperatures (approximation using min/max)
    const dayTemp = kelvinToCelsius(data.main.temp_max)
    const nightTemp = kelvinToCelsius(data.main.temp_min)

    // Map the weather condition to Vietnamese
    const condition =
      weatherConditionMap[data.weather[0].main] || data.weather[0].description

    // Create location key for database lookup - use coordinates or city name
    let locationKey = data.name
    const weatherData = {
      location: locationKey,
      country: data.sys.country === 'VN' ? 'Việt Nam' : data.sys.country,
      temperature: kelvinToCelsius(data.main.temp),
      condition: condition,
      date: formatDate(data.dt),
      day: `Ngày ${dayTemp}°`,
      night: `Tối ${nightTemp}°`,
      humidity: data.main.humidity,
      windSpeed: Math.round(data.wind.speed),
      feelsLike: kelvinToCelsius(data.main.feels_like),
      coordinates: {
        lat: data.coord.lat,
        lon: data.coord.lon
      },
      lastUpdated: new Date()
    }

    return weatherData
  } catch (error) {
    console.error('Error fetching weather data:', error)
    throw error
  }
}

// Update weather data in database
exports.updateWeatherData = async (req, res) => {
  try {
    // Extract location parameters
    const locationParams = {
      lat: req.query.lat || null,
      lon: req.query.lon || null,
      location:
        req.query.location || (req.query.useDefault ? DEFAULT_LOCATION : null)
    }

    // Ensure we have at least one type of location parameter
    if (
      !locationParams.lat &&
      !locationParams.lon &&
      !locationParams.location
    ) {
      locationParams.location = DEFAULT_LOCATION
    }

    const weatherData = await fetchWeatherData(locationParams)

    // Find and update or create new document
    // Use either coordinates or location name for lookup
    let query
    if (locationParams.lat && locationParams.lon) {
      query = {
        'coordinates.lat': {
          $gte: locationParams.lat - 0.01,
          $lte: locationParams.lat + 0.01
        },
        'coordinates.lon': {
          $gte: locationParams.lon - 0.01,
          $lte: locationParams.lon + 0.01
        }
      }
    } else {
      const locationRegex = new RegExp(weatherData.location.split(',')[0], 'i')
      query = { location: { $regex: locationRegex } }
    }

    const weather = await Weather.findOneAndUpdate(query, weatherData, {
      new: true,
      upsert: true
    })

    if (res) {
      res.status(200).json(weather)
    }
    return weather
  } catch (error) {
    console.error('Error updating weather data:', error)
    if (res) {
      res.status(500).json({ message: error.message })
    }
    throw error
  }
}

// Get current weather data
exports.getCurrentWeather = async (req, res) => {
  try {
    // Extract location parameters
    const locationParams = {
      lat: parseFloat(req.query.lat) || null,
      lon: parseFloat(req.query.lon) || null,
      location:
        req.query.location || (req.query.useDefault ? DEFAULT_LOCATION : null)
    }

    // Ensure we have at least one type of location parameter
    if (
      !locationParams.lat &&
      !locationParams.lon &&
      !locationParams.location
    ) {
      locationParams.location = DEFAULT_LOCATION
    }

    // Find the latest weather data based on location parameters
    let weather
    if (locationParams.lat && locationParams.lon) {
      // Search by coordinates with small buffer for precision issues
      weather = await Weather.findOne({
        'coordinates.lat': {
          $gte: locationParams.lat - 0.01,
          $lte: locationParams.lat + 0.01
        },
        'coordinates.lon': {
          $gte: locationParams.lon - 0.01,
          $lte: locationParams.lon + 0.01
        }
      })
    } else if (locationParams.location) {
      // Search by location name
      const locationRegex = new RegExp(
        locationParams.location.split(',')[0],
        'i'
      )
      weather = await Weather.findOne({ location: { $regex: locationRegex } })
    }

    // If no weather data or it's older than 15 minutes, update it
    if (
      !weather ||
      new Date() - new Date(weather.lastUpdated) > 15 * 60 * 1000
    ) {
      weather = await this.updateWeatherData({ query: locationParams })
    }

    res.status(200).json(weather)
  } catch (error) {
    console.error('Error getting weather data:', error)
    res.status(500).json({ message: error.message })
  }
}
