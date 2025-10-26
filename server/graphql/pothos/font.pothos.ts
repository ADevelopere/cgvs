import { gqlSchemaBuilder } from "../gqlSchemaBuilder";
import {
  FontPothosDefinition,
  FontCreateInput,
  FontUpdateInput,
  FontUsageCheckResult,
  FontUsageReference,
} from "@/server/types/font.types";
import { FontRepository } from "@/server/db/repo";

// Font object
const FontObjectRef =
  gqlSchemaBuilder.objectRef<FontPothosDefinition>("Font");

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
        // Parse comma-separated locale string to array
        return font.locale.split(",").filter(l => l.trim().length > 0);
      },
    }),
    storageFileId: t.exposeInt("storageFileId", { nullable: false }),
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
    storageFileId: t.int({ required: true }),
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
    storageFileId: t.int({ required: true }),
  }),
});
