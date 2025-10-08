import * as Graphql from "@/client/graphql/generated/gql/graphql";

export const mapToTemplateTextVariableCreateInput = (
    source: Graphql.TemplateTextVariable | null | undefined,
): Graphql.TemplateTextVariableCreateInput => {
    if (!source?.template?.id) {
        throw new Error("Template ID is required");
    }

    return {
        name: source?.name ?? "",
        description: source?.description,
        minLength: source?.minLength,
        maxLength: source?.maxLength,
        pattern: source?.pattern,
        previewValue: source?.previewValue,
        required: source?.required ?? false,
        templateId: source?.template?.id,
    };
};

export const mapToTemplateNumberVariableCreateInput = (
    source: Graphql.TemplateNumberVariable | null | undefined,
): Graphql.TemplateNumberVariableCreateInput => {
    if (!source?.template?.id) {
        throw new Error("Template ID is required");
    }

    return {
        name: source?.name ?? "",
        description: source?.description,
        minValue: source?.minValue,
        maxValue: source?.maxValue,
        decimalPlaces: source?.decimalPlaces,
        previewValue: Number(source?.previewValue),
        required: source?.required ?? false,
        templateId: source?.template?.id,
    };
};

export const mapToTemplateDateVariableCreateInput = (
    source: Graphql.TemplateDateVariable | null | undefined,
): Graphql.TemplateDateVariableCreateInput => {
    if (!source?.template?.id) {
        throw new Error("Template ID is required");
    }

    return {
        name: source?.name ?? "",
        description: source?.description,
        minDate: source?.minDate,
        maxDate: source?.maxDate,
        format: source?.format,
        previewValue: source?.previewValue,
        required: source?.required ?? false,
        templateId: source?.template?.id,
    };
};

export const mapToTemplateSelectVariableCreateInput = (
    source: Graphql.TemplateSelectVariable | null | undefined,
): Graphql.TemplateSelectVariableCreateInput => {
    if (!source?.template?.id) {
        throw new Error("Template ID is required");
    }

    return {
        name: source?.name ?? "",
        description: source?.description,
        multiple: source?.multiple,
        options: source?.options ?? [],
        previewValue: source?.previewValue,
        required: source?.required ?? false,
        templateId: source?.template?.id,
    };
};
