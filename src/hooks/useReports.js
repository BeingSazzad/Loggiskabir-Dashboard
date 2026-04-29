import { useState, useEffect, useCallback } from 'react';
import { reports as mockReports } from '../data/mockData';

export const useReports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchReports = useCallback(() => {
    try {
      setLoading(true);
      setReports(Array.isArray(mockReports) ? [...mockReports] : []);
      setError(null);
    } catch (err) {
      setError(err.message || 'Failed to fetch reports');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  return { reports, loading, error, refresh: fetchReports };
};
