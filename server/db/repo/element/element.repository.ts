import { db } from "@/server/db/drizzleDb";
import { eq, inArray, asc } from "drizzle-orm";
import { certificateElement } from "@/server/db/schema/certificateElements/certificateElement";
import { font } from "@/server/db/schema/font";
import { templateVariableBases } from "@/server/db/schema/templateVariables";
import { storageFiles } from "@/server/db/schema/storage";
import {
  CertificateElementEntity,
  ElementConfig,
  ElementType,
  FontSource,
  ElementOrderUpdateInput,
} from "@/server/types/element";
import logger from "@/server/lib/logger";
import { TemplateRepository } from "../template.repository";

/**
 * Master repository for certificate elements
 * Provides generic CRUD operations and FK extraction helpers
 */
export namespace ElementRepository {
  // ============================================================================
  // Read Operations
  // ============================================================================

  /**
   * Find element by ID
   * @returns Element or null if not found
   */
  export const findById = async (
    id: number
  ): Promise<CertificateElementEntity | null> => {
    const result = await db
      .select()
      .from(certificateElement)
      .where(eq(certificateElement.id, id))
      .limit(1);
    return result[0] || null;
  };

  /**
   * Find element by ID or throw error
   * @throws Error if element not found
   */
  export const findByIdOrThrow = async (
    id: number
  ): Promise<CertificateElementEntity> => {
    const element = await findById(id);
    if (!element) {
      throw new Error(`Element with ID ${id} does not exist.`);
    }
    return element;
  };

  /**
   * Find all elements for a template, ordered by renderOrder
   * Validates that template exists first
   * @throws Error if template doesn't exist
   */
  export const findByTemplateId = async (
    templateId: number
  ): Promise<CertificateElementEntity[]> => {
    // Validate template exists first
    await validateTemplateId(templateId);

    return db
      .select()
      .from(certificateElement)
      .where(eq(certificateElement.templateId, templateId))
      .orderBy(asc(certificateElement.renderOrder));
  };

  // ============================================================================
  // Batch Read Operations (Dataloader Support)
  // ============================================================================

  /**
   * Load elements by IDs (for Pothos dataloader)
   * Maintains order and returns Error for missing elements
   */
  export const loadByIds = async (
    ids: number[]
  ): Promise<(CertificateElementEntity | Error)[]> => {
    if (ids.length === 0) return [];

    const elements = await db
      .select()
      .from(certificateElement)
      .where(inArray(certificateElement.id, ids));

    // Map to maintain order, return Error for missing
    return ids.map(id => {
      const found = elements.find(e => e.id === id);
      return found || new Error(`Element with ID ${id} not found`);
    });
  };

  /**
   * Load elements by template IDs (for Pothos dataloader)
   * Returns array of element arrays or Error, one per template ID
   */
  export const loadByTemplateIds = async (
    templateIds: number[]
  ): Promise<(CertificateElementEntity[] | Error)[]> => {
    if (templateIds.length === 0) return [];

    const elements = await db
      .select()
      .from(certificateElement)
      .where(inArray(certificateElement.templateId, templateIds))
      .orderBy(asc(certificateElement.renderOrder));

    // Group by templateId, maintaining order, return Error if no elements found could indicate invalid template
    return templateIds.map(templateId => {
      const templateElements = elements.filter(
        element => element.templateId === templateId
      );
      // Return the elements array (empty array is valid for templates with no elements)
      return templateElements;
    });
  };

  // ============================================================================
  // Validation Operations
  // ============================================================================

  /**
   * Check if element exists by ID
   */
  export const existsById = async (id: number): Promise<boolean> => {
    const result = await db
      .select({ id: certificateElement.id })
      .from(certificateElement)
      .where(eq(certificateElement.id, id))
      .limit(1);
    return result.length > 0;
  };

  /**
   * Validate that a template exists before creating elements
   * @throws Error if template doesn't exist
   */
  export const validateTemplateId = async (
    templateId: number
  ): Promise<void> => {
    const exists = await TemplateRepository.existsById(templateId);
    if (!exists) {
      throw new Error(`Template with ID ${templateId} does not exist.`);
    }
  };

  // ============================================================================
  // FK Reference Validation
  // ============================================================================

  /**
   * Validate font exists by ID
   * @throws Error if font doesn't exist
   */
  export const validateFontId = async (fontId: number): Promise<void> => {
    const result = await db
      .select({ id: font.id })
      .from(font)
      .where(eq(font.id, fontId))
      .limit(1);

    if (result.length === 0) {
      throw new Error(`Font with ID ${fontId} does not exist.`);
    }
  };

  /**
   * Validate template variable exists by ID
   * @throws Error if variable doesn't exist
   */
  export const validateTemplateVariableId = async (
    variableId: number
  ): Promise<void> => {
    const result = await db
      .select({ id: templateVariableBases.id })
      .from(templateVariableBases)
      .where(eq(templateVariableBases.id, variableId))
      .limit(1);

    if (result.length === 0) {
      throw new Error(
        `Template variable with ID ${variableId} does not exist.`
      );
    }
  };

  /**
   * Validate storage file exists by ID
   * @throws Error if file doesn't exist
   */
  export const validateStorageFileId = async (
    fileId: number
  ): Promise<void> => {
    const result = await db
      .select({ id: storageFiles.id })
      .from(storageFiles)
      .where(eq(storageFiles.id, BigInt(fileId)))
      .limit(1);

    if (result.length === 0) {
      throw new Error(`Storage file with ID ${fileId} does not exist.`);
    }
  };

  // ============================================================================
  // Config Validation
  // ============================================================================

  /**
   * Validate all FK references in element config
   * Checks that fonts, variables, and files referenced in config actually exist
   * @throws Error if any reference is invalid
   */
  export const validateConfigReferences = async (
    config: ElementConfig
  ): Promise<void> => {
    // Validate font reference (for text-based elements)
    if ("textProps" in config) {
      const { textProps } = config;
      if (textProps.fontRef.type === FontSource.SELF_HOSTED) {
        await validateFontId(textProps.fontRef.fontId);
      }
    }

    // Validate template variable reference
    if ("dataSource" in config) {
      const { dataSource } = config;
      if ("variableId" in dataSource) {
        await validateTemplateVariableId(dataSource.variableId);
      }
    }

    // Validate storage file reference (for IMAGE elements)
    if (config.type === ElementType.IMAGE) {
      await validateStorageFileId(config.dataSource.storageFileId);
    }
  };

  // ============================================================================
  // Delete Operations
  // ============================================================================

  /**
   * Delete element by ID
   * @throws Error if element doesn't exist
   */
  export const deleteById = async (id: number): Promise<void> => {
    const element = await findByIdOrThrow(id);

    await db.delete(certificateElement).where(eq(certificateElement.id, id));

    logger.info(
      `Element deleted: ${element.name} (ID: ${id}, Type: ${element.type})`
    );
  };

  /**
   * Delete multiple elements by IDs (for template deletion)
   */
  export const deleteByIds = async (ids: number[]): Promise<void> => {
    if (ids.length === 0) return;

    await db
      .delete(certificateElement)
      .where(inArray(certificateElement.id, ids));

    logger.info(`Deleted ${ids.length} element(s)`);
  };

  // ============================================================================
  // Batch Operations
  // ============================================================================

  /**
   * Update render order for multiple elements in a single transaction
   */
  export const updateRenderOrder = async (
    updates: ElementOrderUpdateInput[]
  ): Promise<void> => {
    if (updates.length === 0) return;

    // Execute all updates in a transaction
    await db.transaction(async tx => {
      for (const update of updates) {
        await tx
          .update(certificateElement)
          .set({
            renderOrder: update.renderOrder,
            updatedAt: new Date(),
          })
          .where(eq(certificateElement.id, update.id));
      }
    });

    logger.info(`Updated render order for ${updates.length} element(s)`);
  };
}
