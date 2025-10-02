// Helper type to filter out keys ending with "Id"
export type OmitIdRelationFields<T> = {
    [K in keyof T as K extends `${string}Id` ? never : K]: T[K];
};
