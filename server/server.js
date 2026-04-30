import express from 'express';
import cors from 'cors';
import axios from 'axios';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// API Keys from environment
const OPENWEATHER_API_KEY = process.env.OPENWEATHER_API_KEY;
const AQICN_API_TOKEN = process.env.AQICN_API_TOKEN;

// Validation check
if (!OPENWEATHER_API_KEY || !AQICN_API_TOKEN) {
  console.warn('WARNING: Missing API Keys in backend environment variables.');
}

// Routes
app.get('/api/weather/current', async (req, res) => {
  try {
    const { city, lat, lon } = req.query;
    let url;
    
    if (lat && lon) {
      url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${OPENWEATHER_API_KEY}`;
    } else if (city) {
      url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&units=metric&appid=${OPENWEATHER_API_KEY}`;
    } else {
      return res.status(400).json({ error: 'City or coordinates are required' });
    }

    const response = await axios.get(url);
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching current weather:', error.response?.data || error.message);
    res.status(error.response?.status || 500).json(error.response?.data || { error: 'Failed to fetch current weather' });
  }
});

app.get('/api/weather/forecast', async (req, res) => {
  try {
    const { city, lat, lon } = req.query;
    let url;
    
    if (lat && lon) {
      url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${OPENWEATHER_API_KEY}`;
    } else if (city) {
      url = `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(city)}&units=metric&appid=${OPENWEATHER_API_KEY}`;
    } else {
      return res.status(400).json({ error: 'City or coordinates are required' });
    }

    const response = await axios.get(url);
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching forecast weather:', error.response?.data || error.message);
    res.status(error.response?.status || 500).json(error.response?.data || { error: 'Failed to fetch forecast weather' });
  }
});

app.get('/api/aqi', async (req, res) => {
  try {
    const { lat, lon } = req.query;
    
    if (!lat || !lon) {
      return res.status(400).json({ error: 'Coordinates are required for AQI' });
    }

    const url = `https://api.waqi.info/feed/geo:${lat};${lon}/?token=${AQICN_API_TOKEN}`;
    const response = await axios.get(url);
    
    if (response.data.status !== 'ok') {
      return res.status(404).json({ error: 'AQI not available for this location' });
    }
    
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching AQI:', error.message);
    res.status(500).json({ error: 'Failed to fetch AQI data' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
