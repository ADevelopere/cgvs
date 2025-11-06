import { gqlSchemaBuilder } from "@/server/graphql/gqlSchemaBuilder";
import * as Types from "@/server/types/element";
import { DateElementRepository } from "@/server/db/repo/element";
import {
  CertificateElementBaseInputObject,
  CertificateElementPothosInterface,
  isOfElement,
} from "./base.element.pothos";
import { InputFieldBuilder, SchemaTypes } from "@pothos/core";
import { createTextPropsFieldFromEntity, TextPropsInputObject } from "./textProps.pothos";

// ============================================================================
// Enums
// ============================================================================

export const DateDataSourceTypePothosEnum = gqlSchemaBuilder.enumType("DateDataSourceType", {
  values: Object.values(Types.DateDataSourceType),
});

export const StudentDateFieldPothosEnum = gqlSchemaBuilder.enumType("StudentDateField", {
  values: Object.values(Types.StudentDateField),
});

export const CertificateDateFieldPothosEnum = gqlSchemaBuilder.enumType("CertificateDateField", {
  values: Object.values(Types.CertificateDateField),
});

export const CalendarTypePothosEnum = gqlSchemaBuilder.enumType("CalendarType", {
  values: Object.values(Types.CalendarType),
});

export const DateTransformationTypePothosEnum = gqlSchemaBuilder.enumType("DateTransformationType", {
  values: Object.values(Types.DateTransformationType),
});

// ============================================================================
// Data Source Objects (Output) - 4 variants
// ============================================================================

export const DateDataSourceStaticObject = gqlSchemaBuilder
  .objectRef<Extract<Types.DateDataSource, { type: Types.DateDataSourceType.STATIC }>>("DateDataSourceStatic")
  .implement({
    fields: t => ({
      type: t.expose("type", { type: DateDataSourceTypePothosEnum }),
      value: t.exposeString("value"),
    }),
  });

export const DateDataSourceStudentFieldObject = gqlSchemaBuilder
  .objectRef<
    Extract<Types.DateDataSource, { type: Types.DateDataSourceType.STUDENT_DATE_FIELD }>
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
    Extract<Types.DateDataSource, { type: Types.DateDataSourceType.CERTIFICATE_DATE_FIELD }>
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
    Extract<Types.DateDataSource, { type: Types.DateDataSourceType.TEMPLATE_DATE_VARIABLE }>
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

export const DateDataSourceUnion = gqlSchemaBuilder.unionType("DateDataSource", {
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
        throw new Error(`Unknown DateDataSource type: ${(exhaustiveCheck as { type: string }).type}`);
      }
    }
  },
});

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
  .inputRef<Types.DateDataSourceStudentFieldInputGraphql>("DateDataSourceStudentFieldInput")
  .implement({
    fields: t => ({
      field: t.field({ type: StudentDateFieldPothosEnum, required: true }),
    }),
  });

export const DateDataSourceCertificateFieldInputObject = gqlSchemaBuilder
  .inputRef<Types.DateDataSourceCertificateFieldInputGraphql>("DateDataSourceCertificateFieldInput")
  .implement({
    fields: t => ({
      field: t.field({
        type: CertificateDateFieldPothosEnum,
        required: true,
      }),
    }),
  });

export const DateDataSourceTemplateVariableInputObject = gqlSchemaBuilder
  .inputRef<Types.DateDataSourceTemplateVariableInputGraphql>("DateDataSourceTemplateVariableInput")
  .implement({
    fields: t => ({
      variableId: t.int({ required: true }),
    }),
  });

export const DateDataSourceInputObject = gqlSchemaBuilder.inputType("DateDataSourceInput", {
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
});

export const DateDataSourceStandaloneInputObject = gqlSchemaBuilder
  .inputRef<Types.DateDataSourceStandaloneInputGraphql>("DateDataSourceStandaloneInput")
  .implement({
    fields: t => ({
      elementId: t.int({ required: true }),
      dataSource: t.field({ type: DateDataSourceInputObject, required: true }),
    }),
  });

export const DatePropsObject = gqlSchemaBuilder.objectRef<Types.DateElementSpecProps>("DateProps").implement({
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

export const DateDataSourceUpdateResponsePothosObject = gqlSchemaBuilder
  .objectRef<Types.DateDataSourceUpdateResponse>("DateDataSourceUpdateResponse")
  .implement({
    fields: t => ({
      elementId: t.exposeInt("elementId"),
      dateDataSource: t.expose("dateDataSource", {
        type: DateDataSourceUnion,
      }),
    }),
  });

export const DateElementSpecPropsUpdateResponsePothosObject = gqlSchemaBuilder
  .objectRef<Types.DateElementSpecPropsUpdateResponse>("DateElementSpecPropsUpdateResponse")
  .implement({
    fields: t => ({
      elementId: t.exposeInt("elementId"),
      dateProps: t.expose("dateProps", {
        type: DatePropsObject,
      }),
    }),
  });

// ============================================================================
// Mutation Inputs
// ============================================================================

export const DateElementSpecPropsInputObject = gqlSchemaBuilder
  .inputRef<Types.DateElementSpecPropsInput>("DateElementSpecPropsInput")
  .implement({
    fields: t => ({
      calendarType: t.field({ type: CalendarTypePothosEnum, required: true }),
      format: t.string({ required: true }),
      offsetDays: t.int(),
      transformation: t.field({
        type: DateTransformationTypePothosEnum,
      }),
    }),
  });

export const DateElementSpecPropsStandaloneInputObject = gqlSchemaBuilder
  .inputRef<Types.DateElementSpecPropsStandaloneInput>("DateElementSpecPropsStandaloneInput")
  .implement({
    fields: t => ({
      elementId: t.int({ required: true }),
      dateProps: t.field({
        type: DateElementSpecPropsInputObject,
        required: true,
      }),
    }),
  });

const createDateElementInputFields = <Types extends SchemaTypes>(t: InputFieldBuilder<Types, "InputObject">) => ({
  base: t.field({
    type: CertificateElementBaseInputObject,
    required: true,
  }),
  textProps: t.field({ type: TextPropsInputObject, required: true }),
  dataSource: t.field({ type: DateDataSourceInputObject, required: true }),
  dateProps: t.field({
    type: DateElementSpecPropsInputObject,
    required: true,
  }),
});

export const DateElementInputObject = gqlSchemaBuilder
  .inputRef<Types.DateElementInputGraphql>("DateElementInput")
  .implement({
    fields: t => ({
      ...createDateElementInputFields(t),
    }),
  });

export const DateElementUpdateInputObject = gqlSchemaBuilder
  .inputRef<Types.DateElementUpdateInputGraphql>("DateElementUpdateInput")
  .implement({
    fields: t => ({
      id: t.int({ required: true }),
      ...createDateElementInputFields(t),
    }),
  });

// ============================================================================
// Loadable Element Object
// ============================================================================
const DateElementObjectRef = gqlSchemaBuilder.objectRef<Types.DateElementOutput>("DateElement");

export const DateElementObject = gqlSchemaBuilder.loadableObject<
  Types.DateElementOutput | Error,
  number,
  [typeof CertificateElementPothosInterface],
  typeof DateElementObjectRef
>(DateElementObjectRef, {
  load: async ids => await DateElementRepository.loadByIds(ids),
  sort: e => e.base.id,
  interfaces: [CertificateElementPothosInterface],
  isTypeOf: item => isOfElement(item, Types.ElementType.DATE),

  fields: t => ({
    textProps: createTextPropsFieldFromEntity(t),
    dateProps: t.expose("dateProps", { type: DatePropsObject }),
    dateDataSource: t.expose("dateDataSource", { type: DateDataSourceUnion }),
  }),
});
