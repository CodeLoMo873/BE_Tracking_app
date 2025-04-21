const axios = require('axios')
const SunMoon = require('../models/SunMoon')

// Helper to format time in Vietnamese format
const formatTime = (timestamp) => {
  const date = new Date(timestamp * 1000)
  return date.toLocaleTimeString('vi-VN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  })
}

// Helper to format date in Vietnamese format
const formatDate = (timestamp) => {
  const date = new Date(timestamp * 1000)
  return date.toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })
}

// Default location if none is provided
const DEFAULT_LOCATION = 'Hanoi,vn'

// Calculate moon phase based on date
const calculateMoonPhase = () => {
  const date = new Date()
  const synodic = 29.5 // days in lunar cycle

  // Calculate days since new moon on Jan 6, 2000
  const newMoon = new Date(2000, 0, 6).getTime()
  const daysSinceNewMoon = (date.getTime() - newMoon) / (1000 * 60 * 60 * 24)

  // Calculate current position in cycle (0 to 1)
  const phase = (daysSinceNewMoon % synodic) / synodic
  const phasePercent = Math.round(phase * 100)

  // Determine moon phase name based on percentage
  let moonPhase = 'Trăng mới'
  if (phase > 0 && phase < 0.25) {
    moonPhase = 'Trăng lưỡi liềm đầu tháng'
  } else if (phase >= 0.25 && phase < 0.45) {
    moonPhase = 'Trăng bán nguyệt đầu tháng'
  } else if (phase >= 0.45 && phase < 0.55) {
    moonPhase = 'Trăng tròn'
  } else if (phase >= 0.55 && phase < 0.75) {
    moonPhase = 'Trăng bán nguyệt cuối tháng'
  } else if (phase >= 0.75) {
    moonPhase = 'Trăng lưỡi liềm cuối tháng'
  }

  return {
    moonPhase,
    phasePercent
  }
}

// Fetch sun and moon data from OpenWeatherMap API with support for coordinates or location name
const fetchSunMoonData = async (params) => {
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

    // Process sunrise and sunset times
    const sunriseDate = new Date(data.sys.sunrise * 1000)
    const sunsetDate = new Date(data.sys.sunset * 1000)

    // Format times
    const sunrise = formatTime(data.sys.sunrise)
    const sunset = formatTime(data.sys.sunset)

    // Calculate day length
    const dayLengthMs = data.sys.sunset * 1000 - data.sys.sunrise * 1000
    const dayLengthHours = Math.floor(dayLengthMs / (1000 * 60 * 60))
    const dayLengthMinutes = Math.floor(
      (dayLengthMs % (1000 * 60 * 60)) / (1000 * 60)
    )
    const dayLength = `${dayLengthHours}:${dayLengthMinutes
      .toString()
      .padStart(2, '0')}`

    // Calculate night length (24h - day length)
    const nightLengthHours = 23 - dayLengthHours
    const nightLengthMinutes = 60 - dayLengthMinutes
    const nightLength = `${nightLengthHours}:${nightLengthMinutes
      .toString()
      .padStart(2, '0')}`

    // Generate moonrise and moonset data
    // This is a simplified approximation - in reality, you would use an astronomical API
    const moonrise = formatTime(data.sys.sunset + 1800) // 30 minutes after sunset
    const moonset = formatTime(data.sys.sunrise - 1800) // 30 minutes before sunrise

    // Calculate moon phase
    const { moonPhase, phasePercent } = calculateMoonPhase()

    // Use just the city name for location
    const locationKey = data.name

    const sunMoonData = {
      location: locationKey,
      country: data.sys.country === 'VN' ? 'Việt Nam' : data.sys.country,
      date: formatDate(data.dt),
      sunrise,
      sunset,
      dayLength,
      nightLength,
      moonrise,
      moonset,
      moonPhase,
      moonPhasePercentage: `${phasePercent}%`,
      coordinates: {
        lat: data.coord.lat,
        lon: data.coord.lon
      },
      lastUpdated: new Date()
    }

    return sunMoonData
  } catch (error) {
    console.error('Error fetching sun-moon data:', error)
    throw error
  }
}

// Update sun and moon data in database
exports.updateSunMoonData = async (req, res) => {
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

    const sunMoonData = await fetchSunMoonData(locationParams)

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
      // Just search by city name (without country code)
      const cityName = locationParams.location
        ? locationParams.location.split(',')[0]
        : DEFAULT_LOCATION.split(',')[0]
      query = { location: cityName }
    }

    const sunMoon = await SunMoon.findOneAndUpdate(query, sunMoonData, {
      new: true,
      upsert: true
    })

    if (res) {
      res.status(200).json(sunMoon)
    }
    return sunMoon
  } catch (error) {
    console.error('Error updating sun-moon data:', error)
    if (res) {
      res.status(500).json({ message: error.message })
    }
    throw error
  }
}

// Get current sun and moon data
exports.getSunMoonData = async (req, res) => {
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

    // Find the latest sun-moon data based on location parameters
    let sunMoon
    if (locationParams.lat && locationParams.lon) {
      // Search by coordinates with small buffer for precision issues
      sunMoon = await SunMoon.findOne({
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
      const cityName = locationParams.location.split(',')[0]
      sunMoon = await SunMoon.findOne({ location: cityName })
    }

    // If no data or it's older than a day, update it
    // (Sun/moon data doesn't need to update as frequently as weather)
    if (
      !sunMoon ||
      new Date() - new Date(sunMoon.lastUpdated) > 24 * 60 * 60 * 1000
    ) {
      sunMoon = await this.updateSunMoonData({ query: locationParams })
    }

    res.status(200).json(sunMoon)
  } catch (error) {
    console.error('Error getting sun-moon data:', error)
    res.status(500).json({ message: error.message })
  }
}
