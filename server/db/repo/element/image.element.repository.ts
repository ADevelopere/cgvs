import { db } from "@/server/db/drizzleDb";
import { eq } from "drizzle-orm";
import { certificateElement, imageElement } from "@/server/db/schema";
import {
  ImageElementInput,
  ImageElementUpdateInput,
  ImageElementOutput,
  ElementType,
  ImageElementEntity,
  CertificateElementEntityInput,
  ElementImageFit,
  CertificateElementEntity,
} from "@/server/types/element";
import { ImageElementUtils } from "@/server/utils";
import logger from "@/server/lib/logger";
import { ElementRepository } from ".";

/**
 * Repository for IMAGE element operations
 * Handles table-per-type architecture: certificate_element + image_element
 */
export namespace ImageElementRepository {
  // ============================================================================
  // Create Operation
  // ============================================================================

  /**
   * Create a new IMAGE element
   * Pattern:
   * 1. Validate input
   * 2. Extract storageFileId from dataSource
   * 3. Insert into certificate_element → get elementId
   * 4. Insert into image_element
   * 5. Return full output
   */
  export const create = async (
    input: ImageElementInput
  ): Promise<ImageElementOutput> => {
    // 1. Validate input
    await ImageElementUtils.validateInput(input);

    // 2. Convert input dataSource to output format and extract storageFileId
    const newDataSource = ImageElementUtils.convertInputDataSourceToOutput(
      input.dataSource
    );

    const baseInput: CertificateElementEntityInput = {
      ...input.base,
      type: ElementType.IMAGE,
    };

    // 3. Insert into certificate_element (base table)
    const [baseElement] = await db
      .insert(certificateElement)
      .values(baseInput)
      .returning();

    // 4. Insert into image_element (type-specific table)
    const [newImageElement] = await db
      .insert(imageElement)
      .values({
        elementId: baseElement.id,
        fit: input.imageProps.fit,
        imageDataSource: newDataSource,
        storageFileId: newDataSource.storageFileId,
      })
      .returning();

    logger.info(
      `IMAGE element created: ${baseElement.name} (ID: ${baseElement.id})`
    );

    // 5. Return full output
    return {
      base: baseElement,
      imageProps: {
        elementId: newImageElement.elementId,
        storageFileId: newImageElement.storageFileId,
        fit: newImageElement.fit as ElementImageFit,
      },
      imageDataSource: newDataSource,
    };
  };

  // ============================================================================
  // Update Operation
  // ============================================================================

  /**
   * Update an existing IMAGE element
   * Pattern:
   * 1. Load existing element
   * 2. Validate type and input
   * 3. Update certificate_element (base table)
   * 4. Update image_element (type-specific table)
   * 5. Return updated element
   */
  export const update = async (
    input: ImageElementUpdateInput
  ): Promise<ImageElementOutput> => {
    // 1. Load existing element
    const existing = await loadByIdOrThrow(input.id);

    // 2. Validate type
    if (existing.base.type !== ElementType.IMAGE) {
      throw new Error(
        `Element ${input.id} is ${existing.base.type}, not IMAGE. Use correct repository.`
      );
    }

    // 3. Validate update input
    await ImageElementUtils.validateInput(input);

    // 4. Update certificate_element (base table)
    const updatedBaseElement = await ElementRepository.updateBaseElement(
      { ...input.base, id: input.id },
      true
    );

    // 5. Update image_element (type-specific table)
    const updatedImageElement = await updateImageElementSpecific(input);

    logger.info(
      `IMAGE element updated: ${updatedBaseElement.name} (ID: ${input.id})`
    );

    // 6. Return updated element
    return {
      base: updatedBaseElement,
      imageProps: {
        elementId: updatedImageElement.elementId,
        storageFileId: updatedImageElement.storageFileId,
        fit: updatedImageElement.fit as ElementImageFit,
      },
      imageDataSource: updatedImageElement.imageDataSource,
    };
  };

  // ============================================================================
  // Load Operations
  // ============================================================================

  /**
   * Load IMAGE element by ID with all joined data
   * Joins: certificate_element + image_element
   */
  export const loadById = async (
    id: number
  ): Promise<ImageElementOutput | null> => {
    // Join both tables
    const result = await db
      .select()
      .from(certificateElement)
      .innerJoin(
        imageElement,
        eq(imageElement.elementId, certificateElement.id)
      )
      .where(eq(certificateElement.id, id))
      .limit(1);

    if (result.length === 0) return null;

    const row = result[0];

    // Reconstruct output
    return {
      base: row.certificate_element,
      imageProps: {
        elementId: row.image_element.elementId,
        storageFileId: row.image_element.storageFileId,
        fit: row.image_element.fit as ElementImageFit,
      },
      imageDataSource: row.image_element.imageDataSource,
    };
  };

  export const loadByBase = async (
    base: CertificateElementEntity
  ): Promise<ImageElementOutput> => {
    // Join both tables
    const result = await db
      .select()
      .from(imageElement)
      .where(eq(imageElement.elementId, base.id))
      .limit(1);

    if (result.length === 0)
      throw new Error(`IMAGE element with base ID ${base.id} does not exist.`);

    const row = result[0];

    // Reconstruct output
    return {
      base: base,
      imageProps: {
        elementId: row.elementId,
        storageFileId: row.storageFileId,
        fit: row.fit as ElementImageFit,
      },
      imageDataSource: row.imageDataSource,
    };
  };

  /**
   * Load IMAGE element by ID or throw error
   */
  export const loadByIdOrThrow = async (
    id: number
  ): Promise<ImageElementOutput> => {
    const element = await loadById(id);
    if (!element) {
      throw new Error(`IMAGE element with ID ${id} does not exist.`);
    }
    return element;
  };

  /**
   * Load IMAGE elements by IDs for Pothos dataloader
   * Returns array with ImageElementOutput or Error per ID
   */
  export const loadByIds = async (
    ids: number[]
  ): Promise<(ImageElementOutput | Error)[]> => {
    if (ids.length === 0) return [];

    // Load all elements
    const results = await Promise.all(ids.map(id => loadById(id)));

    // Map to maintain order and handle missing elements
    return results.map((element, index) => {
      if (!element) {
        return new Error(`IMAGE element with ID ${ids[index]} does not exist.`);
      }

      // Validate element type
      if (element.base.type !== ElementType.IMAGE) {
        return new Error(
          `Element ${element.base.id} is ${element.base.type}, not IMAGE`
        );
      }

      return element;
    });
  };

  // ============================================================================
  // Update Helper Functions
  // ============================================================================

  /**
   * Update image_element (type-specific table)
   * Returns updated entity
   */
  const updateImageElementSpecific = async (
    input: ImageElementUpdateInput
  ): Promise<ImageElementEntity> => {
    const newDataSource = ImageElementUtils.convertInputDataSourceToOutput(
      input.dataSource
    );

    const imageUpdates: Partial<typeof imageElement.$inferInsert> = {
      fit: input.imageProps.fit,
      imageDataSource: newDataSource,
      storageFileId: newDataSource.storageFileId,
    };

    const [updated] = await db
      .update(imageElement)
      .set(imageUpdates)
      .where(eq(imageElement.elementId, input.id))
      .returning();

    return updated;
  };
}
