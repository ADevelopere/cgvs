import type {
    CreateDateTemplateVariableMutation,
    UpdateDateTemplateVariableMutation,
    DeleteTemplateVariableMutation,
    DateTemplateVariable,
    UpdateDateTemplateVariableInput,
    CreateDateTemplateVariableInput,
} from "@/graphql/generated/types";

export type DateTemplateVariableSource =
    | CreateDateTemplateVariableMutation
    | UpdateDateTemplateVariableMutation
    | DeleteTemplateVariableMutation;

type PartialDateTemplateVariable = Partial<DateTemplateVariable> & {
    id: string;
    name: string;
};

/**
 * Maps a date template variable from any source to a consistent DateTemplateVariable type
 */
const mapDateTemplateVariable = (
    variable: PartialDateTemplateVariable | null | undefined,
    previousVariable?: DateTemplateVariable | null,
): DateTemplateVariable | null => {
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
    } as DateTemplateVariable;
};

/**
 * Maps a creation date template variable mutation result to a DateTemplateVariable
 */
const mapCreateDateTemplateVariable = (
    source: CreateDateTemplateVariableMutation,
): DateTemplateVariable | null => {
    return mapDateTemplateVariable(
        source.createDateTemplateVariable as PartialDateTemplateVariable,
    );
};

/**
 * Maps an update date template variable mutation result to a DateTemplateVariable
 */
const mapUpdateDateTemplateVariable = (
    source: UpdateDateTemplateVariableMutation,
    previousVariable?: DateTemplateVariable,
): DateTemplateVariable | null => {
    return mapDateTemplateVariable(
        source.updateDateTemplateVariable as PartialDateTemplateVariable,
        previousVariable,
    );
};

/**
 * Maps a delete template variable mutation result to a DateTemplateVariable
 */
const mapDeleteTemplateVariable = (
    source: DeleteTemplateVariableMutation,
    previousVariable?: DateTemplateVariable,
): DateTemplateVariable | null => {
    return mapDateTemplateVariable(
        source.deleteTemplateVariable as PartialDateTemplateVariable,
        previousVariable,
    );
};

/**
 * Maps any date template variable source to a single DateTemplateVariable or null
 */
export const mapSingleDateTemplateVariable = (
    source: DateTemplateVariableSource | undefined | null,
    previousVariable?: DateTemplateVariable,
): DateTemplateVariable | null => {
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
 * Maps a DateTemplateVariable to a DateTemplateVariableInput
 */
export const mapDateTemplateVariableToInput = (
    variable: DateTemplateVariable,
): UpdateDateTemplateVariableInput => {
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

export const mapToCreateDateTemplateVariableInput = (
    source: DateTemplateVariable | null | undefined,
): CreateDateTemplateVariableInput => {
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
