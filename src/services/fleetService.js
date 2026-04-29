import { vehicles as mockVehicles } from '../data/mockData';

let fleetDB = [...mockVehicles];

const delay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));

export const fleetService = {
  getVehicles: async () => {
    await delay();
    return [...fleetDB];
  },

  getVehicleById: async (id) => {
    await delay();
    const vehicle = fleetDB.find(v => v.id === id);
    if (!vehicle) throw new Error('Vehicle not found');
    return vehicle;
  },

  updateVehicleStatus: async (id, status) => {
    await delay();
    const index = fleetDB.findIndex(v => v.id === id);
    if (index === -1) throw new Error('Vehicle not found');
    
    fleetDB[index] = { ...fleetDB[index], status };
    return fleetDB[index];
  },

  addVehicle: async (data) => {
    await delay();
    const newVehicle = {
      ...data,
      id: `VEH-00${fleetDB.length + 1}`,
      status: 'available',
      maintenance: [],
    };
    fleetDB.unshift(newVehicle);
    return newVehicle;
  },

  assignDriver: async (vehicleId, driverId) => {
    await delay();
    const index = fleetDB.findIndex(v => v.id === vehicleId);
    if (index === -1) throw new Error('Vehicle not found');
    fleetDB[index] = { ...fleetDB[index], assignedDriverId: driverId };
    return fleetDB[index];
  }
};
