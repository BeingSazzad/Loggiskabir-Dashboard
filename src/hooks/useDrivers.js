import { useState, useEffect, useCallback } from 'react';
import { driverService } from '../services/driverService';

export const useDrivers = (initialFilters = {}) => {
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState(initialFilters);

  const fetchDrivers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await driverService.getDrivers(filters);
      setDrivers(data);
    } catch (err) {
      setError(err.message || 'Failed to fetch drivers');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchDrivers();
  }, [fetchDrivers]);

  const addDriver = async (driverData) => {
    try {
      setError(null);
      const newDriver = await driverService.createDriver(driverData);
      setDrivers(prev => [newDriver, ...prev]);
      return newDriver;
    } catch (err) {
      setError(err.message || 'Failed to add driver');
      throw err;
    }
  };

  const updateDriverStatus = async (id, status) => {
    try {
      setError(null);
      const updated = await driverService.updateDriver(id, { status });
      setDrivers(prev => prev.map(d => d.id === id ? updated : d));
      return updated;
    } catch (err) {
      setError(err.message || 'Failed to update driver');
      throw err;
    }
  };

  return {
    drivers,
    loading,
    error,
    addDriver,
    updateDriverStatus,
    setFilters,
    refresh: fetchDrivers
  };
};
