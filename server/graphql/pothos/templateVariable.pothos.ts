import { templateVariableTypeEnum } from "@/server/db/schema";
import { gqlSchemaBuilder } from "../gqlSchemaBuilder";
import type * as Types from "@/server/types";
import { TemplatePothosObject } from "./template.pothos";
import { TemplateRepository } from "@/server/db/repo";

export const TemplateVariableTypePothosEnum = gqlSchemaBuilder.enumType("TemplateVariableType", {
  values: Object.values(templateVariableTypeEnum.enumValues),
});

export const TemplateVariablePothosInterface = gqlSchemaBuilder
  .interfaceRef<Types.TemplateVariablePothosDefinition>("TemplateVariable")
  .implement({
    fields: t => ({
      id: t.exposeInt("id"),
      name: t.exposeString("name"),
      description: t.exposeString("description"),
      order: t.exposeInt("order"),
      required: t.exposeBoolean("required"),
      type: t.expose("type", {
        type: TemplateVariableTypePothosEnum,
        nullable: true,
      }),
      previewValue: t.exposeString("previewValue"),
      createdAt: t.expose("createdAt", { type: "DateTime" }),
      updatedAt: t.expose("updatedAt", { type: "DateTime" }),
    }),
  });

gqlSchemaBuilder.interfaceFields(TemplateVariablePothosInterface, t => ({
  template: t.loadable({
    type: TemplatePothosObject,
    load: (ids: number[]) => TemplateRepository.loadByIds(ids),
    resolve: templateVariable => templateVariable.templateId,
  }),
}));

export const TemplateTextVariablePothosObjectType = gqlSchemaBuilder
  .objectRef<Types.TemplateTextVariablePothosDefinition>("TemplateTextVariable")
  .implement({
    interfaces: [TemplateVariablePothosInterface],
    isTypeOf: item => typeof item === "object" && item !== null && "type" in item && item.type === "TEXT",
    fields: t => ({
      minLength: t.exposeInt("minLength", { nullable: true }),
      maxLength: t.exposeInt("maxLength", { nullable: true }),
      pattern: t.exposeString("pattern", { nullable: true }),
    }),
  });

export const TemplateNumberVariablePothosObjectType = gqlSchemaBuilder
  .objectRef<Types.TemplateNumberVariablePothosDefinition>("TemplateNumberVariable")
  .implement({
    interfaces: [TemplateVariablePothosInterface],
    isTypeOf: item => typeof item === "object" && item !== null && "type" in item && item.type === "NUMBER",
    fields: t => ({
      minValue: t.exposeFloat("minValue", { nullable: true }),
      maxValue: t.exposeFloat("maxValue", { nullable: true }),
      decimalPlaces: t.exposeInt("decimalPlaces", { nullable: true }),
    }),
  });

export const TemplateDateVariablePothosObjectType = gqlSchemaBuilder
  .objectRef<Types.TemplateDateVariablePothosDefinition>("TemplateDateVariable")
  .implement({
    interfaces: [TemplateVariablePothosInterface],
    isTypeOf: item => typeof item === "object" && item !== null && "type" in item && item.type === "DATE",
    fields: t => ({
      minDate: t.expose("minDate", { type: "DateTime", nullable: true }),
      maxDate: t.expose("maxDate", { type: "DateTime", nullable: true }),
      format: t.exposeString("format", { nullable: true }),
    }),
  });

export const TemplateSelectVariablePothosObjectType = gqlSchemaBuilder
  .objectRef<Types.TemplateSelectVariablePothosDefinition>("TemplateSelectVariable")
  .implement({
    interfaces: [TemplateVariablePothosInterface],
    isTypeOf: item => typeof item === "object" && item !== null && "type" in item && item.type === "SELECT",
    fields: t => ({
      options: t.expose("options", { type: ["String"] }),
      multiple: t.exposeBoolean("multiple", { nullable: true }),
    }),
  });

// Input types for creating template variables
export const TemplateTextVariableCreateInputPothosObject = gqlSchemaBuilder
  .inputRef<Types.TextTemplateVariableCreateInput>("TemplateTextVariableCreateInput")
  .implement({
    fields: t => ({
      templateId: t.int({ required: true }),
      name: t.string({ required: true }),
      description: t.string({ required: false }),
      required: t.boolean({ required: true, defaultValue: false }),
      previewValue: t.string({ required: false }),
      minLength: t.int({ required: false }),
      maxLength: t.int({ required: false }),
      pattern: t.string({ required: false }),
    }),
  });

export const TemplateTextVariableUpdateInputPothosObject = gqlSchemaBuilder
  .inputRef<Types.TextTemplateVariableUpdateInput>("TemplateTextVariableUpdateInput")
  .implement({
    fields: t => ({
      id: t.int({ required: true }),
      name: t.string({ required: true }),
      description: t.string({ required: false }),
      required: t.boolean({ required: true, defaultValue: false }),
      previewValue: t.string({ required: false }),
      minLength: t.int({ required: false }),
      maxLength: t.int({ required: false }),
      pattern: t.string({ required: false }),
    }),
  });

export const TemplateNumberVariableCreateInputPothosObject = gqlSchemaBuilder
  .inputRef<Types.TemplateNumberVariableCreateInput>("TemplateNumberVariableCreateInput")
  .implement({
    fields: t => ({
      templateId: t.int({ required: true }),
      name: t.string({ required: true }),
      description: t.string({ required: false }),
      required: t.boolean({ required: true, defaultValue: false }),
      previewValue: t.float({ required: false }),
      minValue: t.float({ required: false }),
      maxValue: t.float({ required: false }),
      decimalPlaces: t.int({ required: false }),
    }),
  });

export const TemplateNumberVariableUpdateInputPothosObject = gqlSchemaBuilder
  .inputRef<Types.TemplateNumberVariableUpdateInput>("TemplateNumberVariableUpdateInput")
  .implement({
    fields: t => ({
      id: t.int({ required: true }),
      name: t.string({ required: true }),
      description: t.string({ required: false }),
      required: t.boolean({ required: true, defaultValue: false }),
      previewValue: t.float({ required: false }),
      minValue: t.float({ required: false }),
      maxValue: t.float({ required: false }),
      decimalPlaces: t.int({ required: false }),
    }),
  });

export const TemplateDateVariableCreateInputPothosObject = gqlSchemaBuilder
  .inputRef<Types.TemplateDateVariableCreateInput>("TemplateDateVariableCreateInput")
  .implement({
    fields: t => ({
      templateId: t.int({ required: true }),
      name: t.string({ required: true }),
      description: t.string({ required: false }),
      required: t.boolean({ required: true, defaultValue: false }),
      previewValue: t.field({ type: "DateTime", required: false }),
      minDate: t.field({ type: "DateTime", required: false }),
      maxDate: t.field({ type: "DateTime", required: false }),
      format: t.string({ required: false }),
    }),
  });

export const TemplateDateVariableUpdateInputPothosObject = gqlSchemaBuilder
  .inputRef<Types.TemplateDateVariableUpdateInput>("TemplateDateVariableUpdateInput")
  .implement({
    fields: t => ({
      id: t.int({ required: true }),
      name: t.string({ required: true }),
      description: t.string({ required: false }),
      required: t.boolean({ required: true, defaultValue: false }),
      previewValue: t.field({ type: "DateTime", required: false }),
      minDate: t.field({ type: "DateTime", required: false }),
      maxDate: t.field({ type: "DateTime", required: false }),
      format: t.string({ required: false }),
    }),
  });

export const TemplateSelectVariableCreateInputPothosObject = gqlSchemaBuilder
  .inputRef<Types.TemplateSelectVariableCreateInput>("TemplateSelectVariableCreateInput")
  .implement({
    fields: t => ({
      templateId: t.int({ required: true }),
      name: t.string({ required: true }),
      description: t.string({ required: false }),
      required: t.boolean({ required: true, defaultValue: false }),
      previewValue: t.string({ required: false }),
      options: t.stringList({ required: true }),
      multiple: t.boolean({ required: false }),
    }),
  });

export const TemplateSelectVariableUpdateInputPothosObject = gqlSchemaBuilder
  .inputRef<Types.TemplateSelectVariableUpdateInput>("TemplateSelectVariableUpdateInput")
  .implement({
    fields: t => ({
      id: t.int({ required: true }),
      name: t.string({ required: true }),
      description: t.string({ required: false }),
      required: t.boolean({ required: true, defaultValue: false }),
      previewValue: t.string({ required: false }),
      options: t.stringList({ required: true }),
      multiple: t.boolean({ required: false }),
    }),
  });
