import { gqlSchemaBuilder } from "../gqlSchemaBuilder";
import { TemplateCategoryPothosObject } from "@/server/graphql/pothos";
import { TemplateCategoryRepository } from "@/server/db/repo";

gqlSchemaBuilder.queryFields((t) => ({
 templateCategory: t.field({
  type: TemplateCategoryPothosObject,
  nullable: true,
  args: {
   id: t.arg.int({ required: true }),
  },
  resolve: async (_query, args) =>
   await TemplateCategoryRepository.findById(args.id),
 }),

 templateCategories: t.field({
  type: [TemplateCategoryPothosObject],
  nullable: false,
  resolve: async () => await TemplateCategoryRepository.findAll(),
 }),

 mainTemplateCategory: t.field({
  type: TemplateCategoryPothosObject,
  nullable: false,
  resolve: async () =>
   await TemplateCategoryRepository.findTemplatesMainCategory(),
 }),

 suspensionTemplateCategory: t.field({
  type: TemplateCategoryPothosObject,
  nullable: false,
  resolve: async () =>
   await TemplateCategoryRepository.findTemplatesSuspensionCategory(),
 }),
}));
