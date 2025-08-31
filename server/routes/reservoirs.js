const express = require('express');
const router = express.Router();

// In-memory data store (replace with database later)
let reservoirs = [
  {
    id: 1,
    name: "Nairobi Central Water Reserve",
    location: "Nairobi, Kenya",
    capacity: 85,
    currentLevel: 72,
    lastUpdated: "2024-08-30",
    coordinates: { lat: -1.2921, lng: 36.8219 },
    estimatedRunout: "2024-12-15",
    status: "good",
    weatherPrediction: null
  },
  {
    id: 2,
    name: "Mombasa Coastal Reservoir",
    location: "Mombasa, Kenya",
    capacity: 100,
    currentLevel: 45,
    lastUpdated: "2024-08-30",
    coordinates: { lat: -4.0435, lng: 39.6682 },
    estimatedRunout: "2024-10-20",
    status: "warning",
    weatherPrediction: null
  },
  {
    id: 3,
    name: "Kisumu Lake Victoria Reserve",
    location: "Kisumu, Kenya",
    capacity: 95,
    currentLevel: 88,
    lastUpdated: "2024-08-30",
    coordinates: { lat: -0.0917, lng: 34.7680 },
    estimatedRunout: "2025-02-10",
    status: "good",
    weatherPrediction: null
  },
  {
    id: 4,
    name: "Nakuru Rift Valley Reservoir",
    location: "Nakuru, Kenya",
    capacity: 90,
    currentLevel: 32,
    lastUpdated: "2024-08-30",
    coordinates: { lat: -0.3031, lng: 36.0800 },
    estimatedRunout: "2024-09-15",
    status: "critical",
    weatherPrediction: null
  },
  {
    id: 5,
    name: "Eldoret Highland Water Point",
    location: "Eldoret, Kenya",
    capacity: 80,
    currentLevel: 67,
    lastUpdated: "2024-08-30",
    coordinates: { lat: 0.5143, lng: 35.2698 },
    estimatedRunout: "2024-11-25",
    status: "warning",
    weatherPrediction: null
  },
  {
    id: 6,
    name: "Malindi Coastal Reserve",
    location: "Malindi, Kenya",
    capacity: 75,
    currentLevel: 91,
    lastUpdated: "2024-08-30",
    coordinates: { lat: -3.2194, lng: 40.1169 },
    estimatedRunout: "2025-03-20",
    status: "good",
    weatherPrediction: null
  },
  {
    id: 7,
    name: "Machakos Eastern Reserve",
    location: "Machakos, Kenya",
    capacity: 70,
    currentLevel: 55,
    lastUpdated: "2024-08-30",
    coordinates: { lat: -1.5177, lng: 37.2634 },
    estimatedRunout: "2024-11-10",
    status: "warning",
    weatherPrediction: null
  },
  {
    id: 8,
    name: "Kitale Trans-Nzoia Water Point",
    location: "Kitale, Kenya",
    capacity: 85,
    currentLevel: 78,
    lastUpdated: "2024-08-30",
    coordinates: { lat: 1.0157, lng: 35.0062 },
    estimatedRunout: "2025-01-15",
    status: "good",
    weatherPrediction: null
  }
];

// Helper function to determine status based on current level
const getReservoirStatus = (currentLevel) => {
  if (currentLevel >= 70) return 'good';
  if (currentLevel >= 40) return 'warning';
  return 'critical';
};

// GET /api/reservoirs - Get all reservoirs
router.get('/', (req, res) => {
  try {
    const { location, status, minLevel } = req.query;
    let filteredReservoirs = [...reservoirs];

    // Filter by location if provided
    if (location) {
      filteredReservoirs = filteredReservoirs.filter(reservoir =>
        reservoir.location.toLowerCase().includes(location.toLowerCase())
      );
    }

    // Filter by status if provided
    if (status) {
      filteredReservoirs = filteredReservoirs.filter(reservoir =>
        reservoir.status === status
      );
    }

    // Filter by minimum level if provided
    if (minLevel) {
      filteredReservoirs = filteredReservoirs.filter(reservoir =>
        reservoir.currentLevel >= parseInt(minLevel)
      );
    }

    res.json({
      success: true,
      data: filteredReservoirs,
      total: filteredReservoirs.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch reservoirs'
    });
  }
});

// GET /api/reservoirs/:id - Get specific reservoir
router.get('/:id', (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const reservoir = reservoirs.find(r => r.id === id);

    if (!reservoir) {
      return res.status(404).json({
        success: false,
        error: 'Reservoir not found'
      });
    }

    res.json({
      success: true,
      data: reservoir
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch reservoir'
    });
  }
});

// POST /api/reservoirs - Create new reservoir
router.post('/', (req, res) => {
  try {
    const { name, location, capacity, currentLevel, coordinates } = req.body;

    if (!name || !location || !capacity || currentLevel === undefined || !coordinates) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: name, location, capacity, currentLevel, coordinates'
      });
    }

    const newReservoir = {
      id: Math.max(...reservoirs.map(r => r.id)) + 1,
      name,
      location,
      capacity: parseInt(capacity),
      currentLevel: parseInt(currentLevel),
      lastUpdated: new Date().toISOString().split('T')[0],
      coordinates,
      estimatedRunout: calculateEstimatedRunout(currentLevel, capacity),
      status: getReservoirStatus(currentLevel),
      weatherPrediction: null
    };

    reservoirs.push(newReservoir);

    res.status(201).json({
      success: true,
      data: newReservoir
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to create reservoir'
    });
  }
});

// PUT /api/reservoirs/:id - Update reservoir
router.put('/:id', (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const reservoirIndex = reservoirs.findIndex(r => r.id === id);

    if (reservoirIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'Reservoir not found'
      });
    }

    const { name, location, capacity, currentLevel, coordinates } = req.body;
    const updatedReservoir = {
      ...reservoirs[reservoirIndex],
      ...(name && { name }),
      ...(location && { location }),
      ...(capacity && { capacity: parseInt(capacity) }),
      ...(currentLevel !== undefined && { 
        currentLevel: parseInt(currentLevel),
        status: getReservoirStatus(parseInt(currentLevel))
      }),
      ...(coordinates && { coordinates }),
      lastUpdated: new Date().toISOString().split('T')[0]
    };

    if (currentLevel !== undefined) {
      updatedReservoir.estimatedRunout = calculateEstimatedRunout(
        updatedReservoir.currentLevel, 
        updatedReservoir.capacity
      );
    }

    reservoirs[reservoirIndex] = updatedReservoir;

    res.json({
      success: true,
      data: updatedReservoir
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to update reservoir'
    });
  }
});

// DELETE /api/reservoirs/:id - Delete reservoir
router.delete('/:id', (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const reservoirIndex = reservoirs.findIndex(r => r.id === id);

    if (reservoirIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'Reservoir not found'
      });
    }

    const deletedReservoir = reservoirs.splice(reservoirIndex, 1)[0];

    res.json({
      success: true,
      data: deletedReservoir,
      message: 'Reservoir deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to delete reservoir'
    });
  }
});

// Helper function to calculate estimated runout date
function calculateEstimatedRunout(currentLevel, capacity) {
  const today = new Date();
  const dailyConsumption = 0.5; // Assume 0.5% daily consumption
  const daysRemaining = Math.floor(currentLevel / dailyConsumption);
  const runoutDate = new Date(today.getTime() + (daysRemaining * 24 * 60 * 60 * 1000));
  return runoutDate.toISOString().split('T')[0];
}

module.exports = router;
