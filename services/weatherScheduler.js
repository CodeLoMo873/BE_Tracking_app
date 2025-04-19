const cron = require('node-cron');
const weatherController = require('../controllers/weatherController');

// Initialize the weather scheduler
const initWeatherScheduler = () => {
  // Schedule to run every 15 minutes
  cron.schedule('*/15 * * * *', async () => {
    console.log('Running scheduled weather update - ' + new Date().toLocaleString());
    try {
      await weatherController.updateWeatherData({ query: { city: 'Hanoi' } });
      console.log('Weather data successfully updated');
    } catch (error) {
      console.error('Failed to update weather data:', error);
    }
  });
  
  console.log('Weather update scheduler initialized');
};

module.exports = {
  initWeatherScheduler
};