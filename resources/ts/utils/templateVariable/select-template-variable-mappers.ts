import type {
    CreateSelectTemplateVariableMutation,
    UpdateSelectTemplateVariableMutation,
    DeleteTemplateVariableMutation,
    TemplateSelectVariable,
    UpdateSelectTemplateVariableInput,
    Template,
} from "@/graphql/generated/types";

export type SelectTemplateVariableSource =
    | CreateSelectTemplateVariableMutation
    | UpdateSelectTemplateVariableMutation
    | DeleteTemplateVariableMutation;

type PartialSelectTemplateVariable = Partial<TemplateSelectVariable> & {
    id: string;
    name: string;
};

/**
 * Maps a select template variable from any source to a consistent TemplateSelectVariable type
 */
const mapSelectTemplateVariable = (
    variable: PartialSelectTemplateVariable | null | undefined,
    previousVariable?: TemplateSelectVariable | null,
): TemplateSelectVariable => {
    if (!variable) {
        // Create a minimal valid TemplateSelectVariable
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
            type: "select",
            created_at: new Date(),
            updated_at: new Date(),
            multiple: false,
            options: [],
            values: [],
        } as TemplateSelectVariable;
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
        type: "select",
        created_at:
            variable.created_at ?? previousVariable?.created_at ?? new Date(),
        updated_at:
            variable.updated_at ?? previousVariable?.updated_at ?? new Date(),
        multiple: variable.multiple ?? previousVariable?.multiple ?? false,
        options: variable.options ?? previousVariable?.options ?? [],
        values: variable.values ?? previousVariable?.values ?? [],
    } as TemplateSelectVariable;
};

/**
 * Maps a creation select template variable mutation result to a TemplateSelectVariable
 */
const mapCreateSelectTemplateVariable = (
    source: CreateSelectTemplateVariableMutation,
): TemplateSelectVariable => {
    return mapSelectTemplateVariable(
        source.createSelectTemplateVariable as PartialSelectTemplateVariable,
    );
};

/**
 * Maps an update select template variable mutation result to a TemplateSelectVariable
 */
const mapUpdateSelectTemplateVariable = (
    source: UpdateSelectTemplateVariableMutation,
    previousVariable?: TemplateSelectVariable,
): TemplateSelectVariable => {
    return mapSelectTemplateVariable(
        source.updateSelectTemplateVariable as PartialSelectTemplateVariable,
        previousVariable,
    );
};

/**
 * Maps a delete template variable mutation result to a TemplateSelectVariable
 */
const mapDeleteTemplateVariable = (
    source: DeleteTemplateVariableMutation,
    previousVariable?: TemplateSelectVariable,
): TemplateSelectVariable => {
    return mapSelectTemplateVariable(
        source.deleteTemplateVariable as PartialSelectTemplateVariable,
        previousVariable,
    );
};

/**
 * Maps any select template variable source to a single TemplateSelectVariable or null
 */
export const mapSingleSelectTemplateVariable = (
    source: SelectTemplateVariableSource | undefined | null,
    previousVariable?: TemplateSelectVariable,
): TemplateSelectVariable | null => {
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
 * Maps a TemplateSelectVariable to a SelectTemplateVariableInput
 */
export const mapSelectTemplateVariableToInput = (
    variable: TemplateSelectVariable,
): UpdateSelectTemplateVariableInput => {
    return {
        id: variable.id,
        name: variable.name,
        description: variable.description,
        required: variable.required,
        order: variable.order,
        preview_value: variable.preview_value,
        template_id: variable.template.id,
        multiple: variable.multiple,
        options: variable.options,
    };
};
