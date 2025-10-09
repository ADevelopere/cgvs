import * as Db from "@/server/db/schema";
import { TemplatePothosDefintion } from "./template.types";

// entity types
type TemplateVariableEntity = typeof Db.templateVariableBases.$inferSelect;

export type TemplateVariableEntityInput =
    typeof Db.templateVariableBases.$inferInsert;

type TemplateTextVariableEntity = typeof Db.templateTextVariables.$inferSelect;
export type TemplateTextVariableEntityInput =
    typeof Db.templateTextVariables.$inferInsert;

type TemplateNumberVariableEntity =
    typeof Db.templateNumberVariables.$inferSelect;
export type TemplateNumberVariableEntityInput =
    typeof Db.templateNumberVariables.$inferInsert;

type TemplateDateVariableEntity = typeof Db.templateDateVariables.$inferSelect;
export type TemplateDateVariableEntityInput =
    typeof Db.templateDateVariables.$inferInsert;

type TemplateSelectVariableEntity =
    typeof Db.templateSelectVariables.$inferSelect;
export type TemplateSelectVariableEntityInput =
    typeof Db.templateSelectVariables.$inferInsert;

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

export type TemplateTextVariablePothosDefinition =
    TemplateVariablePothosDefinition & TemplateTextVariableEntity;

export type TemplateNumberVariablePothosDefinition =
    TemplateNumberVariableEntity & TemplateVariablePothosDefinition;

export type TemplateDateVariablePothosDefinition = TemplateDateVariableEntity &
    TemplateVariablePothosDefinition;

export type TemplateSelectVariablePothosDefinition = Omit<
    TemplateSelectVariableEntity,
    "options"
> &
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
    description?: string | null;
    previewValue?: string | null;
};

export type TemplateVariableUpdateInput = {
    id: number;
    name: string;
    required: boolean;
    description?: string | null;
    previewValue?: string | null;
};

type TemplateTextVariableProps = {
    minLength?: number | null;
    maxLength?: number | null;
    pattern?: string | null;
};

export type TextTemplaeVariableCreateInput = TemplateVariableCreateInput &
    TemplateTextVariableProps;
export type TextTemplaeVariableUpdateInput = TemplateVariableUpdateInput &
    TemplateTextVariableProps;

type TemplateNumberVariableProps = {
    previewValue?: number | null;
    minValue?: number | null;
    maxValue?: number | null;
    decimalPlaces?: number | null;
};

export type TemplateNumberVariableCreateInput = Omit<
    TemplateVariableCreateInput,
    "previewValue"
> &
    TemplateNumberVariableProps;

export type TemplateNumberVariableUpdateInput = Omit<
    TemplateVariableUpdateInput,
    "previewValue"
> &
    TemplateNumberVariableProps;

type TemplateDateVariableProps = {
    previewValue?: Date | null;
    minDate?: Date | null;
    maxDate?: Date | null;
    format?: string | null;
};
export type TemplateDateVariableCreateInput = Omit<
    TemplateVariableCreateInput,
    "previewValue"
> &
    TemplateDateVariableProps;

export type TemplateDateVariableUpdateInput = Omit<
    TemplateVariableUpdateInput,
    "previewValue"
> &
    TemplateDateVariableProps;

type TemplateSelectVariableProps = {
    options?: string[] | null;
    multiple?: boolean | null;
};

export type TemplateSelectVariableCreateInput = TemplateVariableCreateInput &
    TemplateSelectVariableProps;

export type TemplateSelectVariableUpdateInput = TemplateVariableUpdateInput &
    TemplateSelectVariableProps;
