import { useState, useEffect } from 'react';
import { riders as initialRiders } from '../data/mockData';

export const useRiders = () => {
  const [riders, setRiders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    try {
      setRiders(initialRiders);
      setError(null);
    } catch (err) {
      setError(err.message || 'Failed to load riders');
    } finally {
      setLoading(false);
    }
  }, []);

  return { riders, loading, error };
};
