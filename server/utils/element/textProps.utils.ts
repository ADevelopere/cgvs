import {
  ElementOverflow,
  ElementTextPropsEntity,
  FontSource,
  TextProps,
} from "@/server/types/element";

import { FontReference } from "@/server/types/element";

export namespace TextPropsUtils {
  // ============================================================================
  // Conversion Utilities
  // ============================================================================

  /**
   * Convert DB entity to TextProps output type
   * Reconstructs FontReference from fontSource + fontId/googleFontIdentifier
   */
  export const entityToTextProps = (entity: ElementTextPropsEntity): TextProps => {
    const fontRef: FontReference =
      entity.fontSource === FontSource.SELF_HOSTED
        ? { type: FontSource.SELF_HOSTED as const, fontId: entity.fontId! }
        : {
            type: FontSource.GOOGLE as const,
            identifier: entity.googleFontIdentifier!,
          };

    return {
      fontRef,
      fontSize: entity.fontSize,
      color: entity.color ?? undefined,
      overflow: entity.overflow as ElementOverflow,
    };
  };
}
