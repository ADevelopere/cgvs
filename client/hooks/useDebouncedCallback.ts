import { useEffect, useMemo, useRef } from 'react';
import { debounce } from 'lodash';

export const useDebouncedCallback = <T extends (...args: unknown[]) => unknown>(
  callback: T,
  delay: number
) => {
  const callbackRef = useRef(callback);

  useEffect(() => {
    callbackRef.current = callback;
  });

  return useMemo(
    () =>
      debounce(
        (...args: Parameters<T>): ReturnType<T> => callbackRef.current(...args),
        delay
      ),
    [delay]
  );
};
