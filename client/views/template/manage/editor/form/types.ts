// ============================================================================
// TYPE-SAFE UPDATE FUNCTIONS
// ============================================================================

export type Action<T> = {
  // Use Required<T> to ensure all keys are iterated,
  // even optional ones.
  [K in keyof Required<T>]: {
    key: K;
    // But get the value from the *original* T,
    // which correctly includes | undefined for optional keys.
    value: T[K];
  };
  // And use Required<T> for the final lookup.
}[keyof Required<T>];

export type UpdateStateFn<T> = (action: Action<T>) => void;

// export type UpdateStateFn<T> = <K extends keyof T>(key: K, value: T[K]) => void;
export type ValidateFieldFn<T, E> = (action: Action<T>) => E | undefined;

// ============================================================================
// ELEMENT-ID AWARE ACTION TYPE
// ============================================================================

export type UpdateStateWithElementIdFn<T> = (
  elementId: number,
  action: Action<T>
) => void;

// ============================================================================
// TYPE-SAFE ERROR MAP
// ============================================================================

export type FormErrors<T> = {
  [K in keyof T]?: string;
};
