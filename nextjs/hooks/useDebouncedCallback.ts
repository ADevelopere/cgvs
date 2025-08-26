import { useCallback, useRef } from "react";

/**
 * Creates a debounced version of a callback function
 * @param callback The function to debounce
 * @param delay The delay in milliseconds
 * @returns A debounced version of the callback
 */
export const useDebouncedCallback = <T extends (...args: unknown[]) => unknown>(
    callback: T,
    delay: number,
): T => {
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    return useCallback(
        ((...args: Parameters<T>) => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }

            timeoutRef.current = setTimeout(() => {
                callback(...args);
                timeoutRef.current = null;
            }, delay);
        }) as T,
        [callback, delay],
    );
};
