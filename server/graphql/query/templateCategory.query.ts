import { gqlSchemaBuilder } from "../gqlSchemaBuilder";
import {
  TemplateCategoryPothosObject,
  TemplateCategoryWithParentTreePothosObject,
} from "@/server/graphql/pothos";
import { TemplateCategoryRepository } from "@/server/db/repo";

gqlSchemaBuilder.queryFields(t => ({
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

  categoryChildren: t.field({
    type: [TemplateCategoryPothosObject],
    nullable: false,
    args: {
      parentCategoryId: t.arg.int({ required: false }),
    },
    resolve: async (_query, args) =>
      await TemplateCategoryRepository.findCategoryChildren(
        args.parentCategoryId
      ),
  }),

  searchTemplateCategories: t.field({
    type: [TemplateCategoryWithParentTreePothosObject],
    nullable: false,
    args: {
      searchTerm: t.arg.string({ required: true }),
      limit: t.arg.int({ required: false }),
      includeParentTree: t.arg.boolean({ required: false }),
    },
    resolve: async (_query, args) =>
      await TemplateCategoryRepository.searchByName(
        args.searchTerm,
        args.limit ?? 10,
        args.includeParentTree ?? false
      ),
  }),
}));
