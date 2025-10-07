import * as Db from "@/server/db/schema";
import { TemplatePothosDefintion } from "../template/template.types";

// entity types
export type TemplateVariableEntity =
    typeof Db.templateVariableBases.$inferSelect;

export type TemplateVariableEntityInput =
    typeof Db.templateVariableBases.$inferInsert;

export type TemplateTextVariableEntity =
    typeof Db.templateTextVariables.$inferSelect;
export type TemplateTextVariableEntityInput =
    typeof Db.templateTextVariables.$inferInsert;

export type TemplateNumberVariableEntity =
    typeof Db.nemplateNumberVariables.$inferSelect;
export type TemplateNumberVariableEntityInput =
    typeof Db.nemplateNumberVariables.$inferInsert;

export type TemplateDateVariableEntity =
    typeof Db.templateDateVariables.$inferSelect;
export type TemplateDateVariableEntityInput =
    typeof Db.templateDateVariables.$inferInsert;

export type TemplateSelectVariableEntity =
    typeof Db.templateSelectVariables.$inferSelect;
export type TemplateSelectVariableEntityInput =
    typeof Db.templateSelectVariables.$inferInsert;

// Pothos defintion
export type TemplateVariablePothosDefinition = TemplateVariableEntity & {
    template: TemplatePothosDefintion;
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

// Create and update inputs
type TemplateVariableCreateInput = {
    templateId: number;
    name: string;
    description?: string | null;
    required?: boolean | null;
};

type TemplateVariableUpdateInput = {
    id: number;
    name: string;
    description?: string | null;
    required?: boolean | null;
};

type TemplateTextVariableProps = {
    previewValue: string;
    minLength?: number | null;
    maxLength?: number | null;
    pattern?: string | null;
};

export type TextTemplaeVariableCreateInput = TemplateVariableCreateInput &
    TemplateTextVariableProps;
export type TextTemplaeVariableUpdateInput = TemplateVariableUpdateInput &
    TemplateTextVariableProps;

type TemplateNumberVariableProps = {
    previewValue: number;
    minValue?: number | null;
    maxValue?: number | null;
    decimalPlaces?: number | null;
};

export type TemplateNumberVariableCreateInput = TemplateVariableCreateInput &
    TemplateNumberVariableProps;

export type TemplateNumberVariableUpdateInput = TemplateVariableUpdateInput &
    TemplateNumberVariableProps;

type TemplateDateVariableProps = {
    previewValue: Date;
    minDate?: Date | null;
    maxDate?: Date | null;
    format?: string | null;
};
export type TemplateDateVariableCreateInput = TemplateVariableCreateInput &
    TemplateDateVariableProps;

export type TemplateDateVariableUpdateInput = TemplateVariableUpdateInput &
    TemplateDateVariableProps;

type TemplateSelectVariableProps = {
    previewValue: string | null;
    options: string[];
    multiple?: boolean | null;
};

export type TemplateSelectVariableCreateInput = TemplateVariableCreateInput &
    TemplateSelectVariableProps;

export type TemplateSelectVariableUpdateInput = TemplateVariableUpdateInput &
    TemplateSelectVariableProps;
