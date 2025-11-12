import * as DB from "@/server/db";
import { eq, max } from "drizzle-orm";
import * as Types from "@/server/types";
import { TemplateRepository } from "./template.repository";
import { TemplateVariableUtils } from "@/server/utils";

export namespace TemplateVariableRepository {
  const findTemplateVariableMaxOrderByTemplateId = async (templateId: number): Promise<number> => {
    const [result] = await DB.db
      .select({ maxOrder: max(DB.templateVariableBases.order) })
      .from(DB.templateVariableBases)
      .where(eq(DB.templateVariableBases.templateId, templateId));
    return result?.maxOrder ?? 0;
  };

  const checkCreateInput = async (input: Types.TemplateVariableCreateInput) => {
    TemplateRepository.existsById(input.templateId).then(templateExists => {
      if (!templateExists) {
        throw new Error(`Template with ID ${input.templateId} does not exist.`);
      }
    });

    TemplateVariableUtils.validateName(input.name).then(nameError => {
      if (nameError) {
        throw new Error(nameError);
      }
    });
  };

  const findTemplateBaseVariableById = async (id: number): Promise<Types.TemplateVariablePothosDefinition | null> => {
    return await DB.db
      .select()
      .from(DB.templateVariableBases)
      .where(eq(DB.templateVariableBases.id, id))
      .then(res => {
        if (res.length === 0 || !res[0]) return null;
        return {
          ...res[0],
          type: res[0].type as Types.TemplateVariableType,
        };
      });
  };

  const checkUpdateInput = async (
    input: Types.TemplateVariableUpdateInput,
    type: Types.TemplateVariableType
  ): Promise<Types.TemplateVariablePothosDefinition> => {
    const baseVar = await findTemplateBaseVariableById(input.id);
    if (!baseVar) {
      throw new Error(`Template Variable with ID ${input.id} does not exist.`);
    }

    if (baseVar.type !== type) {
      throw new Error(`Template Variable type mismatch. Expected ${type}, got ${baseVar.type}.`);
    }

    TemplateVariableUtils.validateName(input.name).then(nameError => {
      if (nameError) {
        throw new Error(nameError);
      }
    });

    return baseVar;
  };

  export const createTemplateBaseVariable = async (
    input: Types.TemplateVariableCreateInput,
    type: Types.TemplateVariableType
  ): Promise<Types.TemplateVariablePothosDefinition> => {
    const now = new Date();
    const newOrder = await findTemplateVariableMaxOrderByTemplateId(input.templateId);
    const insertInput: Types.TemplateVariableEntityInput = {
      ...input,
      type: type,
      order: newOrder,
      createdAt: now,
      updatedAt: now,
    };
    const [newVar] = await DB.db.insert(DB.templateVariableBases).values(insertInput).returning();
    if (!newVar) throw new Error("Failed to create template variable");
    return {
      ...newVar,
      type: newVar.type as Types.TemplateVariableType,
    };
  };

  export const createTextVar = async (
    input: Types.TextTemplateVariableCreateInput
  ): Promise<Types.TemplateTextVariablePothosDefinition> => {
    await checkCreateInput(input);

    const baseInput: Types.TemplateVariableCreateInput = {
      ...input,
    };

    const baseVar = await createTemplateBaseVariable(baseInput, Types.TemplateVariableType.TEXT);

    const textInput: Types.TemplateTextVariableEntityInput = {
      ...input,
      id: baseVar.id,
    };

    const [txtVar] = await DB.db.insert(DB.templateTextVariables).values(textInput).returning();

    if (!txtVar) throw new Error("Failed to create text variable");

    const result: Types.TemplateTextVariablePothosDefinition = {
      ...baseVar,
      ...txtVar,
    };
    return result;
  };

  export const createNumberVar = async (
    input: Types.TemplateNumberVariableCreateInput
  ): Promise<Types.TemplateNumberVariablePothosDefinition> => {
    const baseInput: Types.TemplateVariableCreateInput = {
      ...input,
      previewValue: input.previewValue?.toString(),
    };

    await checkCreateInput(baseInput);

    const baseVar = await createTemplateBaseVariable(baseInput, Types.TemplateVariableType.NUMBER);

    const numberVarInput: Types.TemplateNumberVariableEntityInput = {
      ...input,
      id: baseVar.id,
    } as Types.TemplateNumberVariableEntityInput;

    const [numberVar] = await DB.db.insert(DB.templateNumberVariables).values(numberVarInput).returning();

    if (!numberVar) throw new Error("Failed to create number variable");

    const result: Types.TemplateNumberVariablePothosDefinition = {
      ...baseVar,
      ...numberVar,
    };

    return result;
  };

  export const createDateVar = async (
    input: Types.TemplateDateVariableCreateInput
  ): Promise<Types.TemplateDateVariablePothosDefinition> => {
    const baseInput: Types.TemplateVariableCreateInput = {
      ...input,
      previewValue: input.previewValue?.toString(),
    };

    await checkCreateInput(baseInput);

    const baseVar = await createTemplateBaseVariable(baseInput, Types.TemplateVariableType.DATE);

    const dateVarInput: Types.TemplateDateVariableEntityInput = {
      ...input,
      id: baseVar.id,
    };

    const [dateVar] = await DB.db.insert(DB.templateDateVariables).values(dateVarInput).returning();

    if (!dateVar) throw new Error("Failed to create date variable");

    const result: Types.TemplateDateVariablePothosDefinition = {
      ...baseVar,
      ...dateVar,
    };

    return result;
  };

  export const createSelectVar = async (
    input: Types.TemplateSelectVariableCreateInput
  ): Promise<Types.TemplateSelectVariablePothosDefinition> => {
    await checkCreateInput(input);

    const baseInput: Types.TemplateVariableCreateInput = {
      ...input,
    };

    const baseVar = await createTemplateBaseVariable(baseInput, Types.TemplateVariableType.SELECT);

    const dateVarInput: Types.TemplateSelectVariableEntityInput = {
      ...input,
      id: baseVar.id,
    };

    const [selectVar] = await DB.db.insert(DB.templateSelectVariables).values(dateVarInput).returning();

    if (!selectVar) throw new Error("Failed to create select variable");

    const result: Types.TemplateSelectVariablePothosDefinition = {
      ...baseVar,
      ...selectVar,
      options: selectVar.options as string[],
    };

    return result;
  };

  export const updateTemplateBaseVariable = async (
    existingBaseVar: Types.TemplateVariablePothosDefinition,
    input: Types.TemplateVariableUpdateInput
  ): Promise<Types.TemplateVariablePothosDefinition> => {
    const insertInput: Types.TemplateVariableEntityInput = {
      ...existingBaseVar,
      ...input,
    };
    const updatedVar = await DB.db
      .update(DB.templateVariableBases)
      .set(insertInput)
      .where(eq(DB.templateVariableBases.id, input.id))
      .returning();

    if (updatedVar.length === 0 || !updatedVar[0]) {
      throw new Error("Error while updating template variable");
    }

    return {
      ...updatedVar[0],
      type: updatedVar[0].type as Types.TemplateVariableType,
    };
  };

  export const updateTextVar = async (
    input: Types.TextTemplateVariableUpdateInput
  ): Promise<Types.TemplateTextVariablePothosDefinition> => {
    const baseVar = await checkUpdateInput(input, Types.TemplateVariableType.TEXT);

    const updateBaseVar = await updateTemplateBaseVariable(baseVar, {
      ...input,
    });

    const txtInsertInput: Types.TemplateTextVariableEntityInput = {
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

    const result: Types.TemplateTextVariablePothosDefinition = {
      ...updateBaseVar,
      ...updatedTxtVarResult[0],
    };
    return result;
  };

  export const updateNumberVar = async (
    input: Types.TemplateNumberVariableUpdateInput
  ): Promise<Types.TemplateNumberVariablePothosDefinition> => {
    const baseInput: Types.TemplateVariableUpdateInput = {
      ...input,
      previewValue: input.previewValue?.toString(),
    };

    const baseVar = await checkUpdateInput(baseInput, Types.TemplateVariableType.NUMBER);

    const updateBaseVar = await updateTemplateBaseVariable(baseVar, baseInput);

    const numberInsertInput: Types.TemplateNumberVariableEntityInput = {
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

    const result: Types.TemplateNumberVariablePothosDefinition = {
      ...updateBaseVar,
      ...updatedNumberVarResult[0],
    };
    return result;
  };

  export const updateDateVar = async (
    input: Types.TemplateDateVariableUpdateInput
  ): Promise<Types.TemplateDateVariablePothosDefinition> => {
    const baseInput: Types.TemplateVariableUpdateInput = {
      ...input,
      previewValue: input.previewValue?.toString(),
    };
    const baseVar = await checkUpdateInput(baseInput, Types.TemplateVariableType.DATE);

    const updateBaseVar = await updateTemplateBaseVariable(baseVar, baseInput);

    const dateInsertInput: Types.TemplateDateVariableEntityInput = {
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

    const result: Types.TemplateDateVariablePothosDefinition = {
      ...updateBaseVar,
      ...updatedDateVarResult[0],
    };
    return result;
  };

  export const updateSelectVar = async (
    input: Types.TemplateSelectVariableUpdateInput
  ): Promise<Types.TemplateSelectVariablePothosDefinition> => {
    const baseVar = await checkUpdateInput(input, Types.TemplateVariableType.SELECT);

    const updateBaseVar = await updateTemplateBaseVariable(baseVar, {
      ...input,
    });

    const selectInsertInput: Types.TemplateSelectVariableEntityInput = {
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

    const result: Types.TemplateSelectVariablePothosDefinition = {
      ...updateBaseVar,
      ...updatedSelectVarResult[0],
      options: updatedSelectVarResult[0].options as string[],
    };
    return result;
  };

  export const templateVariableExistsById = async (id: number): Promise<boolean> => {
    return (await DB.db.$count(DB.templateVariableBases, eq(DB.templateVariableBases.id, id))) > 0;
  };

  export const findTemplateTextVariableById = async (
    id: number
  ): Promise<Types.TemplateTextVariablePothosDefinition | null> => {
    return await DB.db
      .select()
      .from(DB.templateVariableBases)
      .innerJoin(DB.templateTextVariables, eq(DB.templateVariableBases.id, DB.templateTextVariables.id))
      .where(eq(DB.templateVariableBases.id, id))
      .then(res => {
        if (res.length === 0 || !res[0]) return null;
        return {
          ...res[0].template_variable_base,
          type: res[0].template_variable_base.type as Types.TemplateVariableType,
          ...res[0].template_text_variable,
        };
      });
  };

  export const findTemplateNumberVariableById = async (
    id: number
  ): Promise<Types.TemplateNumberVariablePothosDefinition | null> => {
    return await DB.db
      .select()
      .from(DB.templateVariableBases)
      .innerJoin(DB.templateNumberVariables, eq(DB.templateVariableBases.id, DB.templateNumberVariables.id))
      .where(eq(DB.templateVariableBases.id, id))
      .then(res => {
        if (res.length === 0 || !res[0]) return null;
        return {
          ...res[0].template_variable_base,
          type: res[0].template_variable_base.type as Types.TemplateVariableType,
          ...res[0].template_number_variable,
        };
      });
  };

  export const findTemplateDateVariableById = async (
    id: number
  ): Promise<Types.TemplateDateVariablePothosDefinition | null> => {
    return await DB.db
      .select()
      .from(DB.templateVariableBases)
      .innerJoin(DB.templateDateVariables, eq(DB.templateVariableBases.id, DB.templateDateVariables.id))
      .where(eq(DB.templateVariableBases.id, id))
      .then(res => {
        if (res.length === 0 || !res[0]) return null;
        return {
          ...res[0].template_variable_base,
          type: res[0].template_variable_base.type as Types.TemplateVariableType,
          ...res[0].template_date_variable,
        };
      });
  };

  export const findTemplateSelectVariableById = async (
    id: number
  ): Promise<Types.TemplateSelectVariablePothosDefinition | null> => {
    return await DB.db
      .select()
      .from(DB.templateVariableBases)
      .innerJoin(DB.templateSelectVariables, eq(DB.templateVariableBases.id, DB.templateSelectVariables.id))
      .where(eq(DB.templateVariableBases.id, id))
      .then(res => {
        if (res.length === 0 || !res[0]) return null;
        return {
          ...res[0].template_variable_base,
          type: res[0].template_variable_base.type as Types.TemplateVariableType,
          ...res[0].template_select_variable,
          options: res[0].template_select_variable.options as string[],
        };
      });
  };

  export const findById = async (id: number): Promise<Types.TemplateVariablePothosUnion | null> => {
    const baseVar = await findTemplateBaseVariableById(id);
    if (!baseVar) return null;
    switch (baseVar.type) {
      case Types.TemplateVariableType.TEXT:
        return await findTemplateTextVariableById(id);
      case Types.TemplateVariableType.NUMBER:
        return await findTemplateNumberVariableById(id);
      case Types.TemplateVariableType.DATE:
        return await findTemplateDateVariableById(id);
      case Types.TemplateVariableType.SELECT:
        return await findTemplateSelectVariableById(id);
      default:
        throw new Error(`Unsupported template variable type: ${baseVar.type}`);
    }
  };

  export const findByTemplateId = async (templateId: number): Promise<Types.TemplateVariablePothosUnion[]> => {
    const baseVars = await DB.db
      .select()
      .from(DB.templateVariableBases)
      .where(eq(DB.templateVariableBases.templateId, templateId));

    const resolvedVars = await Promise.all(
      baseVars.map(async baseVar => {
        switch (baseVar.type as Types.TemplateVariableType) {
          case Types.TemplateVariableType.TEXT:
            return await findTemplateTextVariableById(baseVar.id);
          case Types.TemplateVariableType.NUMBER:
            return await findTemplateNumberVariableById(baseVar.id);
          case Types.TemplateVariableType.DATE:
            return await findTemplateDateVariableById(baseVar.id);
          case Types.TemplateVariableType.SELECT:
            return await findTemplateSelectVariableById(baseVar.id);
          default:
            throw new Error(`Unsupported template variable type: ${baseVar.type}`);
        }
      })
    );
    return resolvedVars.filter((v): v is Types.TemplateVariablePothosUnion => v !== null);
  };

  export const loadForTemplates = async (templateIds: number[]): Promise<Types.TemplateVariablePothosUnion[][]> => {
    if (templateIds.length === 0) return [];
    const allVars = await Promise.all(templateIds.map(id => findByTemplateId(id)));
    return allVars;
  };

  export const deleteVarById = async (id: number): Promise<Types.TemplateVariablePothosDefinition> => {
    const baseVar = await findTemplateBaseVariableById(id);
    if (!baseVar) {
      throw new Error(`Template variable with ID ${id} does not exist.`);
    }

    try {
      await DB.db.delete(DB.templateVariableBases).where(eq(DB.templateVariableBases.id, id));
    } catch {
      throw new Error("Cant delete this variable");
    }
    return baseVar;
  };
}
