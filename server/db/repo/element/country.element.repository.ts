import { db } from "@/server/db/drizzleDb";
import { eq } from "drizzle-orm";
import {
  certificateElement,
  countryElement,
  elementTextProps,
} from "@/server/db/schema";
import {
  CountryElementInput,
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
    input: CountryElementInput
  ): Promise<CountryElementOutput> => {
    // 1. Validate input
    await CountryElementUtils.validateInput(input);

    // 2. Create TextProps
    const newTextProps = await TextPropsRepository.create(input.textProps);

    const baseInput: CertificateElementEntityInput = {
      ...input.base,
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
        representation: input.countryProps.representation,
      })
      .returning();

    logger.info(
      `COUNTRY element created: ${baseElement.name} (ID: ${baseElement.id})`
    );

    // 5. Return full output
    return {
      base: baseElement,
      textPropsEntity: newTextProps,
      countryProps: {
        ...newCountryElement,
        representation:
          newCountryElement.representation as CountryRepresentation,
      },
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
    if (existing.base.type !== ElementType.COUNTRY) {
      throw new Error(
        `Element ${input.id} is ${existing.base.type}, not COUNTRY. Use correct repository.`
      );
    }

    // 3. Validate update input
    await CountryElementUtils.validateInput(input);

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

    // 6. Update country_element (type-specific table)
    const existingCountryElement: CountryElementEntity = existing.countryProps;
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
      base: updatedBaseElement,
      textPropsEntity: updatedTextProps,
      countryProps: {
        ...updatedCountryElement,
        representation:
          updatedCountryElement.representation as CountryRepresentation,
      },
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
      base: row.certificate_element,
      textPropsEntity: row.element_text_props,
      countryProps: {
        ...row.country_element,
        representation: row.country_element
          .representation as CountryRepresentation,
      },
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
      if (element.base.type !== ElementType.COUNTRY) {
        return new Error(
          `Element ${element.base.id} is ${element.base.type}, not COUNTRY`
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

    // Full replace: representation is required
    countryUpdates.representation = input.countryProps.representation;

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
