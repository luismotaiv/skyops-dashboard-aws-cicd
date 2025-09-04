import React, { useState } from 'react';
import './SearchBar.css';

const SearchBar = ({ onSearch }) => {
  const [inputValue, setInputValue] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputValue.trim()) {
      onSearch(inputValue.trim());
      setInputValue('');
    }
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const popularCities = ['London', 'New York', 'Tokyo', 'Paris', 'Mexico City', 'Buenos Aires'];

  const handleCityClick = (city) => {
    onSearch(city);
  };

  return (
    <div className="search-container">
      <form onSubmit={handleSubmit} className="search-form">
        <div className="search-input-container">
          <input
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            placeholder="Enter city name..."
            className="search-input"
            autoComplete="off"
          />
          <button type="submit" className="search-button">
            <span className="search-icon">🔍</span>
          </button>
        </div>
      </form>
      
      <div className="popular-cities">
        <p className="popular-cities-label">Popular cities:</p>
        <div className="city-buttons">
          {popularCities.map((city) => (
            <button
              key={city}
              onClick={() => handleCityClick(city)}
              className="city-button"
            >
              {city}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SearchBar;