import { useState, useEffect, useCallback } from 'react';
import taskApi from '../api/taskApi';

export const useWeeklySummary = (timezone) => {
  const [weeklySummaries, setWeeklySummaries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSummary = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await taskApi.getWeeklySummary(timezone);
      if (res.success) {
        setWeeklySummaries(res.data);
      }
    } catch (err) {
      setError(err.message || 'Failed to load weekly summary');
    } finally {
      setLoading(false);
    }
  }, [timezone]);

  useEffect(() => {
    fetchSummary();
  }, [fetchSummary]);

  return { weeklySummaries, loading, error, refresh: fetchSummary };
};

export default useWeeklySummary;

