import axios from 'axios';

const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? '/api'  // Production: calls through ALB to backend
  : 'http://localhost:3001/api';  // Development: direct to backend

class WeatherService {
  async getCurrentWeather(city) {
    try {
      const response = await axios.get(`${API_BASE_URL}/weather/current`, {
        params: { city },
        timeout: 10000 // 10 second timeout
      });
      
      if (response.data && response.data.success) {
        return response.data.data;
      } else {
        throw new Error(response.data?.message || 'Failed to fetch weather data');
      }
    } catch (error) {
      console.error('Weather Service Error:', error);
      
      if (error.code === 'ECONNABORTED') {
        throw new Error('Request timeout - please try again');
      }
      
      if (error.response) {
        // Server responded with error status
        const { status, data } = error.response;
        
        switch (status) {
          case 404:
            throw new Error(`City "${city}" not found`);
          case 400:
            throw new Error(data?.message || 'Invalid city name');
          case 429:
            throw new Error('Too many requests - please wait a moment');
          case 500:
            throw new Error('Weather service temporarily unavailable');
          default:
            throw new Error(data?.message || 'Unable to fetch weather data');
        }
      } else if (error.request) {
        // Network error
        throw new Error('Unable to connect to weather service');
      } else {
        // Other error
        throw new Error(error.message || 'An unexpected error occurred');
      }
    }
  }

  async getWeatherForecast(city, days = 5) {
    try {
      const response = await axios.get(`${API_BASE_URL}/weather/forecast`, {
        params: { city, days },
        timeout: 10000
      });
      
      if (response.data && response.data.success) {
        return response.data.data;
      } else {
        throw new Error(response.data?.message || 'Failed to fetch forecast data');
      }
    } catch (error) {
      console.error('Weather Forecast Service Error:', error);
      throw error;
    }
  }

  // Health check method for monitoring
  async healthCheck() {
    try {
      const response = await axios.get(`${API_BASE_URL}/health`, {
        timeout: 5000
      });
      return response.data;
    } catch (error) {
      console.error('Health Check Error:', error);
      throw error;
    }
  }
}

export default new WeatherService();