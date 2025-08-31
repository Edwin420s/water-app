const express = require('express');
const axios = require('axios');
const router = express.Router();

// Inflection AI service class
class InflectionAIService {
  constructor() {
    this.apiKey = process.env.INFLECTION_AI_API_KEY;
    this.baseURL = process.env.INFLECTION_AI_BASE_URL || 'https://api.inflection.ai/v1';
  }

  async makeRequest(messages) {
    try {
      const response = await axios.post(`${this.baseURL}/chat/completions`, {
        model: "inflection_3_pi",
        messages: messages
      }, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        }
      });

      return response.data;
    } catch (error) {
      console.error('Inflection AI API Error:', error.response?.data || error.message);
      throw new Error('Failed to get AI prediction');
    }
  }

  async generateWaterPrediction(reservoirData, weatherData) {
    const systemPrompt = `You are an AI water management expert specializing in drought-affected communities. 
    Analyze water reservoir data and weather forecasts to provide actionable insights for communities.
    
    Provide responses in JSON format with these fields:
    - prediction: string (brief prediction summary)
    - riskLevel: string (low/medium/high)
    - daysUntilCritical: number (estimated days until water becomes critically low)
    - recommendations: array of strings (practical advice for the community)
    - confidence: number (0-100, confidence in prediction)`;

    const userPrompt = `Analyze this water situation:

    RESERVOIR DATA:
    - Name: ${reservoirData.name}
    - Location: ${reservoirData.location}
    - Current Level: ${reservoirData.currentLevel}%
    - Capacity: ${reservoirData.capacity}%
    - Status: ${reservoirData.status}
    - Last Updated: ${reservoirData.lastUpdated}

    WEATHER FORECAST (next 5 days):
    ${weatherData.forecast.map(day => 
      `- ${day.date}: ${day.description}, Rain: ${day.precipitation}mm, Temp: ${day.minTemp}-${day.maxTemp}°C, Humidity: ${day.avgHumidity}%`
    ).join('\n')}

    Please provide a water availability prediction and recommendations for this community.`;

    const messages = [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt }
    ];

    const response = await this.makeRequest(messages);
    
    // Extract the AI response content
    const aiContent = response.choices?.[0]?.message?.content;
    
    if (!aiContent) {
      throw new Error('Invalid AI response format');
    }

    // Try to parse JSON response, fallback to structured text parsing
    try {
      return JSON.parse(aiContent);
    } catch (parseError) {
      // Fallback: extract information from text response
      return this.parseTextResponse(aiContent, reservoirData);
    }
  }

  parseTextResponse(textResponse, reservoirData) {
    // Fallback parser for non-JSON responses
    const lines = textResponse.split('\n');
    
    let prediction = "AI analysis completed";
    let riskLevel = reservoirData.currentLevel < 30 ? "high" : 
                   reservoirData.currentLevel < 60 ? "medium" : "low";
    let recommendations = ["Monitor water levels regularly", "Implement conservation measures"];
    let confidence = 75;
    
    // Extract key information from text
    lines.forEach(line => {
      if (line.toLowerCase().includes('prediction') || line.toLowerCase().includes('forecast')) {
        prediction = line.replace(/^[^:]*:?\s*/, '').trim();
      }
      if (line.toLowerCase().includes('recommend')) {
        recommendations.push(line.replace(/^[^:]*:?\s*/, '').trim());
      }
    });

    // Calculate days until critical based on current level and consumption rate
    const dailyConsumption = 0.8; // Assume 0.8% daily consumption
    const daysUntilCritical = Math.max(0, Math.floor((reservoirData.currentLevel - 20) / dailyConsumption));

    return {
      prediction: prediction.substring(0, 200), // Limit length
      riskLevel,
      daysUntilCritical,
      recommendations: recommendations.slice(0, 4), // Limit to 4 recommendations
      confidence
    };
  }
}

const aiService = new InflectionAIService();

// POST /api/ai/predict - Generate AI prediction for water availability
router.post('/predict', async (req, res) => {
  try {
    const { reservoirId, weatherData } = req.body;

    if (!reservoirId) {
      return res.status(400).json({
        success: false,
        error: 'Reservoir ID is required'
      });
    }

    // Get reservoir data (in production, this would be from database)
    const reservoirResponse = await axios.get(`http://localhost:${process.env.PORT || 5000}/api/reservoirs/${reservoirId}`);
    
    if (!reservoirResponse.data.success) {
      return res.status(404).json({
        success: false,
        error: 'Reservoir not found'
      });
    }

    const reservoirData = reservoirResponse.data.data;
    let forecast = weatherData;

    // If weather data not provided, fetch it
    if (!forecast) {
      const weatherResponse = await axios.get(
        `http://localhost:${process.env.PORT || 5000}/api/weather/forecast/${reservoirData.coordinates.lat}/${reservoirData.coordinates.lng}`
      );
      
      if (weatherResponse.data.success) {
        forecast = weatherResponse.data.data;
      }
    }

    // Generate AI prediction
    const aiPrediction = await aiService.generateWaterPrediction(reservoirData, forecast);

    // Enhance prediction with additional calculated data
    const enhancedPrediction = {
      ...aiPrediction,
      reservoirId: parseInt(reservoirId),
      generatedAt: new Date().toISOString(),
      weatherSummary: forecast?.forecast ? {
        totalRainExpected: forecast.forecast.reduce((sum, day) => sum + day.precipitation, 0),
        avgTemperature: Math.round(
          forecast.forecast.reduce((sum, day) => sum + (day.maxTemp + day.minTemp) / 2, 0) / forecast.forecast.length
        ),
        dryDays: forecast.forecast.filter(day => day.precipitation < 1).length
      } : null
    };

    res.json({
      success: true,
      data: enhancedPrediction
    });

  } catch (error) {
    console.error('AI prediction error:', error.message);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to generate AI prediction'
    });
  }
});

// POST /api/ai/chat - General chat with AI about water management
router.post('/chat', async (req, res) => {
  try {
    const { message, context } = req.body;

    if (!message) {
      return res.status(400).json({
        success: false,
        error: 'Message is required'
      });
    }

    const systemPrompt = `You are a helpful AI assistant specializing in water management and drought resilience for communities. 
    Provide practical, actionable advice about water conservation, reservoir management, and community preparedness.
    Keep responses concise and focused on actionable insights.`;

    const messages = [
      { role: "system", content: systemPrompt },
      { role: "user", content: message }
    ];

    // Add context if provided
    if (context) {
      messages.splice(1, 0, {
        role: "system", 
        content: `Additional context: ${JSON.stringify(context)}`
      });
    }

    const response = await aiService.makeRequest(messages);
    const aiResponse = response.choices?.[0]?.message?.content;

    if (!aiResponse) {
      throw new Error('Invalid AI response');
    }

    res.json({
      success: true,
      data: {
        response: aiResponse,
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('AI chat error:', error.message);
    res.status(500).json({
      success: false,
      error: 'Failed to get AI response'
    });
  }
});

// GET /api/ai/health - Check AI service health
router.get('/health', (req, res) => {
  const hasApiKey = !!process.env.INFLECTION_AI_API_KEY;
  
  res.json({
    success: true,
    data: {
      status: hasApiKey ? 'ready' : 'not_configured',
      apiKeyConfigured: hasApiKey,
      baseURL: process.env.INFLECTION_AI_BASE_URL || 'https://api.inflection.ai/v1'
    }
  });
});

module.exports = router;
