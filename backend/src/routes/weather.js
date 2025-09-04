const express = require('express');
const router = express.Router();
const weatherService = require('../services/weatherService');

// GET /api/weather/current?city=CityName
router.get('/current', async (req, res) => {
  try {
    const { city } = req.query;
    
    if (!city) {
      return res.status(400).json({
        success: false,
        error: 'City parameter is required',
        example: '/api/weather/current?city=London'
      });
    }

    const weatherData = await weatherService.getCurrentWeather(city);
    
    res.json({
      success: true,
      data: weatherData,
      timestamp: new Date().toISOString(),
      city: city
    });
    
  } catch (error) {
    console.error('Weather route error:', error);
    
    let statusCode = 500;
    let errorMessage = 'Internal server error';
    
    if (error.response) {
      statusCode = error.response.status;
      
      switch (statusCode) {
        case 404:
          errorMessage = `City "${req.query.city}" not found`;
          break;
        case 401:
          errorMessage = 'Weather service authentication failed';
          break;
        case 429:
          errorMessage = 'Weather service rate limit exceeded';
          break;
        default:
          errorMessage = error.response.data?.message || 'Weather service error';
      }
    } else if (error.code === 'ECONNREFUSED' || error.code === 'ENOTFOUND') {
      statusCode = 503;
      errorMessage = 'Weather service temporarily unavailable';
    } else {
      errorMessage = error.message || 'Failed to fetch weather data';
    }
    
    res.status(statusCode).json({
      success: false,
      error: errorMessage,
      timestamp: new Date().toISOString()
    });
  }
});

// GET /api/weather/forecast?city=CityName&days=5
router.get('/forecast', async (req, res) => {
  try {
    const { city, days = 5 } = req.query;
    
    if (!city) {
      return res.status(400).json({
        success: false,
        error: 'City parameter is required',
        example: '/api/weather/forecast?city=London&days=5'
      });
    }

    const forecastData = await weatherService.getWeatherForecast(city, parseInt(days));
    
    res.json({
      success: true,
      data: forecastData,
      timestamp: new Date().toISOString(),
      city: city,
      days: parseInt(days)
    });
    
  } catch (error) {
    console.error('Weather forecast route error:', error);
    
    let statusCode = 500;
    let errorMessage = 'Internal server error';
    
    if (error.response) {
      statusCode = error.response.status;
      errorMessage = error.response.data?.message || 'Weather service error';
    } else if (error.code === 'ECONNREFUSED' || error.code === 'ENOTFOUND') {
      statusCode = 503;
      errorMessage = 'Weather service temporarily unavailable';
    } else {
      errorMessage = error.message || 'Failed to fetch forecast data';
    }
    
    res.status(statusCode).json({
      success: false,
      error: errorMessage,
      timestamp: new Date().toISOString()
    });
  }
});

// GET /api/weather/cities - Popular cities endpoint (bonus)
router.get('/cities', (req, res) => {
  const popularCities = [
    { name: 'London', country: 'GB', coordinates: { lat: 51.5074, lon: -0.1278 } },
    { name: 'New York', country: 'US', coordinates: { lat: 40.7128, lon: -74.0060 } },
    { name: 'Tokyo', country: 'JP', coordinates: { lat: 35.6762, lon: 139.6503 } },
    { name: 'Paris', country: 'FR', coordinates: { lat: 48.8566, lon: 2.3522 } },
    { name: 'Sydney', country: 'AU', coordinates: { lat: -33.8688, lon: 151.2093 } },
    { name: 'Berlin', country: 'DE', coordinates: { lat: 52.5200, lon: 13.4050 } },
    { name: 'Mexico City', country: 'MX', coordinates: { lat: 19.4326, lon: -99.1332 } },
    { name: 'Buenos Aires', country: 'AR', coordinates: { lat: -34.6037, lon: -58.3816 } },
    { name: 'Santiago', country: 'CL', coordinates: { lat: -33.4489, lon: -70.6693 } },
    { name: 'Lima', country: 'PE', coordinates: { lat: -12.0464, lon: -77.0428 } }
  ];

  res.json({
    success: true,
    data: popularCities,
    count: popularCities.length,
    timestamp: new Date().toISOString()
  });
});

module.exports = router;