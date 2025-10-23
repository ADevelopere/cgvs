import { gqlSchemaBuilder } from "../gqlSchemaBuilder";
import * as Types from "@/server/types";

// Recipient row for table
const RecipientWithVariableValuesRef =
  gqlSchemaBuilder.objectRef<Types.RecipientWithVariableValues>(
    "RecipientWithVariableValues"
  );

export const RecipientWithVariableValuesPothosObject =
  RecipientWithVariableValuesRef.implement({
    fields: t => ({
      recipientGroupItemId: t.exposeInt("recipientGroupItemId"),
      studentId: t.exposeInt("studentId"),
      studentName: t.exposeString("studentName"),
      variableValues: t.field({
        type: "JSON",
        description:
          "Map of variableId to value. Use template variables query to get type/constraint info. All template variables are present (null if not set).",
        resolve: obj => obj.variableValues,
      }),
    }),
  });

// Simple input (just string value, backend parses)
const VariableValueInputRef =
  gqlSchemaBuilder.inputRef<Types.VariableValueInput>("VariableValueInput");

export const VariableValueInputPothosObject = VariableValueInputRef.implement({
  fields: t => ({
    variableId: t.int({ required: true }),
    value: t.string({
      required: true,
      description:
        'Value as string. Backend parses to correct type. For SELECT multiple: JSON array string like \'["opt1","opt2"]\'',
    }),
  }),
});

// Simplified result objects - no invalidData
const RecipientVariableValuesGroupResultRef =
  gqlSchemaBuilder.objectRef<Types.RecipientVariableValuesGroupResult>(
    "RecipientVariableValuesGroupResult"
  );
export const RecipientVariableValuesGroupResultPothosObject =
  RecipientVariableValuesGroupResultRef.implement({
    fields: t => ({
      data: t.field({
        type: [RecipientWithVariableValuesRef],
        resolve: obj => obj.data,
      }),
      total: t.exposeInt("total"),
    }),
  });
