import {
  CertificateElementBaseUpdateInput,
  CertificateElementEntity,
  CertificateElementEntityInput,
} from "@/server/types";

type DeepPartial<T> = {
  [P in keyof T]?: T[P] | undefined | null;
};

export function mergePartialUpdate<TEntity extends Record<string, unknown>>(
  existing: TEntity,
  update: DeepPartial<TEntity>,
  nullableFields?: Set<keyof TEntity>
): TEntity {
  const result = { ...existing };

  (Object.keys(update) as Array<keyof TEntity>).forEach(key => {
    const updateValue = update[key];

    // If undefined, keep existing value
    if (updateValue === undefined) {
      return;
    }

    // If null, only set to null if field is in nullableFields set
    if (updateValue === null) {
      if (nullableFields?.has(key)) {
        (result as Record<string, unknown>)[key as string] = null;
      }
      // Otherwise keep existing value (do nothing)
    } else {
      // Use the new value
      (result as Record<string, unknown>)[key as string] = updateValue;
    }
  });

  return result;
}

export namespace BaseElementUtils {
  export const baseUpdates = (
    input: CertificateElementBaseUpdateInput,
    existing: CertificateElementEntity
  ): CertificateElementEntityInput => {
    return {
      ...mergePartialUpdate(existing, input),
      updatedAt: new Date(),
    };
  };
}
