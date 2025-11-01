// ============================================================================
// TYPE-SAFE UPDATE FUNCTIONS
// ============================================================================

type Action<T> = {
  [K in keyof T]: {
    key: K;
    value: T[K];
  };
}[keyof T];
export type UpdateStateFn<T> = (action: Action<T>) => void;

// export type UpdateStateFn<T> = <K extends keyof T>(key: K, value: T[K]) => void;
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
