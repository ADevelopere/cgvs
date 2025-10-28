import { gqlSchemaBuilder } from "@/server/graphql/gqlSchemaBuilder";
import * as Types from "@/server/types/element";
import { ImageElementRepository } from "@/server/db/repo/element";
import { TemplateRepository } from "@/server/db/repo";
import { TemplatePothosObject } from "@/server/graphql/pothos/template.pothos";
import {
  ElementTypePothosEnum,
  CertificateElementPothosInterface,
  createBaseElementInputFields,
  createBaseElementUpdateInputFields,
} from "./base.element.pothos";

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
// Config Objects
// ============================================================================

export const ImageElementConfigObject = gqlSchemaBuilder
  .objectRef<Types.ImageElementConfig>("ImageElementConfig")
  .implement({
    fields: t => ({
      type: t.expose("type", { type: ElementTypePothosEnum }),
      dataSource: t.expose("dataSource", { type: ImageDataSourceUnion }),
      fit: t.expose("fit", { type: ElementImageFitPothosEnum }),
    }),
  });

export const ImageElementConfigInputObject = gqlSchemaBuilder
  .inputRef<Types.ImageElementConfigInputGraphql>("ImageElementConfigInput")
  .implement({
    fields: t => ({
      dataSource: t.field({ type: ImageDataSourceInputObject, required: true }),
      fit: t.field({ type: ElementImageFitPothosEnum, required: true }),
    }),
  });

export const ImageElementConfigUpdateInputObject = gqlSchemaBuilder
  .inputRef<Types.ImageElementConfigUpdateInputGraphql>(
    "ImageElementConfigUpdateInput"
  )
  .implement({
    fields: t => ({
      dataSource: t.field({ type: ImageDataSourceInputObject, required: false }),
      fit: t.field({ type: ElementImageFitPothosEnum, required: false }),
    }),
  });

// ============================================================================
// Mutation Inputs
// ============================================================================

export const ImageElementCreateInputObject = gqlSchemaBuilder
  .inputRef<Types.ImageElementCreateInputGraphql>("ImageElementCreateInput")
  .implement({
    fields: t => ({
      ...createBaseElementInputFields(t),
      config: t.field({ type: ImageElementConfigInputObject, required: true }),
    }),
  });

export const ImageElementUpdateInputObject = gqlSchemaBuilder
  .inputRef<Types.ImageElementUpdateInputGraphql>("ImageElementUpdateInput")
  .implement({
    fields: t => ({
      ...createBaseElementUpdateInputFields(t),
      config: t.field({
        type: ImageElementConfigUpdateInputObject,
        required: false,
      }),
    }),
  });

// ============================================================================
// Loadable Element Object
// ============================================================================

const ImageElementObjectRef =
  gqlSchemaBuilder.objectRef<Types.ImageElementPothosDefinition>("ImageElement");

export const ImageElementObject = gqlSchemaBuilder.loadableObject<
  Types.ImageElementPothosDefinition | Error,
  number,
  [typeof CertificateElementPothosInterface],
  typeof ImageElementObjectRef
>(ImageElementObjectRef, {
  load: async ids => await ImageElementRepository.loadByIds(ids),
  sort: e => e.id,
  interfaces: [CertificateElementPothosInterface],
  isTypeOf: item =>
    typeof item === "object" &&
    item !== null &&
    "type" in item &&
    item.type === Types.ElementType.IMAGE,
  fields: t => ({
    config: t.expose("config", { type: ImageElementConfigObject }),
  }),
});

gqlSchemaBuilder.objectFields(ImageElementObject, t => ({
  template: t.loadable({
    type: TemplatePothosObject,
    load: (ids: number[]) => TemplateRepository.loadByIds(ids),
    resolve: element => element.templateId,
  }),
}));

