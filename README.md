# 🌊💧 Water Oasis Kenya – Hackathon MVP

A comprehensive water reservoir monitoring system with AI-powered predictions to help drought-stricken communities across Kenya manage water resources effectively.

## 🚨 Problem

Communities in drought-stricken areas of Kenya face unreliable access to safe water. Families may walk long distances across rural Kenya, only to find water points empty. Climate change is worsening the crisis by making water availability unpredictable across the country.

## 💡 Solution: Water Oasis Web App

A full-stack application that helps communities:

- **Find nearby water points** with real-time availability
- **See capacity & status** with visual indicators (🟢 Available, 🟡 Low, 🔴 Empty)
- **Predict future water access** using AI + weather data integration
- **Get actionable recommendations** for water conservation and planning

## 🔑 MVP Features

### ✅ Completed Features

1. **Authentication System**
   - Login/Register with JWT tokens
   - Demo login for quick access
   - Secure API endpoints

2. **Water Reservoir Management**
   - List all water reserves with capacity indicators
   - Search and filter by location and status
   - Real-time status updates (Good/Warning/Critical)
   - Detailed reservoir information with coordinates

3. **AI-Powered Predictions**
   - Integration with Inflection AI API for water availability forecasting
   - Weather data integration (OpenWeather API ready)
   - Smart recommendations based on current conditions
   - Risk assessment and timeline predictions

4. **Modern React Frontend**
   - Responsive design with mobile support
   - Real-time data updates
   - Interactive reservoir cards
   - Professional UI/UX

5. **Robust Backend API**
   - RESTful API with Express.js
   - Comprehensive error handling
   - Request logging and validation
   - Modular route structure

## ⚡ Tech Stack

### Frontend (Client)
- **React 18** with React Router
- **Modern CSS** with CSS Variables
- **Responsive Design** for mobile/desktop
- **API Integration** with fetch

### Backend (Server)
- **Node.js** with Express.js
- **JWT Authentication** with bcryptjs
- **Inflection AI Integration** for predictions
- **Weather API Integration** (OpenWeather ready)
- **CORS** enabled for cross-origin requests

### APIs & Services
- **Inflection AI API** - Advanced water management predictions
- **OpenWeather API** - Weather forecasting (configurable)
- **In-memory data store** (easily replaceable with MongoDB)

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ installed
- npm or yarn package manager

### 1. Clone and Setup
```bash
git clone <repository-url>
cd water-app
```

### 2. Install Dependencies
```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

### 3. Configure Environment
```bash
# In server directory, copy .env file
cd server
# Edit .env file with your API keys (Inflection AI key is already included)
```

### 4. Start the Application
```bash
# Terminal 1: Start the backend server
cd server
npm run dev

# Terminal 2: Start the frontend client
cd client
npm start
```

### 5. Access the Application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000/api
- **Health Check**: http://localhost:5000/api/health

## 🔐 Demo Access

### Quick Demo Login
Click the "🚀 Quick Demo Login" button on the login page for instant access

## 🤖 AI Integration

The system uses **Inflection AI API** for advanced water management predictions:

- **Smart Analysis**: Combines reservoir data with weather forecasts
- **Risk Assessment**: Calculates days until critical water levels
- **Actionable Recommendations**: Provides specific advice for communities
- **Confidence Scoring**: Indicates prediction reliability

## 🏆 Hackathon Pitch (60 sec)

> "In drought-hit areas, families often walk for hours only to find empty water sources. Climate change is making water access more unpredictable. Our app, **Water Oasis**, solves this by showing nearby water reserves, their capacity, and using AI-powered weather prediction to forecast water availability. With just a phone, families can plan better, save time, and gain resilience against climate stress. Our MVP demonstrates real-time monitoring, AI predictions, and actionable insights - ready to scale and save lives."

---

**🌊 Water Oasis - Empowering communities through smart water management** 💧

## ✨ Features

- **User Authentication**: Secure login system with demo credentials
- **Reservoir Search**: Search reservoirs by name or location
- **Real-time Data**: View current water levels and capacity
- **Runout Predictions**: See when reservoirs are estimated to run out
- **Responsive Design**: Beautiful UI that works on all devices
- **Modern UI**: Clean white and blue color scheme with smooth animations

## 🚀 Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- npm or yarn package manager

### Installation

1. **Clone or download the project files**
   ```bash
   # If you have git installed
   git clone <repository-url>
   cd water-reservoir-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🔐 Demo Login

For demonstration purposes, you can use any email and password combination:
- **Email**: `demo@example.com`
- **Password**: `password123`

## 🏗️ Project Structure

```
src/
├── components/          # React components
│   ├── Header.js       # Navigation header
│   ├── Login.js        # Login form
│   ├── Dashboard.js    # Main dashboard
│   ├── ReservoirSearch.js    # Search functionality
│   ├── ReservoirList.js      # Reservoir list display
│   └── ReservoirCard.js      # Individual reservoir cards
├── App.js              # Main app component
├── index.js            # App entry point
└── index.css           # Global styles
```

## 🎨 Design Features

- **Color Scheme**: White background with complementary blue accents
- **Responsive Grid**: Adaptive layout for different screen sizes
- **Interactive Cards**: Hover effects and expandable reservoir information
- **Status Indicators**: Visual indicators for reservoir health (Good/Warning/Critical)
- **Capacity Bars**: Visual representation of water levels
- **Modern Typography**: Clean, readable fonts with proper hierarchy

## 🔍 How to Use

1. **Login**: Enter any email and password to access the app
2. **Search**: Use the search bar to find specific reservoirs or filter by location
3. **Browse**: View all available reservoirs in your area
4. **Details**: Click on reservoir cards to see expanded information
5. **Monitor**: Check water levels, capacity, and estimated runout dates

## 📱 Responsive Design

The app is fully responsive and works on:
- Desktop computers
- Tablets
- Mobile phones
- All modern web browsers

## 🛠️ Built With

- **React 18** - Modern React with hooks
- **React Router** - Client-side routing
- **CSS3** - Custom styling with CSS variables
- **HTML5** - Semantic markup
- **JavaScript ES6+** - Modern JavaScript features

## 📊 Mock Data

The app currently uses mock data for demonstration purposes. In a production environment, this would be replaced with:
- Real API endpoints
- Database connections
- Real-time data updates
- User authentication services

## 🚀 Deployment

To build the app for production:

```bash
npm run build
```

This creates a `build` folder with optimized production files that can be deployed to any static hosting service.

## 🤝 Contributing

Feel free to contribute to this project by:
- Reporting bugs
- Suggesting new features
- Submitting pull requests
- Improving documentation

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🆘 Support

If you encounter any issues or have questions:
1. Check the console for error messages
2. Ensure all dependencies are installed
3. Verify Node.js version compatibility
4. Clear browser cache and cookies

---

**Happy Water Monitoring! 💧**
