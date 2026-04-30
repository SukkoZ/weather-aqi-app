import { useState, useCallback, useEffect } from 'react';
import {
  fetchCurrentWeather,
  fetchCurrentWeatherByCoords,
  fetchWeatherForecast,
  fetchWeatherForecastByCoords,
  fetchAirQualityByCoords,
  processForecastData
} from './services/weatherService';
import SearchBar from './components/SearchBar';
import CurrentWeather from './components/CurrentWeather';
import AirQuality from './components/AirQuality';
import ForecastChart from './components/ForecastChart';
import './App.css';

function App() {
  const [city, setCity] = useState('London');
  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState([]);
  const [airQualityData, setAirQualityData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadWeatherData = useCallback(async (cityName = city) => {
    setLoading(true);
    setError(null);
    
    try {
      const [weather, forecast] = await Promise.all([
        fetchCurrentWeather(cityName),
        fetchWeatherForecast(cityName),
      ]);

      const aqi = await fetchAirQualityByCoords(weather.coord.lat, weather.coord.lon).catch(err => {
        console.warn('AQI fetch failed, using fallback:', err);
        return null; // AQI is optional
      });
      
      setWeatherData(weather);
      setForecastData(processForecastData(forecast.list));
      setAirQualityData(aqi);
      // Only update city if it's different to avoid unnecessary re-renders
      if (cityName !== city) {
        setCity(cityName);
      }
    } catch (err) {
      console.error('Error loading weather data:', err);
      setError(`Failed to load weather data for "${cityName}". Please check the city name and try again.`);
      // Keep previous data if available
    } finally {
      setLoading(false);
    }
  }, [city]);

  const loadWeatherByCoords = useCallback(async (lat, lon) => {
    setLoading(true);
    setError(null);
    
    try {
      const [weather, forecast] = await Promise.all([
        fetchCurrentWeatherByCoords(lat, lon),
        fetchWeatherForecastByCoords(lat, lon),
      ]);

      const aqi = await fetchAirQualityByCoords(lat, lon).catch(err => {
        console.warn('AQI fetch failed, using fallback:', err);
        return null; // AQI is optional
      });
      
      setWeatherData(weather);
      setForecastData(processForecastData(forecast.list));
      setAirQualityData(aqi);
      setCity(weather.name); // Update city name from reverse geocoding essentially provided by weather API
    } catch (err) {
      console.error('Error loading weather data by coords:', err);
      setError(`Failed to load weather data for your location.`);
      // Keep previous data if available
    } finally {
      setLoading(false);
    }
  }, []);

  const handleSearch = (searchCity) => {
    if (!searchCity || searchCity.trim().length < 2) {
      setError('Please enter a valid city name (e.g. Delhi, Tokyo)');
      return;
    }

    loadWeatherData(searchCity.trim());
  };

  const handleLocationSearch = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      return;
    }

    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        loadWeatherByCoords(position.coords.latitude, position.coords.longitude);
      },
      (err) => {
        console.error('Geolocation error:', err);
        setLoading(false);
        let errorMsg = err.message;
        if (!errorMsg) {
          if (err.code === 1) errorMsg = "Permission denied";
          else if (err.code === 2) errorMsg = "Position unavailable. Your device cannot determine its location";
          else if (err.code === 3) errorMsg = "Request timed out";
          else errorMsg = "Unknown error";
        }
        setError(`Location access failed: ${errorMsg}`);
      },
      { timeout: 10000, maximumAge: 60000 }
    );
  };

  useEffect(() => {
    // Use setTimeout to avoid synchronous setState in effect
    const timer = setTimeout(() => {
      loadWeatherData();
    }, 0);
    return () => clearTimeout(timer);
  }, [loadWeatherData]);

 
  return (
    <div className="weather-app">
      <header className="app-header">
        <h1>🌤️ Real-Time Weather & Air Quality</h1>
        <p className="subtitle">Search any city to see current weather, AQI, and 5-day forecast</p>
      </header>

      <main className="app-main">
        <SearchBar onSearch={handleSearch} onLocationSearch={handleLocationSearch} loading={loading} />
        
        {error && (
          <div className="error-message">
            <p>{error}</p>
          </div>
        )}

        {loading && !weatherData ? (
          <div className="loading">
            <div className="spinner"></div>
            <p className="text-secondary mt-4">Loading weather data...</p>
          </div>
        ) : weatherData && (
          <>
            <div className="dashboard-grid">
              <CurrentWeather data={weatherData} />
              <AirQuality data={airQualityData} />
            </div>

            {forecastData.length > 0 && (
              <div className="forecast-section">
                <h2>📊 5-Day Forecast</h2>
                <ForecastChart data={forecastData} />
              </div>
            )}

            <div className="api-info">
              <p className="text-sm text-secondary">
                <strong className="text-primary">Integrated APIs:</strong> OpenWeatherMap (weather data) + AQICN (air quality index)
              </p>
              <p className="note text-xs text-muted">
                Note: If AQI data is unavailable for your city, the AQI component will show a fallback message.
              </p>
            </div>
          </>
        )}
      </main>

      <footer className="app-footer">
        <p>Real-Time Weather + Air Quality App • Built with React & Recharts</p>
        <p className="footer-note">
          Data updates in real-time. Search for any city worldwide.
        </p>
      </footer>
    </div>
  );
}

export default App;
