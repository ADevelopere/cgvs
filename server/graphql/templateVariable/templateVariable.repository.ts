import * as DB from "@/server/db";
import { eq, max } from "drizzle-orm";
import * as TmvTypes from "./templateVariable.types";
import { TemplateRepository } from "../template/template.repository";
import { validateTemplateVariableName } from "./templateVariable.utilt";

export namespace TemplateVariableRepository {
    const findTemplateVariableMaxOrderByTemplateId = async (
        templateId: number,
    ): Promise<number> => {
        const [{ maxOrder }] = await DB.db
            .select({ maxOrder: max(DB.templateVariableBases.order) })
            .from(DB.templateVariableBases)
            .where(eq(DB.templateVariableBases.templateId, templateId));
        return maxOrder ?? 0;
    };

    const checkCreateInput = async (
        input: TmvTypes.TemplateVariableCreateInput,
    ) => {
        TemplateRepository.existsById(input.templateId).then(
            (templateExists) => {
                if (!templateExists) {
                    throw new Error(
                        `Template with ID ${input.templateId} does not exist.`,
                    );
                }
            },
        );

        validateTemplateVariableName(input.name).then((nameError) => {
            if (nameError) {
                throw new Error(nameError);
            }
        });
    };

    const findTemplateBaseVariableById = async (
        id: number,
    ): Promise<TmvTypes.TemplateVariablePothosDefinition | null> => {
        return await DB.db
            .select()
            .from(DB.templateVariableBases)
            .where(eq(DB.templateVariableBases.id, id))
            .then((res) => {
                if (res.length === 0) return null;
                return {
                    ...res[0],
                    type: res[0].type as TmvTypes.TemplateVariableType,
                };
            });
    };

    const checkUpdateInput = async (
        input: TmvTypes.TemplateVariableUpdateInput,
        type: TmvTypes.TemplateVariableType,
    ): Promise<TmvTypes.TemplateVariablePothosDefinition> => {
        const baseVar = await findTemplateBaseVariableById(input.id);
        if (!baseVar) {
            throw new Error(
                `Template Variable with ID ${input.id} does not exist.`,
            );
        }

        if (baseVar.type !== type) {
            throw new Error(
                `Template Variable type mismatch. Expected ${type}, got ${baseVar.type}.`,
            );
        }

        validateTemplateVariableName(input.name).then((nameError) => {
            if (nameError) {
                throw new Error(nameError);
            }
        });

        return baseVar;
    };

    export const createTemplateBaseVariable = async (
        input: TmvTypes.TemplateVariableCreateInput,
        type: TmvTypes.TemplateVariableType,
    ): Promise<TmvTypes.TemplateVariablePothosDefinition> => {
        const now = new Date();
        const newOrder = await findTemplateVariableMaxOrderByTemplateId(
            input.templateId,
        );
        const insertInput: TmvTypes.TemplateVariableEntityInput = {
            ...input,
            type: type,
            order: newOrder,
            createdAt: now,
            updatedAt: now,
        };
        const [newVar] = await DB.db
            .insert(DB.templateVariableBases)
            .values(insertInput)
            .returning();
        return {
            ...newVar,
            type: newVar.type as TmvTypes.TemplateVariableType,
        };
    };

    export const createTextVar = async (
        input: TmvTypes.TextTemplaeVariableCreateInput,
    ): Promise<TmvTypes.TemplateTextVariablePothosDefinition> => {
        await checkCreateInput(input);

        const baseInput: TmvTypes.TemplateVariableCreateInput = {
            ...input,
        };

        const baseVar = await createTemplateBaseVariable(
            baseInput,
            TmvTypes.TemplateVariableType.TEXT,
        );

        const textInput: TmvTypes.TemplateTextVariableEntityInput = {
            ...input,
            id: baseVar.id,
        };

        const [txtVar] = await DB.db
            .insert(DB.templateTextVariables)
            .values(textInput)
            .returning();
        const result: TmvTypes.TemplateTextVariablePothosDefinition = {
            ...baseVar,
            ...txtVar,
        };
        return result;
    };

    export const createNumberVar = async (
        input: TmvTypes.TemplateNumberVariableCreateInput,
    ): Promise<TmvTypes.TemplateNumberVariablePothosDefinition> => {
        const baseInput: TmvTypes.TemplateVariableCreateInput = {
            ...input,
            previewValue: input.previewValue?.toString(),
        };

        await checkCreateInput(baseInput);

        const baseVar = await createTemplateBaseVariable(
            baseInput,
            TmvTypes.TemplateVariableType.NUMBER,
        );

        const numberVarInput: TmvTypes.TemplateNumberVariableEntityInput = {
            ...input,
            id: baseVar.id,
        } as TmvTypes.TemplateNumberVariableEntityInput;

        const [numberVar] = await DB.db
            .insert(DB.templateNumberVariables)
            .values(numberVarInput)
            .returning();

        const result: TmvTypes.TemplateNumberVariablePothosDefinition = {
            ...baseVar,
            ...numberVar,
        };

        return result;
    };

    export const createDateVar = async (
        input: TmvTypes.TemplateDateVariableCreateInput,
    ): Promise<TmvTypes.TemplateDateVariablePothosDefinition> => {
        const baseInput: TmvTypes.TemplateVariableCreateInput = {
            ...input,
            previewValue: input.previewValue?.toString(),
        };

        await checkCreateInput(baseInput);

        const baseVar = await createTemplateBaseVariable(
            baseInput,
            TmvTypes.TemplateVariableType.DATE,
        );

        const dateVarInput: TmvTypes.TemplateDateVariableEntityInput = {
            ...input,
            id: baseVar.id,
        };

        const [dateVar] = await DB.db
            .insert(DB.templateDateVariables)
            .values(dateVarInput)
            .returning();

        const result: TmvTypes.TemplateDateVariablePothosDefinition = {
            ...baseVar,
            ...dateVar,
        };

        return result;
    };

    export const createSelectVar = async (
        input: TmvTypes.TemplateSelectVariableCreateInput,
    ): Promise<TmvTypes.TemplateSelectVariablePothosDefinition> => {
        await checkCreateInput(input);

        const baseInput: TmvTypes.TemplateVariableCreateInput = {
            ...input,
        };

        const baseVar = await createTemplateBaseVariable(
            baseInput,
            TmvTypes.TemplateVariableType.SELECT,
        );

        const dateVarInput: TmvTypes.TemplateSelectVariableEntityInput = {
            ...input,
            id: baseVar.id,
        };

        const [selectVar] = await DB.db
            .insert(DB.templateSelectVariables)
            .values(dateVarInput)
            .returning();

        const result: TmvTypes.TemplateSelectVariablePothosDefinition = {
            ...baseVar,
            ...selectVar,
            options: selectVar.options as string[],
        };

        return result;
    };

    export const updateTemplateBaseVariable = async (
        existingBaseVar: TmvTypes.TemplateVariablePothosDefinition,
        input: TmvTypes.TemplateVariableUpdateInput,
    ): Promise<TmvTypes.TemplateVariablePothosDefinition> => {
        const insertInput: TmvTypes.TemplateVariableEntityInput = {
            ...existingBaseVar,
            ...input,
        };
        const updatedVar = await DB.db
            .update(DB.templateVariableBases)
            .set(insertInput)
            .where(eq(DB.templateVariableBases.id, input.id))
            .returning();
        return {
            ...updatedVar[0],
            type: updatedVar[0].type as TmvTypes.TemplateVariableType,
        };
    };

    export const updateTextVar = async (
        input: TmvTypes.TextTemplaeVariableUpdateInput,
    ): Promise<TmvTypes.TemplateTextVariablePothosDefinition> => {
        const baseVar = await checkUpdateInput(
            input,
            TmvTypes.TemplateVariableType.TEXT,
        );

        const updateBaseVar = await updateTemplateBaseVariable(baseVar, {
            ...input,
        });

        const txtInsertInput: TmvTypes.TemplateTextVariableEntityInput = {
            ...input,
        };

        const updatedTxtVarResult = await DB.db
            .update(DB.templateTextVariables)
            .set(txtInsertInput)
            .where(eq(DB.templateTextVariables.id, input.id))
            .returning();

        if (updatedTxtVarResult.length === 0 || !updatedTxtVarResult[0]) {
            throw new Error("Error while updating template variable");
        }

        const result: TmvTypes.TemplateTextVariablePothosDefinition = {
            ...updateBaseVar,
            ...updatedTxtVarResult[0],
        };
        return result;
    };

    export const updateNumberVar = async (
        input: TmvTypes.TemplateNumberVariableUpdateInput,
    ): Promise<TmvTypes.TemplateNumberVariablePothosDefinition> => {
        const baseInput: TmvTypes.TemplateVariableUpdateInput = {
            ...input,
            previewValue: input.previewValue?.toString(),
        };

        const baseVar = await checkUpdateInput(
            baseInput,
            TmvTypes.TemplateVariableType.NUMBER,
        );

        const updateBaseVar = await updateTemplateBaseVariable(
            baseVar,
            baseInput,
        );

        const numberInsertInput: TmvTypes.TemplateNumberVariableEntityInput = {
            ...input,
        };

        const updatedNumberVarResult = await DB.db
            .update(DB.templateNumberVariables)
            .set(numberInsertInput)
            .where(eq(DB.templateNumberVariables.id, input.id))
            .returning();

        if (updatedNumberVarResult.length === 0 || !updatedNumberVarResult[0]) {
            throw new Error("Error while updating template variable");
        }

        const result: TmvTypes.TemplateNumberVariablePothosDefinition = {
            ...updateBaseVar,
            ...updatedNumberVarResult[0],
        };
        return result;
    };

    export const updateDateVar = async (
        input: TmvTypes.TemplateDateVariableUpdateInput,
    ): Promise<TmvTypes.TemplateDateVariablePothosDefinition> => {
        const baseInput: TmvTypes.TemplateVariableUpdateInput = {
            ...input,
            previewValue: input.previewValue?.toString(),
        };
        const baseVar = await checkUpdateInput(
            baseInput,
            TmvTypes.TemplateVariableType.DATE,
        );

        const updateBaseVar = await updateTemplateBaseVariable(
            baseVar,
            baseInput,
        );

        const dateInsertInput: TmvTypes.TemplateDateVariableEntityInput = {
            ...input,
        };

        const updatedDateVarResult = await DB.db
            .update(DB.templateDateVariables)
            .set(dateInsertInput)
            .where(eq(DB.templateDateVariables.id, input.id))
            .returning();

        if (updatedDateVarResult.length === 0 || !updatedDateVarResult[0]) {
            throw new Error("Error while updating template variable");
        }

        const result: TmvTypes.TemplateDateVariablePothosDefinition = {
            ...updateBaseVar,
            ...updatedDateVarResult[0],
        };
        return result;
    };

    export const updateSelectVar = async (
        input: TmvTypes.TemplateSelectVariableUpdateInput,
    ): Promise<TmvTypes.TemplateSelectVariablePothosDefinition> => {
        const baseVar = await checkUpdateInput(
            input,
            TmvTypes.TemplateVariableType.SELECT,
        );

        const updateBaseVar = await updateTemplateBaseVariable(baseVar, {
            ...input,
        });

        const selectInsertInput: TmvTypes.TemplateSelectVariableEntityInput = {
            ...input,
        };

        const updatedSelectVarResult = await DB.db
            .update(DB.templateSelectVariables)
            .set(selectInsertInput)
            .where(eq(DB.templateSelectVariables.id, input.id))
            .returning();

        if (updatedSelectVarResult.length === 0 || !updatedSelectVarResult[0]) {
            throw new Error("Error while updating template variable");
        }

        const result: TmvTypes.TemplateSelectVariablePothosDefinition = {
            ...updateBaseVar,
            ...updatedSelectVarResult[0],
            options: updatedSelectVarResult[0].options as string[],
        };
        return result;
    };

    export const templateVariableExistsById = async (
        id: number,
    ): Promise<boolean> => {
        return (
            (await DB.db.$count(
                DB.templateVariableBases,
                eq(DB.templateVariableBases.id, id),
            )) > 0
        );
    };

    export const findTemplateTextVariableById = async (
        id: number,
    ): Promise<TmvTypes.TemplateTextVariablePothosDefinition | null> => {
        return await DB.db
            .select()
            .from(DB.templateVariableBases)
            .innerJoin(
                DB.templateTextVariables,
                eq(DB.templateVariableBases.id, DB.templateTextVariables.id),
            )
            .where(eq(DB.templateVariableBases.id, id))
            .then((res) => {
                if (res.length === 0) return null;
                return {
                    ...res[0].template_variable_base,
                    type: res[0].template_variable_base
                        .type as TmvTypes.TemplateVariableType,
                    ...res[0].template_text_variable,
                };
            });
    };

    export const findTemplateNumberVariableById = async (
        id: number,
    ): Promise<TmvTypes.TemplateNumberVariablePothosDefinition | null> => {
        return await DB.db
            .select()
            .from(DB.templateVariableBases)
            .innerJoin(
                DB.templateNumberVariables,
                eq(DB.templateVariableBases.id, DB.templateNumberVariables.id),
            )
            .where(eq(DB.templateVariableBases.id, id))
            .then((res) => {
                if (res.length === 0) return null;
                return {
                    ...res[0].template_variable_base,
                    type: res[0].template_variable_base
                        .type as TmvTypes.TemplateVariableType,
                    ...res[0].template_number_variable,
                };
            });
    };

    export const findTemplateDateVariableById = async (
        id: number,
    ): Promise<TmvTypes.TemplateDateVariablePothosDefinition | null> => {
        return await DB.db
            .select()
            .from(DB.templateVariableBases)
            .innerJoin(
                DB.templateDateVariables,
                eq(DB.templateVariableBases.id, DB.templateDateVariables.id),
            )
            .where(eq(DB.templateVariableBases.id, id))
            .then((res) => {
                if (res.length === 0) return null;
                return {
                    ...res[0].template_variable_base,
                    type: res[0].template_variable_base
                        .type as TmvTypes.TemplateVariableType,
                    ...res[0].template_date_variable,
                };
            });
    };

    export const findTemplateSelectVariableById = async (
        id: number,
    ): Promise<TmvTypes.TemplateSelectVariablePothosDefinition | null> => {
        return await DB.db
            .select()
            .from(DB.templateVariableBases)
            .innerJoin(
                DB.templateSelectVariables,
                eq(DB.templateVariableBases.id, DB.templateSelectVariables.id),
            )
            .where(eq(DB.templateVariableBases.id, id))
            .then((res) => {
                if (res.length === 0) return null;
                return {
                    ...res[0].template_variable_base,
                    type: res[0].template_variable_base
                        .type as TmvTypes.TemplateVariableType,
                    ...res[0].template_select_variable,
                    options: res[0].template_select_variable
                        .options as string[],
                };
            });
    };

    export const findById = async (
        id: number,
    ): Promise<TmvTypes.TemplateVariablePothosUnion | null> => {
        const baseVar = await findTemplateBaseVariableById(id);
        if (!baseVar) return null;
        switch (baseVar.type) {
            case TmvTypes.TemplateVariableType.TEXT:
                return await findTemplateTextVariableById(id);
            case TmvTypes.TemplateVariableType.NUMBER:
                return await findTemplateNumberVariableById(id);
            case TmvTypes.TemplateVariableType.DATE:
                return await findTemplateDateVariableById(id);
            case TmvTypes.TemplateVariableType.SELECT:
                return await findTemplateSelectVariableById(id);
            default:
                throw new Error(
                    `Unsupported template variable type: ${baseVar.type}`,
                );
        }
    };

    export const findByTemplateId = async (
        templateId: number,
    ): Promise<TmvTypes.TemplateVariablePothosUnion[]> => {
        const baseVars = await DB.db
            .select()
            .from(DB.templateVariableBases)
            .where(eq(DB.templateVariableBases.templateId, templateId));

        const resolvedVars = await Promise.all(
            baseVars.map(async (baseVar) => {
                switch (baseVar.type as TmvTypes.TemplateVariableType) {
                    case TmvTypes.TemplateVariableType.TEXT:
                        return await findTemplateTextVariableById(baseVar.id);
                    case TmvTypes.TemplateVariableType.NUMBER:
                        return await findTemplateNumberVariableById(baseVar.id);
                    case TmvTypes.TemplateVariableType.DATE:
                        return await findTemplateDateVariableById(baseVar.id);
                    case TmvTypes.TemplateVariableType.SELECT:
                        return await findTemplateSelectVariableById(baseVar.id);
                    default:
                        throw new Error(
                            `Unsupported template variable type: ${baseVar.type}`,
                        );
                }
            }),
        );
        return resolvedVars.filter(
            (v): v is TmvTypes.TemplateVariablePothosUnion => v !== null,
        );
    };

    export const loadForTemplates = async (
        templateIds: number[],
    ): Promise<TmvTypes.TemplateVariablePothosUnion[][]> => {
        if (templateIds.length === 0) return [];
        const allVars = await Promise.all(
            templateIds.map((id) => findByTemplateId(id)),
        );
        return allVars;
    };

    export const deleteVarById = async (
        id: number,
    ): Promise<TmvTypes.TemplateVariablePothosDefinition> => {
        const baseVar = await findTemplateBaseVariableById(id);
        if (!baseVar) {
            throw new Error(`Template variable with ID ${id} does not exist.`);
        }

        try {
            await DB.db
                .delete(DB.templateVariableBases)
                .where(eq(DB.templateVariableBases.id, id));
        } catch {
            throw new Error("Cant delete this variable");
        }
        return baseVar;
    };
}
