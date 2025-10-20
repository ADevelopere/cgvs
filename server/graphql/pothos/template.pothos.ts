import { gqlSchemaBuilder } from "../gqlSchemaBuilder";
import * as Types from "@/server/types";
import {
  TemplateRepository,
  TemplateVariableRepository,
  RecipientGroupRepository,
} from "@/server/db/repo";
import {
  PageInfoObject,
  TemplateCategoryPothosObject,
  TemplateVariablePothosInterface,
  TemplateRecipientGroupPothosObject,
  FileInfoPothosObject,
  OrderSortDirectionPothosObject,
} from "../pothos";
import { getStorageService } from "@/server/storage/storage.service";
import { OrderSortDirection } from "@/lib/enum";

export const TemplatePothosObject = gqlSchemaBuilder
  .loadableObjectRef<Types.TemplatePothosDefintion, number>("Template", {
    load: async (ids: number[]) => TemplateRepository.loadByIds(ids),
    sort: t => t.id,
  })
  .implement({
    fields: t => ({
      id: t.exposeInt("id", { nullable: false }),
      name: t.exposeString("name", { nullable: true }),
      description: t.exposeString("description", { nullable: true }),
      order: t.exposeInt("order", { nullable: true }),
      createdAt: t.expose("createdAt", {
        type: "DateTime",
        nullable: true,
      }),
      updatedAt: t.expose("updatedAt", {
        type: "DateTime",
        nullable: true,
      }),
      imageUrl: t.string({
        nullable: true,
        resolve: async template => {
          if (template.imageFileId) {
            const imageFileInfo = await (
              await getStorageService()
            ).fileInfoByDbFileId(template.imageFileId);
            return imageFileInfo?.url;
          }
          return null;
        },
      }),
    }),
  });

gqlSchemaBuilder.objectFields(TemplatePothosObject, t => ({
  category: t.loadable({
    type: TemplateCategoryPothosObject,
    load: (ids: number[], ctx) =>
      TemplateCategoryPothosObject.getDataloader(ctx).loadMany(ids),
    resolve: template => template.categoryId,
  }),

  preSuspensionCategory: t.loadable({
    type: TemplateCategoryPothosObject,
    load: (ids: number[], ctx) =>
      TemplateCategoryPothosObject.getDataloader(ctx).loadMany(ids),
    resolve: template => template.preSuspensionCategoryId,
  }),

  variables: t.loadableList({
    type: TemplateVariablePothosInterface,
    load: (ids: number[]) => TemplateVariableRepository.loadForTemplates(ids),
    resolve: template => template.id,
  }),

  imageFile: t.field({
    type: FileInfoPothosObject,
    resolve: async template => {
      if (!template.imageFileId) return null;
      const s = await getStorageService();
      return await s.fileInfoByDbFileId(template.imageFileId);
    },
  }),
  recipientGroups: t.loadableList({
    type: TemplateRecipientGroupPothosObject,
    load: (ids: number[]) => RecipientGroupRepository.loadForTemplates(ids),
    resolve: template => template.id,
  }),
}));

export const TemplateCreateInputPothosObject = gqlSchemaBuilder
  .inputRef<Types.TemplateCreateInput>("TemplateCreateInput")
  .implement({
    fields: t => ({
      name: t.string({ required: true }),
      description: t.string({ required: false }),
      categoryId: t.int({ required: true }),
    }),
  });

export const TemplateUpdateInputPothosObject = gqlSchemaBuilder
  .inputRef<Types.TemplateUpdateInput>("TemplateUpdateInput")
  .implement({
    fields: t => ({
      id: t.int({ required: true }),
      name: t.string({ required: true }),
      categoryId: t.int({ required: true }),
      description: t.string({ required: false }),
      imagePath: t.string({ required: false }),
    }),
  });

export const PaginatedTemplatesResponsePothosObject = gqlSchemaBuilder
  .objectRef<Types.PaginatedTemplatesResponse>("PaginatedTemplatesResponse")
  .implement({
    fields: t => ({
      data: t.expose("data", { type: [TemplatePothosObject] }),
      pageInfo: t.expose("pageInfo", { type: PageInfoObject }),
    }),
  });

export const TemplatesConfigsKeyPothosObject = gqlSchemaBuilder.enumType(
  "TemplatesConfigsKey",
  {
    values: Types.TemplatesConfigsKeyValues,
  }
);

export const TemplatesConfigPothosObject = gqlSchemaBuilder
  .objectRef<Types.TemplatesConfigPothosDefinition>("TemplatesConfig")
  .implement({
    fields: t => ({
      key: t.expose("key", { type: TemplatesConfigsKeyPothosObject }),
      value: t.exposeString("value"),
    }),
  });

export const TemplatesConfigsPothosObject = gqlSchemaBuilder
  .objectRef<Types.TemplatesConfigsPothosDefinition>("TemplatesConfigs")
  .implement({
    fields: t => ({
      configs: t.expose("configs", {
        type: [TemplatesConfigPothosObject],
      }),
    }),
  });

export const TemplatesWithFiltersPothosObject = gqlSchemaBuilder
  .objectRef<Types.TemplatesWithFiltersResponse>("TemplatesWithFiltersResponse")
  .implement({
    fields: t => ({
      data: t.expose("data", { type: [TemplatePothosObject], nullable: false }),
      pageInfo: t.expose("pageInfo", { type: PageInfoObject, nullable: false }),
    }),
  });

export const TemplateFilterArgsPothosObject = gqlSchemaBuilder
  .inputRef<Types.TemplateFilterArgs>("TemplateFilterArgs")
  .implement({
    fields: t => ({
      name: t.string(),
    }),
  });

export const TemplatesOrderByColumnPothosObject = gqlSchemaBuilder.enumType(
  "TemplatesOrderByColumn",
  {
    values: Object.values(Types.TemplatesOrderByColumn),
  }
);

export const TemplatesOrderByClausePothosObject = gqlSchemaBuilder
  .inputRef<Types.TemplatesOrderByClause>("TemplatesOrderByClause")
  .implement({
    fields: t => ({
      column: t.field({
        type: TemplatesOrderByColumnPothosObject,
        required: true,
      }),
      order: t.field({
        type: OrderSortDirectionPothosObject,
        required: false,
        defaultValue: OrderSortDirection.ASC,
      }),
    }),
  });
