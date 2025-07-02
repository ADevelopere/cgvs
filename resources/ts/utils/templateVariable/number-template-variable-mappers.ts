import type {
    CreateNumberTemplateVariableMutation,
    UpdateNumberTemplateVariableMutation,
    DeleteTemplateVariableMutation,
    TemplateNumberVariable,
    UpdateNumberTemplateVariableInput,
    Template,
    CreateNumberTemplateVariableInput,
} from "@/graphql/generated/types";

export type NumberTemplateVariableSource =
    | CreateNumberTemplateVariableMutation
    | UpdateNumberTemplateVariableMutation
    | DeleteTemplateVariableMutation;

type PartialNumberTemplateVariable = Partial<TemplateNumberVariable> & {
    id: string;
    name: string;
};

/**
 * Maps a number template variable from any source to a consistent TemplateNumberVariable type
 */
const mapNumberTemplateVariable = (
    variable: PartialNumberTemplateVariable | null | undefined,
    previousVariable?: TemplateNumberVariable | null,
): TemplateNumberVariable => {
    if (!variable) {
        // Create a minimal valid TemplateNumberVariable
        return {
            id: "",
            name: "",
            description: null,
            required: false,
            order: 0,
            preview_value: null,
            template: {
                id: "",
                name: "",
                created_at: new Date(),
                updated_at: new Date(),
            } as Template,
            type: "number",
            created_at: new Date(),
            updated_at: new Date(),
            min_value: null,
            max_value: null,
            decimal_places: null,
            values: [],
        } as TemplateNumberVariable;
    }

    return {
        id: variable.id,
        name: variable.name,
        description:
            variable.description ?? previousVariable?.description ?? null,
        required: variable.required ?? previousVariable?.required ?? false,
        order: variable.order ?? previousVariable?.order ?? 0,
        preview_value:
            variable.preview_value ?? previousVariable?.preview_value ?? null,
        template:
            variable.template ??
            previousVariable?.template ??
            ({
                id: "",
                name: "",
                created_at: new Date(),
                updated_at: new Date(),
            } as Template),
        type: "number",
        created_at:
            variable.created_at ?? previousVariable?.created_at ?? new Date(),
        updated_at:
            variable.updated_at ?? previousVariable?.updated_at ?? new Date(),
        min_value: variable.min_value ?? previousVariable?.min_value ?? null,
        max_value: variable.max_value ?? previousVariable?.max_value ?? null,
        decimal_places:
            variable.decimal_places ?? previousVariable?.decimal_places ?? null,
        values: variable.values ?? previousVariable?.values ?? [],
    } as TemplateNumberVariable;
};

/**
 * Maps a creation number template variable mutation result to a TemplateNumberVariable
 */
const mapCreateNumberTemplateVariable = (
    source: CreateNumberTemplateVariableMutation,
): TemplateNumberVariable => {
    return mapNumberTemplateVariable(
        source.createNumberTemplateVariable as PartialNumberTemplateVariable,
    );
};

/**
 * Maps an update number template variable mutation result to a TemplateNumberVariable
 */
const mapUpdateNumberTemplateVariable = (
    source: UpdateNumberTemplateVariableMutation,
    previousVariable?: TemplateNumberVariable,
): TemplateNumberVariable => {
    return mapNumberTemplateVariable(
        source.updateNumberTemplateVariable as PartialNumberTemplateVariable,
        previousVariable,
    );
};

/**
 * Maps a delete template variable mutation result to a TemplateNumberVariable
 */
const mapDeleteTemplateVariable = (
    source: DeleteTemplateVariableMutation,
    previousVariable?: TemplateNumberVariable,
): TemplateNumberVariable => {
    return mapNumberTemplateVariable(
        source.deleteTemplateVariable as PartialNumberTemplateVariable,
        previousVariable,
    );
};

/**
 * Maps any number template variable source to a single TemplateNumberVariable or null
 */
export const mapSingleNumberTemplateVariable = (
    source: NumberTemplateVariableSource | undefined | null,
    previousVariable?: TemplateNumberVariable,
): TemplateNumberVariable | null => {
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
 * Maps a TemplateNumberVariable to a NumberTemplateVariableInput
 */
export const mapNumberTemplateVariableToInput = (
    variable: TemplateNumberVariable,
): UpdateNumberTemplateVariableInput => {
    return {
        id: variable.id,
        name: variable.name,
        description: variable.description,
        required: variable.required,
        order: variable.order,
        preview_value: variable.preview_value,
        template_id: variable.template.id,
        min_value: variable.min_value,
        max_value: variable.max_value,
        decimal_places: variable.decimal_places,
    };
};

export const mapToCreateNumberTemplateVariableInput = (
    source: TemplateNumberVariable | null | undefined,
): CreateNumberTemplateVariableInput => {
    return {
        name: source?.name ?? "",
        description: source?.description ?? null,
        order: source?.order ?? 0,
        min_value: source?.min_value ?? null,
        max_value: source?.max_value ?? null,
        decimal_places: source?.decimal_places ?? null,
        preview_value: source?.preview_value ?? null,
        required: source?.required ?? false,
        template_id: source?.template?.id ?? "",
    };
};