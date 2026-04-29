import { vehicles as mockVehicles } from '../data/mockData';

let fleetDB = [...mockVehicles];

export const fleetService = {
  getVehicles: () => Promise.resolve([...fleetDB]),

  getVehicleById: (id) => {
    const vehicle = fleetDB.find(v => v.id === id);
    if (!vehicle) return Promise.reject(new Error('Vehicle not found'));
    return Promise.resolve(vehicle);
  },

  updateVehicleStatus: (id, status) => {
    const index = fleetDB.findIndex(v => v.id === id);
    if (index === -1) return Promise.reject(new Error('Vehicle not found'));
    fleetDB[index] = { ...fleetDB[index], status };
    return Promise.resolve(fleetDB[index]);
  },

  addVehicle: (data) => {
    const newVehicle = {
      ...data,
      id: `VEH-00${fleetDB.length + 1}`,
      status: 'available',
      maintenance: [],
    };
    fleetDB.unshift(newVehicle);
    return Promise.resolve(newVehicle);
  },

  assignDriver: (vehicleId, driverId) => {
    const index = fleetDB.findIndex(v => v.id === vehicleId);
    if (index === -1) return Promise.reject(new Error('Vehicle not found'));
    fleetDB[index] = { ...fleetDB[index], assignedDriverId: driverId };
    return Promise.resolve(fleetDB[index]);
  }
};
