import { useState, useEffect, useCallback } from 'react';
import { fleetService } from '../services/fleetService';

export const useFleet = () => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchVehicles = useCallback(async () => {
    try {
      setLoading(true);
      const data = await fleetService.getVehicles();
      setVehicles(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchVehicles();
  }, [fetchVehicles]);

  const addVehicle = async (data) => {
    try {
      const newV = await fleetService.addVehicle(data);
      setVehicles(prev => [newV, ...prev]);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleAssign = async (vehicleId, driverId) => {
    try {
      await fleetService.assignDriver(vehicleId, driverId);
      setVehicles(prev => prev.map(v => v.id === vehicleId ? { ...v, assignedDriverId: driverId } : v));
    } catch (err) {
      setError(err.message);
    }
  };

  return { vehicles, loading, error, addVehicle, handleAssign, refresh: fetchVehicles };
};
