import { getAQICategory } from '../services/weatherService';

const AirQuality = ({ data }) => {
  if (!data) {
    return (
      <div className="dashboard-card air-quality">
        <div className="card-header">
          <h2>🌫️ Air Quality Index</h2>
        </div>
        <div className="aqi-fallback">
          <p>AQI data is currently unavailable for this location.</p>
          <p className="fallback-note">Try searching for a major city.</p>
        </div>
      </div>
    );
  }

  const { aqi, city, dominentpol } = data;
  const aqiCategory = getAQICategory(aqi);
  const pollutants = data.iaqi || {};

  return (
    <div className="dashboard-card air-quality">
      <div className="card-header">
        <h2>🌫️ Air Quality Index</h2>
      </div>

      <div className={`aqi-main aqi-${aqiCategory.level.toLowerCase().replace(' ', '-')}`}>
        <div className="aqi-value-display">
          <div className="aqi-number" style={{ color: aqiCategory.color }}>
            {aqi}
          </div>
          <div className="aqi-category">
            <h3 style={{ color: aqiCategory.color }}>{aqiCategory.level}</h3>
            <p className="aqi-description">{aqiCategory.description}</p>
          </div>
        </div>

        <div className="aqi-details">
          <p className="text-sm text-secondary">
            <strong className="text-primary">Location:</strong> {city.name}
          </p>
          <p className="text-sm text-secondary">
            <strong className="text-primary">Dominant Pollutant:</strong> {dominentpol || 'N/A'}
          </p>
        </div>

        <div className="pollutants-grid">
          {Object.entries(pollutants).slice(0, 4).map(([key, value]) => (
            <div key={key} className="pollutant-item">
              <span className="pollutant-name">{key.toUpperCase()}</span>
              <span className="pollutant-value">{value.v || 'N/A'}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="aqi-scale">
        <div className="scale-item scale-good">
          <span>0-50</span>
          <span>Good</span>
        </div>
        <div className="scale-item scale-moderate">
          <span>51-100</span>
          <span>Moderate</span>
        </div>
        <div className="scale-item scale-unhealthy-sensitive">
          <span>101-150</span>
          <span>Sensitive</span>
        </div>
        <div className="scale-item scale-unhealthy">
          <span>151-200</span>
          <span>Unhealthy</span>
        </div>
        <div className="scale-item scale-very-unhealthy">
          <span>201-300</span>
          <span>Very Unhealthy</span>
        </div>
      </div>
    </div>
  );
};

export default AirQuality;