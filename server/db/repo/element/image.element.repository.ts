import { db } from "@/server/db/drizzleDb";
import { eq } from "drizzle-orm";
import { certificateElement, imageElement } from "@/server/db/schema";
import {
  ImageElementCreateInput,
  ImageElementUpdateInput,
  ImageElementOutput,
  ElementType,
  ImageDataSource,
  ImageDataSourceInput,
  CertificateElementEntityInput,
  ImageElementEntity,
  ElementImageFit,
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
   * 5. Load and return full output
   */
  export const create = async (
    input: ImageElementCreateInput
  ): Promise<ImageElementOutput> => {
    // 1. Validate input
    await ImageElementUtils.validateCreateInput(input);

    // 2. Convert input dataSource to output format and extract storageFileId
    const newDataSource = convertInputDataSourceToOutput(input.dataSource);
    const storageFileId = extractStorageFileIdFromDataSource(newDataSource);

    const baseInput: CertificateElementEntityInput = {
      ...input,
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
        fit: input.fit,
        imageDataSource: newDataSource,
        storageFileId,
      })
      .returning();

    logger.info(
      `IMAGE element created: ${baseElement.name} (ID: ${baseElement.id})`
    );

    // 5. Load and return full output
    return {
      ...baseElement,
      elementId: newImageElement.elementId,
      fit: newImageElement.fit as ElementImageFit,
      imageDataSource: newDataSource,
      storageFileId,
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
    if (existing.type !== ElementType.IMAGE) {
      throw new Error(
        `Element ${input.id} is ${existing.type}, not IMAGE. Use correct repository.`
      );
    }

    // 3. Validate update input
    await ImageElementUtils.validateUpdateInput(input, existing);

    // 4. Update certificate_element (base table)
    const updatedBaseElement = await ElementRepository.updateBaseElement(
      input.id,
      input,
      existing
    );

    // 5. Update image_element (type-specific table)
    const existingImageElement: ImageElementEntity = existing;
    const updatedImageElement = await updateImageElementSpecific(
      input.id,
      input,
      existingImageElement
    );

    logger.info(
      `IMAGE element updated: ${updatedBaseElement.name} (ID: ${input.id})`
    );

    // 6. Return updated element
    return {
      ...updatedBaseElement,
      elementId: updatedImageElement.elementId,
      fit: updatedImageElement.fit as ElementImageFit,
      imageDataSource: updatedImageElement.imageDataSource,
      storageFileId: updatedImageElement.storageFileId,
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
      // Base element fields
      ...row.certificate_element,
      // Image-specific fields
      ...row.image_element,
      fit: row.image_element.fit as ElementImageFit,
      imageDataSource: row.image_element.imageDataSource,
      storageFileId: row.image_element.storageFileId,
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
      if (element.type !== ElementType.IMAGE) {
        return new Error(`Element ${element.id} is ${element.type}, not IMAGE`);
      }

      return element;
    });
  };

  // ============================================================================
  // Update Helper Functions
  // ============================================================================

  /**
   * Update image_element (type-specific table)
   * Returns updated entity or existing if no changes
   */
  const updateImageElementSpecific = async (
    elementId: number,
    input: ImageElementUpdateInput,
    existingImageElement: ImageElementEntity
  ): Promise<ImageElementEntity> => {
    const imageUpdates: Partial<typeof imageElement.$inferInsert> = {};

    // Handle fit update
    if (input.fit !== undefined) {
      if (input.fit === null) {
        throw new Error("fit cannot be null for IMAGE element");
      }
      imageUpdates.fit = input.fit;
    }

    // Handle dataSource update
    if (input.dataSource !== undefined) {
      if (input.dataSource === null) {
        throw new Error("dataSource cannot be null for IMAGE element");
      }
      const dataSource = convertInputDataSourceToOutput(input.dataSource);
      imageUpdates.imageDataSource = dataSource;
      imageUpdates.storageFileId =
        extractStorageFileIdFromDataSource(dataSource);
    }

    if (Object.keys(imageUpdates).length === 0) {
      return existingImageElement;
    }

    const [updated] = await db
      .update(imageElement)
      .set(imageUpdates)
      .where(eq(imageElement.elementId, elementId))
      .returning();

    return updated;
  };

  // ============================================================================
  // Helper Functions
  // ============================================================================

  /**
   * Convert input data source format to output format
   * For IMAGE, input and output are identical
   */
  const convertInputDataSourceToOutput = (
    input: ImageDataSourceInput
  ): ImageDataSource => {
    // IMAGE data source is simple and identical in both formats
    return input;
  };

  /**
   * Extract storageFileId from image data source
   */
  const extractStorageFileIdFromDataSource = (
    dataSource: ImageDataSource
  ): number => {
    return dataSource.storageFileId;
  };
}
