import logger from "@/server/lib/logger";
import { ElementOverflow, ElementTextPropsEntity, FontSource, TextProps } from "@/server/types/element";

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
    logger.debug("[entityToTextProps] Converting ElementTextPropsEntity to TextProps", entity, entity.fontSource);
    const fontRef: FontReference =
      entity.fontSource === FontSource.SELF_HOSTED
        ? { type: FontSource.SELF_HOSTED as const, fontId: entity.fontId! }
        : {
            type: FontSource.GOOGLE as const,
            identifier: entity.googleFontIdentifier!,
          };

    return {
      ...entity,
      fontRef: fontRef,
      overflow: entity.overflow as ElementOverflow,
    };
  };
}
