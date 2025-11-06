import { gqlSchemaBuilder } from "../gqlSchemaBuilder";
import * as Types from "@/server/types";
import { AppLanguagePothosObject, TemplatePothosObject } from "../pothos";
import { TemplateRepository } from "@/server/db/repo";

export const TemplateConfigCreateInputPothosObject = gqlSchemaBuilder
  .inputRef<Types.TemplateConfigInput>("TemplateConfigCreateInput")
  .implement({
    fields: t => ({
      templateId: t.int({ required: true }),
      width: t.int({ required: true }),
      height: t.int({ required: true }),
      language: t.field({
        type: AppLanguagePothosObject,
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
      language: t.field({
        type: AppLanguagePothosObject,
        required: true,
      }),
    }),
  });

export const TemplateConfigPothosObject = gqlSchemaBuilder.objectRef<Types.TemplateConfig>("TemplateConfig").implement({
  fields: t => ({
    id: t.exposeInt("id", { nullable: false }),
    templateId: t.exposeInt("templateId"),
    width: t.exposeInt("width", { nullable: false }),
    height: t.exposeInt("height", { nullable: false }),
    language: t.field({
      type: AppLanguagePothosObject,
      nullable: false,
      resolve: tc => tc.language,
    }),
    createdAt: t.expose("createdAt", {
      type: "DateTime",
    }),
    updatedAt: t.expose("updatedAt", {
      type: "DateTime",
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
