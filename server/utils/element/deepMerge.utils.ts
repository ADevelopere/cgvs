/**
 * Deep merge utility for element config objects
 * Recursively merges nested objects to preserve all properties
 */

/**
 * Check if value is a plain object
 */
const isObject = (item: unknown): item is Record<string, any> => {
  return item !== null && typeof item === "object" && !Array.isArray(item);
};

/**
 * Deep merge two objects recursively
 * Later values override earlier values at the same path
 *
 * @param target - Base object
 * @param source - Object with updates
 * @returns Merged object with all nested properties preserved
 *
 * @example
 * const target = { a: { b: 1, c: 2 }, d: 3 };
 * const source = { a: { b: 10 } };
 * deepMerge(target, source);
 * // Result: { a: { b: 10, c: 2 }, d: 3 }
 */
export function deepMerge<T extends Record<string, any>>(
  target: T,
  source: Partial<T>
): T {
  const output: Record<string, any> = { ...target };

  if (isObject(target) && isObject(source)) {
    Object.keys(source).forEach(key => {
      const sourceValue = source[key];
      const targetValue = target[key];

      if (isObject(sourceValue)) {
        if (!(key in target)) {
          // Key doesn't exist in target, use source value
          output[key] = sourceValue;
        } else if (isObject(targetValue)) {
          // Both are objects, merge recursively
          output[key] = deepMerge(targetValue, sourceValue);
        } else {
          // Target value is not an object, replace with source
          output[key] = sourceValue;
        }
      } else {
        // Source value is not an object, use it directly
        output[key] = sourceValue;
      }
    });
  }

  return output as T;
}
