import type {
    CreateTextTemplateVariableMutation,
    UpdateTextTemplateVariableMutation,
    DeleteTemplateVariableMutation,
    TemplateTextVariable,
    TextTemplateVariableInput,
    Template
} from "@/graphql/generated/types";

export type TextTemplateVariableSource =
    | CreateTextTemplateVariableMutation
    | UpdateTextTemplateVariableMutation
    | DeleteTemplateVariableMutation;

type PartialTextTemplateVariable = Partial<TemplateTextVariable> & { id: string; name: string };

/**
 * Maps a text template variable from any source to a consistent TemplateTextVariable type
 */
const mapTextTemplateVariable = (
    variable: PartialTextTemplateVariable | null | undefined,
    previousVariable?: TemplateTextVariable | null,
): TemplateTextVariable => {
    if (!variable) {
        // Create a minimal valid TemplateTextVariable
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
            type: 'text',
            created_at: new Date(),
            updated_at: new Date(),
            min_length: null,
            max_length: null,
            values: []
        } as TemplateTextVariable;
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
        type: 'text',
        created_at: variable.created_at ?? previousVariable?.created_at ?? new Date(),
        updated_at: variable.updated_at ?? previousVariable?.updated_at ?? new Date(),
        min_length: variable.min_length ?? previousVariable?.min_length ?? null,
        max_length: variable.max_length ?? previousVariable?.max_length ?? null,
        values: variable.values ?? previousVariable?.values ?? []
    } as TemplateTextVariable;
};

/**
 * Maps a creation text template variable mutation result to a TemplateTextVariable
 */
const mapCreateTextTemplateVariable = (source: CreateTextTemplateVariableMutation): TemplateTextVariable => {
    return mapTextTemplateVariable(source.createTextTemplateVariable as PartialTextTemplateVariable);
};

/**
 * Maps an update text template variable mutation result to a TemplateTextVariable
 */
const mapUpdateTextTemplateVariable = (
    source: UpdateTextTemplateVariableMutation,
    previousVariable?: TemplateTextVariable,
): TemplateTextVariable => {
    return mapTextTemplateVariable(
        source.updateTextTemplateVariable as PartialTextTemplateVariable,
        previousVariable,
    );
};

/**
 * Maps a delete template variable mutation result to a TemplateTextVariable
 */
const mapDeleteTemplateVariable = (
    source: DeleteTemplateVariableMutation,
    previousVariable?: TemplateTextVariable,
): TemplateTextVariable => {
    return mapTextTemplateVariable(
        source.deleteTemplateVariable as PartialTextTemplateVariable,
        previousVariable,
    );
};

/**
 * Maps any text template variable source to a single TemplateTextVariable or null
 */
export const mapSingleTextTemplateVariable = (
    source: TextTemplateVariableSource | undefined | null,
    previousVariable?: TemplateTextVariable,
): TemplateTextVariable | null => {
    if (!source) {
        return null;
    }

    if ("createTextTemplateVariable" in source) {
        return mapCreateTextTemplateVariable(source);
    }
    if ("updateTextTemplateVariable" in source) {
        return mapUpdateTextTemplateVariable(source, previousVariable);
    }
    if ("deleteTemplateVariable" in source) {
        return mapDeleteTemplateVariable(source, previousVariable);
    }

    return null;
};

/**
 * Maps a TemplateTextVariable to a TextTemplateVariableInput
 */
export const mapTextTemplateVariableToInput = (
    variable: TemplateTextVariable,
): TextTemplateVariableInput => {
    return {
        id: variable.id,
        name: variable.name,
        description: variable.description,
        required: variable.required,
        order: variable.order,
        preview_value: variable.preview_value,
        template_id: variable.template.id,
        min_length: variable.min_length,
        max_length: variable.max_length,
    };
};
