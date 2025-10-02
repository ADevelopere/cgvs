// Helper type to filter out keys ending with "Id"
export type OmitIdFields<T> = {
    [K in keyof T as K extends `${string}Id` ? never : K]: T[K];
};
