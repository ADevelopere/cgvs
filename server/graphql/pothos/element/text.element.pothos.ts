import { gqlSchemaBuilder } from "@/server/graphql/gqlSchemaBuilder";
import * as Types from "@/server/types/element";
import { TextElementRepository } from "@/server/db/repo/element";
import {
  CertificateElementBaseInputObject,
  CertificateElementPothosInterface,
  isOfElement,
} from "./base.element.pothos";
import { InputFieldBuilder, SchemaTypes } from "@pothos/core";
import {
  createTextPropsFieldFromEntity,
  TextPropsInputObject,
} from "./textProps.pothos";
import logger from "@/server/lib/logger";

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
      studentField: t.expose("studentField", {
        type: StudentTextFieldPothosEnum,
      }),
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
      certificateField: t.expose("certificateField", {
        type: CertificateTextFieldPothosEnum,
      }),
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
      textVariableId: t.exposeInt("textVariableId"),
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
      selectVariableId: t.exposeInt("selectVariableId"),
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

const createTextElementInputFields = <Types extends SchemaTypes>(
  t: InputFieldBuilder<Types, "InputObject">
) => ({
  base: t.field({
    type: CertificateElementBaseInputObject,
    required: true,
  }),
  textProps: t.field({ type: TextPropsInputObject, required: true }),
  dataSource: t.field({ type: TextDataSourceInputObject, required: true }),
});

export const TextElementInputObject = gqlSchemaBuilder
  .inputRef<Types.TextElementInputGraphql>("TextElementInput")
  .implement({
    fields: t => ({
      ...createTextElementInputFields(t),
    }),
  });

export const TextElementUpdateInputObject = gqlSchemaBuilder
  .inputRef<Types.TextElementUpdateInputGraphql>("TextElementUpdateInput")
  .implement({
    fields: t => ({
      id: t.int({ required: true }),
      ...createTextElementInputFields(t),
    }),
  });

// ============================================================================
// Loadable Element Object
// ============================================================================

export const TextElementSpecPropsObject = gqlSchemaBuilder
  .objectRef<Types.TextElementSpecProps>("TextElementSpecProps")
  .implement({
    fields: t => ({
      elementId: t.exposeInt("elementId", { nullable: false }),
      textPropsId: t.exposeInt("textPropsId", { nullable: false }),
      variableId: t.exposeInt("variableId", { nullable: true }),
    }),
  });

const TextElementObjectRef =
  gqlSchemaBuilder.objectRef<Types.TextElementOutput>("TextElement");

export const TextElementObject = gqlSchemaBuilder.loadableObject<
  Types.TextElementOutput | Error,
  number,
  [typeof CertificateElementPothosInterface],
  typeof TextElementObjectRef
>(TextElementObjectRef, {
  load: async ids => {
    const results = await TextElementRepository.loadByIds(ids);
    logger.info(
      `[TextElementObject] Loaded ${results.length} TEXT element(s) for Pothos object`
    );
    logger.debug(
      `[TextElementObject] Loaded elements: ${JSON.stringify(results)}`
    );
    return results;
  },
  sort: e => e.base.id,
  interfaces: [CertificateElementPothosInterface],
  isTypeOf: item => isOfElement(item, Types.ElementType.TEXT),
  fields: t => ({
    textProps: createTextPropsFieldFromEntity(t),
    textElementSpecProps: t.expose("textElementSpecProps", {
      type: TextElementSpecPropsObject,
      nullable: false,
    }),
    textDataSource: t.expose("textDataSource", {
      type: TextDataSourceUnion,
      nullable: false,
    }),
  }),
});
