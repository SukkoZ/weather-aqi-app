import { getWeatherIconUrl } from '../services/weatherService';

const CurrentWeather = ({ data }) => {
  if (!data) return null;

  const { name, sys, main, weather, wind, visibility } = data;
  const weatherCondition = weather[0];
  const iconUrl = getWeatherIconUrl(weatherCondition.icon);

  return (
    <div className="dashboard-card current-weather">
      <div className="card-header">
        <h2>🌡️ Current Weather</h2>
      </div>

      <div className="weather-header">
        <div className="weather-location">
          <h2>{name}</h2>
          <span className="location-flag">{sys.country}</span>
        </div>
        <p className="weather-description">{weatherCondition.description}</p>
      </div>

      <div className="weather-main">
        <div className="temp-display">
          <img src={iconUrl} alt={weatherCondition.main} className="weather-icon" />
          <div className="temp-value">
            <span className="temp">{Math.round(main.temp)}</span>
            <span className="temp-unit">°C</span>
          </div>
        </div>

        <div className="temp-details">
          <div className="temp-range">
            <span>H: {Math.round(main.temp_max)}°</span>
            <span>L: {Math.round(main.temp_min)}°</span>
          </div>
          <p className="feels-like">Feels like {Math.round(main.feels_like)}°C</p>
        </div>
      </div>

      <div className="weather-details">
        <div className="detail-item">
          <span className="detail-label">💧 Humidity</span>
          <span className="detail-value">{main.humidity}%</span>
        </div>
        <div className="detail-item">
          <span className="detail-label">💨 Wind</span>
          <span className="detail-value">{wind.speed} m/s</span>
        </div>
        <div className="detail-item">
          <span className="detail-label">📊 Pressure</span>
          <span className="detail-value">{main.pressure} hPa</span>
        </div>
        <div className="detail-item">
          <span className="detail-label">👁️ Visibility</span>
          <span className="detail-value">{(visibility / 1000).toFixed(1)} km</span>
        </div>
      </div>
    </div>
  );
};

export default CurrentWeather;