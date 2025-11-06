import { useEffect, useMemo, useRef } from "react";
import { debounce } from "lodash";

export const useDebouncedCallback = <A extends unknown[], R>(callback: (...args: A) => R, delay: number) => {
  const callbackRef = useRef(callback);

  useEffect(() => {
    callbackRef.current = callback;
  });

  return useMemo(() => debounce((...args: A): R => callbackRef.current(...args), delay), [delay]);
};
