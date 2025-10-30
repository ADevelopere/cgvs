import { gqlSchemaBuilder } from "@/server/graphql/gqlSchemaBuilder";
import * as Types from "@/server/types/element";
import { DateElementRepository } from "@/server/db/repo/element";
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

export const DateDataSourceTypePothosEnum = gqlSchemaBuilder.enumType(
  "DateDataSourceType",
  { values: Object.values(Types.DateDataSourceType) }
);

export const StudentDateFieldPothosEnum = gqlSchemaBuilder.enumType(
  "StudentDateField",
  { values: Object.values(Types.StudentDateField) }
);

export const CertificateDateFieldPothosEnum = gqlSchemaBuilder.enumType(
  "CertificateDateField",
  { values: Object.values(Types.CertificateDateField) }
);

export const CalendarTypePothosEnum = gqlSchemaBuilder.enumType(
  "CalendarType",
  { values: Object.values(Types.CalendarType) }
);

export const DateTransformationTypePothosEnum = gqlSchemaBuilder.enumType(
  "DateTransformationType",
  { values: Object.values(Types.DateTransformationType) }
);

// ============================================================================
// Data Source Objects (Output) - 4 variants
// ============================================================================

export const DateDataSourceStaticObject = gqlSchemaBuilder
  .objectRef<
    Extract<Types.DateDataSource, { type: Types.DateDataSourceType.STATIC }>
  >("DateDataSourceStatic")
  .implement({
    fields: t => ({
      type: t.expose("type", { type: DateDataSourceTypePothosEnum }),
      value: t.exposeString("value"),
    }),
  });

export const DateDataSourceStudentFieldObject = gqlSchemaBuilder
  .objectRef<
    Extract<
      Types.DateDataSource,
      { type: Types.DateDataSourceType.STUDENT_DATE_FIELD }
    >
  >("DateDataSourceStudentField")
  .implement({
    fields: t => ({
      type: t.expose("type", { type: DateDataSourceTypePothosEnum }),
      studentField: t.expose("studentField", {
        type: StudentDateFieldPothosEnum,
      }),
    }),
  });

export const DateDataSourceCertificateFieldObject = gqlSchemaBuilder
  .objectRef<
    Extract<
      Types.DateDataSource,
      { type: Types.DateDataSourceType.CERTIFICATE_DATE_FIELD }
    >
  >("DateDataSourceCertificateField")
  .implement({
    fields: t => ({
      type: t.expose("type", { type: DateDataSourceTypePothosEnum }),
      certificateField: t.expose("certificateField", {
        type: CertificateDateFieldPothosEnum,
      }),
    }),
  });

export const DateDataSourceTemplateVariableObject = gqlSchemaBuilder
  .objectRef<
    Extract<
      Types.DateDataSource,
      { type: Types.DateDataSourceType.TEMPLATE_DATE_VARIABLE }
    >
  >("DateDataSourceTemplateVariable")
  .implement({
    fields: t => ({
      type: t.expose("type", { type: DateDataSourceTypePothosEnum }),
      dateVariableId: t.exposeInt("dateVariableId"),
    }),
  });

// ============================================================================
// Data Source Union (Output)
// ============================================================================

export const DateDataSourceUnion = gqlSchemaBuilder.unionType(
  "DateDataSource",
  {
    types: [
      DateDataSourceStaticObject,
      DateDataSourceStudentFieldObject,
      DateDataSourceCertificateFieldObject,
      DateDataSourceTemplateVariableObject,
    ],
    resolveType: ds => {
      switch (ds.type) {
        case Types.DateDataSourceType.STATIC:
          return "DateDataSourceStatic";
        case Types.DateDataSourceType.STUDENT_DATE_FIELD:
          return "DateDataSourceStudentField";
        case Types.DateDataSourceType.CERTIFICATE_DATE_FIELD:
          return "DateDataSourceCertificateField";
        case Types.DateDataSourceType.TEMPLATE_DATE_VARIABLE:
          return "DateDataSourceTemplateVariable";
        default: {
          const exhaustiveCheck: never = ds;
          throw new Error(
            `Unknown DateDataSource type: ${(exhaustiveCheck as { type: string }).type}`
          );
        }
      }
    },
  }
);

// ============================================================================
// Data Source Input Objects (isOneOf Pattern)
// ============================================================================

export const DateDataSourceStaticInputObject = gqlSchemaBuilder
  .inputRef<Types.DateDataSourceStaticInputGraphql>("DateDataSourceStaticInput")
  .implement({
    fields: t => ({
      value: t.string({ required: true }),
    }),
  });

export const DateDataSourceStudentFieldInputObject = gqlSchemaBuilder
  .inputRef<Types.DateDataSourceStudentFieldInputGraphql>(
    "DateDataSourceStudentFieldInput"
  )
  .implement({
    fields: t => ({
      field: t.field({ type: StudentDateFieldPothosEnum, required: true }),
    }),
  });

export const DateDataSourceCertificateFieldInputObject = gqlSchemaBuilder
  .inputRef<Types.DateDataSourceCertificateFieldInputGraphql>(
    "DateDataSourceCertificateFieldInput"
  )
  .implement({
    fields: t => ({
      field: t.field({
        type: CertificateDateFieldPothosEnum,
        required: true,
      }),
    }),
  });

export const DateDataSourceTemplateVariableInputObject = gqlSchemaBuilder
  .inputRef<Types.DateDataSourceTemplateVariableInputGraphql>(
    "DateDataSourceTemplateVariableInput"
  )
  .implement({
    fields: t => ({
      variableId: t.int({ required: true }),
    }),
  });

export const DateDataSourceInputObject = gqlSchemaBuilder.inputType(
  "DateDataSourceInput",
  {
    isOneOf: true,
    fields: t => ({
      static: t.field({
        type: DateDataSourceStaticInputObject,
      }),
      studentField: t.field({
        type: DateDataSourceStudentFieldInputObject,
      }),
      certificateField: t.field({
        type: DateDataSourceCertificateFieldInputObject,
      }),
      templateVariable: t.field({
        type: DateDataSourceTemplateVariableInputObject,
      }),
    }),
  }
);

// ============================================================================
// Mutation Inputs
// ============================================================================

export const DatePropsCreateInputObject = gqlSchemaBuilder
  .inputRef<Types.DatePropsCreateInput>("DatePropsCreateInput")
  .implement({
    fields: t => ({
      calendarType: t.field({ type: CalendarTypePothosEnum, required: true }),
      offsetDays: t.int({ required: true }),
      format: t.string({ required: true }),
      transformation: t.field({
        type: DateTransformationTypePothosEnum,
      }),
    }),
  });

export const DateElementCreateInputObject = gqlSchemaBuilder
  .inputRef<Types.DateElementCreateInputGraphql>("DateElementCreateInput")
  .implement({
    fields: t => ({
      ...createBaseElementInputFields(t),
      textProps: t.field({ type: TextPropsInputObject, required: true }),
      dataSource: t.field({ type: DateDataSourceInputObject, required: true }),
      dateProps: t.field({ type: DatePropsCreateInputObject, required: true }),
    }),
  });

export const DatePropsUpdateInputObject = gqlSchemaBuilder
  .inputRef<Types.DatePropsUpdateInput>("DatePropsUpdateInput")
  .implement({
    fields: t => ({
      calendarType: t.field({ type: CalendarTypePothosEnum }),
      offsetDays: t.int(),
      format: t.string(),
      transformation: t.field({
        type: DateTransformationTypePothosEnum,
      }),
    }),
  });

export const DateElementUpdateInputObject = gqlSchemaBuilder
  .inputRef<Types.DateElementUpdateInputGraphql>("DateElementUpdateInput")
  .implement({
    fields: t => ({
      ...createBaseElementUpdateInputFields(t),
      textProps: t.field({
        type: TextPropsUpdateInputObject,
      }),
      dataSource: t.field({
        type: DateDataSourceInputObject,
      }),
      dateProps: t.field({ type: DatePropsUpdateInputObject }),
    }),
  });

// ============================================================================
// Loadable Element Object
// ============================================================================

export const DatePropsObject = gqlSchemaBuilder
  .objectRef<Types.DateElementSpecProps>("DateProps")
  .implement({
    fields: t => ({
      calendarType: t.expose("calendarType", { type: CalendarTypePothosEnum }),
      offsetDays: t.exposeInt("offsetDays"),
      format: t.exposeString("format"),
      transformation: t.expose("transformation", {
        type: DateTransformationTypePothosEnum,
        nullable: true,
      }),
    }),
  });

const DateElementObjectRef =
  gqlSchemaBuilder.objectRef<Types.DateElementPothosDefinition>("DateElement");

export const DateElementObject = gqlSchemaBuilder.loadableObject<
  Types.DateElementPothosDefinition | Error,
  number,
  [typeof CertificateElementPothosInterface],
  typeof DateElementObjectRef
>(DateElementObjectRef, {
  load: async ids => await DateElementRepository.loadByIds(ids),
  sort: e => e.id,
  interfaces: [CertificateElementPothosInterface],
  isTypeOf: item =>
    typeof item === "object" &&
    item !== null &&
    "type" in item &&
    item.type === Types.ElementType.DATE,
  fields: t => ({
    textProps: t.expose("textProps", { type: TextPropsObject }),
    dateProps: t.expose("dateProps", { type: DatePropsObject }),
    dateDataSource: t.expose("dateDataSource", { type: DateDataSourceUnion }),
  }),
});
