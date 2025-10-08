import { gqlSchemaBuilder } from "../gqlSchemaBuilder";
import {
    TemplateRecipientGroupCreateInputPothosObject,
    TemplateRecipientGroupPothosObject,
    TemplateRecipientGroupUpdateInputPothosObject,
} from "./recipientGroup.pothos";
import { TemplateRecipientGroupRepository } from "./recipientGroup.repository";

gqlSchemaBuilder.mutationFields((t) => ({
    createTemplateRecipientGroup: t.field({
        type: TemplateRecipientGroupPothosObject,
        args: {
            input: t.arg({
                type: TemplateRecipientGroupCreateInputPothosObject,
                required: true,
            }),
        },
        resolve: async (_parent, args) =>
            TemplateRecipientGroupRepository.create(args.input),
    }),

    updateTemplateRecipientGroup: t.field({
        type: TemplateRecipientGroupPothosObject,
        args: {
            input: t.arg({
                type: TemplateRecipientGroupUpdateInputPothosObject,
                required: true,
            }),
        },
        resolve: async (_, args) =>
            TemplateRecipientGroupRepository.update(args.input),
    }),

    deleteTemplateRecipientGroup: t.field({
        type: TemplateRecipientGroupPothosObject,
        args: {
            id: t.arg.int({ required: true }),
        },
        resolve: async (_parent, args) =>
            TemplateRecipientGroupRepository.deleteById(args.id),
    }),
}));
