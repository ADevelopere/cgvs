import { db } from "@/server/db/drizzleDb";
import { eq } from "drizzle-orm";
import { certificateElement, qrCodeElement } from "@/server/db/schema";
import {
  QRCodeElementInput,
  QRCodeElementUpdateInput,
  QRCodeElementOutput,
  ElementType,
  QRCodeElementEntity,
  CertificateElementEntityInput,
  QRCodeErrorCorrection,
  QRCodeDataSource,
  QRCodeDataSourceType,
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
    input: QRCodeElementInput
  ): Promise<QRCodeElementOutput> => {
    // 1. Validate input
    await QRCodeElementUtils.validateInput(input);

    const baseInput: CertificateElementEntityInput = {
      ...input.base,
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
        errorCorrection: input.qrCodeProps.errorCorrection,
        foregroundColor: input.qrCodeProps.foregroundColor,
        backgroundColor: input.qrCodeProps.backgroundColor,
      })
      .returning();

    logger.info(
      `QR_CODE element created: ${baseElement.name} (ID: ${baseElement.id})`
    );

    // 4. Return full output
    const newDataSource = QRCodeElementUtils.convertInputDataSourceToOutput(
      input.dataSource
    );

    return {
      base: baseElement,
      qrCodeProps: {
        elementId: newQRCodeElement.elementId,
        errorCorrection: newQRCodeElement.errorCorrection as QRCodeErrorCorrection,
        foregroundColor: newQRCodeElement.foregroundColor,
        backgroundColor: newQRCodeElement.backgroundColor,
      },
      qrCodeDataSource: newDataSource,
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
    if (existing.base.type !== ElementType.QR_CODE) {
      throw new Error(
        `Element ${input.id} is ${existing.base.type}, not QR_CODE. Use correct repository.`
      );
    }

    // 3. Validate update input
    await QRCodeElementUtils.validateInput(input);

    // 4. Update certificate_element (base table)
    const updatedBaseElement = await ElementRepository.updateBaseElement(
      input.id,
      { ...input.base, id: input.id },
      existing.base
    );

    // 5. Update qr_code_element (type-specific table)
    const updatedQRCodeElement = await updateQRCodeElementSpecific(input);

    logger.info(
      `QR_CODE element updated: ${updatedBaseElement.name} (ID: ${input.id})`
    );

    // 6. Return updated element
    const newDataSource = QRCodeElementUtils.convertInputDataSourceToOutput(
      input.dataSource
    );

    return {
      base: updatedBaseElement,
      qrCodeProps: {
        elementId: updatedQRCodeElement.elementId,
        errorCorrection: updatedQRCodeElement.errorCorrection as QRCodeErrorCorrection,
        foregroundColor: updatedQRCodeElement.foregroundColor,
        backgroundColor: updatedQRCodeElement.backgroundColor,
      },
      qrCodeDataSource: newDataSource,
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
    // Note: qrCodeDataSource is stored in base element config JSONB, not in qr_code_element table
    // For now, derive it from config or use a default (this will be fixed when config is properly extracted)
    // TODO: Extract qrCodeDataSource from base element config JSONB
    const qrCodeDataSource: QRCodeDataSource = {
      type: QRCodeDataSourceType.VERIFICATION_URL,
    };

    return {
      base: row.certificate_element,
      qrCodeProps: {
        elementId: row.qr_code_element.elementId,
        errorCorrection: row.qr_code_element.errorCorrection as QRCodeErrorCorrection,
        foregroundColor: row.qr_code_element.foregroundColor,
        backgroundColor: row.qr_code_element.backgroundColor,
      },
      qrCodeDataSource,
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
      if (element.base.type !== ElementType.QR_CODE) {
        return new Error(
          `Element ${element.base.id} is ${element.base.type}, not QR_CODE`
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
   * Returns updated entity
   * Note: qrCodeDataSource is stored in base element config, not in this table
   */
  const updateQRCodeElementSpecific = async (
    input: QRCodeElementUpdateInput,
  ): Promise<QRCodeElementEntity> => {
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

    return updated;
  };
}
