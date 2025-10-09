import { gqlSchemaBuilder } from "../gqlSchemaBuilder";
import { TemplateRecipientGroupRepository } from "@/server/db/repo";
import { TemplateRecipientGroupPothosObject } from "@/server/graphql/pothos";

gqlSchemaBuilder.queryFields((t) => ({
    templateRecipientGroupsByTemplateId: t.field({
        type: [TemplateRecipientGroupPothosObject],
        args: {
            templateId: t.arg.int({ required: true }),
        },
        resolve: async (_parent, args) =>
            TemplateRecipientGroupRepository.findAllByTemplateId(
                args.templateId,
            ),
    }),
}));
