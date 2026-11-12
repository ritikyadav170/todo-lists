import { useState, useEffect } from 'react';

/**
 * Custom hook to debounce a value
 * @param {*} value
 * @param {number} delay in milliseconds (default 300ms)
 */
export const useDebounce = (value, delay = 300) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

export default useDebounce;

