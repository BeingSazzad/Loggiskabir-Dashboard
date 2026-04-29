import { useState, useEffect, useCallback } from 'react';
import { applications as mockApps } from '../data/mockData';

const delay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));

export const useApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchApplications = useCallback(async () => {
    try {
      setLoading(true);
      await delay();
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
