import { gqlSchemaBuilder } from "@/server/graphql/gqlSchemaBuilder";
import * as Types from "@/server/types/element";
import { GenderElementRepository } from "@/server/db/repo/element";
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

// ============================================================================
// Enums
// ============================================================================

export const GenderDataSourceTypePothosEnum = gqlSchemaBuilder.enumType(
  "GenderDataSourceType",
  { values: Object.values(Types.GenderDataSourceType) }
);

// ============================================================================
// Data Source Objects (Output)
// ============================================================================

export const GenderDataSourceObject = gqlSchemaBuilder
  .objectRef<Types.GenderDataSource>("GenderDataSource")
  .implement({
    fields: t => ({
      type: t.expose("type", { type: GenderDataSourceTypePothosEnum }),
    }),
  });

// ============================================================================
// Data Source Input Objects (isOneOf Pattern)
// ============================================================================

export const GenderDataSourceStudentGenderInputObject = gqlSchemaBuilder
  .inputRef<Types.GenderDataSourceStudentGenderInputGraphql>(
    "GenderDataSourceStudentGenderInput"
  )
  .implement({
    fields: _t => ({}), // No fields - STUDENT_GENDER has no parameters
  });

export const GenderDataSourceInputObject = gqlSchemaBuilder.inputType(
  "GenderDataSourceInput",
  {
    isOneOf: true,
    fields: t => ({
      studentGender: t.field({
        type: GenderDataSourceStudentGenderInputObject,
      }),
    }),
  }
);

// ============================================================================
// Mutation Inputs
// ============================================================================

const createGenderElementInputFields = <Types extends SchemaTypes>(
  t: InputFieldBuilder<Types, "InputObject">
) => ({
  base: t.field({
    type: CertificateElementBaseInputObject,
    required: true,
  }),
  textProps: t.field({ type: TextPropsInputObject, required: true }),
  dataSource: t.field({
    type: GenderDataSourceInputObject,
    required: true,
  }),
});

export const GenderElementInputObject = gqlSchemaBuilder
  .inputRef<Types.GenderElementInputGraphql>("GenderElementInput")
  .implement({
    fields: t => ({
      ...createGenderElementInputFields(t),
    }),
  });

export const GenderElementUpdateInputObject = gqlSchemaBuilder
  .inputRef<Types.GenderElementUpdateInputGraphql>("GenderElementUpdateInput")
  .implement({
    fields: t => ({
      id: t.int({ required: true }),
      ...createGenderElementInputFields(t),
    }),
  });

// ============================================================================
// Loadable Element Object
// ============================================================================

const GenderElementObjectRef =
  gqlSchemaBuilder.objectRef<Types.GenderElementOutput>("GenderElement");

export const GenderElementObject = gqlSchemaBuilder.loadableObject<
  Types.GenderElementOutput | Error,
  number,
  [typeof CertificateElementPothosInterface],
  typeof GenderElementObjectRef
>(GenderElementObjectRef, {
  load: async ids => await GenderElementRepository.loadByIds(ids),
  sort: e => e.base.id,
  interfaces: [CertificateElementPothosInterface],
  isTypeOf: item => isOfElement(item, Types.ElementType.GENDER),
  fields: t => ({
    textProps: createTextPropsFieldFromEntity(t),
    genderDataSource: t.expose("genderDataSource", {
      type: GenderDataSourceObject,
    }),
  }),
});
