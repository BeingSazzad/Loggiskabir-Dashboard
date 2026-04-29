import { useState, useEffect, useCallback } from 'react';
import { reports as mockReports } from '../data/mockData';

const delay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));

export const useReports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchReports = useCallback(async () => {
    try {
      setLoading(true);
      await delay();
      
      if (Array.isArray(mockReports)) {
        setReports([...mockReports]);
      } else {
        console.warn('Reports data is missing or invalid in mockData.js');
        setReports([]);
      }
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
