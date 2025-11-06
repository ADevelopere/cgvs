import { db } from "@/server/db/drizzleDb";
import { eq } from "drizzle-orm";
import { certificateElement, textElement, elementTextProps } from "@/server/db/schema";
import * as ElType from "@/server/types/element";
import { TextElementUtils } from "@/server/utils";
import logger from "@/server/lib/logger";
import { ElementRepository, TextPropsRepository } from ".";

/**
 * Repository for TEXT element operations
 * Handles table-per-type architecture: certificate_element + text_element + element_text_props
 */
export namespace TextElementRepository {
  // ============================================================================
  // Create Operation
  // ============================================================================

  /**
   * Create a new TEXT element
   * Pattern:
   * 1. Validate input
   * 2. Create TextProps → get textPropsId
   * 3. Extract variableId from dataSource
   * 4. Insert into certificate_element → get elementId
   * 5. Insert into text_element
   * 6. Return full output
   */
  export const create = async (input: ElType.TextElementInput): Promise<ElType.TextElementOutput> => {
    // 1. Validate input
    await TextElementUtils.validateInput(input);

    // 2. Create TextProps
    const newTextProps = await TextPropsRepository.create(input.textProps);

    // 3. Convert input dataSource to output format and extract variableId
    const newDataSource = TextElementUtils.convertInputDataSourceToOutput(input.dataSource);
    const variableId = TextElementUtils.extractVariableIdFromDataSource(input.dataSource);

    const baseInput: ElType.CertificateElementEntityCreateInput = {
      ...input.base,
      type: ElType.ElementType.TEXT,
    };

    // 4. Insert into certificate_element (base table)
    const baseElement = await ElementRepository.createInternal(baseInput);

    // 5. Insert into text_element (type-specific table)
    const [newTextElement] = await db
      .insert(textElement)
      .values({
        elementId: baseElement.id,
        textPropsId: newTextProps.id,
        textDataSource: newDataSource,
        variableId,
      })
      .returning();

    logger.info(`TEXT element created: ${baseElement.name} (ID: ${baseElement.id})`);

    // 6. Return full output
    return {
      base: baseElement,
      textPropsEntity: newTextProps,
      textElementSpecProps: {
        elementId: newTextElement.elementId,
        textPropsId: newTextElement.textPropsId,
        variableId: newTextElement.variableId,
      },
      textDataSource: newDataSource,
    };
  };

  // ============================================================================
  // Update Operation
  // ============================================================================

  /**
   * Update an existing TEXT element
   * Pattern:
   * 1. Load existing element
   * 2. Validate type and input
   * 3. Update certificate_element (base table)
   * 4. Update element_text_props
   * 5. Update text_element (type-specific table)
   * 6. Return updated element
   */
  export const update = async (input: ElType.TextElementUpdateInput): Promise<ElType.TextElementOutput> => {
    // 1. Load existing element
    const existing = await loadByIdOrThrow(input.id);

    // 2. Validate type
    if (existing.base.type !== ElType.ElementType.TEXT) {
      throw new Error(`Element ${input.id} is ${existing.base.type}, not TEXT. Use correct repository.`);
    }

    // 3. Validate update input
    await TextElementUtils.validateInput(input);

    // 4. Update certificate_element (base table)
    const updatedBaseElement = await ElementRepository.updateBaseElement({ ...input.base, id: input.id }, true);

    // 5. Update element_text_props (full replace required)
    const updatedTextProps: ElType.ElementTextPropsEntity = await TextPropsRepository.update(
      {
        ...input.textProps,
        id: existing.textPropsEntity.id,
      },
      true
    );

    // 6. Update text_element (type-specific table)
    const updatedDataSource = await updateTextElementDataSourceInternal(input.dataSource, input.id);

    logger.info(`TEXT element updated: ${updatedBaseElement.name} (ID: ${input.id})`);

    // 7. Return updated element
    return {
      base: updatedBaseElement,
      textPropsEntity: updatedTextProps,
      textElementSpecProps: {
        elementId: existing.textElementSpecProps.elementId,
        textPropsId: existing.textElementSpecProps.textPropsId,
        variableId: updatedDataSource.variableId,
      },
      textDataSource: updatedDataSource.textDataSource,
    };
  };

  // ============================================================================
  // Load Operations
  // ============================================================================

  /**
   * Load TEXT element by ID with all joined data
   * Joins: certificate_element + text_element + element_text_props
   */
  export const loadById = async (id: number): Promise<ElType.TextElementOutput | null> => {
    // Join all three tables
    const result = await db
      .select()
      .from(certificateElement)
      .innerJoin(textElement, eq(textElement.elementId, certificateElement.id))
      .innerJoin(elementTextProps, eq(elementTextProps.id, textElement.textPropsId))
      .where(eq(certificateElement.id, id))
      .limit(1);

    if (result.length === 0) return null;

    const row = result[0];

    // Reconstruct output
    return {
      base: row.certificate_element,
      textPropsEntity: row.element_text_props,
      textElementSpecProps: {
        elementId: row.text_element.elementId,
        textPropsId: row.text_element.textPropsId,
        variableId: row.text_element.variableId,
      },
      textDataSource: row.text_element.textDataSource,
    };
  };

  /**
   * Load TEXT element by ID or throw error
   */
  export const loadByIdOrThrow = async (id: number): Promise<ElType.TextElementOutput> => {
    const element = await loadById(id);
    if (!element) {
      throw new Error(`TEXT element with ID ${id} does not exist.`);
    }
    return element;
  };

  export const loadByBase = async (base: ElType.CertificateElementEntity): Promise<ElType.TextElementOutput> => {
    const result = await db
      .select()
      .from(textElement)
      .innerJoin(elementTextProps, eq(elementTextProps.id, textElement.textPropsId))
      .where(eq(textElement.elementId, base.id))
      .limit(1);

    if (result.length === 0) throw new Error(`No TEXT element found for base ID ${base.id}`);

    const row = result[0];

    // Reconstruct output
    return {
      base: base,
      textPropsEntity: row.element_text_props,
      textElementSpecProps: {
        elementId: row.text_element.elementId,
        textPropsId: row.text_element.textPropsId,
        variableId: row.text_element.variableId,
      },
      textDataSource: row.text_element.textDataSource,
    };
  };

  /**
   * Load TEXT elements by IDs for Pothos dataloader
   * Returns array with TextElementOutput or Error per ID
   */
  export const loadByIds = async (ids: number[]): Promise<(ElType.TextElementOutput | Error)[]> => {
    if (ids.length === 0) return [];

    // Load all elements
    const results = await Promise.all(ids.map(id => loadById(id)));

    // Map to maintain order and handle missing elements
    return results.map((element, index) => {
      if (!element) {
        return new Error(`TEXT element with ID ${ids[index]} does not exist.`);
      }

      // Validate element type
      if (element.base.type !== ElType.ElementType.TEXT) {
        return new Error(`Element ${element.base.id} is ${element.base.type}, not TEXT`);
      }

      return element;
    });
  };

  export const findById = async (id: number): Promise<ElType.TextElementEntity | null> => {
    const [element] = await db.select().from(textElement).where(eq(textElement.elementId, id)).limit(1);

    return element ?? null;
  };

  export const findByIdOrThrow = async (id: number): Promise<ElType.TextElementEntity> => {
    const element = await findById(id);
    if (!element) {
      throw new Error(`Text element with ID ${id} does not exist.`);
    }
    return element;
  };

  // ============================================================================
  // Update Helper Functions
  // ============================================================================

  const updateTextElementDataSourceInternal = async (
    input: ElType.TextDataSourceInput,
    elementId: number
  ): Promise<ElType.TextDataSourceUpdateResponse> => {
    const newDataSource = TextElementUtils.convertInputDataSourceToOutput(input);
    const variableId = TextElementUtils.extractVariableIdFromDataSource(input);

    const textUpdates: Partial<typeof textElement.$inferInsert> = {
      textDataSource: newDataSource,
      variableId,
    };

    const [updated] = await db
      .update(textElement)
      .set(textUpdates)
      .where(eq(textElement.elementId, elementId))
      .returning();

    return {
      textDataSource: updated.textDataSource,
      variableId: updated.variableId,
      elementId: updated.elementId,
    };
  };

  export const updateTextElementDataSource = async (
    input: ElType.TextDataSourceStandaloneInput
  ): Promise<ElType.TextDataSourceUpdateResponse> => {
    await findByIdOrThrow(input.elementId);

    await TextElementUtils.validateDataSource(input.dataSource);

    return await updateTextElementDataSourceInternal(input.dataSource, input.elementId);
  };
}
