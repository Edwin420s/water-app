import React, { useState, useEffect } from 'react';
import ReservoirSearch from './ReservoirSearch';
import ReservoirList from './ReservoirList';
import apiService from '../services/api';
import './Dashboard.css';

const Dashboard = ({ user }) => {
  const [reservoirs, setReservoirs] = useState([]);
  const [filteredReservoirs, setFilteredReservoirs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // Load reservoirs data from API
    const loadReservoirs = async () => {
      try {
        setIsLoading(true);
        setError('');

        // Fetch reservoirs from backend API
        const response = await apiService.getReservoirs();

        if (response.success) {
          setReservoirs(response.data);
          setFilteredReservoirs(response.data);
        } else {
          throw new Error(response.error || 'Failed to load reservoirs');
        }
      } catch (err) {
        console.error('Error loading reservoirs:', err);
        setError(err.message || 'Failed to load reservoir data. Please check if the backend server is running.');
      } finally {
        setIsLoading(false);
      }
    };

    loadReservoirs();
  }, []);

  const handleSearch = async (searchTerm, location) => {
    try {
      setIsLoading(true);
      setError('');

      // Start with all reservoirs
      let filtered = [...reservoirs];

      // Apply search term filtering (name or location)
      if (searchTerm && searchTerm.trim()) {
        filtered = filtered.filter(reservoir =>
          reservoir.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          reservoir.location.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }

      // Apply location filtering
      if (location && location.trim()) {
        filtered = filtered.filter(reservoir =>
          reservoir.location.toLowerCase().includes(location.toLowerCase())
        );
      }

      setFilteredReservoirs(filtered);
    } catch (err) {
      console.error('Search error:', err);
      setError('Failed to search reservoirs');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = async () => {
    try {
      setIsLoading(true);
      const response = await apiService.getReservoirs();
      if (response.success) {
        setReservoirs(response.data);
        setFilteredReservoirs(response.data);
      }
    } catch (err) {
      console.error('Reset error:', err);
      setError('Failed to reset reservoir list');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = async () => {
    try {
      setIsLoading(true);
      const response = await apiService.getReservoirs();
      if (response.success) {
        setReservoirs(response.data);
        setFilteredReservoirs(response.data);
      }
    } catch (err) {
      console.error('Refresh error:', err);
      setError('Failed to refresh reservoir data');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="main-content">
        <div className="container">
          <div className="loading">
            <h2>Loading reservoir data...</h2>
            <p>Please wait while we fetch the latest information</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="main-content">
        <div className="container">
          <div className="error">
            <h2>Error</h2>
            <p>{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="main-content">
      <div className="container">
        <div className="dashboard-header">
          <h1 className="page-title">🌊 Water Oasis Kenya</h1>
          <p className="page-subtitle">
            Monitor water levels and capacity of reservoirs across Kenya with AI-powered predictions
          </p>
        </div>

        <ReservoirSearch 
          onSearch={handleSearch}
          onReset={handleReset}
          totalReservoirs={reservoirs.length}
          filteredCount={filteredReservoirs.length}
        />

        <ReservoirList
          reservoirs={filteredReservoirs}
          onRefresh={handleRefresh}
        />
      </div>
    </div>
  );
};

export default Dashboard;
