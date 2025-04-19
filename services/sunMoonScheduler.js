const cron = require('node-cron');
const sunMoonController = require('../controllers/sunMoonController');

// Initialize the sun-moon scheduler
const initSunMoonScheduler = () => {
  // Schedule to run once a day at midnight
  cron.schedule('0 0 * * *', async () => {
    console.log('Running scheduled sun-moon data update - ' + new Date().toLocaleString());
    try {
      await sunMoonController.updateSunMoonData({ query: { city: 'Hanoi' } });
      console.log('Sun-moon data successfully updated');
    } catch (error) {
      console.error('Failed to update sun-moon data:', error);
    }
  });
  
  console.log('Sun-moon update scheduler initialized');
};

module.exports = {
  initSunMoonScheduler
};