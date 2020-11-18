import { useEffect, useState } from 'react';

export const useDebounce = (value: string, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    // Update debounced value after delay
    const handler = setTimeout(() => setDebouncedValue(value), delay);

    // Cancel if value changes (also on delay change or unmount)
    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
};
