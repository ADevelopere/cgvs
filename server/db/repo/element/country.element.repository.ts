import { db } from "@/server/db/drizzleDb";
import { eq } from "drizzle-orm";
import { certificateElement, countryElement, elementTextProps } from "@/server/db/schema";
import * as ElTypes from "@/server/types/element";
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
  export const create = async (input: ElTypes.CountryElementInput): Promise<ElTypes.CountryElementOutput> => {
    // 1. Validate input
    await CountryElementUtils.checkInput(input);

    // 2. Create TextProps
    const newTextProps = await TextPropsRepository.create(input.textProps);

    const baseInput: ElTypes.CertificateElementEntityCreateInput = {
      ...input.base,
      type: ElTypes.ElementType.COUNTRY,
    };

    // 3. Insert into certificate_element (base table)
    const baseElement = await ElementRepository.createInternal(baseInput);

    // 4. Insert into country_element (type-specific table)
    const [newCountryElement] = await db
      .insert(countryElement)
      .values({
        elementId: baseElement.id,
        textPropsId: newTextProps.id,
        representation: input.countryProps.representation,
      })
      .returning();

    if (!newCountryElement) throw new Error("Failed to create COUNTRY element");

    logger.info(`COUNTRY element created: ${baseElement.name} (ID: ${baseElement.id})`);

    // 5. Return full output
    return {
      base: baseElement,
      textPropsEntity: newTextProps,
      countryProps: {
        ...newCountryElement,
        representation: newCountryElement.representation as ElTypes.CountryRepresentation,
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
  export const update = async (input: ElTypes.CountryElementUpdateInput): Promise<ElTypes.CountryElementOutput> => {
    // 1. Load existing element
    const existing = await loadByIdOrThrow(input.id);

    // 2. Validate type
    if (existing.base.type !== ElTypes.ElementType.COUNTRY) {
      throw new Error(`Element ${input.id} is ${existing.base.type}, not COUNTRY. Use correct repository.`);
    }

    // 3. Validate update input
    await CountryElementUtils.checkInput(input);

    // 4. Update certificate_element (base table)
    const updatedBaseElement = await ElementRepository.updateBaseElement({ ...input.base, id: input.id }, true);

    // 5. Update element_text_props (full replace required)
    const updatedTextProps: ElTypes.ElementTextPropsEntity = await TextPropsRepository.update(
      {
        ...input.textProps,
        id: existing.textPropsEntity.id,
      },
      true
    );

    // 6. Update country_element (type-specific table)
    const updatedCountryElement = await updateCountryElementSpecific(input.id, input);

    logger.info(`COUNTRY element updated: ${updatedBaseElement.name} (ID: ${input.id})`);

    // 7. Return updated element
    return {
      base: updatedBaseElement,
      textPropsEntity: updatedTextProps,
      countryProps: {
        ...updatedCountryElement,
        representation: updatedCountryElement.representation as ElTypes.CountryRepresentation,
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
  export const loadById = async (id: number): Promise<ElTypes.CountryElementOutput | null> => {
    // Join all three tables
    const result = await db
      .select()
      .from(certificateElement)
      .innerJoin(countryElement, eq(countryElement.elementId, certificateElement.id))
      .innerJoin(elementTextProps, eq(elementTextProps.id, countryElement.textPropsId))
      .where(eq(certificateElement.id, id))
      .limit(1);

    if (result.length === 0 || !result[0]) return null;

    const row = result[0];

    // Reconstruct output
    return {
      base: row.certificate_element,
      textPropsEntity: row.element_text_props,
      countryProps: {
        ...row.country_element,
        representation: row.country_element.representation as ElTypes.CountryRepresentation,
      },
    };
  };

  /**
   * Load COUNTRY element by ID or throw error
   */
  export const loadByIdOrThrow = async (id: number): Promise<ElTypes.CountryElementOutput> => {
    const element = await loadById(id);
    if (!element) {
      throw new Error(`COUNTRY element with ID ${id} does not exist.`);
    }
    return element;
  };

  export const loadByBase = async (base: ElTypes.CertificateElementEntity): Promise<ElTypes.CountryElementOutput> => {
    // Join all three tables
    const result = await db
      .select()
      .from(countryElement)
      .innerJoin(elementTextProps, eq(elementTextProps.id, countryElement.textPropsId))
      .where(eq(countryElement.elementId, base.id))
      .limit(1);

    if (result.length === 0 || !result[0]) throw new Error(`No COUNTRY element found for base ID ${base.id}`);

    const row = result[0];

    // Reconstruct output
    return {
      base: base,
      textPropsEntity: row.element_text_props,
      countryProps: {
        ...row.country_element,
        representation: row.country_element.representation as ElTypes.CountryRepresentation,
      },
    };
  };

  /**
   * Load COUNTRY elements by IDs for Pothos dataloader
   * Returns array with CountryElementOutput or Error per ID
   */
  export const loadByIds = async (ids: number[]): Promise<(ElTypes.CountryElementOutput | Error)[]> => {
    if (ids.length === 0) return [];

    // Load all elements
    const results = await Promise.all(ids.map(id => loadById(id)));

    // Map to maintain order and handle missing elements
    return results.map((element, index) => {
      if (!element) {
        return new Error(`COUNTRY element with ID ${ids[index]} does not exist.`);
      }

      // Validate element type
      if (element.base.type !== ElTypes.ElementType.COUNTRY) {
        return new Error(`Element ${element.base.id} is ${element.base.type}, not COUNTRY`);
      }

      return element;
    });
  };

  export const findById = async (id: number): Promise<ElTypes.CountryElementEntity | null> => {
    const countryEl = await db.select().from(countryElement).where(eq(countryElement.elementId, id)).limit(1);

    if (countryEl.length === 0 || !countryEl[0]) return null;
    return countryEl[0];
  };

  export const findByIdOrThrow = async (id: number): Promise<ElTypes.CountryElementEntity> => {
    const countryEl = await findById(id);
    if (!countryEl) {
      throw new Error(`Country element with ID ${id} does not exist.`);
    }
    return countryEl;
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
    input: ElTypes.CountryElementUpdateInput
  ): Promise<ElTypes.CountryElementEntity> => {
    const countryUpdates: Partial<typeof countryElement.$inferInsert> = {};

    // Full replace: representation is required
    countryUpdates.representation = input.countryProps.representation;

    const [updated] = await db
      .update(countryElement)
      .set(countryUpdates)
      .where(eq(countryElement.elementId, elementId))
      .returning();

    if (!updated) throw new Error(`Country element with ID ${elementId} does not exist.`);

    return updated;
  };

  export const updateSpecProps = async (
    input: ElTypes.CountryElementSpecPropsStandaloneUpdateInput
  ): Promise<ElTypes.CountryElementSpecPropsStandaloneUpdateResponse> => {
    // 1. Load existing element
    await findByIdOrThrow(input.elementId);
    await CountryElementUtils.checkSpecProps(input.countryProps);

    // 3. Update country_element (type-specific table)
    const updatedCountryElement = await db
      .update(countryElement)
      .set({
        representation: input.countryProps.representation,
      })
      .where(eq(countryElement.elementId, input.elementId))
      .returning();

    if (!updatedCountryElement[0]) throw new Error(`Country element with ID ${input.elementId} does not exist.`);

    logger.info(`COUNTRY element specProps updated: (ID: ${input.elementId})`);

    return {
      elementId: input.elementId,
      countryProps: {
        ...updatedCountryElement[0],
        representation: updatedCountryElement[0].representation as ElTypes.CountryRepresentation,
      },
    };
  };
}
