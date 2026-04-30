/**
 * Weather service for OpenWeatherMap API integration
 */

const OPENWEATHER_API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;
const AQICN_API_TOKEN = import.meta.env.VITE_AQICN_API_TOKEN;
const DEFAULT_CITY = import.meta.env.VITE_DEFAULT_CITY || "London";

// Check if API keys are set (not placeholder values)
const isOpenWeatherKeyValid =
  OPENWEATHER_API_KEY &&
  OPENWEATHER_API_KEY !== "your_openweather_api_key_here";
const isAQICNTokenValid =
  AQICN_API_TOKEN && AQICN_API_TOKEN !== "your_aqicn_api_token_here";

/**
 * Fetch current weather data for a city
 * @param {string} city - City name
 * @returns {Promise} Weather data
 */

export const fetchCurrentWeather = async (city = DEFAULT_CITY) => {
  if (!isOpenWeatherKeyValid) {
    throw new Error("OpenWeather API key missing");
  }

  const response = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
      city,
    )}&units=metric&appid=${import.meta.env.VITE_OPENWEATHER_API_KEY}`,
  );

  if (!response.ok) {
    throw new Error(`Weather API failed: ${response.status}`);
  }

  return response.json();
};

/**
 * Fetch current weather data by coordinates
 * @param {number} lat - Latitude
 * @param {number} lon - Longitude
 * @returns {Promise} Weather data
 */
export const fetchCurrentWeatherByCoords = async (lat, lon) => {
  if (!isOpenWeatherKeyValid) {
    throw new Error("OpenWeather API key missing");
  }

  const response = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${import.meta.env.VITE_OPENWEATHER_API_KEY}`,
  );

  if (!response.ok) {
    throw new Error(`Weather API failed: ${response.status}`);
  }

  return response.json();
};

/**
 * Fetch 5-day weather forecast for a city
 * @param {string} city - City name
 * @returns {Promise} Forecast data
 */

export const fetchWeatherForecast = async (city = DEFAULT_CITY) => {
  if (!isOpenWeatherKeyValid) {
    throw new Error("OpenWeather API key missing");
  }

  const response = await fetch(
    `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(
      city,
    )}&units=metric&appid=${import.meta.env.VITE_OPENWEATHER_API_KEY}`,
  );

  if (!response.ok) {
    throw new Error(`Forecast API failed: ${response.status}`);
  }

  return response.json();
};

/**
 * Fetch 5-day weather forecast by coordinates
 * @param {number} lat - Latitude
 * @param {number} lon - Longitude
 * @returns {Promise} Forecast data
 */
export const fetchWeatherForecastByCoords = async (lat, lon) => {
  if (!isOpenWeatherKeyValid) {
    throw new Error("OpenWeather API key missing");
  }

  const response = await fetch(
    `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${import.meta.env.VITE_OPENWEATHER_API_KEY}`,
  );

  if (!response.ok) {
    throw new Error(`Forecast API failed: ${response.status}`);
  }

  return response.json();
};

/**
 * Fetch Air Quality Index (AQI) for a city
 * @param {string} city - City name
 * @returns {Promise} AQI data
 */
export const fetchAirQualityByCoords = async (lat, lon) => {
  if (!isAQICNTokenValid) {
    throw new Error("AQICN API token missing");
  }

  const response = await fetch(
    `https://api.waqi.info/feed/geo:${lat};${lon}/?token=${AQICN_API_TOKEN}`,
  );

  const data = await response.json();

  if (data.status !== "ok") {
    throw new Error("AQI not available for this location");
  }

  return data.data;
};
/**
 * Process forecast data for chart display (group by day)
 * @param {Array} forecastList - List of forecast items from API
 * @returns {Array} Processed daily forecast data
 */
export const processForecastData = (forecastList) => {
  if (!Array.isArray(forecastList)) return [];

  const dailyData = {};

  forecastList.forEach((item) => {
    const date = new Date(item.dt * 1000);
    const dayKey = date.toLocaleDateString("en-US", { weekday: "short" });
    const dateStr = date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });

    if (!dailyData[dayKey]) {
      dailyData[dayKey] = {
        day: dayKey,
        date: dateStr,
        temp_min: item.main.temp_min,
        temp_max: item.main.temp_max,
        temp: item.main.temp,
        humidity: Math.round(item.main.humidity),
        weather: item.weather[0],
        count: 1,
      };
    } else {
      dailyData[dayKey].temp_min = Math.min(
        dailyData[dayKey].temp_min,
        item.main.temp_min,
      );
      dailyData[dayKey].temp_max = Math.max(
        dailyData[dayKey].temp_max,
        item.main.temp_max,
      );

      dailyData[dayKey].temp =
        (dailyData[dayKey].temp * dailyData[dayKey].count + item.main.temp) /
        (dailyData[dayKey].count + 1);

      dailyData[dayKey].humidity = Math.round(
        (dailyData[dayKey].humidity + item.main.humidity) / 2,
      );

      dailyData[dayKey].count += 1;
    }
  });

  return Object.values(dailyData).slice(0, 5);
};

/**
 * Get weather icon URL
 * @param {string} iconCode - OpenWeatherMap icon code
 * @returns {string} Icon URL
 */
export const getWeatherIconUrl = (iconCode) => {
  if (!iconCode) return "";
  return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
};

/**
 * Get AQI category and color based on AQI value
 * @param {number} aqi - AQI value
 * @returns {Object} Category info
 */
export const getAQICategory = (aqi) => {
  if (aqi <= 50) {
    return {
      level: "Good",
      color: "#00E400",
      description: "Air quality is satisfactory",
    };
  } else if (aqi <= 100) {
    return {
      level: "Moderate",
      color: "#FFFF00",
      description: "Air quality is acceptable",
    };
  } else if (aqi <= 150) {
    return {
      level: "Unhealthy for Sensitive Groups",
      color: "#FF7E00",
      description: "Members of sensitive groups may experience health effects",
    };
  } else if (aqi <= 200) {
    return {
      level: "Unhealthy",
      color: "#FF0000",
      description: "Everyone may begin to experience health effects",
    };
  } else if (aqi <= 300) {
    return {
      level: "Very Unhealthy",
      color: "#8F3F97",
      description: "Health warnings of emergency conditions",
    };
  } else {
    return {
      level: "Hazardous",
      color: "#7E0023",
      description:
        "Health alert: everyone may experience serious health effects",
    };
  }
};
