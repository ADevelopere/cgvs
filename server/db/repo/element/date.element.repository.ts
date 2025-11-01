import { db } from "@/server/db/drizzleDb";
import { eq } from "drizzle-orm";
import {
  certificateElement,
  dateElement,
  elementTextProps,
} from "@/server/db/schema";
import {
  DateElementInput,
  DateElementUpdateInput,
  DateElementOutput,
  ElementType,
  CertificateElementEntityInput,
  DateElementEntity,
  ElementTextPropsEntity,
  CalendarType,
  DateTransformationType,
  DateElementEntityInput,
  CertificateElementEntity,
} from "@/server/types/element";
import { TextPropsRepository } from "./textProps.element.repository";
import { DateElementUtils } from "@/server/utils";
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
    input: DateElementInput
  ): Promise<DateElementOutput> => {
    // 1. Validate input
    await DateElementUtils.validateInput(input);

    // 2. Create TextProps
    const newTextProps = await TextPropsRepository.create(input.textProps);

    const variableId = DateElementUtils.extractVariableIdFromDataSource(
      input.dataSource
    );

    const baseInput: CertificateElementEntityInput = {
      ...input.base,
      type: ElementType.DATE,
    };

    // 4. Insert into certificate_element (base table)
    const [newBaseElement] = await db
      .insert(certificateElement)
      .values(baseInput)
      .returning();

    // 5. Insert into date_element (type-specific table)
    const [newDateElement] = await db
      .insert(dateElement)
      .values({
        elementId: newBaseElement.id,
        textPropsId: newTextProps.id,
        calendarType: input.dateProps.calendarType,
        offsetDays: input.dateProps.offsetDays ?? undefined,
        format: input.dateProps.format,
        transformation: input.dateProps.transformation ?? null,
        dateDataSource: DateElementUtils.convertInputDataSourceToOutput(
          input.dataSource
        ),
        variableId,
      })
      .returning();

    logger.info(
      `DATE element created: ${newBaseElement.name} (ID: ${newBaseElement.id})`
    );

    // 6. Load and return full output
    return {
      base: newBaseElement,
      textPropsEntity: newTextProps,
      dateProps: {
        ...newDateElement,
        elementId: newDateElement.elementId,
        calendarType: newDateElement.calendarType as CalendarType,
        transformation:
          newDateElement.transformation as DateTransformationType | null,
      },
      dateDataSource: newDateElement.dateDataSource,
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
    if (existing.base.type !== ElementType.DATE) {
      throw new Error(
        `Element ${input.id} is ${existing.base.type}, not DATE. Use correct repository.`
      );
    }

    // 3. Validate update input
    await DateElementUtils.validateInput(input);

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

    const updatedDateElement = await updateDateElementSpecific(input);

    logger.info(
      `DATE element updated: ${updatedBaseElement.name} (ID: ${input.id})`
    );

    // 8. Return updated element
    return {
      base: updatedBaseElement,
      textPropsEntity: updatedTextProps,
      dateProps: {
        ...updatedDateElement,
        calendarType: updatedDateElement.calendarType as CalendarType,
        transformation:
          updatedDateElement.transformation as DateTransformationType | null,
      },
      dateDataSource: updatedDateElement.dateDataSource,
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
      base: row.certificate_element,
      textPropsEntity: row.element_text_props,
      dateProps: {
        ...row.date_element,
        calendarType: row.date_element.calendarType as CalendarType,
        transformation: row.date_element
          .transformation as DateTransformationType | null,
      },
      dateDataSource: row.date_element.dateDataSource,
    };
  };

  export const loadByBase = async (
    base: CertificateElementEntity
  ): Promise<DateElementOutput> => {
    // Join all three tables
    const result = await db
      .select()
      .from(dateElement)
      .innerJoin(
        elementTextProps,
        eq(elementTextProps.id, dateElement.textPropsId)
      )
      .where(eq(dateElement.elementId, base.id))
      .limit(1);

    if (result.length === 0)
      throw new Error(`DATE element with base ID ${base.id} does not exist.`);

    const row = result[0];

    // Reconstruct output
    return {
      base: base,
      textPropsEntity: row.element_text_props,
      dateProps: {
        ...row.date_element,
        calendarType: row.date_element.calendarType as CalendarType,
        transformation: row.date_element
          .transformation as DateTransformationType | null,
      },
      dateDataSource: row.date_element.dateDataSource,
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
      if (element.base.type !== ElementType.DATE) {
        return new Error(
          `Element ${element.base.id} is ${element.base.type}, not DATE`
        );
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
    input: DateElementUpdateInput
  ): Promise<DateElementEntity> => {
    const dateUpdates: Partial<DateElementEntityInput> = {
      calendarType: input.dateProps.calendarType,
      offsetDays: input.dateProps.offsetDays ?? undefined,
      format: input.dateProps.format,
      transformation: input.dateProps.transformation ?? null,
      dateDataSource: DateElementUtils.convertInputDataSourceToOutput(
        input.dataSource
      ),
      variableId: DateElementUtils.extractVariableIdFromDataSource(
        input.dataSource
      ),
    };

    const [updated] = await db
      .update(dateElement)
      .set(dateUpdates)
      .where(eq(dateElement.elementId, input.id))
      .returning();

    return updated;
  };
}
