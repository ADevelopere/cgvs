import { db } from "@/server/db/drizzleDb";
import { eq } from "drizzle-orm";
import {
  certificateElement,
  genderElement,
  elementTextProps,
} from "@/server/db/schema";
import {
  GenderElementInput,
  GenderElementUpdateInput,
  GenderElementOutput,
  ElementType,
  ElementTextPropsEntity,
  CertificateElementEntityInput,
  CertificateElementEntity,
} from "@/server/types/element";
import { TextPropsRepository } from "./textProps.element.repository";
import { GenderElementUtils } from "@/server/utils";
import logger from "@/server/lib/logger";
import { ElementRepository } from ".";

/**
 * Repository for GENDER element operations
 * Handles table-per-type architecture: certificate_element + gender_element + element_text_props
 */
export namespace GenderElementRepository {
  // ============================================================================
  // Create Operation
  // ============================================================================

  /**
   * Create a new GENDER element
   * Pattern:
   * 1. Validate input
   * 2. Create TextProps → get textPropsId
   * 3. Insert into certificate_element → get elementId
   * 4. Insert into gender_element
   * 5. Return full output
   */
  export const create = async (
    input: GenderElementInput
  ): Promise<GenderElementOutput> => {
    // 1. Validate input
    await GenderElementUtils.validateInput(input);

    // 2. Create TextProps
    const newTextProps = await TextPropsRepository.create(input.textProps);

    const baseInput: CertificateElementEntityInput = {
      ...input.base,
      type: ElementType.GENDER,
    };

    // 3. Insert into certificate_element (base table)
    const [baseElement] = await db
      .insert(certificateElement)
      .values(baseInput)
      .returning();

    // 4. Insert into gender_element (type-specific table)
    const [_] = await db
      .insert(genderElement)
      .values({
        elementId: baseElement.id,
        textPropsId: newTextProps.id,
      })
      .returning();

    logger.info(
      `GENDER element created: ${baseElement.name} (ID: ${baseElement.id})`
    );

    // 5. Return full output
    return {
      base: baseElement,
      textPropsEntity: newTextProps,
    };
  };

  // ============================================================================
  // Update Operation
  // ============================================================================

  /**
   * Update an existing GENDER element
   * Pattern:
   * 1. Load existing element
   * 2. Validate type and input
   * 3. Update certificate_element (base table)
   * 4. Update element_text_props
   * 5. Return updated element (no gender_element specific fields to update)
   */
  export const update = async (
    input: GenderElementUpdateInput
  ): Promise<GenderElementOutput> => {
    // 1. Load existing element
    const existing = await loadByIdOrThrow(input.id);

    // 2. Validate type
    if (existing.base.type !== ElementType.GENDER) {
      throw new Error(
        `Element ${input.id} is ${existing.base.type}, not GENDER. Use correct repository.`
      );
    }

    // 3. Validate update input
    await GenderElementUtils.validateInput(input);

    // 4. Update certificate_element (base table)
    const updatedBaseElement = await ElementRepository.updateBaseElement(
      { ...input.base, id: input.id },
      true
    );

    // 5. Update element_text_props (full replace required)
    const updatedTextProps: ElementTextPropsEntity =
      await TextPropsRepository.update(
        {
          ...input.textProps,
          id: existing.textPropsEntity.id,
        },
        true
      );

    logger.info(
      `GENDER element updated: ${updatedBaseElement.name} (ID: ${input.id})`
    );

    // 6. Return updated element (gender_element has no updateable fields beyond FKs)
    return {
      base: updatedBaseElement,
      textPropsEntity: updatedTextProps,
    };
  };

  // ============================================================================
  // Load Operations
  // ============================================================================

  /**
   * Load GENDER element by ID with all joined data
   * Joins: certificate_element + gender_element + element_text_props
   */
  export const loadById = async (
    id: number
  ): Promise<GenderElementOutput | null> => {
    // Join all three tables
    const result = await db
      .select()
      .from(certificateElement)
      .innerJoin(
        genderElement,
        eq(genderElement.elementId, certificateElement.id)
      )
      .innerJoin(
        elementTextProps,
        eq(elementTextProps.id, genderElement.textPropsId)
      )
      .where(eq(certificateElement.id, id))
      .limit(1);

    if (result.length === 0) return null;

    const row = result[0];

    // Reconstruct output
    return {
      base: row.certificate_element,
      textPropsEntity: row.element_text_props,
    };
  };

  export const loadByBase = async (
    base: CertificateElementEntity
  ): Promise<GenderElementOutput> => {
    // Join all three tables
    const result = await db
      .select()
      .from(genderElement)
      .innerJoin(
        elementTextProps,
        eq(elementTextProps.id, genderElement.textPropsId)
      )
      .where(eq(genderElement.elementId, base.id))
      .limit(1);

    if (result.length === 0)
      throw new Error(`GENDER element with base ID ${base.id} does not exist.`);

    const row = result[0];

    // Reconstruct output
    return {
      base: base,
      textPropsEntity: row.element_text_props,
    };
  };

  /**
   * Load GENDER element by ID or throw error
   */
  export const loadByIdOrThrow = async (
    id: number
  ): Promise<GenderElementOutput> => {
    const element = await loadById(id);
    if (!element) {
      throw new Error(`GENDER element with ID ${id} does not exist.`);
    }
    return element;
  };

  /**
   * Load GENDER elements by IDs for Pothos dataloader
   * Returns array with GenderElementOutput or Error per ID
   */
  export const loadByIds = async (
    ids: number[]
  ): Promise<(GenderElementOutput | Error)[]> => {
    if (ids.length === 0) return [];

    // Load all elements
    const results = await Promise.all(ids.map(id => loadById(id)));

    // Map to maintain order and handle missing elements
    return results.map((element, index) => {
      if (!element) {
        return new Error(
          `GENDER element with ID ${ids[index]} does not exist.`
        );
      }

      // Validate element type
      if (element.base.type !== ElementType.GENDER) {
        return new Error(
          `Element ${element.base.id} is ${element.base.type}, not GENDER`
        );
      }

      return element;
    });
  };
}
