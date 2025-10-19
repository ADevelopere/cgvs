import { gqlSchemaBuilder } from "../gqlSchemaBuilder";
import {
  TemplateCategoryCreateInputPothosObject,
  TemplateCategoryPothosObject,
  TemplateCategoryUpdateInputPothosObject,
} from "../pothos";
import { TemplateCategoryRepository } from "@/server/db/repo";

gqlSchemaBuilder.mutationFields(t => ({
  createTemplateCategory: t.field({
    type: TemplateCategoryPothosObject,
    nullable: false,
    args: {
      input: t.arg({
        type: TemplateCategoryCreateInputPothosObject,
        required: true,
      }),
    },
    resolve: async (_, args) => TemplateCategoryRepository.create(args.input),
  }),

  updateTemplateCategory: t.field({
    type: TemplateCategoryPothosObject,
    nullable: false,
    args: {
      input: t.arg({
        type: TemplateCategoryUpdateInputPothosObject,
        required: true,
      }),
    },
    resolve: async (_, args) => TemplateCategoryRepository.update(args.input),
  }),

  deleteTemplateCategory: t.field({
    type: TemplateCategoryPothosObject,
    nullable: false,
    args: {
      id: t.arg.int({ required: true }),
    },
    resolve: async (_, args) => TemplateCategoryRepository.deleteById(args.id),
  }),
}));
