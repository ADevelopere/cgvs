import { db } from "@/server/db/drizzleDb";
import { eq } from "drizzle-orm";
import { certificateElement, dateElement, elementTextProps } from "@/server/db/schema";
import {
  DateElementCreateInput,
  DateElementUpdateInput,
  DateElementOutput,
  ElementType,
  DateDataSourceType,
  DateDataSource,
  DateDataSourceInput,
  CertificateElementEntityInput,
  DateElementEntity,
  ElementTextPropsEntity,
  CalendarType,
  DateTransformationType,
} from "@/server/types/element";
import { TextPropsRepository } from "./textProps.element.repository";
import { DateElementUtils, TextPropsUtils } from "@/server/utils";
import logger from "@/server/lib/logger";
import { ElementRepository } from ".";

/**
 * Repository for DATE element operations
 * Handles table-per-type architecture: certificate_element + date_element + element_text_props
 */
export namespace DateElementRepository {
  // ============================================================================
  // Create Operation
  // ============================================================================

  /**
   * Create a new DATE element
   * Pattern:
   * 1. Validate input
   * 2. Create TextProps → get textPropsId
   * 3. Extract variableId from dataSource
   * 4. Insert into certificate_element → get elementId
   * 5. Insert into date_element
   * 6. Load and return full output
   */
  export const create = async (
    input: DateElementCreateInput
  ): Promise<DateElementOutput> => {
    // 1. Validate input
    await DateElementUtils.validateCreateInput(input);

    // 2. Create TextProps
    const newTextProps = await TextPropsRepository.create(input.textProps);

    // 3. Convert input dataSource to output format and extract variableId
    const newDataSource = convertInputDataSourceToOutput(input.dataSource);
    const variableId = extractVariableIdFromDataSource(newDataSource);

    const baseInput: CertificateElementEntityInput = {
      ...input,
      type: ElementType.DATE,
    };

    // 4. Insert into certificate_element (base table)
    const [baseElement] = await db
      .insert(certificateElement)
      .values(baseInput)
      .returning();

    // 5. Insert into date_element (type-specific table)
    const [newDateElement] = await db
      .insert(dateElement)
      .values({
        elementId: baseElement.id,
        textPropsId: newTextProps.id,
        calendarType: input.calendarType,
        offsetDays: input.offsetDays,
        format: input.format,
        transformation: input.transformation ?? null,
        dateDataSource: newDataSource,
        variableId,
      })
      .returning();

    logger.info(
      `DATE element created: ${baseElement.name} (ID: ${baseElement.id})`
    );

    // 6. Load and return full output
    return {
      ...baseElement,
      elementId: newDateElement.elementId,
      textPropsId: newDateElement.textPropsId,
      textPropsEntity: newTextProps,
      textProps: TextPropsUtils.entityToTextProps(newTextProps),
      calendarType: newDateElement.calendarType as CalendarType,
      offsetDays: newDateElement.offsetDays,
      format: newDateElement.format,
      transformation:
        newDateElement.transformation as DateTransformationType | null,
      dateDataSource: newDataSource,
      variableId,
    };
  };

  // ============================================================================
  // Update Operation
  // ============================================================================

  /**
   * Update an existing DATE element
   * Pattern:
   * 1. Load existing element
   * 2. Validate type and input
   * 3. Update certificate_element (base table)
   * 4. Update element_text_props (if textProps provided)
   * 5. Update date_element (type-specific table)
   * 6. Return updated element
   */
  export const update = async (
    input: DateElementUpdateInput
  ): Promise<DateElementOutput> => {
    // 1. Load existing element
    const existing = await loadByIdOrThrow(input.id);

    // 2. Validate type
    if (existing.type !== ElementType.DATE) {
      throw new Error(
        `Element ${input.id} is ${existing.type}, not DATE. Use correct repository.`
      );
    }

    // 3. Validate update input
    await DateElementUtils.validateUpdateInput(input, existing);

    // 4. Update certificate_element (base table)
    const updatedBaseElement = await ElementRepository.updateBaseElement(
      input.id,
      input,
      existing
    );

    // 5. Update element_text_props (if textProps provided)
    const existingDateElement: DateElementEntity = existing;
    let updatedTextProps: ElementTextPropsEntity = existing.textPropsEntity;
    if (input.textProps !== undefined) {
      if (input.textProps === null) {
        throw new Error("textProps cannot be null for DATE element");
      }
      updatedTextProps = await TextPropsRepository.update(
        existing.textPropsId,
        input.textProps
      );
    }

    // 6. Update date_element (type-specific table)
    const updatedDateElement = await updateDateElementSpecific(
      input.id,
      input,
      existingDateElement
    );

    logger.info(
      `DATE element updated: ${updatedBaseElement.name} (ID: ${input.id})`
    );

    // 7. Return updated element
    return {
      ...updatedBaseElement,
      elementId: updatedDateElement.elementId,
      textPropsId: updatedDateElement.textPropsId,
      textPropsEntity: updatedTextProps,
      textProps: TextPropsUtils.entityToTextProps(updatedTextProps),
      calendarType: updatedDateElement.calendarType as CalendarType,
      offsetDays: updatedDateElement.offsetDays,
      format: updatedDateElement.format,
      transformation:
        updatedDateElement.transformation as DateTransformationType | null,
      dateDataSource: updatedDateElement.dateDataSource,
      variableId: updatedDateElement.variableId,
    };
  };

  // ============================================================================
  // Load Operations
  // ============================================================================

  /**
   * Load DATE element by ID with all joined data
   * Joins: certificate_element + date_element + element_text_props
   */
  export const loadById = async (
    id: number
  ): Promise<DateElementOutput | null> => {
    // Join all three tables
    const result = await db
      .select()
      .from(certificateElement)
      .innerJoin(dateElement, eq(dateElement.elementId, certificateElement.id))
      .innerJoin(
        elementTextProps,
        eq(elementTextProps.id, dateElement.textPropsId)
      )
      .where(eq(certificateElement.id, id))
      .limit(1);

    if (result.length === 0) return null;

    const row = result[0];

    // Reconstruct output
    return {
      // Base element fields
      ...row.certificate_element,
      // Date-specific fields
      ...row.date_element,
      textPropsEntity: row.element_text_props,
      textProps: TextPropsUtils.entityToTextProps(row.element_text_props),
      calendarType: row.date_element.calendarType as CalendarType,
      transformation: row.date_element
        .transformation as DateTransformationType | null,
      dateDataSource: row.date_element.dateDataSource,
      variableId: row.date_element.variableId,
    };
  };

  /**
   * Load DATE element by ID or throw error
   */
  export const loadByIdOrThrow = async (
    id: number
  ): Promise<DateElementOutput> => {
    const element = await loadById(id);
    if (!element) {
      throw new Error(`DATE element with ID ${id} does not exist.`);
    }
    return element;
  };

  /**
   * Load DATE elements by IDs for Pothos dataloader
   * Returns array with DateElementOutput or Error per ID
   */
  export const loadByIds = async (
    ids: number[]
  ): Promise<(DateElementOutput | Error)[]> => {
    if (ids.length === 0) return [];

    // Load all elements
    const results = await Promise.all(ids.map(id => loadById(id)));

    // Map to maintain order and handle missing elements
    return results.map((element, index) => {
      if (!element) {
        return new Error(`DATE element with ID ${ids[index]} does not exist.`);
      }

      // Validate element type
      if (element.type !== ElementType.DATE) {
        return new Error(`Element ${element.id} is ${element.type}, not DATE`);
      }

      return element;
    });
  };

  // ============================================================================
  // Update Helper Functions
  // ============================================================================

  /**
   * Update date_element (type-specific table)
   * Returns updated entity or existing if no changes
   */
  const updateDateElementSpecific = async (
    elementId: number,
    input: DateElementUpdateInput,
    existingDateElement: DateElementEntity
  ): Promise<DateElementEntity> => {
    const dateUpdates: Partial<typeof dateElement.$inferInsert> = {};

    // Handle calendarType update
    if (input.calendarType !== undefined) {
      if (input.calendarType === null) {
        throw new Error("calendarType cannot be null for DATE element");
      }
      dateUpdates.calendarType = input.calendarType;
    }

    // Handle offsetDays update
    if (input.offsetDays !== undefined) {
      if (input.offsetDays === null) {
        throw new Error("offsetDays cannot be null for DATE element");
      }
      dateUpdates.offsetDays = input.offsetDays;
    }

    // Handle format update
    if (input.format !== undefined) {
      if (input.format === null) {
        throw new Error("format cannot be null for DATE element");
      }
      dateUpdates.format = input.format;
    }

    // Handle transformation update
    if (input.transformation !== undefined) {
      dateUpdates.transformation = input.transformation;
    }

    // Handle dataSource update
    if (input.dataSource !== undefined) {
      if (input.dataSource === null) {
        throw new Error("dataSource cannot be null for DATE element");
      }
      const dataSource = convertInputDataSourceToOutput(input.dataSource);
      dateUpdates.dateDataSource = dataSource;
      dateUpdates.variableId = extractVariableIdFromDataSource(dataSource);
    }

    if (Object.keys(dateUpdates).length === 0) {
      return existingDateElement;
    }

    const [updated] = await db
      .update(dateElement)
      .set(dateUpdates)
      .where(eq(dateElement.elementId, elementId))
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
    input: DateDataSourceInput
  ): DateDataSource => {
    switch (input.type) {
      case DateDataSourceType.STATIC:
        return { type: input.type, value: input.value };

      case DateDataSourceType.STUDENT_DATE_FIELD:
        return { type: input.type, studentField: input.field };

      case DateDataSourceType.CERTIFICATE_DATE_FIELD:
        return { type: input.type, certificateField: input.field };

      case DateDataSourceType.TEMPLATE_DATE_VARIABLE:
        return { type: input.type, dateVariableId: input.variableId };

      default:
        throw new Error(`Invalid date data source type`);
    }
  };

  /**
   * Extract variableId from date data source (inline in repository)
   * Maps to correct TypeScript field name based on type
   */
  const extractVariableIdFromDataSource = (
    dataSource: DateDataSource
  ): number | null => {
    switch (dataSource.type) {
      case DateDataSourceType.TEMPLATE_DATE_VARIABLE:
        return dataSource.dateVariableId;
      default:
        return null;
    }
  };
}
