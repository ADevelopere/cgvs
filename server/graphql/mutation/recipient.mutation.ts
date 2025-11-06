import { gqlSchemaBuilder } from "../gqlSchemaBuilder";
import {
  TemplateRecipientPothosObject,
  TemplateRecipientCreateInputPothosObject,
  TemplateRecipientCreateListInputPothosObject,
} from "../pothos";
import { RecipientRepository } from "@/server/db/repo";

gqlSchemaBuilder.mutationFields(t => ({
  createRecipient: t.field({
    type: TemplateRecipientPothosObject,
    nullable: false,
    args: {
      input: t.arg({
        type: TemplateRecipientCreateInputPothosObject,
        required: true,
      }),
    },
    resolve: async (_, args) => await RecipientRepository.create(args.input),
  }),

  createRecipients: t.field({
    type: [TemplateRecipientPothosObject],
    nullable: false,
    args: {
      input: t.arg({
        type: TemplateRecipientCreateListInputPothosObject,
        required: true,
      }),
    },
    resolve: async (_, args) => await RecipientRepository.createList(args.input),
  }),

  deleteRecipient: t.field({
    type: TemplateRecipientPothosObject,
    nullable: false,
    args: {
      id: t.arg.int({ required: true }),
    },
    resolve: async (_, args) => await RecipientRepository.deleteById(args.id),
  }),

  deleteRecipients: t.field({
    type: [TemplateRecipientPothosObject],
    nullable: false,
    args: {
      ids: t.arg.intList({ required: true }),
    },
    resolve: async (_, args) => await RecipientRepository.deleteSetByIds(args.ids),
  }),
}));
