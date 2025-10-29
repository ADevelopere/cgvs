import { db } from "@/server/db/drizzleDb";
import { eq } from "drizzle-orm";
import { certificateElement , textElement, elementTextProps} from "@/server/db/schema";
import {
  TextElementCreateInput,
  TextElementUpdateInput,
  TextElementOutput,
  ElementType,
  TextDataSourceType,
  TextDataSource,
  TextDataSourceInput,
  CertificateElementEntityInput,
  TextElementEntity,
  ElementTextPropsEntity,
} from "@/server/types/element";
import { TextPropsRepository } from "./textProps.element.repository";
import { TextElementUtils } from "@/server/utils";
import logger from "@/server/lib/logger";
import { TextPropsUtils } from "@/server/utils/element/textProps.utils";
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
   * 6. Load and return full output
   */
  export const create = async (
    input: TextElementCreateInput
  ): Promise<TextElementOutput> => {
    // 1. Validate input
    await TextElementUtils.validateCreateInput(input);

    // 2. Create TextProps
    const newTextProps = await TextPropsRepository.create(input.textProps);

    // 3. Convert input dataSource to output format and extract variableId
    const newDataSource = convertInputDataSourceToOutput(input.dataSource);
    const variableId = extractVariableIdFromDataSource(newDataSource);

    const baseInput: CertificateElementEntityInput = {
      ...input,
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

    // 6. Load and return full output
    return {
      ...baseElement,
      elementId: newTextElement.elementId,
      textPropsId: newTextElement.textPropsId,
      textPropsEntity: newTextProps,
      textProps: TextPropsUtils.entityToTextProps(newTextProps),
      textDataSource: newDataSource,
      variableId,
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
   * 4. Update element_text_props (if textProps provided)
   * 5. Update text_element (type-specific table)
   * 6. Return updated element
   */
  export const update = async (
    input: TextElementUpdateInput
  ): Promise<TextElementOutput> => {
    // 1. Load existing element
    const existing = await loadByIdOrThrow(input.id);

    // 2. Validate type
    if (existing.type !== ElementType.TEXT) {
      throw new Error(
        `Element ${input.id} is ${existing.type}, not TEXT. Use correct repository.`
      );
    }

    // 3. Validate update input
    await TextElementUtils.validateUpdateInput(input, existing);

    // 4. Update certificate_element (base table)
    const updatedBaseElement = await ElementRepository.updateBaseElement(
      input.id,
      input,
      existing
    );


    // 5. Update element_text_props (if textProps provided)
    const existingTextElement: TextElementEntity = existing;
    let updatedTextProps: ElementTextPropsEntity = existing.textPropsEntity;
    if (input.textProps !== undefined) {
      if (input.textProps === null) {
        throw new Error("textProps cannot be null for TEXT element");
      }
      updatedTextProps = await TextPropsRepository.update(
        existing.textPropsId,
        input.textProps
      );
    }

    // 6. Update text_element (type-specific table)
    const updatedTextElement = await updateTextElementSpecific(
      input.id,
      input,
      existingTextElement
    );

    logger.info(
      `TEXT element updated: ${updatedBaseElement.name} (ID: ${input.id})`
    );

    // 7. Return updated element
    return {
      ...updatedBaseElement,
      elementId: updatedTextElement.elementId,
      textPropsId: updatedTextElement.textPropsId,
      textPropsEntity: updatedTextProps,
      textProps: TextPropsUtils.entityToTextProps(updatedTextProps),
      textDataSource: updatedTextElement.textDataSource,
      variableId: updatedTextElement.variableId,
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
      // Base element fields
      ...row.certificate_element,
      // Text-specific fields
      ...row.text_element,
      textPropsEntity: row.element_text_props,
      textProps: TextPropsUtils.entityToTextProps(row.element_text_props),
      textDataSource: row.text_element.textDataSource,
      variableId: row.text_element.variableId,
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
      if (element.type !== ElementType.TEXT) {
        return new Error(`Element ${element.id} is ${element.type}, not TEXT`);
      }

      return element;
    });
  };

  // ============================================================================
  // Update Helper Functions
  // ============================================================================

  /**
   * Update text_element (type-specific table)
   * Returns updated entity or existing if no changes
   */
  const updateTextElementSpecific = async (
    elementId: number,
    input: TextElementUpdateInput,
    existingTextElement: TextElementEntity
  ): Promise<TextElementEntity> => {
    const textUpdates: Partial<typeof textElement.$inferInsert> = {};

    // Handle dataSource update
    if (input.dataSource !== undefined) {
      if (input.dataSource === null) {
        throw new Error("dataSource cannot be null for TEXT element");
      }
      const dataSource = convertInputDataSourceToOutput(input.dataSource);
      textUpdates.textDataSource = dataSource;
      textUpdates.variableId = extractVariableIdFromDataSource(dataSource);
    }

    if (Object.keys(textUpdates).length === 0) {
      return existingTextElement;
    }

    const [updated] = await db
      .update(textElement)
      .set(textUpdates)
      .where(eq(textElement.elementId, elementId))
      .returning();

    return updated;
  };

  // ============================================================================
  // Helper Functions
  // ============================================================================

  /**
   * Convert input data source format to output format
   * Input uses 'field' property, output uses 'studentField'/'certificateField'
   */
  const convertInputDataSourceToOutput = (
    input: TextDataSourceInput
  ): TextDataSource => {
    switch (input.type) {
      case TextDataSourceType.STATIC:
        return { type: input.type, value: input.value };

      case TextDataSourceType.STUDENT_TEXT_FIELD:
        return { type: input.type, studentField: input.field };

      case TextDataSourceType.CERTIFICATE_TEXT_FIELD:
        return { type: input.type, certificateField: input.field };

      case TextDataSourceType.TEMPLATE_TEXT_VARIABLE:
        return { type: input.type, textVariableId: input.variableId };

      case TextDataSourceType.TEMPLATE_SELECT_VARIABLE:
        return { type: input.type, selectVariableId: input.variableId };

      default:
        throw new Error(`Invalid text data source type`);
    }
  };

  /**
   * Extract variableId from text data source (inline in repository)
   * Maps to correct TypeScript field name based on type
   */
  const extractVariableIdFromDataSource = (
    dataSource: TextDataSource
  ): number | null => {
    switch (dataSource.type) {
      case TextDataSourceType.TEMPLATE_TEXT_VARIABLE:
        return dataSource.textVariableId;
      case TextDataSourceType.TEMPLATE_SELECT_VARIABLE:
        return dataSource.selectVariableId;
      default:
        return null;
    }
  };
}
