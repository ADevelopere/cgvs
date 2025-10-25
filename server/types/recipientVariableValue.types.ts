import * as Db from "@/server/db/schema";

// Entity types
export type RecipientVariableValueEntity =
  typeof Db.recipientGroupItemVariableValues.$inferSelect;

export type RecipientVariableValueEntityInput =
  typeof Db.recipientGroupItemVariableValues.$inferInsert;

// Simple value map (matches DB structure, allows O(1) access)
export type VariableValuesMap = {
  [variableId: string]: string | number | string[] | null; // Value type determined by template variable definition
};

// Table row - recipient with their values as map
export type RecipientWithVariableValues = {
  recipientGroupItemId: number;
  studentId: number;
  studentName: string;
  variableValues: VariableValuesMap; // Map for efficient column access
};

// Simple input (backend determines type from variable ID)
export type VariableValueInput = {
  variableId: number;
  value?: string | null | undefined; // Always string, backend parses based on variable type
};

// Simplified results - no invalidData, auto-fixed in DB
export type RecipientVariableValuesGroupResult = {
  data: RecipientWithVariableValues[];
  total: number;
};
