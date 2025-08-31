import React, { useState } from 'react';
import apiService from '../services/api';
import './Login.css';

const Login = ({ onLogin }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      if (isSignUp) {
        // Client-side validation for sign up
        if (formData.password !== formData.confirmPassword) {
          setError('Passwords do not match');
          return;
        }
        if (formData.password.length < 6) {
          setError('Password must be at least 6 characters long');
          return;
        }
        if (!formData.name.trim()) {
          setError('Name is required');
          return;
        }

        // Call register API
        const response = await apiService.register(formData.email, formData.password, formData.name);

        if (response.success) {
          onLogin(response.data.user);
        } else {
          setError(response.error || 'Registration failed');
        }
      } else {
        // Call login API
        const response = await apiService.login(formData.email, formData.password);

        if (response.success) {
          onLogin(response.data.user);
        } else {
          setError(response.error || 'Login failed');
        }
      }
    } catch (err) {
      console.error('Authentication error:', err);
      setError(err.message || (isSignUp ? 'Sign up failed. Please try again.' : 'Login failed. Please try again.'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setIsLoading(true);
    setError('');

    try {
      const response = await apiService.demoLogin();

      if (response.success) {
        onLogin(response.data.user);
      } else {
        setError(response.error || 'Demo login failed');
      }
    } catch (err) {
      console.error('Demo login error:', err);
      setError(err.message || 'Demo login failed. Please check if the backend server is running.');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMode = () => {
    setIsSignUp(!isSignUp);
    setFormData({
      email: '',
      password: '',
      confirmPassword: '',
      name: ''
    });
    setError('');
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <div className="logo-icon">🌊💧</div>
          <h1>Water Oasis Kenya</h1>
          <p>{isSignUp ? 'Create your account to start monitoring water points across Kenya' : 'Sign in to access water reservoir information across Kenya with AI predictions'}</p>
        </div>
        
        <form onSubmit={handleSubmit} className="login-form">
          {error && <div className="error-message">{error}</div>}
          
          {isSignUp && (
            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <input
                type="text"
                id="name"
                name="name"
                className="form-control"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                required={isSignUp}
              />
            </div>
          )}
          
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              className="form-control"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              className="form-control"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
            />
          </div>

          {isSignUp && (
            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                className="form-control"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm your password"
                required={isSignUp}
              />
            </div>
          )}
          
          <button
            type="submit"
            className="btn btn-primary login-btn"
            disabled={isLoading}
          >
            {isLoading ? (isSignUp ? 'Creating Account...' : 'Signing In...') : (isSignUp ? 'Create Account' : 'Sign In')}
          </button>

          {!isSignUp && (
            <button
              type="button"
              className="btn btn-secondary demo-btn"
              onClick={handleDemoLogin}
              disabled={isLoading}
              style={{ marginTop: '10px', width: '100%' }}
            >
              {isLoading ? 'Logging in...' : 'Quick Demo Login'}
            </button>
          )}
        </form>
        
        <div className="toggle-mode">
          <p>
            {isSignUp ? 'Already have an account?' : "Don't have an account?"}
            <button 
              type="button" 
              className="toggle-btn"
              onClick={toggleMode}
            >
              {isSignUp ? 'Sign In' : 'Sign Up'}
            </button>
          </p>
        </div>
        

      </div>
    </div>
  );
};

export default Login;
