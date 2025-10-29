import { gqlSchemaBuilder } from "@/server/graphql/gqlSchemaBuilder";
import * as Types from "@/server/types/element";
import { TextElementRepository } from "@/server/db/repo/element";
import {
  TextPropsObject,
  TextPropsInputObject,
  TextPropsUpdateInputObject,
  CertificateElementPothosInterface,
  createBaseElementInputFields,
  createBaseElementUpdateInputFields,
} from "./base.element.pothos";

// ============================================================================
// Enums
// ============================================================================

export const TextDataSourceTypePothosEnum = gqlSchemaBuilder.enumType(
  "TextDataSourceType",
  {
    values: Object.values(Types.TextDataSourceType),
  }
);

export const StudentTextFieldPothosEnum = gqlSchemaBuilder.enumType(
  "StudentTextField",
  {
    values: Object.values(Types.StudentTextField),
  }
);

export const CertificateTextFieldPothosEnum = gqlSchemaBuilder.enumType(
  "CertificateTextField",
  {
    values: Object.values(Types.CertificateTextField),
  }
);

// ============================================================================
// Data Source Objects (Output)
// ============================================================================

export const TextDataSourceStaticObject = gqlSchemaBuilder
  .objectRef<
    Extract<Types.TextDataSource, { type: Types.TextDataSourceType.STATIC }>
  >("TextDataSourceStatic")
  .implement({
    fields: t => ({
      type: t.expose("type", { type: TextDataSourceTypePothosEnum }),
      value: t.exposeString("value"),
    }),
  });

export const TextDataSourceStudentFieldObject = gqlSchemaBuilder
  .objectRef<
    Extract<
      Types.TextDataSource,
      { type: Types.TextDataSourceType.STUDENT_TEXT_FIELD }
    >
  >("TextDataSourceStudentField")
  .implement({
    fields: t => ({
      type: t.expose("type", { type: TextDataSourceTypePothosEnum }),
      field: t.expose("studentField", { type: StudentTextFieldPothosEnum }),
    }),
  });

export const TextDataSourceCertificateFieldObject = gqlSchemaBuilder
  .objectRef<
    Extract<
      Types.TextDataSource,
      { type: Types.TextDataSourceType.CERTIFICATE_TEXT_FIELD }
    >
  >("TextDataSourceCertificateField")
  .implement({
    fields: t => ({
      type: t.expose("type", { type: TextDataSourceTypePothosEnum }),
      field: t.expose("certificateField", { type: CertificateTextFieldPothosEnum }),
    }),
  });

export const TextDataSourceTemplateTextVariableObject = gqlSchemaBuilder
  .objectRef<
    Extract<
      Types.TextDataSource,
      { type: Types.TextDataSourceType.TEMPLATE_TEXT_VARIABLE }
    >
  >("TextDataSourceTemplateTextVariable")
  .implement({
    fields: t => ({
      type: t.expose("type", { type: TextDataSourceTypePothosEnum }),
      variableId: t.exposeInt("textVariableId"),
    }),
  });

export const TextDataSourceTemplateSelectVariableObject = gqlSchemaBuilder
  .objectRef<
    Extract<
      Types.TextDataSource,
      { type: Types.TextDataSourceType.TEMPLATE_SELECT_VARIABLE }
    >
  >("TextDataSourceTemplateSelectVariable")
  .implement({
    fields: t => ({
      type: t.expose("type", { type: TextDataSourceTypePothosEnum }),
      variableId: t.exposeInt("selectVariableId"),
    }),
  });

// ============================================================================
// Data Source Union (Output)
// ============================================================================

export const TextDataSourceUnion = gqlSchemaBuilder.unionType(
  "TextDataSource",
  {
    types: [
      TextDataSourceStaticObject,
      TextDataSourceStudentFieldObject,
      TextDataSourceCertificateFieldObject,
      TextDataSourceTemplateTextVariableObject,
      TextDataSourceTemplateSelectVariableObject,
    ],
    resolveType: ds => {
      switch (ds.type) {
        case Types.TextDataSourceType.STATIC:
          return "TextDataSourceStatic";
        case Types.TextDataSourceType.STUDENT_TEXT_FIELD:
          return "TextDataSourceStudentField";
        case Types.TextDataSourceType.CERTIFICATE_TEXT_FIELD:
          return "TextDataSourceCertificateField";
        case Types.TextDataSourceType.TEMPLATE_TEXT_VARIABLE:
          return "TextDataSourceTemplateTextVariable";
        case Types.TextDataSourceType.TEMPLATE_SELECT_VARIABLE:
          return "TextDataSourceTemplateSelectVariable";
        default: {
          const exhaustiveCheck: never = ds;
          throw new Error(
            `Unknown TextDataSource type: ${(exhaustiveCheck as { type: string }).type}`
          );
        }
      }
    },
  }
);

// ============================================================================
// Data Source Input Objects (isOneOf Pattern)
// ============================================================================

export const TextDataSourceStaticInputObject = gqlSchemaBuilder
  .inputRef<Types.TextDataSourceStaticInputGraphql>("TextDataSourceStaticInput")
  .implement({
    fields: t => ({
      value: t.string({ required: true }),
    }),
  });

export const TextDataSourceStudentFieldInputObject = gqlSchemaBuilder
  .inputRef<Types.TextDataSourceStudentFieldInputGraphql>(
    "TextDataSourceStudentFieldInput"
  )
  .implement({
    fields: t => ({
      field: t.field({ type: StudentTextFieldPothosEnum, required: true }),
    }),
  });

export const TextDataSourceCertificateFieldInputObject = gqlSchemaBuilder
  .inputRef<Types.TextDataSourceCertificateFieldInputGraphql>(
    "TextDataSourceCertificateFieldInput"
  )
  .implement({
    fields: t => ({
      field: t.field({
        type: CertificateTextFieldPothosEnum,
        required: true,
      }),
    }),
  });

export const TextDataSourceTemplateTextVariableInputObject = gqlSchemaBuilder
  .inputRef<Types.TextDataSourceTemplateTextVariableInputGraphql>(
    "TextDataSourceTemplateTextVariableInput"
  )
  .implement({
    fields: t => ({
      variableId: t.int({ required: true }),
    }),
  });

export const TextDataSourceTemplateSelectVariableInputObject = gqlSchemaBuilder
  .inputRef<Types.TextDataSourceTemplateSelectVariableInputGraphql>(
    "TextDataSourceTemplateSelectVariableInput"
  )
  .implement({
    fields: t => ({
      variableId: t.int({ required: true }),
    }),
  });

export const TextDataSourceInputObject = gqlSchemaBuilder.inputType(
  "TextDataSourceInput",
  {
    isOneOf: true,
    fields: t => ({
      static: t.field({
        type: TextDataSourceStaticInputObject,
      }),
      studentField: t.field({
        type: TextDataSourceStudentFieldInputObject,
      }),
      certificateField: t.field({
        type: TextDataSourceCertificateFieldInputObject,
      }),
      templateTextVariable: t.field({
        type: TextDataSourceTemplateTextVariableInputObject,
      }),
      templateSelectVariable: t.field({
        type: TextDataSourceTemplateSelectVariableInputObject,
      }),
    }),
  }
);

// ============================================================================
// Mutation Inputs
// ============================================================================

export const TextElementCreateInputObject = gqlSchemaBuilder
  .inputRef<Types.TextElementCreateInputGraphql>("TextElementCreateInput")
  .implement({
    fields: t => ({
      ...createBaseElementInputFields(t),
      textProps: t.field({ type: TextPropsInputObject, required: true }),
      dataSource: t.field({ type: TextDataSourceInputObject, required: true }),
    }),
  });

export const TextElementUpdateInputObject = gqlSchemaBuilder
  .inputRef<Types.TextElementUpdateInputGraphql>("TextElementUpdateInput")
  .implement({
    fields: t => ({
      ...createBaseElementUpdateInputFields(t),
      textProps: t.field({
        type: TextPropsUpdateInputObject,
      }),
      dataSource: t.field({
        type: TextDataSourceInputObject,
      }),
    }),
  });

// ============================================================================
// Loadable Element Object
// ============================================================================

const TextElementObjectRef =
  gqlSchemaBuilder.objectRef<Types.TextElementPothosDefinition>("TextElement");

export const TextElementObject = gqlSchemaBuilder.loadableObject<
  Types.TextElementPothosDefinition | Error,
  number,
  [typeof CertificateElementPothosInterface],
  typeof TextElementObjectRef
>(TextElementObjectRef, {
  load: async ids => await TextElementRepository.loadByIds(ids),
  sort: e => e.id,
  interfaces: [CertificateElementPothosInterface],
  isTypeOf: item =>
    typeof item === "object" &&
    item !== null &&
    "type" in item &&
    item.type === Types.ElementType.TEXT,
  fields: t => ({
    textProps: t.expose("textProps", { type: TextPropsObject, nullable: true }),
    dataSource: t.expose("dataSource", {
      type: TextDataSourceUnion,
      nullable: true,
    }),
  }),
});