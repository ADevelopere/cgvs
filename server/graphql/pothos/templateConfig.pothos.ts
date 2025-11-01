import { gqlSchemaBuilder } from "../gqlSchemaBuilder";
import * as Types from "@/server/types";
import { CountryCodePothosObject, TemplatePothosObject } from "../pothos";
import { TemplateRepository } from "@/server/db/repo";

export const TemplateConfigCreateInputPothosObject = gqlSchemaBuilder
  .inputRef<Types.TemplateConfigInput>("TemplateConfigCreateInput")
  .implement({
    fields: t => ({
      templateId: t.int({ required: true }),
      width: t.int({ required: true }),
      height: t.int({ required: true }),
      locale: t.field({
        type: CountryCodePothosObject,
        required: true,
      }),
    }),
  });

export const TemplateConfigUpdateInputPothosObject = gqlSchemaBuilder
  .inputRef<Types.TemplateConfigUpdateInput>("TemplateConfigUpdateInput")
  .implement({
    fields: t => ({
      id: t.int({ required: true }),
      width: t.int({ required: true }),
      height: t.int({ required: true }),
      locale: t.field({
        type: CountryCodePothosObject,
        required: true,
      }),
    }),
  });

export const TemplateConfigPothosObject = gqlSchemaBuilder
  .objectRef<Types.TemplateConfig>("TemplateConfig")
  .implement({
    fields: t => ({
      id: t.exposeInt("id", { nullable: false }),
      templateId: t.exposeInt("templateId", { nullable: false }),
      width: t.exposeInt("width", { nullable: false }),
      height: t.exposeInt("height", { nullable: false }),
      locale: t.field({
        type: CountryCodePothosObject,
        nullable: false,
        resolve: tc => tc.locale,
      }),
      createdAt: t.expose("createdAt", {
        type: "DateTime",
        nullable: false,
      }),
      updatedAt: t.expose("updatedAt", {
        type: "DateTime",
        nullable: false,
      }),
    }),
  });

gqlSchemaBuilder.objectFields(TemplateConfigPothosObject, t => ({
  template: t.loadable({
    type: TemplatePothosObject,
    load: (ids: number[]) => TemplateRepository.loadByIds(ids),
    resolve: templateVariable => templateVariable.templateId,
  }),
}));
