const cron = require('node-cron')
const detailedWeatherController = require('../controllers/detailedWeatherController')

// Initialize the detailed weather scheduler
const initBadWeatherScheduler = () => {
  // Schedule to run every 15 minutes
  cron.schedule('*/15 * * * *', async () => {
    console.log(
      'Running scheduled detailed weather update - ' +
        new Date().toLocaleString()
    )
    try {
      // Pass the default city using the location parameter
      await detailedWeatherController.updateDetailedWeatherData({
        query: {
          useDefault: true
        }
      })
      console.log('Detailed weather data successfully updated')
    } catch (error) {
      console.error('Failed to update detailed weather data:', error)
    }
  })

  console.log('Detailed weather update scheduler initialized')
}

module.exports = {
  initBadWeatherScheduler
}
