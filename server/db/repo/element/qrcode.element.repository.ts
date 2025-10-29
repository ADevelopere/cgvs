import { db } from "@/server/db/drizzleDb";
import { eq } from "drizzle-orm";
import { certificateElement } from "@/server/db/schema/certificateElements/certificateElement";
import { qrCodeElement } from "@/server/db/schema/certificateElements/qrCodeElement";
import {
  QRCodeElementCreateInput,
  QRCodeElementUpdateInput,
  QRCodeElementOutput,
  ElementType,
  QRCodeElementEntity,
  CertificateElementEntityInput,
  QRCodeErrorCorrection,
} from "@/server/types/element";
import { QRCodeElementUtils } from "@/server/utils/element";
import logger from "@/server/lib/logger";
import { ElementRepository } from ".";

/**
 * Repository for QR_CODE element operations
 * Handles table-per-type architecture: certificate_element + qr_code_element
 */
export namespace QRCodeElementRepository {
  // ============================================================================
  // Create Operation
  // ============================================================================

  /**
   * Create a new QR_CODE element
   * Pattern:
   * 1. Validate input
   * 2. Insert into certificate_element → get elementId
   * 3. Insert into qr_code_element
   * 4. Return full output
   */
  export const create = async (
    input: QRCodeElementCreateInput
  ): Promise<QRCodeElementOutput> => {
    // 1. Validate input
    await QRCodeElementUtils.validateCreateInput(input);

    const baseInput: CertificateElementEntityInput = {
      ...input,
      type: ElementType.QR_CODE,
    };

    // 2. Insert into certificate_element (base table)
    const [baseElement] = await db
      .insert(certificateElement)
      .values(baseInput)
      .returning();

    // 3. Insert into qr_code_element (type-specific table)
    const [newQRCodeElement] = await db
      .insert(qrCodeElement)
      .values({
        elementId: baseElement.id,
        errorCorrection: input.errorCorrection,
        foregroundColor: input.foregroundColor,
        backgroundColor: input.backgroundColor,
      })
      .returning();

    logger.info(
      `QR_CODE element created: ${baseElement.name} (ID: ${baseElement.id})`
    );

    // 4. Return full output
    return {
      ...baseElement,
      elementId: newQRCodeElement.elementId,
      errorCorrection: newQRCodeElement.errorCorrection as QRCodeErrorCorrection,
      foregroundColor: newQRCodeElement.foregroundColor,
      backgroundColor: newQRCodeElement.backgroundColor,
    };
  };

  // ============================================================================
  // Update Operation
  // ============================================================================

  /**
   * Update an existing QR_CODE element
   * Pattern:
   * 1. Load existing element
   * 2. Validate type and input
   * 3. Update certificate_element (base table)
   * 4. Update qr_code_element (type-specific table)
   * 5. Return updated element
   */
  export const update = async (
    input: QRCodeElementUpdateInput
  ): Promise<QRCodeElementOutput> => {
    // 1. Load existing element
    const existing = await loadByIdOrThrow(input.id);

    // 2. Validate type
    if (existing.type !== ElementType.QR_CODE) {
      throw new Error(
        `Element ${input.id} is ${existing.type}, not QR_CODE. Use correct repository.`
      );
    }

    // 3. Validate update input
    await QRCodeElementUtils.validateUpdateInput(input, existing);

    // 4. Update certificate_element (base table)
    const updatedBaseElement = await ElementRepository.updateBaseElement(
      input.id,
      input,
      existing
    );

    // 5. Update qr_code_element (type-specific table)
    const existingQRCodeElement: QRCodeElementEntity = existing;
    const updatedQRCodeElement = await updateQRCodeElementSpecific(
      input.id,
      input,
      existingQRCodeElement
    );

    logger.info(
      `QR_CODE element updated: ${updatedBaseElement.name} (ID: ${input.id})`
    );

    // 6. Return updated element
    return {
      ...updatedBaseElement,
      elementId: updatedQRCodeElement.elementId,
      errorCorrection: updatedQRCodeElement.errorCorrection as QRCodeErrorCorrection,
      foregroundColor: updatedQRCodeElement.foregroundColor,
      backgroundColor: updatedQRCodeElement.backgroundColor,
    };
  };

  // ============================================================================
  // Load Operations
  // ============================================================================

  /**
   * Load QR_CODE element by ID with all joined data
   * Joins: certificate_element + qr_code_element
   */
  export const loadById = async (
    id: number
  ): Promise<QRCodeElementOutput | null> => {
    // Join both tables
    const result = await db
      .select()
      .from(certificateElement)
      .innerJoin(
        qrCodeElement,
        eq(qrCodeElement.elementId, certificateElement.id)
      )
      .where(eq(certificateElement.id, id))
      .limit(1);

    if (result.length === 0) return null;

    const row = result[0];

    // Reconstruct output
    return {
      // Base element fields
      ...row.certificate_element,
      // QR_CODE-specific fields
      ...row.qr_code_element,
      errorCorrection: row.qr_code_element.errorCorrection as QRCodeErrorCorrection,
      foregroundColor: row.qr_code_element.foregroundColor,
      backgroundColor: row.qr_code_element.backgroundColor,
    };
  };

  /**
   * Load QR_CODE element by ID or throw error
   */
  export const loadByIdOrThrow = async (
    id: number
  ): Promise<QRCodeElementOutput> => {
    const element = await loadById(id);
    if (!element) {
      throw new Error(`QR_CODE element with ID ${id} does not exist.`);
    }
    return element;
  };

  /**
   * Load QR_CODE elements by IDs for Pothos dataloader
   * Returns array with QRCodeElementOutput or Error per ID
   */
  export const loadByIds = async (
    ids: number[]
  ): Promise<(QRCodeElementOutput | Error)[]> => {
    if (ids.length === 0) return [];

    // Load all elements
    const results = await Promise.all(ids.map(id => loadById(id)));

    // Map to maintain order and handle missing elements
    return results.map((element, index) => {
      if (!element) {
        return new Error(
          `QR_CODE element with ID ${ids[index]} does not exist.`
        );
      }

      // Validate element type
      if (element.type !== ElementType.QR_CODE) {
        return new Error(
          `Element ${element.id} is ${element.type}, not QR_CODE`
        );
      }

      return element;
    });
  };

  // ============================================================================
  // Update Helper Functions
  // ============================================================================

  /**
   * Update qr_code_element (type-specific table)
   * Returns updated entity or existing if no changes
   */
  const updateQRCodeElementSpecific = async (
    elementId: number,
    input: QRCodeElementUpdateInput,
    existingQRCodeElement: QRCodeElementEntity
  ): Promise<QRCodeElementEntity> => {
    const qrCodeUpdates: Partial<typeof qrCodeElement.$inferInsert> = {};

    // Handle errorCorrection update
    if (input.errorCorrection !== undefined) {
      if (input.errorCorrection === null) {
        throw new Error("errorCorrection cannot be null for QR_CODE element");
      }
      qrCodeUpdates.errorCorrection = input.errorCorrection;
    }

    // Handle foregroundColor update
    if (input.foregroundColor !== undefined) {
      if (input.foregroundColor === null) {
        throw new Error("foregroundColor cannot be null for QR_CODE element");
      }
      qrCodeUpdates.foregroundColor = input.foregroundColor;
    }

    // Handle backgroundColor update
    if (input.backgroundColor !== undefined) {
      if (input.backgroundColor === null) {
        throw new Error("backgroundColor cannot be null for QR_CODE element");
      }
      qrCodeUpdates.backgroundColor = input.backgroundColor;
    }

    if (Object.keys(qrCodeUpdates).length === 0) {
      return existingQRCodeElement;
    }

    const [updated] = await db
      .update(qrCodeElement)
      .set(qrCodeUpdates)
      .where(eq(qrCodeElement.elementId, elementId))
      .returning();

    return updated;
  };
}
