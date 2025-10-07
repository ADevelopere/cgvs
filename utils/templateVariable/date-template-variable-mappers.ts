import type {
    CreateTemplateDateVariableMutation,
    UptemplateDateDateVariableMutation,
    DeleteTemplateVariableMutation,
    TemplateDateVariable,
    UptemplateDateDateVariableInput,
    CreateTemplateDateVariableInput,
} from "@/graphql/generated/types";

export type TemplateDateVariableSource =
    | CreateTemplateDateVariableMutation
    | UptemplateDateDateVariableMutation
    | DeleteTemplateVariableMutation;

type PartialTemplateDateVariable = Partial<TemplateDateVariable> & {
    id: string;
    name: string;
};

/**
 * Maps a date template variable from any source to a consistent TemplateDateVariable type
 */
const mapTemplateDateVariable = (
    variable: PartialTemplateDateVariable | null | undefined,
    previousVariable?: TemplateDateVariable | null,
): TemplateDateVariable | null => {
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
        // previewValue: variable.preview_value ?? previousVariable?.preview_value ?? null,
        template: variable.template ?? previousVariable?.template,
        type: "DATE", // Ensure this matches the expected TemplateVariableType
        createdAt:
            variable.createdAt ?? previousVariable?.createdAt ?? new Date(),
        updatedAt:
            variable.updatedAt ?? previousVariable?.updatedAt ?? new Date(),
        minDate: variable.minDate ?? previousVariable?.minDate ?? null,
        maxDate: variable.maxDate ?? previousVariable?.maxDate ?? null,
        format: variable.format ?? previousVariable?.format ?? null,
    } as TemplateDateVariable;
};

/**
 * Maps a creation date template variable mutation result to a TemplateDateVariable
 */
const mapCreateTemplateDateVariable = (
    source: CreateTemplateDateVariableMutation,
): TemplateDateVariable | null => {
    return mapTemplateDateVariable(
        source.createTemplateDateVariable as PartialTemplateDateVariable,
    );
};

/**
 * Maps an update date template variable mutation result to a TemplateDateVariable
 */
const mapUptemplateDateDateVariable = (
    source: UptemplateDateDateVariableMutation,
    previousVariable?: TemplateDateVariable,
): TemplateDateVariable | null => {
    return mapTemplateDateVariable(
        source.uptemplateDateDateVariable as PartialTemplateDateVariable,
        previousVariable,
    );
};

/**
 * Maps a delete template variable mutation result to a TemplateDateVariable
 */
const mapDeleteTemplateVariable = (
    source: DeleteTemplateVariableMutation,
    previousVariable?: TemplateDateVariable,
): TemplateDateVariable | null => {
    return mapTemplateDateVariable(
        source.deleteTemplateVariable as PartialTemplateDateVariable,
        previousVariable,
    );
};

/**
 * Maps any date template variable source to a single TemplateDateVariable or null
 */
export const mapSingleTemplateDateVariable = (
    source: TemplateDateVariableSource | undefined | null,
    previousVariable?: TemplateDateVariable,
): TemplateDateVariable | null => {
    if (!source) {
        return null;
    }

    if ("createTemplateDateVariable" in source) {
        return mapCreateTemplateDateVariable(source);
    }
    if ("uptemplateDateDateVariable" in source) {
        return mapUptemplateDateDateVariable(source, previousVariable);
    }
    if ("deleteTemplateVariable" in source) {
        return mapDeleteTemplateVariable(source, previousVariable);
    }

    return null;
};

/**
 * Maps a TemplateDateVariable to a TemplateDateVariableInput
 */
export const mapTemplateDateVariableToInput = (
    variable: TemplateDateVariable,
): UptemplateDateDateVariableInput => {
    return {
        id: variable.id,
        name: variable.name,
        description: variable.description,
        required: variable.required,
        previewValue: variable.datePreviewValue,
        minDate: variable.minDate,
        maxDate: variable.maxDate,
        format: variable.format,
    };
};

export const mapToCreateTemplateDateVariableInput = (
    source: TemplateDateVariable | null | undefined,
): CreateTemplateDateVariableInput => {
    return {
        name: source?.name ?? "",
        description: source?.description ?? null,
        minDate: source?.minDate ?? null,
        maxDate: source?.maxDate ?? null,
        format: source?.format ?? null,
        previewValue: source?.datePreviewValue ?? null,
        required: source?.required ?? false,
        templateId: source?.template?.id ?? 0,
    };
};
