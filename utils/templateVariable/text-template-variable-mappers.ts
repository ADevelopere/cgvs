import type {
    CreateTextTemplateVariableMutation,
    UpdateTextTemplateVariableMutation,
    DeleteTemplateVariableMutation,
    TextTemplateVariable,
    UpdateTextTemplateVariableInput,
    Template,
    CreateTextTemplateVariableInput,
} from "@/graphql/generated/types";

export type TextTemplateVariableSource =
    | CreateTextTemplateVariableMutation
    | UpdateTextTemplateVariableMutation
    | DeleteTemplateVariableMutation;

type PartialTextTemplateVariable = Partial<TextTemplateVariable> & {
    id: string;
    name: string;
};

/**
 * Maps a text template variable from any source to a consistent TextTemplateVariable type
 */
const mapTextTemplateVariable = (
    variable: PartialTextTemplateVariable | null | undefined,
    previousVariable?: TextTemplateVariable | null,
): TextTemplateVariable | null => {
    if (!variable) {
        return null;
    }

    return {
        id: variable.id,
        name: variable.name,
        description:
            variable.description ?? previousVariable?.description ?? null,
        required: variable.required ?? previousVariable?.required ?? false,
        order: variable.order ?? previousVariable?.order ?? 0,
        previewValue:
            variable.textPreviewValue ??
            previousVariable?.textPreviewValue ??
            null,
        template:
            variable.template ??
            previousVariable?.template ??
            ({
                id: 0,
                name: "",
                createdAt: new Date(),
                updatedAt: new Date(),
            } as Template),
        type: "TEXT",
        createdAt:
            variable.createdAt ?? previousVariable?.createdAt ?? new Date(),
        updatedAt:
            variable.updatedAt ?? previousVariable?.updatedAt ?? new Date(),
        minLength: variable.minLength ?? previousVariable?.minLength ?? null,
        maxLength: variable.maxLength ?? previousVariable?.maxLength ?? null,
    } as TextTemplateVariable;
};

/**
 * Maps a creation text template variable mutation result to a TextTemplateVariable
 */
const mapCreateTextTemplateVariable = (
    source: CreateTextTemplateVariableMutation,
): TextTemplateVariable | null => {
    return mapTextTemplateVariable(
        source.createTextTemplateVariable as PartialTextTemplateVariable,
    );
};

/**
 * Maps an update text template variable mutation result to a TextTemplateVariable
 */
const mapUpdateTextTemplateVariable = (
    source: UpdateTextTemplateVariableMutation,
    previousVariable?: TextTemplateVariable,
): TextTemplateVariable | null => {
    return mapTextTemplateVariable(
        source.updateTextTemplateVariable as PartialTextTemplateVariable,
        previousVariable,
    );
};

/**
 * Maps a delete template variable mutation result to a TextTemplateVariable
 */
const mapDeleteTemplateVariable = (
    source: DeleteTemplateVariableMutation,
    previousVariable?: TextTemplateVariable,
): TextTemplateVariable | null => {
    return mapTextTemplateVariable(
        source.deleteTemplateVariable as PartialTextTemplateVariable,
        previousVariable,
    );
};

/**
 * Maps any text template variable source to a single TextTemplateVariable or null
 */
export const mapSingleTextTemplateVariable = (
    source: TextTemplateVariableSource | undefined | null,
    previousVariable?: TextTemplateVariable,
): TextTemplateVariable | null => {
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
 * Maps a TextTemplateVariable to a TextTemplateVariableInput
 */
export const mapTextTemplateVariableToInput = (
    variable: TextTemplateVariable,
): UpdateTextTemplateVariableInput => {
    return {
        id: variable.id,
        name: variable.name,
        description: variable.description,
        required: variable.required,
        previewValue: variable.textPreviewValue,
        minLength: variable.minLength,
        maxLength: variable.maxLength,
    };
};

export const mapToCreateTextTemplateVariableInput = (
    source: TextTemplateVariable | null | undefined,
): CreateTextTemplateVariableInput => {
    return {
        name: source?.name ?? "",
        description: source?.description,
        minLength: source?.minLength,
        maxLength: source?.maxLength,
        pattern: source?.pattern,
        previewValue: source?.textPreviewValue,
        required: source?.required ?? false,
        templateId: source?.template?.id ?? 0,
    };
};
