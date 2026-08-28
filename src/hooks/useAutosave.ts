import { useEffect, useState, useRef } from 'react';

/**
 * Hook to debounce value changes and trigger an autosave callback.
 */
export function useAutosave<T>(
  value: T,
  delay: number,
  onSave: (debouncedValue: T) => void
) {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  // Keep track of the initial render so we don't save immediately
  const isInitial = useRef(true);

  useEffect(() => {
    if (isInitial.current) {
      isInitial.current = false;
      return;
    }
    
    const handler = setTimeout(() => {
      setDebouncedValue(value);
      onSave(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay, onSave]);

  return debouncedValue;
}
