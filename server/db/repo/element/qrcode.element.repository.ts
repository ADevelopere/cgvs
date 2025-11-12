import { db } from "@/server/db/drizzleDb";
import { eq } from "drizzle-orm";
import { certificateElement, qrCodeElement } from "@/server/db/schema";
import {
  QRCodeElementInput,
  QRCodeElementUpdateInput,
  QRCodeElementOutput,
  ElementType,
  QRCodeElementEntity,
  CertificateElementEntityCreateInput,
  QRCodeErrorCorrection,
  CertificateElementEntity,
  QRCodeElementSpecPropsStandaloneUpdateInput,
  QRCodeElementSpecPropsStandaloneUpdateResponse,
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
  export const create = async (input: QRCodeElementInput): Promise<QRCodeElementOutput> => {
    // 1. Validate input
    await QRCodeElementUtils.validateInput(input);

    const baseInput: CertificateElementEntityCreateInput = {
      ...input.base,
      type: ElementType.QR_CODE,
    };

    // 2. Insert into certificate_element (base table)
    const baseElement = await ElementRepository.createInternal(baseInput);

    // 3. Insert into qr_code_element (type-specific table)
    const [newQRCodeElement] = await db
      .insert(qrCodeElement)
      .values({
        elementId: baseElement.id,
        errorCorrection: input.qrCodeProps.errorCorrection,
        foregroundColor: input.qrCodeProps.foregroundColor,
        backgroundColor: input.qrCodeProps.backgroundColor,
      })
      .returning();

    if (!newQRCodeElement) throw new Error("Failed to create QR_CODE element");

    logger.info(`QR_CODE element created: ${baseElement.name} (ID: ${baseElement.id})`);

    return {
      base: baseElement,
      qrCodeProps: {
        ...newQRCodeElement,
        errorCorrection: newQRCodeElement.errorCorrection as QRCodeErrorCorrection,
      },
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
  export const update = async (input: QRCodeElementUpdateInput): Promise<QRCodeElementOutput> => {
    // 1. Load existing element
    const existing = await loadByIdOrThrow(input.id);

    // 2. Validate type
    if (existing.base.type !== ElementType.QR_CODE) {
      throw new Error(`Element ${input.id} is ${existing.base.type}, not QR_CODE. Use correct repository.`);
    }

    // 3. Validate update input
    await QRCodeElementUtils.validateInput(input);

    // 4. Update certificate_element (base table)
    const updatedBaseElement = await ElementRepository.updateBaseElement({ ...input.base, id: input.id }, true);

    // 5. Update qr_code_element (type-specific table)
    const updatedQRCodeElement = await updateQRCodeElementSpecific(input);

    logger.info(`QR_CODE element updated: ${updatedBaseElement.name} (ID: ${input.id})`);

    return {
      base: updatedBaseElement,
      qrCodeProps: {
        ...updatedQRCodeElement,
        errorCorrection: updatedQRCodeElement.errorCorrection as QRCodeErrorCorrection,
      },
    };
  };

  // ============================================================================
  // Load Operations
  // ============================================================================

  /**
   * Load QR_CODE element by ID with all joined data
   * Joins: certificate_element + qr_code_element
   */
  export const loadById = async (id: number): Promise<QRCodeElementOutput | null> => {
    // Join both tables
    const result = await db
      .select()
      .from(certificateElement)
      .innerJoin(qrCodeElement, eq(qrCodeElement.elementId, certificateElement.id))
      .where(eq(certificateElement.id, id))
      .limit(1);

    if (result.length === 0 || !result[0]) return null;

    const row = result[0];

    return {
      base: row.certificate_element,
      qrCodeProps: {
        ...row.qr_code_element,
        errorCorrection: row.qr_code_element.errorCorrection as QRCodeErrorCorrection,
      },
    };
  };

  export const loadByBase = async (base: CertificateElementEntity): Promise<QRCodeElementOutput> => {
    // Join both tables
    const result = await db.select().from(qrCodeElement).where(eq(qrCodeElement.elementId, base.id)).limit(1);

    if (result.length === 0 || !result[0]) throw new Error(`QR_CODE element with base ID ${base.id} does not exist.`);

    const row = result[0];

    return {
      base: base,
      qrCodeProps: {
        ...row,
        errorCorrection: row.errorCorrection as QRCodeErrorCorrection,
      },
    };
  };

  /**
   * Load QR_CODE element by ID or throw error
   */
  export const loadByIdOrThrow = async (id: number): Promise<QRCodeElementOutput> => {
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
  export const loadByIds = async (ids: number[]): Promise<(QRCodeElementOutput | Error)[]> => {
    if (ids.length === 0) return [];

    // Load all elements
    const results = await Promise.all(ids.map(id => loadById(id)));

    // Map to maintain order and handle missing elements
    return results.map((element, index) => {
      if (!element) {
        return new Error(`QR_CODE element with ID ${ids[index]} does not exist.`);
      }

      // Validate element type
      if (element.base.type !== ElementType.QR_CODE) {
        return new Error(`Element ${element.base.id} is ${element.base.type}, not QR_CODE`);
      }

      return element;
    });
  };

  // ============================================================================
  // Find Operations (for standalone updates)
  // ============================================================================

  /**
   * Find qrCode element entity by elementId
   * Returns entity from qr_code_element table only
   */
  export const findById = async (id: number): Promise<QRCodeElementEntity | null> => {
    const qrCodeEl = await db.select().from(qrCodeElement).where(eq(qrCodeElement.elementId, id)).limit(1);

    if (qrCodeEl.length === 0 || !qrCodeEl[0]) return null;
    return qrCodeEl[0];
  };

  /**
   * Find qrCode element entity by elementId or throw error
   */
  export const findByIdOrThrow = async (id: number): Promise<QRCodeElementEntity> => {
    const qrCodeEl = await findById(id);
    if (!qrCodeEl) {
      throw new Error(`QRCode element with ID ${id} does not exist.`);
    }
    return qrCodeEl;
  };

  // ============================================================================
  // Update Helper Functions
  // ============================================================================

  /**
   * Update qr_code_element (type-specific table)
   * Returns updated entity
   * Note: qrCodeDataSource is stored in base element config, not in this table
   */
  const updateQRCodeElementSpecific = async (input: QRCodeElementUpdateInput): Promise<QRCodeElementEntity> => {
    const qrCodeUpdates: Partial<typeof qrCodeElement.$inferInsert> = {
      errorCorrection: input.qrCodeProps.errorCorrection,
      foregroundColor: input.qrCodeProps.foregroundColor,
      backgroundColor: input.qrCodeProps.backgroundColor,
    };

    const [updated] = await db
      .update(qrCodeElement)
      .set(qrCodeUpdates)
      .where(eq(qrCodeElement.elementId, input.id))
      .returning();

    if (!updated) throw new Error(`QR_CODE element with ID ${input.id} does not exist.`);

    return updated;
  };

  /**
   * Update only qrCodeProps of a QR_CODE element
   * Pattern: Load element → validate → update qr_code_element table → return response
   */
  export const updateSpecProps = async (
    input: QRCodeElementSpecPropsStandaloneUpdateInput
  ): Promise<QRCodeElementSpecPropsStandaloneUpdateResponse> => {
    // 1. Load existing element
    await findByIdOrThrow(input.elementId);
    await QRCodeElementUtils.checkSpecProps(input.qrCodeProps);

    // 3. Update qr_code_element (type-specific table)
    const updatedQRCodeElement = await db
      .update(qrCodeElement)
      .set({
        errorCorrection: input.qrCodeProps.errorCorrection,
        foregroundColor: input.qrCodeProps.foregroundColor,
        backgroundColor: input.qrCodeProps.backgroundColor,
      })
      .where(eq(qrCodeElement.elementId, input.elementId))
      .returning();

    if (!updatedQRCodeElement[0]) {
      throw new Error(`QR_CODE element with ID ${input.elementId} does not exist.`);
    }

    logger.info(`QR_CODE element specProps updated: (ID: ${input.elementId})`);

    return {
      elementId: input.elementId,
      qrCodeProps: {
        ...updatedQRCodeElement[0],
        errorCorrection: updatedQRCodeElement[0].errorCorrection as QRCodeErrorCorrection,
      },
    };
  };
}
