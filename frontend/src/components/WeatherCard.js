import React from 'react';
import './WeatherCard.css';

const WeatherCard = ({ weatherData }) => {
  if (!weatherData) return null;

  const {
    name,
    main: { temp, feels_like, humidity, pressure },
    weather: [{ main: weatherMain, description, icon }],
    wind: { speed },
    sys: { country },
    visibility
  } = weatherData;

  const formatTemp = (temp) => Math.round(temp);
  const formatWindSpeed = (speed) => Math.round(speed * 3.6); // m/s to km/h
  const formatVisibility = (visibility) => (visibility / 1000).toFixed(1); // m to km

  const getWeatherIcon = (iconCode) => {
    return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
  };

  const getWeatherEmoji = (main) => {
    const emojiMap = {
      'Clear': '☀️',
      'Clouds': '☁️',
      'Rain': '🌧️',
      'Drizzle': '🌦️',
      'Thunderstorm': '⛈️',
      'Snow': '❄️',
      'Mist': '🌫️',
      'Fog': '🌫️',
      'Haze': '🌫️'
    };
    return emojiMap[main] || '🌤️';
  };

  return (
    <div className="weather-card">
      <div className="weather-header">
        <div className="location">
          <h2>{name}, {country}</h2>
          <p className="weather-description">{description}</p>
        </div>
        <div className="weather-icon">
          <img 
            src={getWeatherIcon(icon)} 
            alt={description}
            className="weather-icon-img"
          />
          <span className="weather-emoji">{getWeatherEmoji(weatherMain)}</span>
        </div>
      </div>

      <div className="temperature-section">
        <div className="main-temp">
          <span className="temp-value">{formatTemp(temp)}</span>
          <span className="temp-unit">°C</span>
        </div>
        <div className="feels-like">
          <p>Feels like {formatTemp(feels_like)}°C</p>
        </div>
      </div>

      <div className="weather-details">
        <div className="detail-item">
          <div className="detail-icon">💧</div>
          <div className="detail-content">
            <span className="detail-label">Humidity</span>
            <span className="detail-value">{humidity}%</span>
          </div>
        </div>

        <div className="detail-item">
          <div className="detail-icon">🌪️</div>
          <div className="detail-content">
            <span className="detail-label">Wind Speed</span>
            <span className="detail-value">{formatWindSpeed(speed)} km/h</span>
          </div>
        </div>

        <div className="detail-item">
          <div className="detail-icon">📊</div>
          <div className="detail-content">
            <span className="detail-label">Pressure</span>
            <span className="detail-value">{pressure} hPa</span>
          </div>
        </div>

        <div className="detail-item">
          <div className="detail-icon">👁️</div>
          <div className="detail-content">
            <span className="detail-label">Visibility</span>
            <span className="detail-value">{formatVisibility(visibility)} km</span>
          </div>
        </div>
      </div>

      <div className="update-time">
        <p>Last updated: {new Date().toLocaleString()}</p>
      </div>
    </div>
  );
};

export default WeatherCard;