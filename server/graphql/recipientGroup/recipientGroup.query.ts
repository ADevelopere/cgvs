import { gqlSchemaBuilder } from "../gqlSchemaBuilder";
import { TemplateRecipientGroupPothosObject } from "./recipientGroup.pothos";
import { TemplateRecipientGroupRepository } from "./recipientGroup.repository";

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
