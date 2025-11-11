import { db } from "@/server/db/drizzleDb";
import { eq, inArray, asc, max, and, gt, lt, sql, lte, gte } from "drizzle-orm";
import { font, fontVariant, certificateElement, templateVariableBases } from "@/server/db/schema";
import {
  TextElementRepository,
  CountryElementRepository,
  DateElementRepository,
  GenderElementRepository,
  ImageElementRepository,
  NumberElementRepository,
  QRCodeElementRepository,
} from "@/server/db/repo";
import {
  CertificateElementEntity,
  CertificateElementBaseUpdateInput,
  CertificateElementInterface,
  CertificateElementUnion,
  ElementType,
  CertificateElementEntityCreateInput,
  IncreaseElementOrderInput,
  DecreaseElementOrderInput,
  ElementMoveInput,
} from "@/server/types/element";
import logger from "@/server/lib/logger";
import { TemplateRepository } from "../template.repository";
import { TemplateVariableType } from "@/server/types";
import { CommonElementUtils } from "@/server/utils";
import { getStorageService } from "@/server/storage/storage.service";

/**
 * Master repository for certificate elements
 * Provides generic CRUD operations and FK extraction helpers
 */
export namespace ElementRepository {
  /**
   * Update certificate_element (base table)
   * Returns updated entity or existing if no changes
   */
  export const updateBaseElement = async (
    input: CertificateElementBaseUpdateInput,
    validated: boolean = false
  ): Promise<CertificateElementEntity> => {
    if (!validated) {
      await findByIdOrThrow(input.id);
      await CommonElementUtils.checkBaseInput(input);
    }

    const [updated] = await db
      .update(certificateElement)
      .set(input)
      .where(eq(certificateElement.id, input.id))
      .returning();

    return updated;
  };
  // ============================================================================
  // Read Operations
  // ============================================================================

  /**
   * Find element by ID
   * @returns Element or null if not found
   */
  export const findById = async (id: number): Promise<CertificateElementEntity | null> => {
    const result = await db.select().from(certificateElement).where(eq(certificateElement.id, id)).limit(1);
    return result[0] || null;
  };

  /**
   * Find element by ID or throw error
   * @throws Error if element not found
   */
  export const findByIdOrThrow = async (id: number): Promise<CertificateElementEntity> => {
    const element = await findById(id);
    if (!element) {
      throw new Error(`Element with ID ${id} does not exist.`);
    }
    return element;
  };

  /**
   * Find all elements for a template, ordered by zIndex
   * Validates that template exists first
   * @throws Error if template doesn't exist
   */
  export const findByTemplateId = async (templateId: number): Promise<CertificateElementEntity[]> => {
    // Validate template exists first
    await validateTemplateId(templateId);

    return db
      .select()
      .from(certificateElement)
      .where(eq(certificateElement.templateId, templateId))
      .orderBy(asc(certificateElement.zIndex));
  };

  export const findMaxOrderInTemplate = async (templateId: number): Promise<number> => {
    const [{ maxOrder }] = await db
      .select({ maxOrder: max(certificateElement.zIndex) })
      .from(certificateElement)
      .where(eq(certificateElement.templateId, templateId));
    return maxOrder ?? 0;
  };

  // ============================================================================
  // Batch Read Operations (Dataloader Support)
  // ============================================================================

  /**
   * Load elements by IDs (for Pothos dataloader)
   * Maintains order and returns Error for missing elements
   */
  export const loadByIds = async (ids: number[]): Promise<CertificateElementInterface[]> => {
    if (ids.length === 0) return [];

    const elements = await db.select().from(certificateElement).where(inArray(certificateElement.id, ids));

    // Map to maintain order, return Error for missing
    return ids.map(id => {
      const found = elements.find(e => e.id === id);
      if (!found) {
        throw new Error(`Element with ID ${id} not found`);
        // return new Error(`Element with ID ${id} not found`)
      }
      return { base: found };
    });
  };

  /**
   * Load elements by template IDs (for Pothos dataloader)
   * Returns array of element arrays or Error, one per template ID
   */
  export const loadByTemplateIds = async (
    templateIds: number[]
    // The context argument is often passed by Pothos, even if unused
    // context: BaseContext
  ): Promise<(CertificateElementUnion[] | Error)[]> => {
    // <-- Return type changed
    if (templateIds.length === 0) return [];

    const baseElements = await db
      .select()
      .from(certificateElement)
      .where(inArray(certificateElement.templateId, templateIds))
      .orderBy(asc(certificateElement.zIndex));

    const elementsByTemplateId = new Map<number, CertificateElementEntity[]>();
    for (const base of baseElements) {
      if (!elementsByTemplateId.has(base.templateId)) {
        elementsByTemplateId.set(base.templateId, []);
      }
      elementsByTemplateId.get(base.templateId)!.push(base);
    }

    // Map over the original templateIds to preserve order
    const allGroupPromises = templateIds.map(async (id): Promise<CertificateElementUnion[] | Error> => {
      // <-- Inner promise type changed
      const groupBaseElements = elementsByTemplateId.get(id) || [];

      try {
        // This will now try to resolve all elements.
        // If *any* promise rejects, the .catch() block will handle it.
        const groupResultPromises = groupBaseElements.map(async (base): Promise<CertificateElementUnion> => {
          // <-- No | Error here
          switch (base.type) {
            case ElementType.COUNTRY:
              return await CountryElementRepository.loadByBase(base);
            case ElementType.DATE:
              return await DateElementRepository.loadByBase(base);
            case ElementType.GENDER:
              return await GenderElementRepository.loadByBase(base);
            case ElementType.IMAGE:
              return await ImageElementRepository.loadByBase(base);
            case ElementType.NUMBER:
              return await NumberElementRepository.loadByBase(base);
            case ElementType.QR_CODE:
              return await QRCodeElementRepository.loadByBase(base);
            case ElementType.TEXT:
              return await TextElementRepository.loadByBase(base);
          }
          // Throw an error instead of returning it
          // This will cause the Promise.all() to reject
          throw new Error(`Element type ${base.type} not implemented yet`);
        });

        // Wait for all elements in *this* group to be processed
        return await Promise.all(groupResultPromises);
      } catch (error) {
        // If any element fails (e.g., "not implemented"),
        // catch it and return a single Error for this entire group.
        return error instanceof Error ? error : new Error(String(error));
      }
    });

    // Wait for all the *group* promises to resolve
    return await Promise.all(allGroupPromises);
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
  export const validateTemplateId = async (templateId: number): Promise<void> => {
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
    const result = await db.select({ id: font.id }).from(font).where(eq(font.id, fontId)).limit(1);

    if (result.length === 0) {
      throw new Error(`Font with ID ${fontId} does not exist.`);
    }
  };

  /**
   * Validate font variant exists by ID
   * @throws Error if font variant doesn't exist
   */
  export const validateFontVariantId = async (fontVariantId: number): Promise<void> => {
    const result = await db
      .select({ id: fontVariant.id })
      .from(fontVariant)
      .where(eq(fontVariant.id, fontVariantId))
      .limit(1);

    if (result.length === 0) {
      throw new Error(`Font variant with ID ${fontVariantId} does not exist.`);
    }
  };

  /**
   * Validate template variable exists by ID
   * @throws Error if variable doesn't exist
   */
  export const checkTemplateVariableId = async (variableId: number, type: TemplateVariableType): Promise<void> => {
    const variable = await db
      .select({
        id: templateVariableBases.id,
        type: templateVariableBases.type,
      })
      .from(templateVariableBases)
      .where(eq(templateVariableBases.id, variableId))
      .limit(1);

    if (variable.length === 0) {
      throw new Error(`Template variable with ID ${variableId} does not exist.`);
    }

    if (variable[0].type !== type) {
      throw new Error(`Template variable with ID ${variableId} is not of type ${type}.`);
    }
  };

  /**
   * Validate storage file exists by ID
   * @throws Error if file doesn't exist
   */
  export const validateStorageFilePath = async (filePath: string): Promise<void> => {
    const storageService = await getStorageService();
    const exists = await storageService.fileExists(filePath);
    if (!exists) {
      throw new Error(`Storage file with path ${filePath} does not exist.`);
    }
  };

  // ============================================================================
  // Config Validation
  // ============================================================================

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

    logger.info(`Element deleted: ${element.name} (ID: ${id}, Type: ${element.type})`);
  };

  /**
   * Delete multiple elements by IDs (for template deletion)
   */
  export const deleteByIds = async (ids: number[]): Promise<void> => {
    if (ids.length === 0) return;

    await db.delete(certificateElement).where(inArray(certificateElement.id, ids));

    logger.info(`Deleted ${ids.length} element(s)`);
  };

  // ============================================================================
  // Mutations
  // ============================================================================

  export const createInternal = async (
    input: CertificateElementEntityCreateInput
  ): Promise<CertificateElementEntity> => {
    const newOrder = (await findMaxOrderInTemplate(input.templateId)) + 1;
    const [newBaseElement] = await db
      .insert(certificateElement)
      .values({
        ...input,
        zIndex: newOrder,
      })
      .returning();

    return newBaseElement;
  };

  /**
   * Updates the render order of a single element based on a drag-and-drop action,
   * validates the new position, and returns all affected elements.
   * This will shift other elements within the same template to accommodate the new order.
   *
   * @param input - The element to move and its new render order.
   * @returns A promise that resolves to an array of all elements with updated orders.
   */
  export const moveElement = async (input: ElementMoveInput): Promise<CertificateElementInterface[]> => {
    const { elementId, newZIndex } = input;

    const updatedElements = await db.transaction(async tx => {
      // 1. Get the element being moved to find its current order and templateId
      const elementToMove = await findByIdOrThrow(elementId);
      const oldZIndex = elementToMove.zIndex;
      const templateId = elementToMove.templateId;

      // If order hasn't changed, do nothing.
      if (oldZIndex === newZIndex) {
        return [];
      }

      // 2. Validate the new render order
      const maxOrder = await findMaxOrderInTemplate(templateId);
      if (newZIndex < 1 || newZIndex > maxOrder) {
        throw new Error(`Invalid new render order: ${newZIndex}. Must be between 1 and ${maxOrder}.`);
      }

      let affectedSiblings: CertificateElementEntity[] = [];

      // 3. Shift the affected elements
      if (oldZIndex < newZIndex) {
        // Moved DOWN the list (e.g., from 2 to 5)
        // Decrement the order of elements between the old and new position
        affectedSiblings = await tx
          .update(certificateElement)
          .set({
            zIndex: sql`${certificateElement.zIndex} - 1`,
            updatedAt: new Date(),
          })
          .where(
            and(
              eq(certificateElement.templateId, templateId),
              gt(certificateElement.zIndex, oldZIndex),
              lte(certificateElement.zIndex, newZIndex)
            )
          )
          .returning();
      } else {
        // Moved UP the list (e.g., from 5 to 2)
        // Increment the order of elements between the new and old position
        affectedSiblings = await tx
          .update(certificateElement)
          .set({
            zIndex: sql`${certificateElement.zIndex} + 1`,
            updatedAt: new Date(),
          })
          .where(
            and(
              eq(certificateElement.templateId, templateId),
              lt(certificateElement.zIndex, oldZIndex),
              gte(certificateElement.zIndex, newZIndex)
            )
          )
          .returning();
      }

      // 4. Update the moved element's order
      const [movedElement] = await tx
        .update(certificateElement)
        .set({
          zIndex: newZIndex,
          updatedAt: new Date(),
        })
        .where(eq(certificateElement.id, elementId))
        .returning();

      return [...affectedSiblings, movedElement];
    });

    logger.info(
      `Moved element ID ${elementId} to render order ${newZIndex}. Affected ${updatedElements.length} element(s).`
    );

    return updatedElements.map(el => ({ base: el }));
  };

  /**
   * Increase the render order of an element (move it down the list).
   */
  export const increaseElementOrder = async (
    input: IncreaseElementOrderInput
  ): Promise<CertificateElementInterface[]> => {
    const { elementId } = input;
    const element = await findByIdOrThrow(elementId);
    const maxOrder = await findMaxOrderInTemplate(element.templateId);

    if (element.zIndex < maxOrder) {
      return await moveElement({ elementId, newZIndex: element.zIndex + 1 });
    }
    return [];
  };

  /**
   * Decrease the render order of an element (move it up the list).
   */
  export const decreaseElementOrder = async (
    input: DecreaseElementOrderInput
  ): Promise<CertificateElementInterface[]> => {
    const { elementId } = input;
    const element = await findByIdOrThrow(elementId);

    if (element.zIndex > 1) {
      return await moveElement({ elementId, newZIndex: element.zIndex - 1 });
    }
    return [];
  };
}
