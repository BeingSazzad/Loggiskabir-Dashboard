import { useState, useEffect, useCallback } from 'react';
import { applications as mockApps } from '../data/mockData';

export const useApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchApplications = useCallback(() => {
    try {
      setLoading(true);
      setApplications([...mockApps]);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  return { applications, loading, error, refresh: fetchApplications };
};
