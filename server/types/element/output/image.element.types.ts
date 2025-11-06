import type { CertificateElementEntity } from "./base.element.types";
import type { imageElement } from "@/server/db/schema";

// ============================================================================
// IMAGE-specific Enums
// ============================================================================

export enum ElementImageFit {
  COVER = "COVER",
  CONTAIN = "CONTAIN",
  FILL = "FILL",
}

export enum ImageDataSourceType {
  STORAGE_FILE = "STORAGE_FILE",
}

// ============================================================================
// Data Source Types
// ============================================================================

export type ImageDataSource = {
  type: ImageDataSourceType.STORAGE_FILE;
  storageFilePath: string;
};

// ============================================================================
// Raw Entity (from Drizzle schema)
// ============================================================================

export type ImageElementEntity = typeof imageElement.$inferSelect;
// { elementId, fit, imageDataSource, storageFileId }

// ============================================================================
// Output Type (mirrors database - base + image_element joined)
// ============================================================================

export type ImageElementSpecProps = Omit<ImageElementEntity, "imageDataSource" | "fit"> & {
  fit: ElementImageFit;
};

export type ImageElementOutput = {
  base: CertificateElementEntity;
  imageProps: ImageElementSpecProps;
  imageDataSource: ImageDataSource;
};

export type ImageElementSpecPropsStandaloneUpdateResponse = {
  elementId: number;
  imageProps: ImageElementSpecProps;
};

export type ImageDataSourceStandaloneUpdateResponse = {
  elementId: number;
  imageDataSource: ImageDataSource;
};
