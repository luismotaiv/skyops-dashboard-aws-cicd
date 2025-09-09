import React, { useState, useEffect } from 'react';
import WeatherCard from './components/WeatherCard';
import SearchBar from './components/SearchBar';
import LoadingSpinner from './components/LoadingSpinner';
import weatherService from './services/weatherService';
import './App.css';

// Importar logos
import projectLogo from './assets/logo_skyops-dashboard.png';
import terraformLogo from './assets/icons8-terraform.svg';
import ecsLogo from './assets/Fargate.svg';
import githubActionsLogo from './assets/Actions.svg';
import awsRestartLogo from './assets/AWS_Restart_Logo.png';

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
         {/* Logo en vez de H1 */}
        <img 
          src={projectLogo} 
          alt="Weather Dashboard Logo" 
          className="project-logo" 
        />
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
        <p>
          Deployed with AWS ECS Fargate 
          <img src={ecsLogo} alt="AWS ECS Fargate" className="tech-icon" /> • 
          CI/CD Pipeline 
          <img src={githubActionsLogo} alt="GitHub Actions" className="tech-icon" /> • 
          Terraform IaC 
          <img src={terraformLogo} alt="Terraform" className="tech-icon" />
        </p>
        <p>
          Built for AWS re/Start by luismotaiv 
          <img src={awsRestartLogo} alt="AWS Re/Start" className="tech-icon" />
        </p>
      </footer>
    </div>
  );
}

export default App;