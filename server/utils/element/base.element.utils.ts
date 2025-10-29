import {
  CertificateElementBaseUpdateInput,
  CertificateElementEntity,
  CertificateElementEntityInput,
} from "@/server/types";

export namespace BaseElementUtils {
  /**
   * Build partial updates for base element fields
   * Deep Partial Semantics:
   * - undefined = preserve existing (don't update)
   * - null = update field to NULL
   * - value = update field to value
   */
  export const baseUpdates = (
    input: CertificateElementBaseUpdateInput,
    existing: CertificateElementEntity
  ): Partial<CertificateElementEntityInput> => {
    const updates: Partial<CertificateElementEntityInput> = {};

    // Only skip undefined fields (null and values are included)
    if (input.name !== undefined) {
      updates.name = input.name ?? existing.name;
    }
    if (input.description !== undefined) {
      updates.description = input.description ?? existing.description;
    }
    if (input.positionX !== undefined) {
      updates.positionX =
        input.positionX !== null ? input.positionX : existing.positionX;
    }
    if (input.positionY !== undefined) {
      updates.positionY =
        input.positionY !== null ? input.positionY : existing.positionY;
    }
    if (input.width !== undefined) {
      updates.width = input.width !== null ? input.width : existing.width;
    }
    if (input.height !== undefined) {
      updates.height = input.height !== null ? input.height : existing.height;
    }
    if (input.alignment !== undefined) {
      updates.alignment = input.alignment ?? existing.alignment;
    }
    if (input.renderOrder !== undefined) {
      updates.renderOrder =
        input.renderOrder !== null ? input.renderOrder : existing.renderOrder;
    }

    return updates;
  };
}
