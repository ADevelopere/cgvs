import { gqlSchemaBuilder } from "../gqlSchemaBuilder";
import {
  TemplateRecipientGroupCreateInputPothosObject,
  TemplateRecipientGroupPothosObject,
  TemplateRecipientGroupUpdateInputPothosObject,
} from "../pothos";
import { RecipientGroupRepository as Repo } from "@/server/db/repo";

gqlSchemaBuilder.mutationFields(t => ({
  createTemplateRecipientGroup: t.field({
    type: TemplateRecipientGroupPothosObject,
    args: {
      input: t.arg({
        type: TemplateRecipientGroupCreateInputPothosObject,
        required: true,
      }),
    },
    resolve: async (_parent, args) => Repo.create(args.input),
  }),

  updateTemplateRecipientGroup: t.field({
    type: TemplateRecipientGroupPothosObject,
    args: {
      input: t.arg({
        type: TemplateRecipientGroupUpdateInputPothosObject,
        required: true,
      }),
    },
    resolve: async (_, args) => Repo.update(args.input),
  }),

  deleteTemplateRecipientGroup: t.field({
    type: TemplateRecipientGroupPothosObject,
    args: {
      id: t.arg.int({ required: true }),
    },
    resolve: async (_parent, args) => Repo.deleteById(args.id),
  }),
}));
