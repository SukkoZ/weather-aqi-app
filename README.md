# Real-Time Weather + Air Quality App

A responsive React application that displays real-time weather data and air quality index (AQI) for any city worldwide. Features a 5-day forecast with interactive charts.

## Features

- **City Search**: Search for any city to get real-time weather and AQI data
- **Current Weather Display**: Temperature, humidity, wind speed, pressure, visibility
- **Air Quality Index**: Real-time AQI with color-coded categories and pollutant details
- **5-Day Forecast**: Interactive charts showing temperature trends and humidity
- **Responsive Design**: Works seamlessly on mobile, tablet, and desktop
- **Dark/Light Mode**: Automatically adapts to system preference

## Tech Stack

- **React.js** - Frontend framework
- **Recharts** - Charting library for data visualization
- **OpenWeatherMap API** - Weather data
- **AQICN API** - Air quality data
- **Vite** - Build tool and development server
- **CSS Modules** - Styling with CSS variables for theming

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Clone the repository or extract the project files
2. Navigate to the project directory:
   ```bash
   cd weather-aqi-app
   ```
3. Install dependencies:
   ```bash
   npm install
   ```

### API Keys Setup

1. Get a free API key from [OpenWeatherMap](https://openweathermap.org/api)
2. Get a free API token from [AQICN](https://aqicn.org/api/)
3. Create a `.env` file in the project root (or edit the existing one):
   ```
   VITE_OPENWEATHER_API_KEY=your_openweather_api_key_here
   VITE_AQICN_API_TOKEN=your_aqicn_api_token_here
   VITE_DEFAULT_CITY=London
   ```

### Running the Application

#### Development Server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) to view the app in your browser.

#### Build for Production
```bash
npm run build
```
The built files will be in the `dist` directory.

#### Preview Production Build
```bash
npm run preview
```

## Project Structure

```
weather-aqi-app/
├── src/
│   ├── components/
│   │   ├── SearchBar.jsx      # City search input
│   │   ├── CurrentWeather.jsx # Current weather display
│   │   ├── AirQuality.jsx     # AQI display
│   │   └── ForecastChart.jsx  # 5-day forecast charts
│   ├── services/
│   │   └── weatherService.js  # API integration functions
│   ├── App.jsx                # Main application component
│   ├── App.css                # Application styles
│   └── main.jsx               # Application entry point
├── public/                    # Static assets
├── .env                       # Environment variables
├── package.json              # Dependencies and scripts
└── README.md                 # This file
```

## API Integration

The application integrates two third-party APIs:

### 1. OpenWeatherMap API
- **Current Weather**: `https://api.openweathermap.org/data/2.5/weather`
- **5-Day Forecast**: `https://api.openweathermap.org/data/2.5/forecast`
- Provides temperature, humidity, wind speed, pressure, and weather conditions

### 2. AQICN API
- **Air Quality Index**: `https://api.waqi.info/feed/{city}/`
- Provides real-time AQI values, dominant pollutants, and individual pollutant concentrations

## Features in Detail

### Search Functionality
- Type any city name and press Enter or click Search
- Quick search examples provided (London, Tokyo, New York, etc.)
- Loading state with spinner during API calls
- Error handling for invalid city names

### Current Weather Display
- Temperature in Celsius with high/low range
- Weather condition with appropriate icon
- Detailed metrics: humidity, wind speed, pressure, visibility
- "Feels like" temperature

### Air Quality Index
- Color-coded AQI value (0-500 scale)
- Health category (Good, Moderate, Unhealthy, etc.)
- Dominant pollutant identification
- Individual pollutant levels (PM2.5, PM10, O3, etc.)
- AQI scale reference

### 5-Day Forecast
- Interactive line chart showing temperature trends
- Bar chart for humidity forecast
- Daily forecast cards with weather icons
- Temperature ranges for each day

### Responsive Design
- Adapts to all screen sizes (mobile, tablet, desktop)
- Grid layouts that rearrange based on screen width
- Touch-friendly buttons and inputs
- Readable typography scaling

## Customization

### Styling
The app uses CSS variables for theming. Modify `src/index.css` to change:
- Color schemes (light/dark mode)
- Typography
- Spacing and layout

### Default City
Change the default city by modifying `VITE_DEFAULT_CITY` in the `.env` file.

### API Configuration
Adjust API endpoints or parameters in `src/services/weatherService.js`.

## Known Limitations

1. **AQI Data Availability**: AQI data may not be available for all cities, especially smaller ones. The app gracefully handles this with fallback messages.
2. **API Rate Limits**: Free tier APIs have rate limits. Consider implementing caching for production use.
3. **City Name Ambiguity**: Some city names may return multiple locations. The app uses the first result from the API.

## Future Enhancements

- Geolocation to detect user's current location
- Favorite cities with local storage
- Historical data comparison
- Weather alerts and notifications
- Multi-language support
- Unit conversion (Celsius/Fahrenheit)

## License

This project is created for educational and demonstration purposes. Feel free to use and modify as needed.

## Acknowledgments

- [OpenWeatherMap](https://openweathermap.org/) for weather data API
- [AQICN](https://aqicn.org/) for air quality data
- [Recharts](https://recharts.org/) for charting components
- [Vite](https://vite.dev/) for the excellent development experience
