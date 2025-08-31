const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
    this.token = localStorage.getItem('authToken');
  }

  // Helper method to make HTTP requests
  async makeRequest(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    // Add authorization header if token exists
    if (this.token) {
      config.headers.Authorization = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error(`API request failed: ${endpoint}`, error);
      throw error;
    }
  }

  // Set authentication token
  setAuthToken(token) {
    this.token = token;
    if (token) {
      localStorage.setItem('authToken', token);
    } else {
      localStorage.removeItem('authToken');
    }
  }

  // Authentication methods
  async login(email, password) {
    const response = await this.makeRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    
    if (response.success && response.data.token) {
      this.setAuthToken(response.data.token);
    }
    
    return response;
  }

  async demoLogin() {
    const response = await this.makeRequest('/auth/demo-login', {
      method: 'POST',
    });
    
    if (response.success && response.data.token) {
      this.setAuthToken(response.data.token);
    }
    
    return response;
  }

  async register(email, password, name) {
    const response = await this.makeRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, name }),
    });
    
    if (response.success && response.data.token) {
      this.setAuthToken(response.data.token);
    }
    
    return response;
  }

  async getCurrentUser() {
    return await this.makeRequest('/auth/me');
  }

  logout() {
    this.setAuthToken(null);
  }

  // Reservoir methods
  async getReservoirs(filters = {}) {
    const queryParams = new URLSearchParams();
    
    if (filters.location) queryParams.append('location', filters.location);
    if (filters.status) queryParams.append('status', filters.status);
    if (filters.minLevel) queryParams.append('minLevel', filters.minLevel);
    
    const queryString = queryParams.toString();
    const endpoint = `/reservoirs${queryString ? `?${queryString}` : ''}`;
    
    return await this.makeRequest(endpoint);
  }

  async getReservoir(id) {
    return await this.makeRequest(`/reservoirs/${id}`);
  }

  async createReservoir(reservoirData) {
    return await this.makeRequest('/reservoirs', {
      method: 'POST',
      body: JSON.stringify(reservoirData),
    });
  }

  async updateReservoir(id, reservoirData) {
    return await this.makeRequest(`/reservoirs/${id}`, {
      method: 'PUT',
      body: JSON.stringify(reservoirData),
    });
  }

  async deleteReservoir(id) {
    return await this.makeRequest(`/reservoirs/${id}`, {
      method: 'DELETE',
    });
  }

  // Weather methods
  async getCurrentWeather(lat, lng) {
    return await this.makeRequest(`/weather/current/${lat}/${lng}`);
  }

  async getWeatherForecast(lat, lng) {
    return await this.makeRequest(`/weather/forecast/${lat}/${lng}`);
  }

  async getWeatherPrediction(reservoirId) {
    return await this.makeRequest(`/weather/prediction/${reservoirId}`);
  }

  // AI methods
  async getAIPrediction(reservoirId, weatherData = null) {
    return await this.makeRequest('/ai/predict', {
      method: 'POST',
      body: JSON.stringify({ reservoirId, weatherData }),
    });
  }

  async chatWithAI(message, context = null) {
    return await this.makeRequest('/ai/chat', {
      method: 'POST',
      body: JSON.stringify({ message, context }),
    });
  }

  async checkAIHealth() {
    return await this.makeRequest('/ai/health');
  }

  // Health check
  async healthCheck() {
    return await this.makeRequest('/health');
  }
}

// Create and export a singleton instance
const apiService = new ApiService();
export default apiService;

// Export the class as well for testing purposes
export { ApiService };
