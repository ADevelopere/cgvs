import type {
    CreateSelectTemplateVariableMutation,
    UpdateSelectTemplateVariableMutation,
    DeleteTemplateVariableMutation,
    SelectTemplateVariable,
    UpdateSelectTemplateVariableInput,
    Template,
    CreateSelectTemplateVariableInput,
} from "@/graphql/generated/types";

export type SelectTemplateVariableSource =
    | CreateSelectTemplateVariableMutation
    | UpdateSelectTemplateVariableMutation
    | DeleteTemplateVariableMutation;

type PartialSelectTemplateVariable = Partial<SelectTemplateVariable> & {
    id: string;
    name: string;
};

/**
 * Maps a select template variable from any source to a consistent SelectTemplateVariable type
 */
const mapSelectTemplateVariable = (
    variable: PartialSelectTemplateVariable | null | undefined,
    previousVariable?: SelectTemplateVariable | null,
): SelectTemplateVariable => {
    if (!variable) {
        // Create a minimal valid SelectTemplateVariable
        return {
            id: 0,
            name: "",
            description: null,
            required: false,
            order: 0,
            previewValue: null,
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
            type: "SELECT",
            createdAt: new Date(),
            updatedAt: new Date(),
            multiple: false,
            options: [],
            values: [],
        } as SelectTemplateVariable;
    }

    return {
        id: variable.id,
        name: variable.name,
        description:
            variable.description ?? previousVariable?.description ?? null,
        required: variable.required ?? previousVariable?.required ?? false,
        order: variable.order ?? previousVariable?.order ?? 0,
        previewValue:
            variable.selectPreviewValue ?? previousVariable?.selectPreviewValue ?? null,
        template:
            variable.template ??
            previousVariable?.template ??
            ({
                id: 0,
                name: "",
                createdAt: new Date(),
                updatedAt: new Date(),
            } as Template),
        type: "SELECT",
        createdAt:
            variable.createdAt ?? previousVariable?.createdAt ?? new Date(),
        updatedAt:
            variable.updatedAt ?? previousVariable?.updatedAt ?? new Date(),
        multiple: variable.multiple ?? previousVariable?.multiple ?? false,
        options: variable.options ?? previousVariable?.options ?? [],
    } as SelectTemplateVariable;
};

/**
 * Maps a creation select template variable mutation result to a SelectTemplateVariable
 */
const mapCreateSelectTemplateVariable = (
    source: CreateSelectTemplateVariableMutation,
): SelectTemplateVariable => {
    return mapSelectTemplateVariable(
        source.createSelectTemplateVariable as PartialSelectTemplateVariable,
    );
};

/**
 * Maps an update select template variable mutation result to a SelectTemplateVariable
 */
const mapUpdateSelectTemplateVariable = (
    source: UpdateSelectTemplateVariableMutation,
    previousVariable?: SelectTemplateVariable,
): SelectTemplateVariable => {
    return mapSelectTemplateVariable(
        source.updateSelectTemplateVariable as PartialSelectTemplateVariable,
        previousVariable,
    );
};

/**
 * Maps a delete template variable mutation result to a SelectTemplateVariable
 */
const mapDeleteTemplateVariable = (
    source: DeleteTemplateVariableMutation,
    previousVariable?: SelectTemplateVariable,
): SelectTemplateVariable => {
    return mapSelectTemplateVariable(
        source.deleteTemplateVariable as PartialSelectTemplateVariable,
        previousVariable,
    );
};

/**
 * Maps any select template variable source to a single SelectTemplateVariable or null
 */
export const mapSingleSelectTemplateVariable = (
    source: SelectTemplateVariableSource | undefined | null,
    previousVariable?: SelectTemplateVariable,
): SelectTemplateVariable | null => {
    if (!source) {
        return null;
    }

    if ("createSelectTemplateVariable" in source) {
        return mapCreateSelectTemplateVariable(source);
    }
    if ("updateSelectTemplateVariable" in source) {
        return mapUpdateSelectTemplateVariable(source, previousVariable);
    }
    if ("deleteTemplateVariable" in source) {
        return mapDeleteTemplateVariable(source, previousVariable);
    }

    return null;
};

/**
 * Maps a SelectTemplateVariable to a SelectTemplateVariableInput
 */
export const mapSelectTemplateVariableToInput = (
    variable: SelectTemplateVariable,
): UpdateSelectTemplateVariableInput => {
    return {
        id: variable.id,
        name: variable.name,
        description: variable.description,
        required: variable.required,
        previewValue: variable.selectPreviewValue,
        options: variable?.options ?? [],
        multiple: variable?.multiple ?? false,
    };
};

export const mapToCreateSelectTemplateVariableInput = (
    source: SelectTemplateVariable | null | undefined,
): CreateSelectTemplateVariableInput => {
    return {
        name: source?.name ?? "",
        description: source?.description ?? null,
        multiple: source?.multiple ?? false,
        options: source?.options ?? [],
        previewValue: source?.selectPreviewValue ?? null,
        required: source?.required ?? false,
        templateId: source?.template?.id ?? 0,
        };
    };

