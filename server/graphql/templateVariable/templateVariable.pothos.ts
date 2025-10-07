import { templateVariableTypeEnum } from "@/server/db/schema";
import { gqlSchemaBuilder } from "../gqlSchemaBuilder";
import type * as TmvTypes from "./templateVariable.types";
import { TemplatePothosObject } from "../template/template.pothos";
import { loadTemplatesByIds } from "../template/template.repository";

export const TemplateVariableTypePothosEnum = gqlSchemaBuilder.enumType(
    "TemplateVariableType",
    {
        values: Object.values(templateVariableTypeEnum.enumValues),
    },
);

export const TemplateVariablePothosInterface = gqlSchemaBuilder
    .interfaceRef<TmvTypes.TemplateVariablePothosDefinition>("TemplateVariable")
    .implement({
        fields: (t) => ({
            id: t.exposeInt("id"),
            name: t.exposeString("name"),
            description: t.exposeString("description"),
            order: t.exposeInt("order"),
            required: t.exposeBoolean("required"),
            type: t.expose("type", {
                type: TemplateVariableTypePothosEnum,
                nullable: true,
            }),
            createdAt: t.expose("createdAt", { type: "DateTime" }),
            updatedAt: t.expose("updatedAt", { type: "DateTime" }),
        }),
    });

gqlSchemaBuilder.interfaceFields(TemplateVariablePothosInterface, (t) => ({
    template: t.loadable({
        type: TemplatePothosObject,
        load: (ids: number[]) => loadTemplatesByIds(ids),
        resolve: (templateVariable) => templateVariable.templateId,
    }),
}));

export const TemplateTextVariablePothosObjectType = gqlSchemaBuilder
    .objectRef<TmvTypes.TemplateTextVariablePothosDefinition>(
        "TemplateTextVariable",
    )
    .implement({
        interfaces: [TemplateVariablePothosInterface],
        isTypeOf: (item) =>
            typeof item === "object" &&
            item !== null &&
            "type" in item &&
            item.type === "TEXT",
        fields: (t) => ({
            minLength: t.exposeInt("minLength", { nullable: true }),
            maxLength: t.exposeInt("maxLength", { nullable: true }),
            pattern: t.exposeString("pattern", { nullable: true }),
            previewValue: t.exposeString("previewValue"),
        }),
    });

export const TemplateNumberVariablePothosObjectType = gqlSchemaBuilder
    .objectRef<TmvTypes.TemplateNumberVariablePothosDefinition>(
        "TemplateNumberVariable",
    )
    .implement({
        interfaces: [TemplateVariablePothosInterface],
        isTypeOf: (item) =>
            typeof item === "object" &&
            item !== null &&
            "type" in item &&
            item.type === "NUMBER",
        fields: (t) => ({
            minValue: t.exposeString("minValue", { nullable: true }),
            maxValue: t.exposeString("maxValue", { nullable: true }),
            decimalPlaces: t.exposeInt("decimalPlaces", { nullable: true }),
            previewValue: t.exposeString("previewValue"),
        }),
    });

export const TemplateDateVariablePothosObjectType = gqlSchemaBuilder
    .objectRef<TmvTypes.TemplateDateVariablePothosDefinition>(
        "TemplateDateVariable",
    )
    .implement({
        interfaces: [TemplateVariablePothosInterface],
        isTypeOf: (item) =>
            typeof item === "object" &&
            item !== null &&
            "type" in item &&
            item.type === "DATE",
        fields: (t) => ({
            minDate: t.expose("minDate", { type: "DateTime", nullable: true }),
            maxDate: t.expose("maxDate", { type: "DateTime", nullable: true }),
            format: t.exposeString("format", { nullable: true }),
            previewValue: t.expose("previewValue", { type: "DateTime" }),
        }),
    });

export const TemplateSelectVariablePothosObjectType = gqlSchemaBuilder
    .objectRef<TmvTypes.TemplateSelectVariablePothosDefinition>(
        "TemplateSelectVariable",
    )
    .implement({
        interfaces: [TemplateVariablePothosInterface],
        isTypeOf: (item) =>
            typeof item === "object" &&
            item !== null &&
            "type" in item &&
            item.type === "SELECT",
        fields: (t) => ({
            options: t.expose("options", { type: ["String"] }),
            multiple: t.exposeBoolean("multiple", { nullable: true }),
            previewValue: t.exposeString("previewValue", { nullable: true }),
        }),
    });

// Input types for creating template variables
export const TemplateTextVariableCreateInputPothosObject = gqlSchemaBuilder
    .inputRef<TmvTypes.TextTemplaeVariableCreateInput>(
        "TemplateTextVariableCreateInput",
    )
    .implement({
        fields: (t) => ({
            templateId: t.int({ required: true }),
            name: t.string({ required: true }),
            description: t.string({ required: false }),
            required: t.boolean({ required: false }),
            previewValue: t.string({ required: true }),
            minLength: t.int({ required: false }),
            maxLength: t.int({ required: false }),
            pattern: t.string({ required: false }),
        }),
    });

export const TemplateTextVariableUpdateInputPothosObject = gqlSchemaBuilder
    .inputRef<TmvTypes.TextTemplaeVariableUpdateInput>(
        "TemplateTextVariableUpdateInput",
    )
    .implement({
        fields: (t) => ({
            id: t.int({ required: true }),
            name: t.string({ required: true }),
            description: t.string({ required: false }),
            required: t.boolean({ required: false }),
            previewValue: t.string({ required: true }),
            minLength: t.int({ required: false }),
            maxLength: t.int({ required: false }),
            pattern: t.string({ required: false }),
        }),
    });

export const TemplateNumberVariableCreateInputPothosObject = gqlSchemaBuilder
    .inputRef<TmvTypes.TemplateNumberVariableCreateInput>(
        "TemplateNumberVariableCreateInput",
    )
    .implement({
        fields: (t) => ({
            templateId: t.int({ required: true }),
            name: t.string({ required: true }),
            description: t.string({ required: false }),
            required: t.boolean({ required: false }),
            previewValue: t.float({ required: true }),
            minValue: t.float({ required: false }),
            maxValue: t.float({ required: false }),
            decimalPlaces: t.int({ required: false }),
        }),
    });

export const TemplateNumberVariableUpdateInputPothosObject = gqlSchemaBuilder
    .inputRef<TmvTypes.TemplateNumberVariableUpdateInput>(
        "TemplateNumberVariableUpdateInput",
    )
    .implement({
        fields: (t) => ({
            id: t.int({ required: true }),
            name: t.string({ required: true }),
            description: t.string({ required: false }),
            required: t.boolean({ required: false }),
            previewValue: t.float({ required: true }),
            minValue: t.float({ required: false }),
            maxValue: t.float({ required: false }),
            decimalPlaces: t.int({ required: false }),
        }),
    });

export const TemplateDateVariableCreateInputPothosObject = gqlSchemaBuilder
    .inputRef<TmvTypes.TemplateDateVariableCreateInput>(
        "TemplateDateVariableCreateInput",
    )
    .implement({
        fields: (t) => ({
            templateId: t.int({ required: true }),
            name: t.string({ required: true }),
            description: t.string({ required: false }),
            required: t.boolean({ required: false }),
            previewValue: t.field({ type: "DateTime", required: true }),
            minDate: t.field({ type: "DateTime", required: false }),
            maxDate: t.field({ type: "DateTime", required: false }),
            format: t.string({ required: false }),
        }),
    });

export const TemplateDateVariableUpdateInputPothosObject = gqlSchemaBuilder
    .inputRef<TmvTypes.TemplateDateVariableUpdateInput>(
        "TemplateDateVariableUpdateInput",
    )
    .implement({
        fields: (t) => ({
            id: t.int({ required: true }),
            name: t.string({ required: true }),
            description: t.string({ required: false }),
            required: t.boolean({ required: false }),
            previewValue: t.field({ type: "DateTime", required: true }),
            minDate: t.field({ type: "DateTime", required: false }),
            maxDate: t.field({ type: "DateTime", required: false }),
            format: t.string({ required: false }),
        }),
    });

export const TemplateSelectVariableCreateInputPothosObject = gqlSchemaBuilder
    .inputRef<TmvTypes.TemplateSelectVariableCreateInput>(
        "TemplateSelectVariableCreateInput",
    )
    .implement({
        fields: (t) => ({
            templateId: t.int({ required: true }),
            name: t.string({ required: true }),
            description: t.string({ required: false }),
            required: t.boolean({ required: false }),
            previewValue: t.string({ required: false }),
            options: t.stringList({ required: true }),
            multiple: t.boolean({ required: false }),
        }),
    });

export const TemplateSelectVariableUpdateInputPothosObject = gqlSchemaBuilder
    .inputRef<TmvTypes.TemplateSelectVariableUpdateInput>(
        "TemplateSelectVariableUpdateInput",
    )
    .implement({
        fields: (t) => ({
            id: t.int({ required: true }),
            name: t.string({ required: true }),
            description: t.string({ required: false }),
            required: t.boolean({ required: false }),
            previewValue: t.string({ required: false }),
            options: t.stringList({ required: true }),
            multiple: t.boolean({ required: false }),
        }),
    });


