import { drivers as mockDrivers } from '../data/mockData';

// Simulated database
let driversDB = [...mockDrivers];

// Utility to simulate network delay
const delay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));

export const driverService = {
  /**
   * Fetch all drivers
   * @param {Object} filters - Optional filters
   * @returns {Promise<Array>} Array of drivers
   */
  getDrivers: async (filters = {}) => {
    await delay();
    let result = [...driversDB];
    
    // Apply optional filters if backend were real
    if (filters.status && filters.status !== 'all') {
       result = result.filter(d => d.status === filters.status);
    }
    
    return result;
  },

  /**
   * Fetch a single driver by ID
   * @param {string} id 
   * @returns {Promise<Object>}
   */
  getDriverById: async (id) => {
    await delay();
    const driver = driversDB.find(d => d.id === id);
    if (!driver) throw new Error('Driver not found');
    return driver;
  },

  /**
   * Create a new driver
   * @param {Object} driverData 
   * @returns {Promise<Object>}
   */
  createDriver: async (driverData) => {
    await delay(800); // Simulate slightly longer write operation
    const newDriver = {
      id: `DRV-${Math.floor(1000 + Math.random() * 9000)}`,
      ...driverData,
      status: 'pending',
      onDuty: false,
      rating: 0,
      totalTrips: 0,
      joinedDate: new Date().toISOString()
    };
    driversDB = [newDriver, ...driversDB];
    return newDriver;
  },

  /**
   * Update an existing driver
   * @param {string} id 
   * @param {Object} updates 
   * @returns {Promise<Object>}
   */
  updateDriver: async (id, updates) => {
    await delay();
    const index = driversDB.findIndex(d => d.id === id);
    if (index === -1) throw new Error('Driver not found');
    
    driversDB[index] = { ...driversDB[index], ...updates };
    return driversDB[index];
  }
};
