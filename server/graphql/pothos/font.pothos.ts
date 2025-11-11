import { gqlSchemaBuilder } from "../gqlSchemaBuilder";
import {
  FontVariantPothosDefinition,
  FontVariantCreateInput,
  FontVariantUpdateInput,
  FontVariantUsageCheckResult,
  FontUsageReference,
  FontVariantsWithFiltersResponse,
  FontVariantFilterArgs,
  FontVariantsOrderByColumn,
  FontVariantsOrderByClause,
} from "@/server/types/font.types";
import { FontVariantRepository } from "@/server/db/repo/fontVariant.repository";
import { PageInfoObject, OrderSortDirectionPothosObject, FileInfoPothosObject } from "../pothos";
import { OrderSortDirection } from "@/lib/enum";
import { getStorageService } from "@/server/storage/storage.service";
// Font variant object
const FontVariantObjectRef = gqlSchemaBuilder.objectRef<FontVariantPothosDefinition>("FontVariant");

export const FontVariantPothosObject = gqlSchemaBuilder.loadableObject<
  FontVariantPothosDefinition | Error,
  number,
  [],
  typeof FontVariantObjectRef
>(FontVariantObjectRef, {
  load: async (ids: number[]) => await FontVariantRepository.loadByIds(ids),
  sort: f => f.id,
  fields: t => ({
    id: t.exposeInt("id", { nullable: false }),
    familyId: t.exposeInt("familyId", { nullable: false }),
    variant: t.exposeString("variant", { nullable: false }),
    file: t.field({
      type: FileInfoPothosObject,
      resolve: async font => {
        const storageService = await getStorageService();
        const fileInfo = await storageService.fileInfoByDbFileId(BigInt(font.storageFileId));
        return fileInfo;
      },
    }),
    url: t.field({
      type: "String",
      resolve: async font => {
        const storageService = await getStorageService();
        const fileInfo = await storageService.fileInfoByDbFileId(BigInt(font.storageFileId));
        return fileInfo?.url;
      },
    }),
    createdAt: t.expose("createdAt", { type: "DateTime", nullable: false }),
    updatedAt: t.expose("updatedAt", { type: "DateTime", nullable: false }),
  }),
});

// Font variant usage reference object
export const FontVariantUsageReferencePothosObject = gqlSchemaBuilder
  .objectRef<FontUsageReference>("FontVariantUsageReference")
  .implement({
    fields: t => ({
      elementId: t.exposeInt("elementId", { nullable: false }),
      elementType: t.exposeString("elementType", { nullable: false }),
      templateId: t.exposeInt("templateId", { nullable: true }),
      templateName: t.exposeString("templateName", { nullable: true }),
    }),
  });

// Font variant usage check result object
export const FontVariantUsageCheckResultPothosObject = gqlSchemaBuilder
  .objectRef<FontVariantUsageCheckResult>("FontVariantUsageCheckResult")
  .implement({
    fields: t => ({
      isInUse: t.exposeBoolean("isInUse", { nullable: false }),
      usageCount: t.exposeInt("usageCount", { nullable: false }),
      usedBy: t.expose("usedBy", {
        type: [FontVariantUsageReferencePothosObject],
        nullable: false,
      }),
      canDelete: t.exposeBoolean("canDelete", { nullable: false }),
      deleteBlockReason: t.exposeString("deleteBlockReason", {
        nullable: true,
      }),
    }),
  });

// Font variant create input
const FontVariantCreateInputRef = gqlSchemaBuilder.inputRef<FontVariantCreateInput>("FontVariantCreateInput");

export const FontVariantCreateInputPothosObject = FontVariantCreateInputRef.implement({
  fields: t => ({
    familyId: t.int({ required: true }),
    variant: t.string({ required: true }),
    storageFilePath: t.string({ required: true }),
  }),
});

// Font variant update input
const FontVariantUpdateInputRef = gqlSchemaBuilder.inputRef<FontVariantUpdateInput>("FontVariantUpdateInput");

export const FontVariantUpdateInputPothosObject = FontVariantUpdateInputRef.implement({
  fields: t => ({
    id: t.int({ required: true }),
    variant: t.string({ required: true }),
    storageFilePath: t.string({ required: true }),
  }),
});

// Font variants with filters response
export const FontVariantsWithFiltersPothosObject = gqlSchemaBuilder
  .objectRef<FontVariantsWithFiltersResponse>("FontVariantsWithFiltersResponse")
  .implement({
    fields: t => ({
      data: t.expose("data", { type: [FontVariantPothosObject], nullable: false }),
      pageInfo: t.expose("pageInfo", { type: PageInfoObject, nullable: false }),
    }),
  });

// Font variant filter args
export const FontVariantFilterArgsPothosObject = gqlSchemaBuilder
  .inputRef<FontVariantFilterArgs>("FontVariantFilterArgs")
  .implement({
    fields: t => ({
      familyId: t.int(),
      variant: t.string(),
      variantContains: t.string(),
      createdAtFrom: t.field({ type: "DateTime" }),
      createdAtTo: t.field({ type: "DateTime" }),
    }),
  });

// Font variants order by column enum
export const FontVariantsOrderByColumnPothosObject = gqlSchemaBuilder.enumType("FontVariantsOrderByColumn", {
  values: Object.values(FontVariantsOrderByColumn),
});

// Font variants order by clause
export const FontVariantsOrderByClausePothosObject = gqlSchemaBuilder
  .inputRef<FontVariantsOrderByClause>("FontVariantsOrderByClause")
  .implement({
    fields: t => ({
      column: t.field({
        type: FontVariantsOrderByColumnPothosObject,
        required: true,
      }),
      order: t.field({
        type: OrderSortDirectionPothosObject,
        required: false,
        defaultValue: OrderSortDirection.ASC,
      }),
    }),
  });
