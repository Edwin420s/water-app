const express = require('express');
const axios = require('axios');
const router = express.Router();

// GET /api/weather/current/:lat/:lng - Get current weather for coordinates
router.get('/current/:lat/:lng', async (req, res) => {
  try {
    const { lat, lng } = req.params;
    const apiKey = process.env.OPENWEATHER_API_KEY;

    if (!apiKey) {
      return res.status(500).json({
        success: false,
        error: 'Weather API key not configured'
      });
    }

    const weatherUrl = `${process.env.WEATHER_API_BASE_URL}/weather?lat=${lat}&lon=${lng}&appid=${apiKey}&units=metric`;
    
    const response = await axios.get(weatherUrl);
    const weatherData = response.data;

    const processedWeather = {
      location: weatherData.name,
      temperature: Math.round(weatherData.main.temp),
      humidity: weatherData.main.humidity,
      description: weatherData.weather[0].description,
      icon: weatherData.weather[0].icon,
      windSpeed: weatherData.wind?.speed || 0,
      pressure: weatherData.main.pressure,
      visibility: weatherData.visibility / 1000, // Convert to km
      coordinates: { lat: parseFloat(lat), lng: parseFloat(lng) }
    };

    res.json({
      success: true,
      data: processedWeather
    });
  } catch (error) {
    console.error('Weather API error:', error.message);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch weather data'
    });
  }
});

// GET /api/weather/forecast/:lat/:lng - Get 5-day weather forecast
router.get('/forecast/:lat/:lng', async (req, res) => {
  try {
    const { lat, lng } = req.params;
    const apiKey = process.env.OPENWEATHER_API_KEY;

    if (!apiKey) {
      return res.status(500).json({
        success: false,
        error: 'Weather API key not configured'
      });
    }

    const forecastUrl = `${process.env.WEATHER_API_BASE_URL}/forecast?lat=${lat}&lon=${lng}&appid=${apiKey}&units=metric`;
    
    const response = await axios.get(forecastUrl);
    const forecastData = response.data;

    // Process forecast data - group by day and get daily summaries
    const dailyForecasts = {};
    
    forecastData.list.forEach(item => {
      const date = item.dt_txt.split(' ')[0];
      if (!dailyForecasts[date]) {
        dailyForecasts[date] = {
          date,
          temperatures: [],
          humidity: [],
          precipitation: 0,
          weather: item.weather[0],
          windSpeed: item.wind?.speed || 0
        };
      }
      
      dailyForecasts[date].temperatures.push(item.main.temp);
      dailyForecasts[date].humidity.push(item.main.humidity);
      
      // Check for precipitation
      if (item.rain && item.rain['3h']) {
        dailyForecasts[date].precipitation += item.rain['3h'];
      }
      if (item.snow && item.snow['3h']) {
        dailyForecasts[date].precipitation += item.snow['3h'];
      }
    });

    // Convert to array and calculate daily averages
    const processedForecast = Object.values(dailyForecasts).map(day => ({
      date: day.date,
      maxTemp: Math.round(Math.max(...day.temperatures)),
      minTemp: Math.round(Math.min(...day.temperatures)),
      avgHumidity: Math.round(day.humidity.reduce((a, b) => a + b, 0) / day.humidity.length),
      precipitation: Math.round(day.precipitation * 100) / 100,
      description: day.weather.description,
      icon: day.weather.icon,
      windSpeed: day.windSpeed,
      rainProbability: day.precipitation > 0 ? Math.min(90, day.precipitation * 20) : 10
    })).slice(0, 5); // Limit to 5 days

    res.json({
      success: true,
      data: {
        location: forecastData.city.name,
        coordinates: { lat: parseFloat(lat), lng: parseFloat(lng) },
        forecast: processedForecast
      }
    });
  } catch (error) {
    console.error('Weather forecast API error:', error.message);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch weather forecast'
    });
  }
});

// GET /api/weather/prediction/:reservoirId - Get water availability prediction for a reservoir
router.get('/prediction/:reservoirId', async (req, res) => {
  try {
    const reservoirId = parseInt(req.params.reservoirId);
    
    // This would typically fetch from your reservoir database
    // For now, we'll use the in-memory data
    const reservoir = require('./reservoirs').reservoirs?.find(r => r.id === reservoirId);
    
    if (!reservoir) {
      return res.status(404).json({
        success: false,
        error: 'Reservoir not found'
      });
    }

    // Get weather forecast for reservoir location
    const forecastResponse = await axios.get(
      `http://localhost:${process.env.PORT || 5000}/api/weather/forecast/${reservoir.coordinates.lat}/${reservoir.coordinates.lng}`
    );

    if (!forecastResponse.data.success) {
      throw new Error('Failed to get weather forecast');
    }

    const forecast = forecastResponse.data.data.forecast;
    
    // Calculate prediction based on weather data
    const totalRainExpected = forecast.reduce((sum, day) => sum + day.precipitation, 0);
    const avgRainProbability = forecast.reduce((sum, day) => sum + day.rainProbability, 0) / forecast.length;
    
    let prediction = {
      reservoirId,
      currentLevel: reservoir.currentLevel,
      expectedChange: 0,
      confidence: 'medium',
      summary: '',
      recommendations: []
    };

    // Simple prediction logic
    if (totalRainExpected > 10) {
      prediction.expectedChange = Math.min(15, totalRainExpected * 1.5);
      prediction.confidence = 'high';
      prediction.summary = `Heavy rainfall expected (${totalRainExpected}mm). Water levels likely to increase by ${prediction.expectedChange}%.`;
      prediction.recommendations.push('Good time to reduce water conservation measures temporarily');
    } else if (avgRainProbability > 60) {
      prediction.expectedChange = Math.min(8, avgRainProbability * 0.1);
      prediction.confidence = 'medium';
      prediction.summary = `Moderate rain likely. Small increase in water levels expected.`;
      prediction.recommendations.push('Continue current water usage patterns');
    } else {
      prediction.expectedChange = -2;
      prediction.confidence = 'high';
      prediction.summary = `Dry conditions expected. Water levels will continue to decrease.`;
      prediction.recommendations.push('Implement water conservation measures');
      
      if (reservoir.currentLevel < 40) {
        prediction.recommendations.push('Consider alternative water sources');
      }
    }

    res.json({
      success: true,
      data: {
        prediction,
        weatherForecast: forecast.slice(0, 3) // Next 3 days
      }
    });
  } catch (error) {
    console.error('Weather prediction error:', error.message);
    res.status(500).json({
      success: false,
      error: 'Failed to generate weather prediction'
    });
  }
});

module.exports = router;
