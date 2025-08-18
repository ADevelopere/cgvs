import type {
    CreateNumberTemplateVariableMutation,
    UpdateNumberTemplateVariableMutation,
    DeleteTemplateVariableMutation,
    NumberTemplateVariable,
    UpdateNumberTemplateVariableInput,
    Template,
    CreateNumberTemplateVariableInput,
} from "@/graphql/generated/types";

export type NumberTemplateVariableSource =
    | CreateNumberTemplateVariableMutation
    | UpdateNumberTemplateVariableMutation
    | DeleteTemplateVariableMutation;

type PartialNumberTemplateVariable = Partial<NumberTemplateVariable> & {
    id: string;
    name: string;
};

/**
 * Maps a number template variable from any source to a consistent NumberTemplateVariable type
 */
const mapNumberTemplateVariable = (
    variable: PartialNumberTemplateVariable | null | undefined,
    previousVariable?: NumberTemplateVariable | null,
): NumberTemplateVariable => {
    if (!variable) {
        // Create a minimal valid NumberTemplateVariable
        return {
            id: 0,
            name: "",
            description: null,
            required: false,
            order: 0,
            numberPreviewValue: null,
            template: {
                id: 0,
                name: "",
                order: 0,
                category: {
                    id: 0,
                    name: "",
                    description: null,
                    imageUrl: null,
                    order: 0,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    templates: [],
                    childCategories: [],
                    parentCategory: null,
                },
                createdAt: new Date(),
                updatedAt: new Date(),
                variables: [],
            } as Template,
            type: "NUMBER",
            createdAt: new Date(),
            updatedAt: new Date(),
            minValue: null,
            maxValue: null,
            decimalPlaces: null,
        } as NumberTemplateVariable;
    }

    return {
        id: variable.id,
        name: variable.name,
        description:
            variable.description ?? previousVariable?.description ?? null,
        required: variable.required ?? previousVariable?.required ?? false,
        order: variable.order ?? previousVariable?.order ?? 0,
        preview_value:
            variable.numberPreviewValue ?? previousVariable?.numberPreviewValue ?? null,
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
    } as NumberTemplateVariable;
};

/**
 * Maps a creation number template variable mutation result to a NumberTemplateVariable
 */
const mapCreateNumberTemplateVariable = (
    source: CreateNumberTemplateVariableMutation,
): NumberTemplateVariable => {
    return mapNumberTemplateVariable(
        source.createNumberTemplateVariable as PartialNumberTemplateVariable,
    );
};

/**
 * Maps an update number template variable mutation result to a NumberTemplateVariable
 */
const mapUpdateNumberTemplateVariable = (
    source: UpdateNumberTemplateVariableMutation,
    previousVariable?: NumberTemplateVariable,
): NumberTemplateVariable => {
    return mapNumberTemplateVariable(
        source.updateNumberTemplateVariable as PartialNumberTemplateVariable,
        previousVariable,
    );
};

/**
 * Maps a delete template variable mutation result to a NumberTemplateVariable
 */
const mapDeleteTemplateVariable = (
    source: DeleteTemplateVariableMutation,
    previousVariable?: NumberTemplateVariable,
): NumberTemplateVariable => {
    return mapNumberTemplateVariable(
        source.deleteTemplateVariable as PartialNumberTemplateVariable,
        previousVariable,
    );
};

/**
 * Maps any number template variable source to a single NumberTemplateVariable or null
 */
export const mapSingleNumberTemplateVariable = (
    source: NumberTemplateVariableSource | undefined | null,
    previousVariable?: NumberTemplateVariable,
): NumberTemplateVariable | null => {
    if (!source) {
        return null;
    }

    if ("createNumberTemplateVariable" in source) {
        return mapCreateNumberTemplateVariable(source);
    }
    if ("updateNumberTemplateVariable" in source) {
        return mapUpdateNumberTemplateVariable(source, previousVariable);
    }
    if ("deleteTemplateVariable" in source) {
        return mapDeleteTemplateVariable(source, previousVariable);
    }

    return null;
};

/**
 * Maps a NumberTemplateVariable to a NumberTemplateVariableInput
 */
export const mapNumberTemplateVariableToInput = (
    variable: NumberTemplateVariable,
): UpdateNumberTemplateVariableInput => {
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

export const mapToCreateNumberTemplateVariableInput = (
    source: NumberTemplateVariable | null | undefined,
): CreateNumberTemplateVariableInput => {
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