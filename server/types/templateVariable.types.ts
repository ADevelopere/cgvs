import * as Db from "@/server/db/schema";
import { TemplatePothosDefintion } from "./template.types";

// entity types
type TemplateVariableEntity = typeof Db.templateVariableBases.$inferSelect;

export type TemplateVariableEntityInput = typeof Db.templateVariableBases.$inferInsert;

type TemplateTextVariableEntity = typeof Db.templateTextVariables.$inferSelect;
export type TemplateTextVariableEntityInput = typeof Db.templateTextVariables.$inferInsert;

type TemplateNumberVariableEntity = typeof Db.templateNumberVariables.$inferSelect;
export type TemplateNumberVariableEntityInput = typeof Db.templateNumberVariables.$inferInsert;

type TemplateDateVariableEntity = typeof Db.templateDateVariables.$inferSelect;
export type TemplateDateVariableEntityInput = typeof Db.templateDateVariables.$inferInsert;

type TemplateSelectVariableEntity = typeof Db.templateSelectVariables.$inferSelect;
export type TemplateSelectVariableEntityInput = typeof Db.templateSelectVariables.$inferInsert;

export enum TemplateVariableType {
  TEXT = "TEXT",
  NUMBER = "NUMBER",
  DATE = "DATE",
  SELECT = "SELECT",
}

// Pothos defintion
export type TemplateVariablePothosDefinition = TemplateVariableEntity & {
  type: TemplateVariableType;
  template?: TemplatePothosDefintion | null;
};

export type TemplateTextVariablePothosDefinition = TemplateVariablePothosDefinition & TemplateTextVariableEntity;

export type TemplateNumberVariablePothosDefinition = TemplateNumberVariableEntity & TemplateVariablePothosDefinition;

export type TemplateDateVariablePothosDefinition = TemplateDateVariableEntity & TemplateVariablePothosDefinition;

export type TemplateSelectVariablePothosDefinition = Omit<TemplateSelectVariableEntity, "options"> &
  TemplateVariablePothosDefinition & {
    options: string[];
  };

export type TemplateVariablePothosUnion =
  | TemplateTextVariablePothosDefinition
  | TemplateNumberVariablePothosDefinition
  | TemplateDateVariablePothosDefinition
  | TemplateSelectVariablePothosDefinition;

// Create and update inputs
export type TemplateVariableCreateInput = {
  templateId: number;
  name: string;
  required: boolean;
  description?: string | null | undefined;
  previewValue?: string | null | undefined;
};

export type TemplateVariableUpdateInput = {
  id: number;
  name: string;
  required: boolean;
  description?: string | null | undefined;
  previewValue?: string | null | undefined;
};

type TemplateTextVariableProps = {
  minLength?: number | null | undefined;
  maxLength?: number | null | undefined;
  pattern?: string | null | undefined;
};

export type TextTemplateVariableCreateInput = TemplateVariableCreateInput & TemplateTextVariableProps;
export type TextTemplateVariableUpdateInput = TemplateVariableUpdateInput & TemplateTextVariableProps;

type TemplateNumberVariableProps = {
  previewValue?: number | null | undefined;
  minValue?: number | null | undefined;
  maxValue?: number | null | undefined;
  decimalPlaces?: number | null | undefined;
};

export type TemplateNumberVariableCreateInput = Omit<TemplateVariableCreateInput, "previewValue"> &
  TemplateNumberVariableProps;

export type TemplateNumberVariableUpdateInput = Omit<TemplateVariableUpdateInput, "previewValue"> &
  TemplateNumberVariableProps;

type TemplateDateVariableProps = {
  previewValue?: Date | null | undefined;
  minDate?: Date | null | undefined;
  maxDate?: Date | null | undefined;
  format?: string | null | undefined;
};
export type TemplateDateVariableCreateInput = Omit<TemplateVariableCreateInput, "previewValue"> &
  TemplateDateVariableProps;

export type TemplateDateVariableUpdateInput = Omit<TemplateVariableUpdateInput, "previewValue"> &
  TemplateDateVariableProps;

type TemplateSelectVariableProps = {
  options?: string[] | null | undefined;
  multiple?: boolean | null | undefined;
};

export type TemplateSelectVariableCreateInput = TemplateVariableCreateInput & TemplateSelectVariableProps;

export type TemplateSelectVariableUpdateInput = TemplateVariableUpdateInput & TemplateSelectVariableProps;
