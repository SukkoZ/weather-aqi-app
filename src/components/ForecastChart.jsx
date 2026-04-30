// import {
//   LineChart,
//   Line,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   Legend,
//   ResponsiveContainer,
//   BarChart,
//   Bar
// } from 'recharts';
// import { getWeatherIconUrl } from '../services/weatherService';

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";

import { getWeatherIconUrl } from "../services/weatherService";

// Custom tooltip component defined outside
const CustomTooltip = ({ active, payload, label, chartData }) => {
  if (active && payload && payload.length) {
    // const dayData = chartData.find(d => d.day === label);
    const dayData = chartData.find((d) => d.day === label) || {};
    return (
      <div className="custom-tooltip">
        <p className="tooltip-day">
          {label} ({dayData?.date})
        </p>
        <p className="tooltip-temp">
          <strong>Temp:</strong> {payload[0].value}°C
        </p>
        <p className="tooltip-range">
          <strong>Range:</strong> {dayData?.low}°C - {dayData?.high}°C
        </p>
        <p className="tooltip-humidity">
          <strong>Humidity:</strong> {dayData?.humidity}%
        </p>
        {dayData?.icon && (
          <img
            src={getWeatherIconUrl(dayData.icon)}
            alt={dayData.description}
            className="tooltip-icon"
          />
        )}
      </div>
    );
  }
  return null;
};

const ForecastChart = ({ data }) => {
  if (!data || data.length === 0) return null;

  const chartData = data.map((day) => ({
    day: day.day,
    date: day.date,
    temperature: Math.round(day.temp),
    high: Math.round(day.temp_max),
    low: Math.round(day.temp_min),
    humidity: Math.round(day.humidity), // ✅ FIXED
    icon: day.weather?.icon,
    description: day.weather?.description,
  }));

  return (
    <div className="forecast-chart">
      <div className="chart-container">
        <ResponsiveContainer width="100%" height={300}>
          <LineChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis
              dataKey="day"
              stroke="var(--text)"
              tick={{ fill: "var(--text)" }}
            />
            <YAxis
              stroke="var(--text)"
              tick={{ fill: "var(--text)" }}
              label={{
                value: "Temperature (°C)",
                angle: -90,
                position: "insideLeft",
                fill: "var(--text)",
              }}
            />
            <Tooltip content={<CustomTooltip chartData={chartData} />} />
            <Legend />
            <Line
              type="monotone"
              dataKey="temperature"
              name="Avg Temperature"
              stroke="#3b82f6"
              strokeWidth={3}
              dot={{ r: 6, fill: "#3b82f6" }}
              activeDot={{ r: 8 }}
            />
            <Line
              type="monotone"
              dataKey="high"
              name="High"
              stroke="#f59e0b"
              strokeWidth={2}
              strokeDasharray="5 5"
            />
            <Line
              type="monotone"
              dataKey="low"
              name="Low"
              stroke="#06b6d4"
              strokeWidth={2}
              strokeDasharray="5 5"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="humidity-chart">
        <h3>Humidity Forecast</h3>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis
              dataKey="day"
              stroke="var(--text)"
              tick={{ fill: "var(--text)" }}
            />
            <YAxis
              stroke="var(--text)"
              tick={{ fill: "var(--text)" }}
              label={{
                value: "Humidity (%)",
                angle: -90,
                position: "insideLeft",
                fill: "var(--text)",
              }}
            />
            <Tooltip />
            <Bar
              dataKey="humidity"
              name="Humidity"
              fill="#10b981"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="forecast-details">
        <h3>5-Day Forecast Details</h3>
        <div className="forecast-cards">
          {chartData.map((day, index) => (
            <div key={index} className="forecast-card">
              <div className="card-header">
                <h4>{day.day}</h4>
                <p className="card-date">{day.date}</p>
              </div>
              <div className="card-weather">
                <img
                  src={getWeatherIconUrl(day.icon)}
                  alt={day.description}
                  className="card-icon"
                />
                <p className="card-desc">{day.description}</p>
              </div>
              <div className="card-temps">
                <div className="temp-high">
                  <span className="temp-label">High</span>
                  <span className="temp-value">{day.high}°C</span>
                </div>
                <div className="temp-avg">
                  <span className="temp-label">Avg</span>
                  <span className="temp-value">{day.temperature}°C</span>
                </div>
                <div className="temp-low">
                  <span className="temp-label">Low</span>
                  <span className="temp-value">{day.low}°C</span>
                </div>
              </div>
              <div className="card-humidity">
                <span className="humidity-label">Humidity</span>
                <span className="humidity-value">{day.humidity}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ForecastChart;
