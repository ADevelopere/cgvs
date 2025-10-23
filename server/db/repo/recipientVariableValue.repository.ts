import { db } from "@/server/db/drizzleDb";
import * as Types from "@/server/types";
import * as DB from "@/server/db";
import { eq } from "drizzle-orm";
import { TemplateVariableRepository } from "./templateVariable.repository";
import type { TemplateVariableValuesMap } from "@/server/db/schema/templateRecipientGroups";

export namespace RecipientVariableValueRepository {
  // Get values for single recipient
  export const findByRecipientGroupItemId = async (
    recipientGroupItemId: number
  ): Promise<Types.RecipientWithVariableValues | null> => {
    // 1. Fetch recipient group item with student name
    const recipientItem = await db
      .select({
        id: DB.templateRecipientGroupItems.id,
        recipientGroupId: DB.templateRecipientGroupItems.recipientGroupId,
        studentId: DB.templateRecipientGroupItems.studentId,
        studentName: DB.students.name,
      })
      .from(DB.templateRecipientGroupItems)
      .leftJoin(
        DB.students,
        eq(DB.templateRecipientGroupItems.studentId, DB.students.id)
      )
      .where(eq(DB.templateRecipientGroupItems.id, recipientGroupItemId))
      .limit(1);

    if (!recipientItem[0]) return null;

    const item = recipientItem[0];

    // 2. Fetch recipient group to get template ID
    const group = await db
      .select({ templateId: DB.templateRecipientGroups.templateId })
      .from(DB.templateRecipientGroups)
      .where(eq(DB.templateRecipientGroups.id, item.recipientGroupId))
      .limit(1);

    if (!group[0]) return null;

    // 3. Fetch template variables
    const variables = await TemplateVariableRepository.findByTemplateId(
      group[0].templateId
    );

    // 4. Fetch JSONB values
    const valueRow = await db
      .select()
      .from(DB.recipientGroupItemVariableValues)
      .where(
        eq(
          DB.recipientGroupItemVariableValues.templateRecipientGroupItemId,
          recipientGroupItemId
        )
      )
      .limit(1);

    const jsonbValues = valueRow[0]?.variableValues || {};

    // 5. Transform to map and collect invalid fields
    const { values, invalidFields } = transformAndValidateJsonb(
      jsonbValues,
      variables
    );

    // 6. If there are invalid fields, fix them in DB (set to null)
    if (invalidFields.length > 0 && valueRow[0]) {
      const fixedJsonb: TemplateVariableValuesMap = { ...jsonbValues };
      for (const fieldId of invalidFields) {
        delete fixedJsonb[fieldId]; // Remove invalid entries
      }

      await db
        .update(DB.recipientGroupItemVariableValues)
        .set({
          variableValues: fixedJsonb,
          updatedAt: new Date(),
        })
        .where(eq(DB.recipientGroupItemVariableValues.id, valueRow[0].id));
    }

    return {
      recipientGroupItemId: item.id,
      studentId: item.studentId,
      studentName: item.studentName || "Unknown",
      variableValues: values,
    };
  };

  // Get values for all recipients in group (table-ready with pagination)
  export const findByRecipientGroupId = async (
    recipientGroupId: number,
    pagination?: { limit?: number; offset?: number }
  ): Promise<Types.RecipientVariableValuesGroupResult> => {
    // 1. Fetch recipient group to get template ID
    const group = await db
      .select({ templateId: DB.templateRecipientGroups.templateId })
      .from(DB.templateRecipientGroups)
      .where(eq(DB.templateRecipientGroups.id, recipientGroupId))
      .limit(1);

    if (!group[0]) return { data: [], total: 0 };

    // 2. Fetch template variables
    const variables = await TemplateVariableRepository.findByTemplateId(
      group[0].templateId
    );

    // 3. Build query for recipients with student names
    const baseQuery = db
      .select({
        id: DB.templateRecipientGroupItems.id,
        studentId: DB.templateRecipientGroupItems.studentId,
        studentName: DB.students.name,
      })
      .from(DB.templateRecipientGroupItems)
      .leftJoin(
        DB.students,
        eq(DB.templateRecipientGroupItems.studentId, DB.students.id)
      )
      .where(
        eq(DB.templateRecipientGroupItems.recipientGroupId, recipientGroupId)
      )
      .$dynamic();

    // Apply pagination if provided
    const recipientsQuery =
      pagination?.limit !== undefined
        ? baseQuery.limit(pagination.limit).offset(pagination.offset || 0)
        : baseQuery;

    const recipients = await recipientsQuery;

    // Get total count
    const total = await db.$count(
      DB.templateRecipientGroupItems,
      eq(DB.templateRecipientGroupItems.recipientGroupId, recipientGroupId)
    );

    // 4. Fetch all JSONB values
    const valueRows = await db
      .select()
      .from(DB.recipientGroupItemVariableValues)
      .where(
        eq(
          DB.recipientGroupItemVariableValues.recipientGroupId,
          recipientGroupId
        )
      );

    const valuesMap = new Map(
      valueRows.map(row => [
        row.templateRecipientGroupItemId,
        { jsonb: row.variableValues, dbId: row.id },
      ])
    );

    // 5. Transform each recipient and collect fixes
    const recipientsData: Types.RecipientWithVariableValues[] = [];
    const fixesToApply: Array<{
      dbId: number;
      fixedJsonb: TemplateVariableValuesMap;
    }> = [];

    for (const recipient of recipients) {
      const valueData = valuesMap.get(recipient.id);
      const jsonbValues = valueData?.jsonb || {};

      const { values, invalidFields } = transformAndValidateJsonb(
        jsonbValues,
        variables
      );

      // Collect fixes for this recipient
      if (invalidFields.length > 0 && valueData?.dbId) {
        const fixedJsonb: TemplateVariableValuesMap = { ...jsonbValues };
        for (const fieldId of invalidFields) {
          delete fixedJsonb[fieldId]; // Remove invalid entries
        }
        fixesToApply.push({ dbId: valueData.dbId, fixedJsonb });
      }

      recipientsData.push({
        recipientGroupItemId: recipient.id,
        studentId: recipient.studentId,
        studentName: recipient.studentName || "Unknown",
        variableValues: values,
      });
    }

    // 6. Apply all fixes in a single batch update
    if (fixesToApply.length > 0) {
      await db.transaction(async tx => {
        for (const fix of fixesToApply) {
          await tx
            .update(DB.recipientGroupItemVariableValues)
            .set({
              variableValues: fix.fixedJsonb,
              updatedAt: new Date(),
            })
            .where(eq(DB.recipientGroupItemVariableValues.id, fix.dbId));
        }
      });
    }

    return { data: recipientsData, total };
  };

  // Upsert values with validation (uses transaction)
  export const upsertVariableValues = async (
    recipientGroupItemId: number,
    values: Types.VariableValueInput[]
  ): Promise<Types.RecipientWithVariableValues> => {
    return await db.transaction(async tx => {
      // 1. Fetch recipient + template ID
      const recipientItem = await tx
        .select({
          id: DB.templateRecipientGroupItems.id,
          recipientGroupId: DB.templateRecipientGroupItems.recipientGroupId,
          studentId: DB.templateRecipientGroupItems.studentId,
          studentName: DB.students.name,
        })
        .from(DB.templateRecipientGroupItems)
        .leftJoin(
          DB.students,
          eq(DB.templateRecipientGroupItems.studentId, DB.students.id)
        )
        .where(eq(DB.templateRecipientGroupItems.id, recipientGroupItemId))
        .limit(1);

      if (!recipientItem[0]) {
        throw new Error(
          `Recipient group item ${recipientGroupItemId} not found`
        );
      }

      const item = recipientItem[0];

      const group = await tx
        .select({ templateId: DB.templateRecipientGroups.templateId })
        .from(DB.templateRecipientGroups)
        .where(eq(DB.templateRecipientGroups.id, item.recipientGroupId))
        .limit(1);

      if (!group[0]) {
        throw new Error(`Recipient group ${item.recipientGroupId} not found`);
      }

      // 2. Fetch template variables
      const variables = await TemplateVariableRepository.findByTemplateId(
        group[0].templateId
      );
      const variablesById = new Map(variables.map(v => [v.id, v]));

      // 3. Validate all variable IDs belong to template
      const invalidIds = values.filter(v => !variablesById.has(v.variableId));
      if (invalidIds.length > 0) {
        throw new Error(
          `Invalid variable IDs: ${invalidIds.map(v => v.variableId).join(", ")}`
        );
      }

      // 4. Parse and validate inputs - throw on first error
      const parsedValues: TemplateVariableValuesMap = {};

      for (const input of values) {
        const variable = variablesById.get(input.variableId)!;
        const parseResult = parseInputValue(input, variable);

        if (parseResult.error) {
          throw new Error(`Variable ${variable.name}: ${parseResult.error}`);
        }

        parsedValues[input.variableId] = {
          type: variable.type,
          value: parseResult.parsed,
        };
      }

      // 5. Fetch current JSONB
      const currentRow = await tx
        .select()
        .from(DB.recipientGroupItemVariableValues)
        .where(
          eq(
            DB.recipientGroupItemVariableValues.templateRecipientGroupItemId,
            recipientGroupItemId
          )
        )
        .limit(1);

      const currentValues = currentRow[0]?.variableValues || {};

      // 6. Merge and save
      const mergedValues: TemplateVariableValuesMap = {
        ...currentValues,
        ...parsedValues,
      };

      if (currentRow[0]) {
        await tx
          .update(DB.recipientGroupItemVariableValues)
          .set({
            variableValues: mergedValues,
            updatedAt: new Date(),
          })
          .where(eq(DB.recipientGroupItemVariableValues.id, currentRow[0].id));
      } else {
        await tx.insert(DB.recipientGroupItemVariableValues).values({
          templateRecipientGroupItemId: recipientGroupItemId,
          templateId: group[0].templateId,
          recipientGroupId: item.recipientGroupId,
          studentId: item.studentId,
          variableValues: mergedValues,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      }

      // 7. Return result (will be clean since we just saved validated data)
      const result = await findByRecipientGroupItemId(recipientGroupItemId);
      if (!result) {
        throw new Error("Failed to fetch updated values");
      }
      return result;
    });
  };

  // Helper: Transform JSONB to map and collect invalid field IDs
  const transformAndValidateJsonb = (
    jsonbValue: TemplateVariableValuesMap,
    variables: Types.TemplateVariablePothosUnion[]
  ): {
    values: Types.VariableValuesMap;
    invalidFields: number[];
  } => {
    const values: Types.VariableValuesMap = {};
    const invalidFields: number[] = [];

    // Initialize all variables with null (or [] for SELECT multiple)
    for (const variable of variables) {
      if (variable.type === Types.TemplateVariableType.SELECT) {
        const selectVar =
          variable as Types.TemplateSelectVariablePothosDefinition;
        if (selectVar.multiple) {
          values[variable.id] = [];
        } else {
          values[variable.id] = null;
        }
      } else {
        values[variable.id] = null;
      }
    }

    // Fill in actual values and validate
    for (const variable of variables) {
      const jsonbEntry = jsonbValue[variable.id];
      if (!jsonbEntry) continue; // Keep null

      const expectedType = variable.type;
      const actualType = jsonbEntry.type;
      const actualValue = jsonbEntry.value;

      // Type mismatch check
      if (expectedType !== actualType) {
        invalidFields.push(variable.id);
        continue; // Keep null
      }

      // Type-specific validation
      const validationError = validateValue(actualValue, variable);
      if (validationError) {
        invalidFields.push(variable.id);
        continue; // Keep null
      }

      // Valid - assign value
      values[variable.id] = actualValue;
    }

    return { values, invalidFields };
  };

  // Helper: Parse string input to correct type
  const parseInputValue = (
    input: Types.VariableValueInput,
    variable: Types.TemplateVariablePothosUnion
  ): {
    parsed: string | number | string[] | null;
    error: string | null;
  } => {
    try {
      switch (variable.type) {
        case Types.TemplateVariableType.TEXT: {
          const textVar =
            variable as Types.TemplateTextVariablePothosDefinition;
          // Validate pattern if exists (patterns should be sanitized at create/update)
          if (textVar.pattern) {
            try {
              const re = new RegExp(textVar.pattern);
              if (!re.test(input.value)) {
                return {
                  parsed: null,
                  error: `Does not match pattern: ${textVar.pattern}`,
                };
              }
            } catch {
              return { parsed: null, error: "Invalid pattern configuration" };
            }
          }
          return { parsed: input.value, error: null };
        }

        case Types.TemplateVariableType.NUMBER: {
          const numberVar =
            variable as Types.TemplateNumberVariablePothosDefinition;
          const num = parseFloat(input.value);
          if (isNaN(num)) {
            return { parsed: null, error: "Invalid number format" };
          }
          if (
            numberVar.decimalPlaces !== undefined &&
            numberVar.decimalPlaces !== null
          ) {
            const decimals = (Math.abs(num).toString().split(".")[1] || "")
              .length;
            if (decimals > numberVar.decimalPlaces) {
              return {
                parsed: null,
                error: `Too many decimal places (max ${numberVar.decimalPlaces})`,
              };
            }
          }
          if (
            numberVar.minValue !== undefined &&
            numberVar.minValue !== null &&
            num < numberVar.minValue
          ) {
            return {
              parsed: null,
              error: `Value ${num} is less than minimum ${numberVar.minValue}`,
            };
          }
          if (
            numberVar.maxValue !== undefined &&
            numberVar.maxValue !== null &&
            num > numberVar.maxValue
          ) {
            return {
              parsed: null,
              error: `Value ${num} exceeds maximum ${numberVar.maxValue}`,
            };
          }
          return { parsed: num, error: null };
        }

        case Types.TemplateVariableType.DATE: {
          const dateVar =
            variable as Types.TemplateDateVariablePothosDefinition;
          const date = new Date(input.value);
          if (isNaN(date.getTime())) {
            return { parsed: null, error: "Invalid date format" };
          }
          if (dateVar.minDate) {
            const minDate = new Date(dateVar.minDate);
            if (date < minDate) {
              return {
                parsed: null,
                error: `Date is before minimum ${dateVar.minDate}`,
              };
            }
          }
          if (dateVar.maxDate) {
            const maxDate = new Date(dateVar.maxDate);
            if (date > maxDate) {
              return {
                parsed: null,
                error: `Date is after maximum ${dateVar.maxDate}`,
              };
            }
          }
          return { parsed: date.toISOString(), error: null };
        }

        case Types.TemplateVariableType.SELECT: {
          const selectVar =
            variable as Types.TemplateSelectVariablePothosDefinition;
          // Try parse as JSON array for multiple select
          let selectedValues: string[];
          try {
            const parsed = JSON.parse(input.value);
            selectedValues = Array.isArray(parsed) ? parsed : [input.value];
          } catch {
            selectedValues = [input.value];
          }

          // Validate against options
          const validOptions = selectVar.options || [];
          const invalidOptions = selectedValues.filter(
            v => !validOptions.includes(v)
          );
          if (invalidOptions.length > 0) {
            return {
              parsed: null,
              error: `Invalid options: ${invalidOptions.join(", ")}`,
            };
          }

          if (selectVar.multiple) {
            return { parsed: selectedValues, error: null };
          } else {
            if (selectedValues.length > 1) {
              return {
                parsed: null,
                error: "Multiple values provided for single-select",
              };
            }
            return { parsed: selectedValues[0] ?? null, error: null };
          }
        }

        default:
          return {
            parsed: null,
            error: `Unknown variable type: ${(variable as Types.TemplateVariablePothosUnion).type}`,
          };
      }
    } catch (err) {
      return { parsed: null, error: `Parse error: ${err}` };
    }
  };

  // Helper: Validate value against constraints
  const validateValue = (
    value: string | number | string[] | null,
    variable: Types.TemplateVariablePothosUnion
  ): string | null => {
    // Absence of value is acceptable at query time; required is enforced in mutation/UI
    if (value === null) return null;

    switch (variable.type) {
      case Types.TemplateVariableType.TEXT: {
        const textVar = variable as Types.TemplateTextVariablePothosDefinition;
        if (typeof value !== "string") return "Expected string";
        if (textVar.minLength && value.length < textVar.minLength) {
          return `Length ${value.length} is less than minimum ${textVar.minLength}`;
        }
        if (textVar.maxLength && value.length > textVar.maxLength) {
          return `Length ${value.length} exceeds maximum ${textVar.maxLength}`;
        }
        // Pattern correctness is validated on create/update; skip pattern matching at query time
        return null;
      }

      case Types.TemplateVariableType.NUMBER: {
        const numberVar =
          variable as Types.TemplateNumberVariablePothosDefinition;
        if (typeof value !== "number") return "Expected number";
        if (
          numberVar.minValue !== undefined &&
          numberVar.minValue !== null &&
          value < numberVar.minValue
        ) {
          return `Value ${value} is less than minimum ${numberVar.minValue}`;
        }
        if (
          numberVar.maxValue !== undefined &&
          numberVar.maxValue !== null &&
          value > numberVar.maxValue
        ) {
          return `Value ${value} exceeds maximum ${numberVar.maxValue}`;
        }
        if (
          numberVar.decimalPlaces !== undefined &&
          numberVar.decimalPlaces !== null
        ) {
          const decimals = (Math.abs(value).toString().split(".")[1] || "")
            .length;
          if (decimals > numberVar.decimalPlaces) {
            return `Too many decimal places (max ${numberVar.decimalPlaces})`;
          }
        }
        return null;
      }

      case Types.TemplateVariableType.DATE: {
        const dateVar = variable as Types.TemplateDateVariablePothosDefinition;
        // Handle both string and Date objects
        let dateValue: Date;
        if (typeof value === "string") {
          dateValue = new Date(value);
        } else if (value instanceof Date) {
          dateValue = value;
        } else {
          return "Expected valid date";
        }

        if (isNaN(dateValue.getTime())) {
          return "Expected valid date";
        }

        if (dateVar.minDate) {
          const minDate = new Date(dateVar.minDate);
          if (dateValue < minDate) {
            return `Date is before minimum`;
          }
        }
        if (dateVar.maxDate) {
          const maxDate = new Date(dateVar.maxDate);
          if (dateValue > maxDate) {
            return `Date is after maximum`;
          }
        }
        return null;
      }

      case Types.TemplateVariableType.SELECT: {
        const selectVar =
          variable as Types.TemplateSelectVariablePothosDefinition;
        const isMultiple = selectVar.multiple;
        if (isMultiple) {
          const values = Array.isArray(value) ? value : [value];
          const validOptions = selectVar.options || [];
          const invalid = values.filter(
            v => !validOptions.includes(v as string)
          );
          if (invalid.length > 0) {
            return `Invalid options: ${invalid.join(", ")}`;
          }
          return null;
        } else {
          if (Array.isArray(value)) return "Expected single value";
          const validOptions = selectVar.options || [];
          if (!validOptions.includes(value as string))
            return `Invalid options: ${value}`;
          return null;
        }
      }

      default:
        return null;
    }
  };
}
