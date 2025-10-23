import { gqlSchemaBuilder } from "../gqlSchemaBuilder";
import { RecipientVariableValueRepository } from "@/server/db/repo";
import {
  RecipientWithVariableValuesPothosObject,
  RecipientVariableValuesGroupResultPothosObject,
} from "../pothos/recipientVariableValue.pothos";

gqlSchemaBuilder.queryFields(t => ({
  // Single recipient (auto-fixes invalid data)
  recipientVariableValues: t.field({
    type: RecipientWithVariableValuesPothosObject,
    nullable: true,
    authScopes: { loggedIn: true },
    description:
      "Get variable values for a recipient. Auto-fixes invalid data by setting to null.",
    args: { recipientGroupItemId: t.arg.int({ required: true }) },
    resolve: async (_, args) =>
      await RecipientVariableValueRepository.findByRecipientGroupItemId(
        args.recipientGroupItemId
      ),
  }),

  // All recipients in group (with pagination, auto-fixes invalid data)
  recipientVariableValuesByGroup: t.field({
    type: RecipientVariableValuesGroupResultPothosObject,
    authScopes: { loggedIn: true },
    description:
      "Get all recipients with values. Auto-fixes invalid data by setting to null. Supports pagination.",
    args: {
      recipientGroupId: t.arg.int({ required: true }),
      limit: t.arg.int(),
      offset: t.arg.int(),
    },
    resolve: async (_, args) =>
      await RecipientVariableValueRepository.findByRecipientGroupId(
        args.recipientGroupId,
        { limit: args.limit ?? undefined, offset: args.offset ?? undefined }
      ),
  }),
}));
