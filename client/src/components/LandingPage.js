import React from 'react';
import { useNavigate } from 'react-router-dom';
import './LandingPage.css';

const LandingPage = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/login');
  };

  return (
    <div className="landing-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container">
          <div className="hero-content">
            <div className="hero-text">
              <h1 className="hero-title">
                🌊💧 <span className="brand">Water Oasis Kenya</span>
              </h1>
              <p className="hero-subtitle">
                Empowering Kenyan communities with AI-powered water resource monitoring and predictions
              </p>
              <p className="hero-description">
                Find nearby water points, check real-time availability, and get smart predictions 
                to help your community plan better during drought conditions across Kenya.
              </p>
              <div className="hero-buttons">
                <button className="btn btn-primary btn-large" onClick={handleGetStarted}>
                  🚀 Get Started
                </button>
                <button className="btn btn-secondary btn-large" onClick={() => navigate('/demo')}>
                  📱 View Demo
                </button>
              </div>
            </div>
            <div className="hero-image">
              <div className="water-animation">
                <div className="water-drop">💧</div>
                <div className="water-wave">🌊</div>
                <div className="kenya-flag">🇰🇪</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="problem-section">
        <div className="container">
          <h2 className="section-title">🚨 The Challenge in Kenya</h2>
          <div className="problem-grid">
            <div className="problem-card">
              <div className="problem-icon">🚶‍♀️</div>
              <h3>Long Distances</h3>
              <p>Families walk hours to reach water points, often finding them empty</p>
            </div>
            <div className="problem-card">
              <div className="problem-icon">🌡️</div>
              <h3>Climate Change</h3>
              <p>Unpredictable weather patterns make water availability uncertain</p>
            </div>
            <div className="problem-card">
              <div className="problem-icon">📱</div>
              <h3>Lack of Information</h3>
              <p>No real-time data on water point status and capacity levels</p>
            </div>
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section className="solution-section">
        <div className="container">
          <h2 className="section-title">💡 Our AI-Powered Solution</h2>
          <div className="solution-grid">
            <div className="solution-card">
              <div className="solution-icon">🗺️</div>
              <h3>Find Water Points</h3>
              <p>Locate nearby water reservoirs and boreholes across Kenya with real-time status</p>
            </div>
            <div className="solution-card">
              <div className="solution-icon">📊</div>
              <h3>Check Availability</h3>
              <p>See current water levels, capacity, and status indicators (Good/Warning/Critical)</p>
            </div>
            <div className="solution-card">
              <div className="solution-icon">🤖</div>
              <h3>AI Predictions</h3>
              <p>Get smart forecasts using weather data and AI to predict water availability</p>
            </div>
            <div className="solution-card">
              <div className="solution-icon">💡</div>
              <h3>Smart Recommendations</h3>
              <p>Receive actionable advice for water conservation and community planning</p>
            </div>
          </div>
        </div>
      </section>

      {/* AI Technology Section */}
      <section className="ai-section">
        <div className="container">
          <h2 className="section-title">🤖 Powered by Advanced AI Technology</h2>
          <div className="ai-content">
            <div className="ai-text">
              <h3>Inflection AI Integration</h3>
              <p>
                Our system leverages the powerful <strong>Inflection AI API</strong> to provide 
                intelligent water management insights specifically tailored for Kenyan communities.
              </p>
              
              <div className="ai-features">
                <div className="ai-feature">
                  <span className="ai-feature-icon">🧠</span>
                  <div>
                    <h4>Smart Analysis</h4>
                    <p>Combines reservoir data with weather forecasts for accurate predictions</p>
                  </div>
                </div>
                <div className="ai-feature">
                  <span className="ai-feature-icon">⚠️</span>
                  <div>
                    <h4>Risk Assessment</h4>
                    <p>Calculates days until critical water levels with confidence scoring</p>
                  </div>
                </div>
                <div className="ai-feature">
                  <span className="ai-feature-icon">📋</span>
                  <div>
                    <h4>Actionable Recommendations</h4>
                    <p>Provides specific advice for water conservation and community preparedness</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="ai-code">
              <h4>🔧 Technical Implementation</h4>
              <div className="code-block">
                <pre><code>{`// Inflection AI API Integration
const response = await axios.post(
  'https://api.inflection.ai/v1/chat/completions',
  {
    model: "inflection_3_pi",
    messages: [
      {
        role: "system", 
        content: "You are an AI water management expert..."
      },
      {
        role: "user", 
        content: "Analyze water situation in Kenya..."
      }
    ]
  },
  {
    headers: {
      'Authorization': 'Bearer YOUR_API_KEY',
      'Content-Type': 'application/json'
    }
  }
);`}</code></pre>
              </div>
              <p className="code-description">
                The same robust API architecture from the Java example, 
                implemented in Node.js for seamless web integration.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Kenya Coverage Section */}
      <section className="coverage-section">
        <div className="container">
          <h2 className="section-title">🇰🇪 Kenya Coverage</h2>
          <div className="coverage-content">
            <p className="coverage-description">
              Currently monitoring water points across major Kenyan cities and regions:
            </p>
            <div className="kenya-locations">
              <div className="location-group">
                <h4>Major Cities</h4>
                <ul>
                  <li>🏙️ Nairobi - Central Water Reserve</li>
                  <li>🌊 Mombasa - Coastal Reservoir</li>
                  <li>🏞️ Kisumu - Lake Victoria Reserve</li>
                  <li>🌋 Nakuru - Rift Valley Reservoir</li>
                </ul>
              </div>
              <div className="location-group">
                <h4>Regional Centers</h4>
                <ul>
                  <li>⛰️ Eldoret - Highland Water Point</li>
                  <li>🏖️ Malindi - Coastal Reserve</li>
                  <li>🌾 Machakos - Eastern Reserve</li>
                  <li>🌿 Kitale - Trans-Nzoia Water Point</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>Ready to Help Your Community?</h2>
            <p>Join thousands of Kenyans using Water Oasis to monitor and manage water resources</p>
            <button className="btn btn-primary btn-large" onClick={handleGetStarted}>
              🌊 Start Monitoring Water Points
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="container">
          <p>&copy; 2024 Water Oasis Kenya - Empowering communities through smart water management 💧</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
