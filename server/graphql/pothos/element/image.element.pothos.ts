import { gqlSchemaBuilder } from "@/server/graphql/gqlSchemaBuilder";
import * as Types from "@/server/types/element";
import { ImageElementRepository } from "@/server/db/repo/element";
import {
  CertificateElementBaseInputObject,
  CertificateElementPothosInterface,
} from "./base.element.pothos";
import { InputFieldBuilder, SchemaTypes } from "@pothos/core";

// ============================================================================
// Enums
// ============================================================================

export const ImageDataSourceTypePothosEnum = gqlSchemaBuilder.enumType(
  "ImageDataSourceType",
  { values: Object.values(Types.ImageDataSourceType) }
);

export const ElementImageFitPothosEnum = gqlSchemaBuilder.enumType(
  "ElementImageFit",
  { values: Object.values(Types.ElementImageFit) }
);

// ============================================================================
// Data Source Object (Output) - Single variant
// ============================================================================

export const ImageDataSourceStorageFileObject = gqlSchemaBuilder
  .objectRef<
    Extract<
      Types.ImageDataSource,
      { type: Types.ImageDataSourceType.STORAGE_FILE }
    >
  >("ImageDataSourceStorageFile")
  .implement({
    fields: t => ({
      type: t.expose("type", { type: ImageDataSourceTypePothosEnum }),
      storageFileId: t.exposeInt("storageFileId"),
    }),
  });

// ============================================================================
// Data Source Union (Output) - Only one type but still a union for consistency
// ============================================================================

export const ImageDataSourceUnion = gqlSchemaBuilder.unionType(
  "ImageDataSource",
  {
    types: [ImageDataSourceStorageFileObject],
    resolveType: ds => {
      if (ds.type === Types.ImageDataSourceType.STORAGE_FILE) {
        return "ImageDataSourceStorageFile";
      }
      throw new Error(
        `Unknown ImageDataSource type: ${(ds as { type: string }).type}`
      );
    },
  }
);

// ============================================================================
// Data Source Input Object (isOneOf Pattern)
// ============================================================================

export const ImageDataSourceStorageFileInputObject = gqlSchemaBuilder
  .inputRef<Types.ImageDataSourceStorageFileInputGraphql>(
    "ImageDataSourceStorageFileInput"
  )
  .implement({
    fields: t => ({
      storageFileId: t.int({ required: true }),
    }),
  });

export const ImageDataSourceInputObject = gqlSchemaBuilder.inputType(
  "ImageDataSourceInput",
  {
    isOneOf: true,
    fields: t => ({
      storageFile: t.field({
        type: ImageDataSourceStorageFileInputObject,
        required: false,
      }),
    }),
  }
);

// ============================================================================
// Mutation Inputs
// ============================================================================

const createImageElementSpecPropsInputFields = <Types extends SchemaTypes>(
  t: InputFieldBuilder<Types, "InputObject">
) => ({
  fit: t.field({ type: ElementImageFitPothosEnum, required: true }),
});

export const ImageElementSpecPropsInputObject = gqlSchemaBuilder
  .inputRef<Types.ImageElementSpecPropsInput>("ImageElementSpecPropsInput")
  .implement({
    fields: t => ({
      ...createImageElementSpecPropsInputFields(t),
    }),
  });

const createImageElementInputFields = <Types extends SchemaTypes>(
  t: InputFieldBuilder<Types, "InputObject">
) => ({
  base: t.field({
    type: CertificateElementBaseInputObject,
    required: true,
  }),
  imageProps: t.field({
    type: ImageElementSpecPropsInputObject,
    required: true,
  }),
  dataSource: t.field({ type: ImageDataSourceInputObject, required: true }),
});

export const ImageElementInputObject = gqlSchemaBuilder
  .inputRef<Types.ImageElementInputGraphql>("ImageElementInput")
  .implement({
    fields: t => ({
      ...createImageElementInputFields(t),
    }),
  });

export const ImageElementUpdateInputObject = gqlSchemaBuilder
  .inputRef<Types.ImageElementUpdateInputGraphql>("ImageElementUpdateInput")
  .implement({
    fields: t => ({
      id: t.int({ required: true }),
      ...createImageElementInputFields(t),
    }),
  });

export const ImageElementSpecPropsStandaloneUpdateInputObject =
  gqlSchemaBuilder
    .inputRef<Types.ImageElementSpecPropsStandaloneUpdateInput>(
      "ImageElementSpecPropsStandaloneUpdateInput"
    )
    .implement({
      fields: t => ({
        elementId: t.int({ required: true }),
        imageProps: t.field({
          type: ImageElementSpecPropsInputObject,
          required: true,
        }),
      }),
    });

// ============================================================================
// Loadable Element Object
// ============================================================================

export const ImageElementSpecPropsObject = gqlSchemaBuilder
  .objectRef<Types.ImageElementSpecProps>("ImageElementSpecProps")
  .implement({
    fields: t => ({
      elementId: t.exposeInt("elementId"),
      storageFileId: t.exposeInt("storageFileId"),
      fit: t.expose("fit", { type: ElementImageFitPothosEnum }),
    }),
  });

export const ImageElementSpecPropsStandaloneUpdateResponseObject =
  gqlSchemaBuilder
    .objectRef<Types.ImageElementSpecPropsStandaloneUpdateResponse>(
      "ImageElementSpecPropsStandaloneUpdateResponse"
    )
    .implement({
      fields: t => ({
        elementId: t.expose("elementId", { type: "Int" }),
        imageProps: t.expose("imageProps", {
          type: ImageElementSpecPropsObject,
        }),
      }),
    });

const ImageElementObjectRef =
  gqlSchemaBuilder.objectRef<Types.ImageElementOutput>("ImageElement");

export const ImageElementObject = gqlSchemaBuilder.loadableObject<
  Types.ImageElementOutput | Error,
  number,
  [typeof CertificateElementPothosInterface],
  typeof ImageElementObjectRef
>(ImageElementObjectRef, {
  load: async ids => await ImageElementRepository.loadByIds(ids),
  sort: e => e.base.id,
  interfaces: [CertificateElementPothosInterface],
  isTypeOf: item =>
    typeof item === "object" &&
    item !== null &&
    !(item instanceof Error) &&
    "base" in item &&
    item.base !== null &&
    typeof item.base === "object" &&
    "type" in item.base &&
    item.base.type === Types.ElementType.IMAGE,
  fields: t => ({
    imageProps: t.expose("imageProps", {
      type: ImageElementSpecPropsObject,
    }),
    imageDataSource: t.expose("imageDataSource", {
      type: ImageDataSourceUnion,
    }),
  }),
});
