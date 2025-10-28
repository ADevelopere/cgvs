import { gqlSchemaBuilder } from "../gqlSchemaBuilder";
import {
  FontPothosDefinition,
  FontCreateInput,
  FontUpdateInput,
  FontUsageCheckResult,
  FontUsageReference,
  FontsWithFiltersResponse,
  FontFilterArgs,
  FontsOrderByColumn,
  FontsOrderByClause,
} from "@/server/types/font.types";
import { FontRepository } from "@/server/db/repo";
import {
  PageInfoObject,
  OrderSortDirectionPothosObject,
  FileInfoPothosObject,
} from "../pothos";
import { OrderSortDirection } from "@/lib/enum";
import { getStorageService } from "@/server/storage/storage.service";

// Font object
const FontObjectRef = gqlSchemaBuilder.objectRef<FontPothosDefinition>("Font");

export const FontPothosObject = gqlSchemaBuilder.loadableObject<
  FontPothosDefinition | Error,
  number,
  [],
  typeof FontObjectRef
>(FontObjectRef, {
  load: async (ids: number[]) => await FontRepository.loadByIds(ids),
  sort: f => f.id,
  fields: t => ({
    id: t.exposeInt("id", { nullable: false }),
    name: t.exposeString("name", { nullable: false }),
    locale: t.field({
      type: ["String"],
      nullable: false,
      resolve: font => {
        // Locale is stored as JSONB array, return directly
        return Array.isArray(font.locale) ? font.locale : [];
      },
    }),
    file: t.field({
      type: FileInfoPothosObject,
      resolve: async font => {
        const storageService = await getStorageService();
        const fileInfo = await storageService.fileInfoByDbFileId(
          BigInt(font.storageFileId)
        );
        return fileInfo;
      },
    }),
    url: t.field({
      type: "String",
      resolve: async font => {
        const storageService = await getStorageService();
        const fileInfo = await storageService.fileInfoByDbFileId(
          BigInt(font.storageFileId)
        );
        return fileInfo?.url;
      },
    }),
    createdAt: t.expose("createdAt", { type: "DateTime", nullable: false }),
    updatedAt: t.expose("updatedAt", { type: "DateTime", nullable: false }),
  }),
});

// Font usage reference object
export const FontUsageReferencePothosObject = gqlSchemaBuilder
  .objectRef<FontUsageReference>("FontUsageReference")
  .implement({
    fields: t => ({
      elementId: t.exposeInt("elementId", { nullable: false }),
      elementType: t.exposeString("elementType", { nullable: false }),
      templateId: t.exposeInt("templateId", { nullable: true }),
      templateName: t.exposeString("templateName", { nullable: true }),
    }),
  });

// Font usage check result object
export const FontUsageCheckResultPothosObject = gqlSchemaBuilder
  .objectRef<FontUsageCheckResult>("FontUsageCheckResult")
  .implement({
    fields: t => ({
      isInUse: t.exposeBoolean("isInUse", { nullable: false }),
      usageCount: t.exposeInt("usageCount", { nullable: false }),
      usedBy: t.expose("usedBy", {
        type: [FontUsageReferencePothosObject],
        nullable: false,
      }),
      canDelete: t.exposeBoolean("canDelete", { nullable: false }),
      deleteBlockReason: t.exposeString("deleteBlockReason", {
        nullable: true,
      }),
    }),
  });

// Font create input
const FontCreateInputRef =
  gqlSchemaBuilder.inputRef<FontCreateInput>("FontCreateInput");

export const FontCreateInputPothosObject = FontCreateInputRef.implement({
  fields: t => ({
    name: t.string({ required: true }),
    locale: t.stringList({ required: true }),
    storageFilePath: t.string({ required: true }),
  }),
});

// Font update input
const FontUpdateInputRef =
  gqlSchemaBuilder.inputRef<FontUpdateInput>("FontUpdateInput");

export const FontUpdateInputPothosObject = FontUpdateInputRef.implement({
  fields: t => ({
    id: t.int({ required: true }),
    name: t.string({ required: true }),
    locale: t.stringList({ required: true }),
    storageFilePath: t.string({ required: true }),
  }),
});

// FontsWithFiltersResponse
export const FontsWithFiltersPothosObject = gqlSchemaBuilder
  .objectRef<FontsWithFiltersResponse>("FontsWithFiltersResponse")
  .implement({
    fields: t => ({
      data: t.expose("data", { type: [FontPothosObject], nullable: false }),
      pageInfo: t.expose("pageInfo", { type: PageInfoObject, nullable: false }),
    }),
  });

// FontFilterArgs
export const FontFilterArgsPothosObject = gqlSchemaBuilder
  .inputRef<FontFilterArgs>("FontFilterArgs")
  .implement({
    fields: t => ({
      name: t.string(),
      nameNotContains: t.string(),
      nameEquals: t.string(),
      nameNotEquals: t.string(),
      nameStartsWith: t.string(),
      nameEndsWith: t.string(),
      nameIsEmpty: t.boolean(),
      nameIsNotEmpty: t.boolean(),

      locale: t.string(),

      createdAt: t.field({ type: "DateTime" }),
      createdAtFrom: t.field({ type: "DateTime" }),
      createdAtTo: t.field({ type: "DateTime" }),
      createdAtAfter: t.field({ type: "DateTime" }),
      createdAtBefore: t.field({ type: "DateTime" }),

      updatedAt: t.field({ type: "DateTime" }),
      updatedAtFrom: t.field({ type: "DateTime" }),
      updatedAtTo: t.field({ type: "DateTime" }),
    }),
  });

// FontsOrderByColumn enum
export const FontsOrderByColumnPothosObject = gqlSchemaBuilder.enumType(
  "FontsOrderByColumn",
  {
    values: Object.values(FontsOrderByColumn),
  }
);

// FontsOrderByClause
export const FontsOrderByClausePothosObject = gqlSchemaBuilder
  .inputRef<FontsOrderByClause>("FontsOrderByClause")
  .implement({
    fields: t => ({
      column: t.field({
        type: FontsOrderByColumnPothosObject,
        required: true,
      }),
      order: t.field({
        type: OrderSortDirectionPothosObject,
        required: false,
        defaultValue: OrderSortDirection.ASC,
      }),
    }),
  });
