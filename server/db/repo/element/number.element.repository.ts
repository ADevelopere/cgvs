import { db } from "@/server/db/drizzleDb";
import { eq } from "drizzle-orm";
import { certificateElement, numberElement, elementTextProps } from "@/server/db/schema";
import {
  NumberElementCreateInput,
  NumberElementUpdateInput,
  NumberElementOutput,
  ElementType,
  NumberDataSource,
  NumberDataSourceInput,
  CertificateElementEntityInput,
  NumberElementEntity,
  ElementTextPropsEntity,
} from "@/server/types/element";
import { TextPropsRepository } from "./textProps.element.repository";
import { NumberElementUtils } from "@/server/utils";
import logger from "@/server/lib/logger";
import { TextPropsUtils } from "@/server/utils/element/textProps.utils";
import { ElementRepository } from ".";

/**
 * Repository for NUMBER element operations
 * Handles table-per-type architecture: certificate_element + number_element + element_text_props
 */
export namespace NumberElementRepository {
  // ============================================================================
  // Create Operation
  // ============================================================================

  /**
   * Create a new NUMBER element
   * Pattern:
   * 1. Validate input
   * 2. Create TextProps → get textPropsId
   * 3. Extract variableId from dataSource
   * 4. Insert into certificate_element → get elementId
   * 5. Insert into number_element
   * 6. Load and return full output
   */
  export const create = async (
    input: NumberElementCreateInput
  ): Promise<NumberElementOutput> => {
    // 1. Validate input
    await NumberElementUtils.validateCreateInput(input);

    // 2. Create TextProps
    const newTextProps = await TextPropsRepository.create(input.textProps);

    // 3. Convert input dataSource to output format and extract variableId
    const newDataSource = convertInputDataSourceToOutput(input.dataSource);
    const variableId = extractVariableIdFromDataSource(newDataSource);

    const baseInput: CertificateElementEntityInput = {
      ...input,
      type: ElementType.NUMBER,
    };

    // 4. Insert into certificate_element (base table)
    const [baseElement] = await db
      .insert(certificateElement)
      .values(baseInput)
      .returning();

    // 5. Insert into number_element (type-specific table)
    const [newNumberElement] = await db
      .insert(numberElement)
      .values({
        elementId: baseElement.id,
        textPropsId: newTextProps.id,
        mapping: input.mapping,
        numberDataSource: newDataSource,
        variableId,
      })
      .returning();

    logger.info(
      `NUMBER element created: ${baseElement.name} (ID: ${baseElement.id})`
    );

    // 6. Load and return full output
    return {
      ...baseElement,
      elementId: newNumberElement.elementId,
      textPropsId: newNumberElement.textPropsId,
      textPropsEntity: newTextProps,
      textProps: TextPropsUtils.entityToTextProps(newTextProps),
      mapping: newNumberElement.mapping,
      numberDataSource: newDataSource,
      variableId,
    };
  };

  // ============================================================================
  // Update Operation
  // ============================================================================

  /**
   * Update an existing NUMBER element
   * Pattern:
   * 1. Load existing element
   * 2. Validate type and input
   * 3. Update certificate_element (base table)
   * 4. Update element_text_props (if textProps provided)
   * 5. Update number_element (type-specific table)
   * 6. Return updated element
   */
  export const update = async (
    input: NumberElementUpdateInput
  ): Promise<NumberElementOutput> => {
    // 1. Load existing element
    const existing = await loadByIdOrThrow(input.id);

    // 2. Validate type
    if (existing.type !== ElementType.NUMBER) {
      throw new Error(
        `Element ${input.id} is ${existing.type}, not NUMBER. Use correct repository.`
      );
    }

    // 3. Validate update input
    await NumberElementUtils.validateUpdateInput(input, existing);

    // 4. Update certificate_element (base table)
    const updatedBaseElement = await ElementRepository.updateBaseElement(
      input.id,
      input,
      existing
    );

    // 5. Update element_text_props (if textProps provided)
    const existingNumberElement: NumberElementEntity = existing;
    let updatedTextProps: ElementTextPropsEntity = existing.textPropsEntity;
    if (input.textProps !== undefined) {
      if (input.textProps === null) {
        throw new Error("textProps cannot be null for NUMBER element");
      }
      updatedTextProps = await TextPropsRepository.update(
        existing.textPropsId,
        input.textProps
      );
    }

    // 6. Update number_element (type-specific table)
    const updatedNumberElement = await updateNumberElementSpecific(
      input.id,
      input,
      existingNumberElement
    );

    logger.info(
      `NUMBER element updated: ${updatedBaseElement.name} (ID: ${input.id})`
    );

    // 7. Return updated element
    return {
      ...updatedBaseElement,
      elementId: updatedNumberElement.elementId,
      textPropsId: updatedNumberElement.textPropsId,
      textPropsEntity: updatedTextProps,
      textProps: TextPropsUtils.entityToTextProps(updatedTextProps),
      mapping: updatedNumberElement.mapping,
      numberDataSource: updatedNumberElement.numberDataSource,
      variableId: updatedNumberElement.variableId,
    };
  };

  // ============================================================================
  // Load Operations
  // ============================================================================

  /**
   * Load NUMBER element by ID with all joined data
   * Joins: certificate_element + number_element + element_text_props
   */
  export const loadById = async (
    id: number
  ): Promise<NumberElementOutput | null> => {
    // Join all three tables
    const result = await db
      .select()
      .from(certificateElement)
      .innerJoin(
        numberElement,
        eq(numberElement.elementId, certificateElement.id)
      )
      .innerJoin(
        elementTextProps,
        eq(elementTextProps.id, numberElement.textPropsId)
      )
      .where(eq(certificateElement.id, id))
      .limit(1);

    if (result.length === 0) return null;

    const row = result[0];

    // Reconstruct output
    return {
      // Base element fields
      ...row.certificate_element,
      // Number-specific fields
      ...row.number_element,
      textPropsEntity: row.element_text_props,
      textProps: TextPropsUtils.entityToTextProps(row.element_text_props),
      mapping: row.number_element.mapping,
      numberDataSource: row.number_element.numberDataSource,
      variableId: row.number_element.variableId,
    };
  };

  /**
   * Load NUMBER element by ID or throw error
   */
  export const loadByIdOrThrow = async (
    id: number
  ): Promise<NumberElementOutput> => {
    const element = await loadById(id);
    if (!element) {
      throw new Error(`NUMBER element with ID ${id} does not exist.`);
    }
    return element;
  };

  /**
   * Load NUMBER elements by IDs for Pothos dataloader
   * Returns array with NumberElementOutput or Error per ID
   */
  export const loadByIds = async (
    ids: number[]
  ): Promise<(NumberElementOutput | Error)[]> => {
    if (ids.length === 0) return [];

    // Load all elements
    const results = await Promise.all(ids.map(id => loadById(id)));

    // Map to maintain order and handle missing elements
    return results.map((element, index) => {
      if (!element) {
        return new Error(
          `NUMBER element with ID ${ids[index]} does not exist.`
        );
      }

      // Validate element type
      if (element.type !== ElementType.NUMBER) {
        return new Error(
          `Element ${element.id} is ${element.type}, not NUMBER`
        );
      }

      return element;
    });
  };

  // ============================================================================
  // Update Helper Functions
  // ============================================================================

  /**
   * Update number_element (type-specific table)
   * Returns updated entity or existing if no changes
   */
  const updateNumberElementSpecific = async (
    elementId: number,
    input: NumberElementUpdateInput,
    existingNumberElement: NumberElementEntity
  ): Promise<NumberElementEntity> => {
    const numberUpdates: Partial<typeof numberElement.$inferInsert> = {};

    // Handle mapping update
    if (input.mapping !== undefined) {
      if (input.mapping === null) {
        throw new Error("mapping cannot be null for NUMBER element");
      }
      numberUpdates.mapping = input.mapping;
    }

    // Handle dataSource update
    if (input.dataSource !== undefined) {
      if (input.dataSource === null) {
        throw new Error("dataSource cannot be null for NUMBER element");
      }
      const dataSource = convertInputDataSourceToOutput(input.dataSource);
      numberUpdates.numberDataSource = dataSource;
      numberUpdates.variableId = extractVariableIdFromDataSource(dataSource);
    }

    if (Object.keys(numberUpdates).length === 0) {
      return existingNumberElement;
    }

    const [updated] = await db
      .update(numberElement)
      .set(numberUpdates)
      .where(eq(numberElement.elementId, elementId))
      .returning();

    return updated;
  };

  // ============================================================================
  // Helper Functions
  // ============================================================================

  /**
   * Convert input data source format to output format
   * Input uses 'variableId' property, output uses 'numberVariableId'
   */
  const convertInputDataSourceToOutput = (
    input: NumberDataSourceInput
  ): NumberDataSource => {
    return {
      type: input.type,
      numberVariableId: input.variableId,
    };
  };

  /**
   * Extract variableId from number data source (inline in repository)
   */
  const extractVariableIdFromDataSource = (
    dataSource: NumberDataSource
  ): number => {
    return dataSource.numberVariableId;
  };
}
