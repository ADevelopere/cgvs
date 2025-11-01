// ============================================================================
// TYPE-SAFE UPDATE FUNCTIONS
// ============================================================================

export type UpdateStateFn<T> = <K extends keyof T>(key: K, value: T[K]) => void;
export type ValidateFieldFn<T> = <K extends keyof T>(
  key: K,
  value: T[K]
) => string | undefined;

// ============================================================================
// TYPE-SAFE ERROR MAP
// ============================================================================

export type FormErrors<T> = {
  [K in keyof T]?: string;
};
