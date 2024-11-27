import  { useState, useEffect } from "react";

const cities = [
  "Ho Chi Minh",
  "Singapore",
  "Kuala Lumpur",
  "Tokyo",
  "Athens",
];

export default function Weather() {
  const [city, setCity] = useState(localStorage.getItem("selectedCity"));
  const [weatherData, setWeatherData] = useState(null);
  const [error, setError] = useState(null);
  const [forecastData, setForecastData] = useState(null);
  const [days, setDays] = useState(3);

  const API_KEY = '2da3e0c66e1e4f8a675e1ad508805466';
  const WEATHER_API_URL = `https://api.openweathermap.org/data/2.5/weather?appid=${API_KEY}&units=metric&q=`;
  const FORECAST_API_URL = `https://api.openweathermap.org/data/2.5/forecast?appid=${API_KEY}&units=metric&q=`;

  const fetchWeatherData = async (selectedCity) => {
    try {
      const weatherResponse = await fetch(WEATHER_API_URL + selectedCity);
      const weatherData = await weatherResponse.json();

      if (weatherData.cod !== 200) {
        throw new Error(weatherData.message);
      }

      setWeatherData(weatherData);

      const forecastResponse = await fetch(FORECAST_API_URL + selectedCity);
      const forecastData = await forecastResponse.json();
      setForecastData(forecastData.list.slice(0, days * 8)); 
      setError(null);
    } catch (err) {
      setError(err.message);
      setWeatherData(null);
      setForecastData(null);
    }
  };

  useEffect(() => {
    fetchWeatherData(city);
  }, [city, days]); 

  const handleCityChange = (event) => {
    setCity(event.target.value);
    localStorage.setItem("selectedCity", event.target.value); 
  };

  const handleDaysChange = (event) => {
    setDays(event.target.value);
  };

  return (
    <div className="weather-app">
      <h1>Weather Forecast</h1>
      <div className="input-container">
        <select onChange={handleCityChange} value={city}>
          {cities.map((cityOption) => (
            <option key={cityOption} value={cityOption}>
              {cityOption}
            </option>
          ))}
        </select>
        <input
          type="number"
          value={days}
          onChange={handleDaysChange}
          min="1"
          max="7"
          placeholder="Days (1-7)"
        />
      </div>

      {error && <p className="error-message">{error}</p>}

      {weatherData && (
        <div className="weather-info">
          <h2>
            {weatherData.name}, {weatherData.sys.country}
          </h2>
          <div className="weather-details">
            <p>Temperature: {weatherData.main.temp}°C</p>
            <p>Feel Like: {weatherData.main.feels_like}°C</p>
            <p>Description: {weatherData.weather[0].description}</p>
            <img
              src={`https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`}
              alt="Weather icon"
            />
          </div>

          {forecastData && (
            <div className="forecast">
              <h3>Forecast for the next {days} days:</h3>
              <div className="forecast-details">
                {forecastData.map((forecast, index) => (
                  <div key={index} className="forecast-item">
                    <p>{new Date(forecast.dt_txt).toLocaleString()}</p>
                    <p>Temp: {forecast.main.temp}°C</p>
                    <p>{forecast.weather[0].description}</p>
                    <img
                      src={`https://openweathermap.org/img/wn/${forecast.weather[0].icon}@2x.png`}
                      alt="Weather icon"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
