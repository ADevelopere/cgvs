import type {
    CreateTemplateNumberVariableMutation,
    UpdateTemplateNumberVariableMutation,
    DeleteTemplateVariableMutation,
    TemplateNumberVariable,
    UpdateTemplateNumberVariableInput,
    Template,
    CreateTemplateNumberVariableInput,
} from "@/graphql/generated/types";

export type TemplateNumberVariableSource =
    | CreateTemplateNumberVariableMutation
    | UpdateTemplateNumberVariableMutation
    | DeleteTemplateVariableMutation;

type PartialTemplateNumberVariable = Partial<TemplateNumberVariable> & {
    id: string;
    name: string;
};

/**
 * Maps a number template variable from any source to a consistent TemplateNumberVariable type
 */
const mapTemplateNumberVariable = (
    variable: PartialTemplateNumberVariable | null | undefined,
    previousVariable?: TemplateNumberVariable | null,
): TemplateNumberVariable | null => {
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
        preview_value:
            variable.numberPreviewValue ??
            previousVariable?.numberPreviewValue ??
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
        type: "NUMBER",
        createdAt:
            variable.createdAt ?? previousVariable?.createdAt ?? new Date(),
        updatedAt:
            variable.updatedAt ?? previousVariable?.updatedAt ?? new Date(),
        minValue: variable.minValue ?? previousVariable?.minValue ?? null,
        maxValue: variable.maxValue ?? previousVariable?.maxValue ?? null,
        decimalPlaces:
            variable.decimalPlaces ?? previousVariable?.decimalPlaces ?? null,
    } as TemplateNumberVariable;
};

/**
 * Maps a creation number template variable mutation result to a TemplateNumberVariable
 */
const mapCreateTemplateNumberVariable = (
    source: CreateTemplateNumberVariableMutation,
): TemplateNumberVariable | null => {
    return mapTemplateNumberVariable(
        source.createTemplateNumberVariable as PartialTemplateNumberVariable,
    );
};

/**
 * Maps an update number template variable mutation result to a TemplateNumberVariable
 */
const mapUpdateTemplateNumberVariable = (
    source: UpdateTemplateNumberVariableMutation,
    previousVariable?: TemplateNumberVariable,
): TemplateNumberVariable | null => {
    return mapTemplateNumberVariable(
        source.updateTemplateNumberVariable as PartialTemplateNumberVariable,
        previousVariable,
    );
};

/**
 * Maps a delete template variable mutation result to a TemplateNumberVariable
 */
const mapDeleteTemplateVariable = (
    source: DeleteTemplateVariableMutation,
    previousVariable?: TemplateNumberVariable,
): TemplateNumberVariable | null => {
    return mapTemplateNumberVariable(
        source.deleteTemplateVariable as PartialTemplateNumberVariable,
        previousVariable,
    );
};

/**
 * Maps any number template variable source to a single TemplateNumberVariable or null
 */
export const mapSingleTemplateNumberVariable = (
    source: TemplateNumberVariableSource | undefined | null,
    previousVariable?: TemplateNumberVariable,
): TemplateNumberVariable | null => {
    if (!source) {
        return null;
    }

    if ("createTemplateNumberVariable" in source) {
        return mapCreateTemplateNumberVariable(source);
    }
    if ("updateTemplateNumberVariable" in source) {
        return mapUpdateTemplateNumberVariable(source, previousVariable);
    }
    if ("deleteTemplateVariable" in source) {
        return mapDeleteTemplateVariable(source, previousVariable);
    }

    return null;
};

/**
 * Maps a TemplateNumberVariable to a TemplateNumberVariableInput
 */
export const mapTemplateNumberVariableToInput = (
    variable: TemplateNumberVariable,
): UpdateTemplateNumberVariableInput => {
    return {
        id: variable.id,
        name: variable.name,
        description: variable.description,
        required: variable.required,
        previewValue: variable.numberPreviewValue,
        minValue: variable.minValue,
        maxValue: variable.maxValue,
        decimalPlaces: variable.decimalPlaces,
    };
};

export const mapToCreateTemplateNumberVariableInput = (
    source: TemplateNumberVariable | null | undefined,
): CreateTemplateNumberVariableInput => {
    return {
        name: source?.name ?? "",
        description: source?.description ?? null,
        minValue: source?.minValue ?? null,
        maxValue: source?.maxValue ?? null,
        decimalPlaces: source?.decimalPlaces ?? null,
        previewValue: source?.numberPreviewValue ?? null,
        required: source?.required ?? false,
        templateId: source?.template?.id ?? 0,
    };
};
