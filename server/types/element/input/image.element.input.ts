import { ElementImageFit, ImageDataSourceType } from "../output";
import { CertificateElementBaseInput } from "./base.element.input";
import { imageElement } from "@/server/db/schema";

// ============================================================================
// Data Source Types
// ============================================================================
export type ImageDataSourceInput = {
  type: ImageDataSourceType.STORAGE_FILE;
  storageFilePath: string;
  url: string;
};

// ============================================================================
// Mutation Inputs
// ============================================================================

export type ImageElementEntityInput = typeof imageElement.$inferInsert;
export type ImageElementSpecPropsInput = Omit<
  ImageElementEntityInput,
  "elementId" | "imageDataSource" | "storageFileId" | "fit"
> & {
  fit: ElementImageFit;
};

export type ImageElementInput = {
  base: CertificateElementBaseInput;
  imageProps: ImageElementSpecPropsInput;
  dataSource: ImageDataSourceInput;
};

export type ImageElementUpdateInput = ImageElementInput & {
  id: number;
};

export type ImageElementSpecPropsStandaloneUpdateInput = {
  elementId: number;
  imageProps: ImageElementSpecPropsInput;
};

export type ImageDataSourceStandaloneUpdateInput = {
  elementId: number;
  dataSource: ImageDataSourceInput;
};