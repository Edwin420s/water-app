import React, { useState } from 'react';
import './ReservoirSearch.css';

const ReservoirSearch = ({ onSearch, onReset, totalReservoirs, filteredCount }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [location, setLocation] = useState('');

  // Kenya locations for dropdown
  const kenyanLocations = [
    'Nairobi',
    'Mombasa',
    'Kisumu',
    'Nakuru',
    'Eldoret',
    'Malindi',
    'Machakos',
    'Kitale',
    'Thika',
    'Nyeri',
    'Meru',
    'Garissa',
    'Kakamega',
    'Kericho',
    'Embu',
    'Lamu'
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(searchTerm, location);
  };

  const handleReset = () => {
    setSearchTerm('');
    setLocation('');
    onReset();
  };

  return (
    <div className="search-container">
      <div className="container">
        <div className="search-header">
          <h2 className="section-title">Find Water Points in Kenya</h2>
          <p>Search for water reservoirs and boreholes across Kenya by name or location</p>
        </div>

        <form onSubmit={handleSubmit} className="search-form">
          <div className="search-inputs">
            <div className="form-group">
              <label htmlFor="searchTerm">Water Point Name</label>
              <input
                type="text"
                id="searchTerm"
                className="form-control"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by name (e.g., Nairobi Central, Coastal)..."
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="location">Location</label>
              <div className="location-search">
                <select
                  id="locationSelect"
                  className="form-control"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  style={{ marginBottom: '8px' }}
                >
                  <option value="">Select a location...</option>
                  {kenyanLocations.map(loc => (
                    <option key={loc} value={loc}>{loc}, Kenya</option>
                  ))}
                </select>
                <input
                  type="text"
                  id="location"
                  className="form-control"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Or type Kenya city/county name..."
                />
              </div>
            </div>
          </div>

          <div className="search-actions">
            <button type="submit" className="btn btn-primary">
              🔍 Search Reservoirs
            </button>
            <button 
              type="button" 
              className="btn btn-secondary"
              onClick={handleReset}
            >
              Reset Filters
            </button>
          </div>
        </form>

        <div className="search-results-info">
          <p>
            Showing <strong>{filteredCount}</strong> of <strong>{totalReservoirs}</strong> reservoirs
          </p>
        </div>
      </div>
    </div>
  );
};

export default ReservoirSearch;
