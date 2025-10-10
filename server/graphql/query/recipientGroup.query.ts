import { gqlSchemaBuilder } from "../gqlSchemaBuilder";
import { RecipientGroupRepository } from "@/server/db/repo";
import { TemplateRecipientGroupPothosObject } from "@/server/graphql/pothos";

gqlSchemaBuilder.queryFields((t) => ({
    templateRecipientGroupById: t.field({
        type: TemplateRecipientGroupPothosObject,
        args: {
            id: t.arg.int({ required: true }),
        },
        resolve: async (_parent, args) =>
            RecipientGroupRepository.findById(args.id),
    }),

    templateRecipientGroupsByTemplateId: t.field({
        type: [TemplateRecipientGroupPothosObject],
        args: {
            templateId: t.arg.int({ required: true }),
        },
        resolve: async (_parent, args) =>
            RecipientGroupRepository.findAllByTemplateId(args.templateId),
    }),
}));
