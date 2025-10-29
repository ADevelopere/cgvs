import { gqlSchemaBuilder } from "@/server/graphql/gqlSchemaBuilder";
import * as Types from "@/server/types/element/output";
import { GenderElementRepository } from "@/server/db/repo/element";
import { TemplateRepository } from "@/server/db/repo";
import { TemplatePothosObject } from "@/server/graphql/pothos/template.pothos";
import {
  ElementTypePothosEnum,
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

export const GenderDataSourceTypePothosEnum = gqlSchemaBuilder.enumType(
  "GenderDataSourceType",
  { values: Object.values(Types.GenderDataSourceType) }
);

// ============================================================================
// Data Source Objects (Output) - 1 variant
// ============================================================================

export const GenderDataSourceStudentGenderObject = gqlSchemaBuilder
  .objectRef<
    Extract<
      Types.GenderDataSource,
      { type: Types.GenderDataSourceType.STUDENT_GENDER }
    >
  >("GenderDataSourceStudentGender")
  .implement({
    fields: t => ({
      type: t.expose("type", { type: GenderDataSourceTypePothosEnum }),
    }),
  });

// No union needed - only 1 variant, use object directly

// ============================================================================
// Data Source Input Objects (isOneOf Pattern)
// ============================================================================

export const GenderDataSourceStudentGenderInputObject = gqlSchemaBuilder
  .inputRef<Types.GenderDataSourceStudentGenderInputGraphql>(
    "GenderDataSourceStudentGenderInput"
  )
  .implement({
    fields: () => ({}), // No fields - discriminator only
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
// Config Objects
// ============================================================================

export const GenderElementConfigObject = gqlSchemaBuilder
  .objectRef<Types.GenderElementConfig>("GenderElementConfig")
  .implement({
    fields: t => ({
      type: t.expose("type", { type: ElementTypePothosEnum }),
      textProps: t.expose("textProps", { type: TextPropsObject }),
      dataSource: t.expose("dataSource", {
        type: GenderDataSourceStudentGenderObject,
      }),
    }),
  });

export const GenderElementConfigInputObject = gqlSchemaBuilder
  .inputRef<Types.GenderElementConfigInputGraphql>("GenderElementConfigInput")
  .implement({
    fields: t => ({
      textProps: t.field({ type: TextPropsInputObject, required: true }),
      dataSource: t.field({
        type: GenderDataSourceInputObject,
        required: true,
      }),
    }),
  });

export const GenderElementConfigUpdateInputObject = gqlSchemaBuilder
  .inputRef<Types.GenderElementConfigUpdateInputGraphql>(
    "GenderElementConfigUpdateInput"
  )
  .implement({
    fields: t => ({
      textProps: t.field({
        type: TextPropsUpdateInputObject,
        required: false,
      }),
      dataSource: t.field({
        type: GenderDataSourceInputObject,
        required: false,
      }),
    }),
  });

// ============================================================================
// Mutation Inputs
// ============================================================================

export const GenderElementCreateInputObject = gqlSchemaBuilder
  .inputRef<Types.GenderElementCreateInputGraphql>("GenderElementCreateInput")
  .implement({
    fields: t => ({
      ...createBaseElementInputFields(t),
      config: t.field({
        type: GenderElementConfigInputObject,
        required: true,
      }),
    }),
  });

export const GenderElementUpdateInputObject = gqlSchemaBuilder
  .inputRef<Types.GenderElementUpdateInputGraphql>("GenderElementUpdateInput")
  .implement({
    fields: t => ({
      ...createBaseElementUpdateInputFields(t),
      config: t.field({
        type: GenderElementConfigUpdateInputObject,
      }),
    }),
  });

// ============================================================================
// Loadable Element Object
// ============================================================================

const GenderElementObjectRef =
  gqlSchemaBuilder.objectRef<Types.GenderElementPothosDefinition>(
    "GenderElement"
  );

export const GenderElementObject = gqlSchemaBuilder.loadableObject<
  Types.GenderElementPothosDefinition | Error,
  number,
  [typeof CertificateElementPothosInterface],
  typeof GenderElementObjectRef
>(GenderElementObjectRef, {
  load: async ids => await GenderElementRepository.loadByIds(ids),
  sort: e => e.id,
  interfaces: [CertificateElementPothosInterface],
  isTypeOf: item =>
    typeof item === "object" &&
    item !== null &&
    "type" in item &&
    item.type === Types.ElementType.GENDER,
  fields: t => ({
    config: t.expose("config", { type: GenderElementConfigObject }),
  }),
});

gqlSchemaBuilder.objectFields(GenderElementObject, t => ({
  template: t.loadable({
    type: TemplatePothosObject,
    load: (ids: number[]) => TemplateRepository.loadByIds(ids),
    resolve: element => element.templateId,
  }),
}));

