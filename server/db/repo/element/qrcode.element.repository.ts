import {
  QRCodeElementPothosDefinition,
  ElementType,
  QRCodeElementConfig,
} from "@/server/types/element";
import { ElementRepository } from "./element.repository";

/**
 * Repository for QR_CODE element operations
 */
export namespace QRCodeElementRepository {
  // ============================================================================
  // Load Operations (for Pothos Dataloader)
  // ============================================================================

  /**
   * Load QR_CODE elements by IDs for Pothos dataloader
   * Returns array with QRCodeElementPothosDefinition or Error per ID
   */
  export const loadByIds = async (
    ids: number[]
  ): Promise<(QRCodeElementPothosDefinition | Error)[]> => {
    if (ids.length === 0) return [];

    // Get elements from repository
    const elements = await ElementRepository.loadByIds(ids);

    // Map to maintain order and validate QR_CODE type
    return elements.map(element => {
      if (element instanceof Error) return element;

      // Validate element type
      if (element.type !== ElementType.QR_CODE) {
        return new Error(
          `Element ${element.id} is ${element.type}, not QR_CODE`
        );
      }

      // Return as QRCodeElementPothosDefinition
      return {
        ...element,
        config: element.config as QRCodeElementConfig,
      };
    });
  };
}

