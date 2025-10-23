import { gqlSchemaBuilder } from "../gqlSchemaBuilder";
import { RecipientVariableValueRepository } from "@/server/db/repo";
import {
  RecipientWithVariableValuesPothosObject,
  VariableValueInputPothosObject,
} from "../pothos/recipientVariableValue.pothos";

gqlSchemaBuilder.mutationFields(t => ({
  setRecipientVariableValues: t.field({
    type: RecipientWithVariableValuesPothosObject,
    authScopes: { loggedIn: true },
    description: "Update variable values. Throws on validation errors.",
    args: {
      recipientGroupItemId: t.arg.int({ required: true }),
      values: t.arg({ type: [VariableValueInputPothosObject], required: true }),
    },
    resolve: async (_, args) =>
      await RecipientVariableValueRepository.upsertVariableValues(
        args.recipientGroupItemId,
        args.values
      ),
  }),
}));

