import { useState, useEffect, useCallback } from 'react';
import { tripService } from '../services/tripService';

export const useTrips = (initialFilters = {}) => {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState(initialFilters);

  const fetchTrips = useCallback(async () => {
    try {
      setLoading(true);
      const data = await tripService.getTrips(filters);
      setTrips(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchTrips();
  }, [fetchTrips]);

  return { trips, loading, error, setFilters, refresh: fetchTrips };
};
