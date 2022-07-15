import { useEffect, useState } from 'react';

/**
 * Debounce a varying value
 * @param {any} value An input value which may change
 * @param {number} delay Amount of time before the value is considered unbounced
 * @returns A value which hasn't been changed for the set delay
 */
export default function useDebounce<T>(value: T, delay?: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
