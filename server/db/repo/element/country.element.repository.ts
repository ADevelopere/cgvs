import { db } from "@/server/db/drizzleDb";
import { eq } from "drizzle-orm";
import { certificateElement } from "@/server/db/schema/certificateElements/certificateElement";
import { countryElement } from "@/server/db/schema/certificateElements/countryElement";
import { elementTextProps } from "@/server/db/schema/certificateElements/elementTextProps";
import {
  CountryElementCreateInput,
  CountryElementUpdateInput,
  CountryElementOutput,
  ElementType,
  CountryElementEntity,
  ElementTextPropsEntity,
  CertificateElementEntityInput,
  CountryRepresentation,
} from "@/server/types/element";
import { TextPropsRepository } from "./textProps.element.repository";
import { CountryElementUtils } from "@/server/utils";
import logger from "@/server/lib/logger";
import { TextPropsUtils } from "@/server/utils/element/textProps.utils";
import { ElementRepository } from ".";

/**
 * Repository for COUNTRY element operations
 * Handles table-per-type architecture: certificate_element + country_element + element_text_props
 */
export namespace CountryElementRepository {
  // ============================================================================
  // Create Operation
  // ============================================================================

  /**
   * Create a new COUNTRY element
   * Pattern:
   * 1. Validate input
   * 2. Create TextProps → get textPropsId
   * 3. Insert into certificate_element → get elementId
   * 4. Insert into country_element
   * 5. Return full output
   */
  export const create = async (
    input: CountryElementCreateInput
  ): Promise<CountryElementOutput> => {
    // 1. Validate input
    await CountryElementUtils.validateCreateInput(input);

    // 2. Create TextProps
    const newTextProps = await TextPropsRepository.create(input.textProps);

    const baseInput: CertificateElementEntityInput = {
      ...input,
      type: ElementType.COUNTRY,
    };

    // 3. Insert into certificate_element (base table)
    const [baseElement] = await db
      .insert(certificateElement)
      .values(baseInput)
      .returning();

    // 4. Insert into country_element (type-specific table)
    const [newCountryElement] = await db
      .insert(countryElement)
      .values({
        elementId: baseElement.id,
        textPropsId: newTextProps.id,
        representation: input.representation,
      })
      .returning();

    logger.info(
      `COUNTRY element created: ${baseElement.name} (ID: ${baseElement.id})`
    );

    // 5. Return full output
    return {
      ...baseElement,
      elementId: newCountryElement.elementId,
      textPropsId: newCountryElement.textPropsId,
      textPropsEntity: newTextProps,
      textProps: TextPropsUtils.entityToTextProps(newTextProps),
      representation: newCountryElement.representation as CountryRepresentation,
    };
  };

  // ============================================================================
  // Update Operation
  // ============================================================================

  /**
   * Update an existing COUNTRY element
   * Pattern:
   * 1. Load existing element
   * 2. Validate type and input
   * 3. Update certificate_element (base table)
   * 4. Update element_text_props (if textProps provided)
   * 5. Update country_element (type-specific table)
   * 6. Return updated element
   */
  export const update = async (
    input: CountryElementUpdateInput
  ): Promise<CountryElementOutput> => {
    // 1. Load existing element
    const existing = await loadByIdOrThrow(input.id);

    // 2. Validate type
    if (existing.type !== ElementType.COUNTRY) {
      throw new Error(
        `Element ${input.id} is ${existing.type}, not COUNTRY. Use correct repository.`
      );
    }

    // 3. Validate update input
    await CountryElementUtils.validateUpdateInput(input, existing);

    // 4. Update certificate_element (base table)
    const updatedBaseElement = await ElementRepository.updateBaseElement(
      input.id,
      input,
      existing
    );

    // 5. Update element_text_props (if textProps provided)
    const existingCountryElement: CountryElementEntity = existing;
    let updatedTextProps: ElementTextPropsEntity = existing.textPropsEntity;
    if (input.textProps !== undefined) {
      if (input.textProps === null) {
        throw new Error("textProps cannot be null for COUNTRY element");
      }
      updatedTextProps = await TextPropsRepository.update(
        existing.textPropsId,
        input.textProps
      );
    }

    // 6. Update country_element (type-specific table)
    const updatedCountryElement = await updateCountryElementSpecific(
      input.id,
      input,
      existingCountryElement
    );

    logger.info(
      `COUNTRY element updated: ${updatedBaseElement.name} (ID: ${input.id})`
    );

    // 7. Return updated element
    return {
      ...updatedBaseElement,
      elementId: updatedCountryElement.elementId,
      textPropsId: updatedCountryElement.textPropsId,
      textPropsEntity: updatedTextProps,
      textProps: TextPropsUtils.entityToTextProps(updatedTextProps),
      representation: updatedCountryElement.representation as CountryRepresentation,
    };
  };

  // ============================================================================
  // Load Operations
  // ============================================================================

  /**
   * Load COUNTRY element by ID with all joined data
   * Joins: certificate_element + country_element + element_text_props
   */
  export const loadById = async (
    id: number
  ): Promise<CountryElementOutput | null> => {
    // Join all three tables
    const result = await db
      .select()
      .from(certificateElement)
      .innerJoin(
        countryElement,
        eq(countryElement.elementId, certificateElement.id)
      )
      .innerJoin(
        elementTextProps,
        eq(elementTextProps.id, countryElement.textPropsId)
      )
      .where(eq(certificateElement.id, id))
      .limit(1);

    if (result.length === 0) return null;

    const row = result[0];

    // Reconstruct output
    return {
      // Base element fields
      ...row.certificate_element,
      // Country-specific fields
      ...row.country_element,
      textPropsEntity: row.element_text_props,
      textProps: TextPropsUtils.entityToTextProps(row.element_text_props),
      representation: row.country_element.representation as CountryRepresentation,
    };
  };

  /**
   * Load COUNTRY element by ID or throw error
   */
  export const loadByIdOrThrow = async (
    id: number
  ): Promise<CountryElementOutput> => {
    const element = await loadById(id);
    if (!element) {
      throw new Error(`COUNTRY element with ID ${id} does not exist.`);
    }
    return element;
  };

  /**
   * Load COUNTRY elements by IDs for Pothos dataloader
   * Returns array with CountryElementOutput or Error per ID
   */
  export const loadByIds = async (
    ids: number[]
  ): Promise<(CountryElementOutput | Error)[]> => {
    if (ids.length === 0) return [];

    // Load all elements
    const results = await Promise.all(ids.map(id => loadById(id)));

    // Map to maintain order and handle missing elements
    return results.map((element, index) => {
      if (!element) {
        return new Error(
          `COUNTRY element with ID ${ids[index]} does not exist.`
        );
      }

      // Validate element type
      if (element.type !== ElementType.COUNTRY) {
        return new Error(
          `Element ${element.id} is ${element.type}, not COUNTRY`
        );
      }

      return element;
    });
  };

  // ============================================================================
  // Update Helper Functions
  // ============================================================================

  /**
   * Update country_element (type-specific table)
   * Returns updated entity or existing if no changes
   */
  const updateCountryElementSpecific = async (
    elementId: number,
    input: CountryElementUpdateInput,
    existingCountryElement: CountryElementEntity
  ): Promise<CountryElementEntity> => {
    const countryUpdates: Partial<typeof countryElement.$inferInsert> = {};

    // Handle representation update
    if (input.representation !== undefined) {
      if (input.representation === null) {
        throw new Error("representation cannot be null for COUNTRY element");
      }
      countryUpdates.representation = input.representation;
    }

    if (Object.keys(countryUpdates).length === 0) {
      return existingCountryElement;
    }

    const [updated] = await db
      .update(countryElement)
      .set(countryUpdates)
      .where(eq(countryElement.elementId, elementId))
      .returning();

    return updated;
  };
}
