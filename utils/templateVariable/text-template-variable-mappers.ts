import type {
    CreateTemplateTextVariableMutation,
    UptemplateDateTextVariableMutation,
    DeleteTemplateVariableMutation,
    TemplateTextVariable,
    UptemplateDateTextVariableInput,
    Template,
    CreateTemplateTextVariableInput,
} from "@/graphql/generated/types";

export type TemplateTextVariableSource =
    | CreateTemplateTextVariableMutation
    | UptemplateDateTextVariableMutation
    | DeleteTemplateVariableMutation;

type PartialTemplateTextVariable = Partial<TemplateTextVariable> & {
    id: string;
    name: string;
};

/**
 * Maps a text template variable from any source to a consistent TemplateTextVariable type
 */
const mapTemplateTextVariable = (
    variable: PartialTemplateTextVariable | null | undefined,
    previousVariable?: TemplateTextVariable | null,
): TemplateTextVariable | null => {
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
    } as TemplateTextVariable;
};

/**
 * Maps a creation text template variable mutation result to a TemplateTextVariable
 */
const mapCreateTemplateTextVariable = (
    source: CreateTemplateTextVariableMutation,
): TemplateTextVariable | null => {
    return mapTemplateTextVariable(
        source.createTemplateTextVariable as PartialTemplateTextVariable,
    );
};

/**
 * Maps an update text template variable mutation result to a TemplateTextVariable
 */
const mapUptemplateDateTextVariable = (
    source: UptemplateDateTextVariableMutation,
    previousVariable?: TemplateTextVariable,
): TemplateTextVariable | null => {
    return mapTemplateTextVariable(
        source.uptemplateDateTextVariable as PartialTemplateTextVariable,
        previousVariable,
    );
};

/**
 * Maps a delete template variable mutation result to a TemplateTextVariable
 */
const mapDeleteTemplateVariable = (
    source: DeleteTemplateVariableMutation,
    previousVariable?: TemplateTextVariable,
): TemplateTextVariable | null => {
    return mapTemplateTextVariable(
        source.deleteTemplateVariable as PartialTemplateTextVariable,
        previousVariable,
    );
};

/**
 * Maps any text template variable source to a single TemplateTextVariable or null
 */
export const mapSingleTemplateTextVariable = (
    source: TemplateTextVariableSource | undefined | null,
    previousVariable?: TemplateTextVariable,
): TemplateTextVariable | null => {
    if (!source) {
        return null;
    }

    if ("createTemplateTextVariable" in source) {
        return mapCreateTemplateTextVariable(source);
    }
    if ("uptemplateDateTextVariable" in source) {
        return mapUptemplateDateTextVariable(source, previousVariable);
    }
    if ("deleteTemplateVariable" in source) {
        return mapDeleteTemplateVariable(source, previousVariable);
    }

    return null;
};

/**
 * Maps a TemplateTextVariable to a TemplateTextVariableInput
 */
export const mapTemplateTextVariableToInput = (
    variable: TemplateTextVariable,
): UptemplateDateTextVariableInput => {
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

export const mapToCreateTemplateTextVariableInput = (
    source: TemplateTextVariable | null | undefined,
): CreateTemplateTextVariableInput => {
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
