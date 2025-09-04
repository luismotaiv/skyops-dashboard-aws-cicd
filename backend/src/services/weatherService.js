const axios = require('axios');

class WeatherService {
  constructor() {
    this.apiKey = process.env.OPENWEATHER_API_KEY;
    this.baseUrl = 'https://api.openweathermap.org/data/2.5';
    this.timeout = 10000; // 10 seconds
    
    if (!this.apiKey) {
      console.warn('⚠️  WARNING: OPENWEATHER_API_KEY not found in environment variables');
      console.log('🔗 Get your free API key at: https://openweathermap.org/api');
    }
  }

  async getCurrentWeather(city) {
    try {
      if (!this.apiKey) {
        throw new Error('OpenWeather API key not configured');
      }

      const response = await axios.get(`${this.baseUrl}/weather`, {
        params: {
          q: city,
          appid: this.apiKey,
          units: 'metric'
        },
        timeout: this.timeout
      });

      return this.formatWeatherData(response.data);
    } catch (error) {
      console.error('Weather Service Error:', {
        city,
        error: error.message,
        status: error.response?.status,
        data: error.response?.data
      });
      throw error;
    }
  }

  async getWeatherForecast(city, days = 5) {
    try {
      if (!this.apiKey) {
        throw new Error('OpenWeather API key not configured');
      }

      const response = await axios.get(`${this.baseUrl}/forecast`, {
        params: {
          q: city,
          appid: this.apiKey,
          units: 'metric',
          cnt: Math.min(days * 8, 40) // API returns 8 forecasts per day, max 40
        },
        timeout: this.timeout
      });

      return this.formatForecastData(response.data, days);
    } catch (error) {
      console.error('Weather Forecast Service Error:', {
        city,
        days,
        error: error.message,
        status: error.response?.status
      });
      throw error;
    }
  }

  formatWeatherData(data) {
    return {
      id: data.id,
      name: data.name,
      country: data.sys.country,
      coordinates: {
        lat: data.coord.lat,
        lon: data.coord.lon
      },
      weather: data.weather.map(w => ({
        id: w.id,
        main: w.main,
        description: w.description,
        icon: w.icon
      })),
      main: {
        temp: Math.round(data.main.temp * 10) / 10,
        feels_like: Math.round(data.main.feels_like * 10) / 10,
        temp_min: Math.round(data.main.temp_min * 10) / 10,
        temp_max: Math.round(data.main.temp_max * 10) / 10,
        pressure: data.main.pressure,
        humidity: data.main.humidity,
        sea_level: data.main.sea_level,
        grnd_level: data.main.grnd_level
      },
      wind: {
        speed: data.wind.speed,
        deg: data.wind.deg,
        gust: data.wind.gust
      },
      clouds: {
        all: data.clouds.all
      },
      visibility: data.visibility,
      dt: data.dt,
      sys: {
        type: data.sys.type,
        id: data.sys.id,
        country: data.sys.country,
        sunrise: data.sys.sunrise,
        sunset: data.sys.sunset
      },
      timezone: data.timezone,
      cod: data.cod
    };
  }

  formatForecastData(data, requestedDays) {
    const dailyForecasts = {};
    
    data.list.forEach(item => {
      const date = new Date(item.dt * 1000).toDateString();
      
      if (!dailyForecasts[date]) {
        dailyForecasts[date] = {
          date: date,
          items: [],
          temp: { min: Infinity, max: -Infinity },
          weather: item.weather[0], // Use first weather of the day
          humidity: [],
          pressure: [],
          wind_speed: []
        };
      }
      
      dailyForecasts[date].items.push(item);
      dailyForecasts[date].temp.min = Math.min(dailyForecasts[date].temp.min, item.main.temp_min);
      dailyForecasts[date].temp.max = Math.max(dailyForecasts[date].temp.max, item.main.temp_max);
      dailyForecasts[date].humidity.push(item.main.humidity);
      dailyForecasts[date].pressure.push(item.main.pressure);
      dailyForecasts[date].wind_speed.push(item.wind.speed);
    });

    // Convert to array and calculate averages
    const forecastArray = Object.values(dailyForecasts)
      .slice(0, requestedDays)
      .map(day => ({
        date: day.date,
        weather: day.weather,
        temperature: {
          min: Math.round(day.temp.min * 10) / 10,
          max: Math.round(day.temp.max * 10) / 10,
          avg: Math.round(((day.temp.min + day.temp.max) / 2) * 10) / 10
        },
        humidity: Math.round(day.humidity.reduce((a, b) => a + b, 0) / day.humidity.length),
        pressure: Math.round(day.pressure.reduce((a, b) => a + b, 0) / day.pressure.length),
        wind_speed: Math.round((day.wind_speed.reduce((a, b) => a + b, 0) / day.wind_speed.length) * 10) / 10,
        items_count: day.items.length
      }));

    return {
      city: {
        id: data.city.id,
        name: data.city.name,
        country: data.city.country,
        coordinates: {
          lat: data.city.coord.lat,
          lon: data.city.coord.lon
        },
        population: data.city.population,
        timezone: data.city.timezone,
        sunrise: data.city.sunrise,
        sunset: data.city.sunset
      },
      cnt: data.cnt,
      forecast: forecastArray,
      requested_days: requestedDays
    };
  }

  // Health check method
  async healthCheck() {
    try {
      if (!this.apiKey) {
        return {
          status: 'error',
          message: 'API key not configured'
        };
      }

      const startTime = Date.now();
      await this.getCurrentWeather('London');
      const latency = Date.now() - startTime;

      return {
        status: 'healthy',
        latency: latency,
        provider: 'OpenWeatherMap',
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        error: error.message,
        timestamp: new Date().toISOString()
      };
    }
  }
}

module.exports = new WeatherService();