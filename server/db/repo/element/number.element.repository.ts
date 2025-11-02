import { db } from "@/server/db/drizzleDb";
import { eq } from "drizzle-orm";
import {
  certificateElement,
  numberElement,
  elementTextProps,
} from "@/server/db/schema";
import * as ElType from "@/server/types/element";
import { TextPropsRepository } from "./textProps.element.repository";
import { NumberElementUtils } from "@/server/utils";
import logger from "@/server/lib/logger";
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
   * 6. Return full output
   */
  export const create = async (
    input: ElType.NumberElementInput
  ): Promise<ElType.NumberElementOutput> => {
    // 1. Validate input
    await NumberElementUtils.validateInput(input);

    // 2. Create TextProps
    const newTextProps = await TextPropsRepository.create(input.textProps);

    // 3. Convert input dataSource to output format and extract variableId
    const newDataSource = NumberElementUtils.convertInputDataSourceToOutput(
      input.dataSource
    );
    const variableId = NumberElementUtils.extractVariableIdFromDataSource(
      input.dataSource
    );

    if (variableId === null) {
      throw new Error(
        "NUMBER element data source must include a variableId (TEMPLATE_NUMBER_VARIABLE)"
      );
    }

    const baseInput: ElType.CertificateElementEntityInput = {
      ...input.base,
      type: ElType.ElementType.NUMBER,
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
        mapping: input.numberProps.mapping,
        numberDataSource: newDataSource,
        variableId,
      })
      .returning();

    logger.info(
      `NUMBER element created: ${baseElement.name} (ID: ${baseElement.id})`
    );

    // 6. Return full output
    return {
      base: baseElement,
      textPropsEntity: newTextProps,
      numberProps: newNumberElement,
      numberDataSource: newDataSource,
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
   * 4. Update element_text_props
   * 5. Update number_element (type-specific table)
   * 6. Return updated element
   */
  export const update = async (
    input: ElType.NumberElementUpdateInput
  ): Promise<ElType.NumberElementOutput> => {
    // 1. Load existing element
    const existing = await loadByIdOrThrow(input.id);

    // 2. Validate type
    if (existing.base.type !== ElType.ElementType.NUMBER) {
      throw new Error(
        `Element ${input.id} is ${existing.base.type}, not NUMBER. Use correct repository.`
      );
    }

    // 3. Validate update input
    await NumberElementUtils.validateInput(input);

    // 4. Update certificate_element (base table)
    const updatedBaseElement = await ElementRepository.updateBaseElement(
      { ...input.base, id: input.id },
      true
    );

    // 5. Update element_text_props (full replace required)
    const updatedTextProps: ElType.ElementTextPropsEntity =
      await TextPropsRepository.update(
        {
          ...input.textProps,
          id: existing.textPropsEntity.id,
        },
        true
      );

    // 6. Update number_element (type-specific table)
    const updatedNumberElement =
      await updateNumberElementSpecPropsInternal(input);

    logger.info(
      `NUMBER element updated: ${updatedBaseElement.name} (ID: ${input.id})`
    );

    // 7. Return updated element
    return {
      base: updatedBaseElement,
      textPropsEntity: updatedTextProps,
      numberProps: updatedNumberElement,
      numberDataSource: updatedNumberElement.numberDataSource,
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
  ): Promise<ElType.NumberElementOutput | null> => {
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
      base: row.certificate_element,
      textPropsEntity: row.element_text_props,
      numberProps: row.number_element,
      numberDataSource: row.number_element.numberDataSource,
    };
  };

  export const loadByBase = async (
    base: ElType.CertificateElementEntity
  ): Promise<ElType.NumberElementOutput> => {
    // Join all three tables
    const result = await db
      .select()
      .from(numberElement)
      .innerJoin(
        elementTextProps,
        eq(elementTextProps.id, numberElement.textPropsId)
      )
      .where(eq(numberElement.elementId, base.id))
      .limit(1);

    if (result.length === 0)
      throw new Error(`NUMBER element with base ID ${base.id} does not exist.`);

    const row = result[0];

    // Reconstruct output
    return {
      base: base,
      textPropsEntity: row.element_text_props,
      numberProps: row.number_element,
      numberDataSource: row.number_element.numberDataSource,
    };
  };

  /**
   * Load NUMBER element by ID or throw error
   */
  export const loadByIdOrThrow = async (
    id: number
  ): Promise<ElType.NumberElementOutput> => {
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
  ): Promise<(ElType.NumberElementOutput | Error)[]> => {
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
      if (element.base.type !== ElType.ElementType.NUMBER) {
        return new Error(
          `Element ${element.base.id} is ${element.base.type}, not NUMBER`
        );
      }

      return element;
    });
  };

  export const findById = async (
    id: number
  ): Promise<ElType.NumberElementEntity | null> => {
    const result = await db
      .select()
      .from(numberElement)
      .where(eq(numberElement.elementId, id))
      .limit(1);

    if (result.length === 0) return null;

    return result[0];
  };

  export const findByIdOrThrow = async (
    id: number
  ): Promise<ElType.NumberElementEntity> => {
    const element = await findById(id);
    if (!element) {
      throw new Error(`NUMBER element with ID ${id} does not exist.`);
    }
    return element;
  };

  // ============================================================================
  // Update Helper Functions
  // ============================================================================

  const updateNumberElementSpecPropsInternal = async (
    input: ElType.NumberElementUpdateInput
  ): Promise<ElType.NumberElementEntity> => {
    const newDataSource = NumberElementUtils.convertInputDataSourceToOutput(
      input.dataSource
    );
    const variableId = NumberElementUtils.extractVariableIdFromDataSource(
      input.dataSource
    );

    if (variableId === null) {
      throw new Error(
        "NUMBER element data source must include a variableId (TEMPLATE_NUMBER_VARIABLE)"
      );
    }

    const numberUpdates: Partial<ElType.NumberElementEntityInput> = {
      mapping: input.numberProps.mapping,
      numberDataSource: newDataSource,
      variableId,
    };

    const [updated] = await db
      .update(numberElement)
      .set(numberUpdates)
      .where(eq(numberElement.elementId, input.id))
      .returning();

    return updated;
  };

  /**
   * Update number_element (type-specific table)
   * Returns updated entity
   */
  export const updateNumberElementDataSource = async (
    input: ElType.NumberElementDataSourceStandaloneUpdateInput
  ): Promise<ElType.NumberElementDataSourceUpdateResponse> => {
    await findByIdOrThrow(input.elementId);
    const newDataSource = NumberElementUtils.convertInputDataSourceToOutput(
      input.dataSource
    );
    const variableId = NumberElementUtils.extractVariableIdFromDataSource(
      input.dataSource
    );

    if (variableId === null) {
      throw new Error(
        "NUMBER element data source must include a variableId (TEMPLATE_NUMBER_VARIABLE)"
      );
    }

    const numberUpdates: Partial<ElType.NumberElementEntityInput> = {
      numberDataSource: newDataSource,
      variableId,
    };

    const [updated] = await db
      .update(numberElement)
      .set(numberUpdates)
      .where(eq(numberElement.elementId, input.elementId))
      .returning();

    return updated;
  };

  export const updateNumberElementSpecProps = async (
    input: ElType.NumberElementSpecPropsStandaloneUpdateInput
  ): Promise<ElType.NumberElementSpecPropsUpdateResponse> => {
    await findByIdOrThrow(input.elementId);

    const numberUpdates: Partial<ElType.NumberElementEntityInput> = {
      mapping: input.numberProps.mapping,
    };

    const [updated] = await db
      .update(numberElement)
      .set(numberUpdates)
      .where(eq(numberElement.elementId, input.elementId))
      .returning();

    return {
      elementId: updated.elementId,
      numberProps: updated,
    };
  };
}
