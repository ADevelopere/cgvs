import type {
    CreateDateTemplateVariableMutation,
    UpdateDateTemplateVariableMutation,
    DeleteTemplateVariableMutation,
    TemplateDateVariable,
    UpdateDateTemplateVariableInput,
    Template
} from "@/graphql/generated/types";

export type DateTemplateVariableSource =
    | CreateDateTemplateVariableMutation
    | UpdateDateTemplateVariableMutation
    | DeleteTemplateVariableMutation;

type PartialDateTemplateVariable = Partial<TemplateDateVariable> & { id: string; name: string };

/**
 * Maps a date template variable from any source to a consistent TemplateDateVariable type
 */
const mapDateTemplateVariable = (
    variable: PartialDateTemplateVariable | null | undefined,
    previousVariable?: TemplateDateVariable | null,
): TemplateDateVariable => {
    if (!variable) {
        // Create a minimal valid TemplateDateVariable
        return {
            id: '',
            name: '',
            description: null,
            required: false,
            order: 0,
            preview_value: null,
            template: {
                id: '',
                name: '',
                created_at: new Date(),
                updated_at: new Date(),
            } as Template,
            type: 'date',
            created_at: new Date(),
            updated_at: new Date(),
            min_date: null,
            max_date: null,
            format: null,
            values: []
        } as TemplateDateVariable;
    }

    return {
        id: variable.id,
        name: variable.name,
        description: variable.description ?? previousVariable?.description ?? null,
        required: variable.required ?? previousVariable?.required ?? false,
        order: variable.order ?? previousVariable?.order ?? 0,
        preview_value: variable.preview_value ?? previousVariable?.preview_value ?? null,
        template: variable.template ?? previousVariable?.template ?? {
            id: '',
            name: '',
            created_at: new Date(),
            updated_at: new Date(),
        } as Template,
        type: 'date',
        created_at: variable.created_at ?? previousVariable?.created_at ?? new Date(),
        updated_at: variable.updated_at ?? previousVariable?.updated_at ?? new Date(),
        min_date: variable.min_date ?? previousVariable?.min_date ?? null,
        max_date: variable.max_date ?? previousVariable?.max_date ?? null,
        format: variable.format ?? previousVariable?.format ?? null,
        values: variable.values ?? previousVariable?.values ?? []
    } as TemplateDateVariable;
};

/**
 * Maps a creation date template variable mutation result to a TemplateDateVariable
 */
const mapCreateDateTemplateVariable = (source: CreateDateTemplateVariableMutation): TemplateDateVariable => {
    return mapDateTemplateVariable(source.createDateTemplateVariable as PartialDateTemplateVariable);
};

/**
 * Maps an update date template variable mutation result to a TemplateDateVariable
 */
const mapUpdateDateTemplateVariable = (
    source: UpdateDateTemplateVariableMutation,
    previousVariable?: TemplateDateVariable,
): TemplateDateVariable => {
    return mapDateTemplateVariable(
        source.updateDateTemplateVariable as PartialDateTemplateVariable,
        previousVariable,
    );
};

/**
 * Maps a delete template variable mutation result to a TemplateDateVariable
 */
const mapDeleteTemplateVariable = (
    source: DeleteTemplateVariableMutation,
    previousVariable?: TemplateDateVariable,
): TemplateDateVariable => {
    return mapDateTemplateVariable(
        source.deleteTemplateVariable as PartialDateTemplateVariable,
        previousVariable,
    );
};

/**
 * Maps any date template variable source to a single TemplateDateVariable or null
 */
export const mapSingleDateTemplateVariable = (
    source: DateTemplateVariableSource | undefined | null,
    previousVariable?: TemplateDateVariable,
): TemplateDateVariable | null => {
    if (!source) {
        return null;
    }

    if ("createDateTemplateVariable" in source) {
        return mapCreateDateTemplateVariable(source);
    }
    if ("updateDateTemplateVariable" in source) {
        return mapUpdateDateTemplateVariable(source, previousVariable);
    }
    if ("deleteTemplateVariable" in source) {
        return mapDeleteTemplateVariable(source, previousVariable);
    }

    return null;
};

/**
 * Maps a TemplateDateVariable to a DateTemplateVariableInput
 */
export const mapDateTemplateVariableToInput = (
    variable: TemplateDateVariable,
): UpdateDateTemplateVariableInput => {
    return {
        id: variable.id,
        name: variable.name,
        description: variable.description,
        required: variable.required,
        order: variable.order,
        preview_value: variable.preview_value,
        template_id: variable.template.id,
        min_date: variable.min_date,
        max_date: variable.max_date,
        format: variable.format,
    };
};
