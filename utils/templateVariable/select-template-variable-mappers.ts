import type {
    CreateTemplateSelectVariableMutation,
    UpdateTemplateSelectVariableMutation,
    DeleteTemplateVariableMutation,
    TemplateSelectVariable,
    UpdateTemplateSelectVariableInput,
    Template,
    CreateTemplateSelectVariableInput,
} from "@/graphql/generated/types";

export type TemplateSelectVariableSource =
    | CreateTemplateSelectVariableMutation
    | UpdateTemplateSelectVariableMutation
    | DeleteTemplateVariableMutation;

type PartialTemplateSelectVariable = Partial<TemplateSelectVariable> & {
    id: string;
    name: string;
};

/**
 * Maps a select template variable from any source to a consistent TemplateSelectVariable type
 */
const mapTemplateSelectVariable = (
    variable: PartialTemplateSelectVariable | null | undefined,
    previousVariable?: TemplateSelectVariable | null,
): TemplateSelectVariable | null => {
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
            variable.selectPreviewValue ??
            previousVariable?.selectPreviewValue ??
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
        type: "SELECT",
        createdAt:
            variable.createdAt ?? previousVariable?.createdAt ?? new Date(),
        updatedAt:
            variable.updatedAt ?? previousVariable?.updatedAt ?? new Date(),
        multiple: variable.multiple ?? previousVariable?.multiple ?? false,
        options: variable.options ?? previousVariable?.options ?? [],
    } as TemplateSelectVariable;
};

/**
 * Maps a creation select template variable mutation result to a TemplateSelectVariable
 */
const mapCreateTemplateSelectVariable = (
    source: CreateTemplateSelectVariableMutation,
): TemplateSelectVariable | null => {
    return mapTemplateSelectVariable(
        source.createTemplateSelectVariable as PartialTemplateSelectVariable,
    );
};

/**
 * Maps an update select template variable mutation result to a TemplateSelectVariable
 */
const mapUpdateTemplateSelectVariable = (
    source: UpdateTemplateSelectVariableMutation,
    previousVariable?: TemplateSelectVariable,
): TemplateSelectVariable | null => {
    return mapTemplateSelectVariable(
        source.updateTemplateSelectVariable as PartialTemplateSelectVariable,
        previousVariable,
    );
};

/**
 * Maps a delete template variable mutation result to a TemplateSelectVariable
 */
const mapDeleteTemplateVariable = (
    source: DeleteTemplateVariableMutation,
    previousVariable?: TemplateSelectVariable,
): TemplateSelectVariable | null => {
    return mapTemplateSelectVariable(
        source.deleteTemplateVariable as PartialTemplateSelectVariable,
        previousVariable,
    );
};

/**
 * Maps any select template variable source to a single TemplateSelectVariable or null
 */
export const mapSingleTemplateSelectVariable = (
    source: TemplateSelectVariableSource | undefined | null,
    previousVariable?: TemplateSelectVariable,
): TemplateSelectVariable | null => {
    if (!source) {
        return null;
    }

    if ("createTemplateSelectVariable" in source) {
        return mapCreateTemplateSelectVariable(source);
    }
    if ("updateTemplateSelectVariable" in source) {
        return mapUpdateTemplateSelectVariable(source, previousVariable);
    }
    if ("deleteTemplateVariable" in source) {
        return mapDeleteTemplateVariable(source, previousVariable);
    }

    return null;
};

/**
 * Maps a TemplateSelectVariable to a TemplateSelectVariableInput
 */
export const mapTemplateSelectVariableToInput = (
    variable: TemplateSelectVariable,
): UpdateTemplateSelectVariableInput => {
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

export const mapToCreateTemplateSelectVariableInput = (
    source: TemplateSelectVariable | null | undefined,
): CreateTemplateSelectVariableInput => {
    return {
        name: source?.name ?? "",
        description: source?.description,
        multiple: source?.multiple ?? false,
        options: source?.options ?? [],
        previewValue: source?.selectPreviewValue,
        required: source?.required ?? false,
        templateId: source?.template?.id ?? 0,
    };
};
