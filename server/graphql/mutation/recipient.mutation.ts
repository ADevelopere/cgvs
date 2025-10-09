import { gqlSchemaBuilder } from "../gqlSchemaBuilder";
import {
    TemplateRecipientPothosObject,
    TemplateRecipientCreateInputPothosObject,
    TemplateRecipientCreateListInputPothosObject,
} from "../pothos";
import { RecipientRepository } from "@/server/db/repo";

gqlSchemaBuilder.mutationFields((t) => ({
    createRecipient: t.field({
        type: TemplateRecipientPothosObject,
        args: {
            input: t.arg({
                type: TemplateRecipientCreateInputPothosObject,
                required: true,
            }),
        },
        resolve: async (_, args) => RecipientRepository.create(args.input),
    }),

    createRecipients: t.field({
        type: [TemplateRecipientPothosObject],
        args: {
            input: t.arg({
                type: TemplateRecipientCreateListInputPothosObject,
                required: true,
            }),
        },
        resolve: async (_, args) => RecipientRepository.createList(args.input),
    }),

    deleteRecipient: t.field({
        type: TemplateRecipientPothosObject,
        nullable: true,
        args: {
            id: t.arg.int({ required: true }),
        },
        resolve: async (_, args) => RecipientRepository.deleteById(args.id),
    }),

    deleteRecipients: t.field({
        type: [TemplateRecipientPothosObject],
        args: {
            ids: t.arg.intList({ required: true }),
        },
        resolve: async (_, args) =>
            RecipientRepository.deleteSetByIds(args.ids),
    }),
}));
