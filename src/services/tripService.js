import { trips as mockTrips } from '../data/mockData';

let tripsDB = [...mockTrips];

const delay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));

export const tripService = {
  getTrips: async (filters = {}) => {
    await delay();
    let result = [...tripsDB];
    
    if (filters.status && filters.status !== 'all') {
      result = result.filter(t => t.status === filters.status);
    }
    
    return result;
  },

  getTripById: async (id) => {
    await delay();
    const trip = tripsDB.find(t => t.id === id);
    if (!trip) throw new Error('Trip not found');
    return trip;
  },

  updateTripStatus: async (id, status) => {
    await delay();
    const index = tripsDB.findIndex(t => t.id === id);
    if (index === -1) throw new Error('Trip not found');
    
    tripsDB[index] = { ...tripsDB[index], status };
    return tripsDB[index];
  },

  assignDriver: async (tripId, driverId) => {
    await delay();
    const index = tripsDB.findIndex(t => t.id === tripId);
    if (index === -1) throw new Error('Trip not found');
    
    tripsDB[index] = { ...tripsDB[index], driverId, status: 'assigned' };
    return tripsDB[index];
  }
};
