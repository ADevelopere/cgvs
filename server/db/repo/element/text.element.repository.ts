import { db } from "@/server/db/drizzleDb";
import { eq } from "drizzle-orm";
import {
  certificateElement,
  textElement,
  elementTextProps,
} from "@/server/db/schema";
import {
  TextElementInput,
  TextElementUpdateInput,
  TextElementOutput,
  ElementType,
  TextElementEntity,
  ElementTextPropsEntity,
  CertificateElementEntity,
  CertificateElementEntityInput,
} from "@/server/types/element";
import { TextPropsRepository } from "./textProps.element.repository";
import { TextElementUtils } from "@/server/utils";
import logger from "@/server/lib/logger";
import { ElementRepository } from ".";

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
  export const create = async (
    input: TextElementInput
  ): Promise<TextElementOutput> => {
    // 1. Validate input
    await TextElementUtils.validateInput(input);

    // 2. Create TextProps
    const newTextProps = await TextPropsRepository.create(input.textProps);

    // 3. Convert input dataSource to output format and extract variableId
    const newDataSource = TextElementUtils.convertInputDataSourceToOutput(
      input.dataSource
    );
    const variableId = TextElementUtils.extractVariableIdFromDataSource(
      input.dataSource
    );

    const baseInput: CertificateElementEntityInput = {
      ...input.base,
      type: ElementType.TEXT,
    };

    // 4. Insert into certificate_element (base table)
    const [baseElement] = await db
      .insert(certificateElement)
      .values(baseInput)
      .returning();

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

    logger.info(
      `TEXT element created: ${baseElement.name} (ID: ${baseElement.id})`
    );

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
  export const update = async (
    input: TextElementUpdateInput
  ): Promise<TextElementOutput> => {
    // 1. Load existing element
    const existing = await loadByIdOrThrow(input.id);

    // 2. Validate type
    if (existing.base.type !== ElementType.TEXT) {
      throw new Error(
        `Element ${input.id} is ${existing.base.type}, not TEXT. Use correct repository.`
      );
    }

    // 3. Validate update input
    await TextElementUtils.validateInput(input);

    // 4. Update certificate_element (base table)
    const updatedBaseElement = await ElementRepository.updateBaseElement(
      input.id,
      { ...input.base, id: input.id },
      existing.base
    );

    // 5. Update element_text_props (full replace required)
    const updatedTextProps: ElementTextPropsEntity =
      await TextPropsRepository.update(existing.textPropsEntity.id, {
        ...input.textProps,
        id: existing.textPropsEntity.id,
      });

    // 6. Update text_element (type-specific table)
    const updatedTextElement = await updateTextElementSpecific(input);

    logger.info(
      `TEXT element updated: ${updatedBaseElement.name} (ID: ${input.id})`
    );

    // 7. Return updated element
    return {
      base: updatedBaseElement,
      textPropsEntity: updatedTextProps,
      textElementSpecProps: {
        elementId: updatedTextElement.elementId,
        textPropsId: updatedTextElement.textPropsId,
        variableId: updatedTextElement.variableId,
      },
      textDataSource: updatedTextElement.textDataSource,
    };
  };

  // ============================================================================
  // Load Operations
  // ============================================================================

  /**
   * Load TEXT element by ID with all joined data
   * Joins: certificate_element + text_element + element_text_props
   */
  export const loadById = async (
    id: number
  ): Promise<TextElementOutput | null> => {
    // Join all three tables
    const result = await db
      .select()
      .from(certificateElement)
      .innerJoin(textElement, eq(textElement.elementId, certificateElement.id))
      .innerJoin(
        elementTextProps,
        eq(elementTextProps.id, textElement.textPropsId)
      )
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
  export const loadByIdOrThrow = async (
    id: number
  ): Promise<TextElementOutput> => {
    const element = await loadById(id);
    if (!element) {
      throw new Error(`TEXT element with ID ${id} does not exist.`);
    }
    return element;
  };

  export const loadByBase = async (
    base: CertificateElementEntity
  ): Promise<TextElementOutput> => {
    const result = await db
      .select()
      .from(textElement)
      .innerJoin(elementTextProps, eq(elementTextProps.id, base.id))
      .where(eq(textElement.elementId, base.id))
      .limit(1);

    if (result.length === 0)
      throw new Error(`No TEXT element found for base ID ${base.id}`);

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
  export const loadByIds = async (
    ids: number[]
  ): Promise<(TextElementOutput | Error)[]> => {
    if (ids.length === 0) return [];

    // Load all elements
    const results = await Promise.all(ids.map(id => loadById(id)));

    // Map to maintain order and handle missing elements
    return results.map((element, index) => {
      if (!element) {
        return new Error(`TEXT element with ID ${ids[index]} does not exist.`);
      }

      // Validate element type
      if (element.base.type !== ElementType.TEXT) {
        return new Error(
          `Element ${element.base.id} is ${element.base.type}, not TEXT`
        );
      }

      return element;
    });
  };

  // ============================================================================
  // Update Helper Functions
  // ============================================================================

  /**
   * Update text_element (type-specific table)
   * Returns updated entity
   */
  const updateTextElementSpecific = async (
    input: TextElementUpdateInput
  ): Promise<TextElementEntity> => {
    const newDataSource = TextElementUtils.convertInputDataSourceToOutput(
      input.dataSource
    );
    const variableId = TextElementUtils.extractVariableIdFromDataSource(
      input.dataSource
    );

    const textUpdates: Partial<typeof textElement.$inferInsert> = {
      textDataSource: newDataSource,
      variableId,
    };

    const [updated] = await db
      .update(textElement)
      .set(textUpdates)
      .where(eq(textElement.elementId, input.id))
      .returning();

    return updated;
  };
}
