import { drivers as mockDrivers } from '../data/mockData';

let driversDB = [...mockDrivers];

export const driverService = {
  getDrivers: (filters = {}) => {
    let result = [...driversDB];
    if (filters.status && filters.status !== 'all') {
      result = result.filter(d => d.status === filters.status);
    }
    return Promise.resolve(result);
  },

  getDriverById: (id) => {
    const driver = driversDB.find(d => d.id === id);
    if (!driver) return Promise.reject(new Error('Driver not found'));
    return Promise.resolve(driver);
  },

  createDriver: (driverData) => {
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
    return Promise.resolve(newDriver);
  },

  updateDriver: (id, updates) => {
    const index = driversDB.findIndex(d => d.id === id);
    if (index === -1) return Promise.reject(new Error('Driver not found'));
    driversDB[index] = { ...driversDB[index], ...updates };
    return Promise.resolve(driversDB[index]);
  }
};
