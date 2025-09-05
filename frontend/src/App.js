import React, { useState, useEffect } from 'react';
import WeatherCard from './components/WeatherCard';
import SearchBar from './components/SearchBar';
import LoadingSpinner from './components/LoadingSpinner';
import weatherService from './services/weatherService';
import './App.css';

function App() {
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [city, setCity] = useState('Santiago');

  // Load weather data on component mount and city change
  useEffect(() => {
    fetchWeather(city);
  }, [city]);

  const fetchWeather = async (cityName) => {
    setLoading(true);
    setError('');
    
    try {
      const data = await weatherService.getCurrentWeather(cityName);
      setWeatherData(data);
    } catch (err) {
      setError(err.message || 'Error fetching weather data');
      setWeatherData(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (searchCity) => {
    if (searchCity.trim()) {
      setCity(searchCity.trim());
    }
  };

  return (
    <div className="App">
      <header className="app-header">
        <h1>🌤️ Weather Dashboard</h1>
        <p>Real-time weather information powered by CI/CD</p>
      </header>

      <main className="app-main">
        <SearchBar onSearch={handleSearch} />
        
        {loading && <LoadingSpinner />}
        
        {error && (
          <div className="error-message">
            <p>❌ {error}</p>
          </div>
        )}
        
        {weatherData && !loading && (
          <WeatherCard weatherData={weatherData} />
        )}
      </main>

      <footer className="app-footer">
        <p>Deployed with AWS ECS • CI/CD Pipeline • Terraform IaC</p>
        <p>Built for AWS re/Start by luismotaiv</p>
      </footer>
    </div>
  );
}

export default App;