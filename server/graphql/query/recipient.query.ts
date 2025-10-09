import { gqlSchemaBuilder } from "../gqlSchemaBuilder";
import { TemplateRecipientPothosObject } from "../pothos";
import { RecipientRepository } from "@/server/db/repo";

gqlSchemaBuilder.queryFields((t) => ({
    recipient: t.field({
        type: TemplateRecipientPothosObject,
        nullable: true,
        args: {
            id: t.arg.int({ required: true }),
        },
        resolve: async (_, args) => RecipientRepository.findById(args.id),
    }),

    recipientsByGroupId: t.field({
        type: [TemplateRecipientPothosObject],
        args: {
            recipientGroupId: t.arg.int({ required: true }),
        },
        resolve: async (_, args) =>
            RecipientRepository.findAllByGroupId(args.recipientGroupId),
    }),

    recipientsByStudentId: t.field({
        type: [TemplateRecipientPothosObject],
        args: {
            studentId: t.arg.int({ required: true }),
        },
        resolve: async (_, args) =>
            RecipientRepository.findByStudentId(args.studentId),
    }),
}));
