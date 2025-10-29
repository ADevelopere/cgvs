import { gqlSchemaBuilder } from "@/server/graphql/gqlSchemaBuilder";
import * as Types from "@/server/types/element";
import { CountryElementRepository } from "@/server/db/repo/element";
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

export const CountryRepresentationPothosEnum = gqlSchemaBuilder.enumType(
  "CountryRepresentation",
  { values: Object.values(Types.CountryRepresentation) }
);

export const CountryDataSourceTypePothosEnum = gqlSchemaBuilder.enumType(
  "CountryDataSourceType",
  { values: Object.values(Types.CountryDataSourceType) }
);

// ============================================================================
// Data Source Objects (Output) - 1 variant
// ============================================================================

export const CountryDataSourceStudentNationalityObject = gqlSchemaBuilder
  .objectRef<
    Extract<
      Types.CountryDataSource,
      { type: Types.CountryDataSourceType.STUDENT_NATIONALITY }
    >
  >("CountryDataSourceStudentNationality")
  .implement({
    fields: t => ({
      type: t.expose("type", { type: CountryDataSourceTypePothosEnum }),
    }),
  });

// ============================================================================
// Data Source Union (Output) - Single type but still a union for consistency
// ============================================================================

export const CountryDataSourceUnion = gqlSchemaBuilder.unionType(
  "CountryDataSource",
  {
    types: [CountryDataSourceStudentNationalityObject],
    resolveType: ds => {
      switch (ds.type) {
        case Types.CountryDataSourceType.STUDENT_NATIONALITY:
          return "CountryDataSourceStudentNationality";
        default:
          throw new Error(
            `Unknown CountryDataSource type: ${(ds as { type: string }).type}`
          );
      }
    },
  }
);

// ============================================================================
// Data Source Input Objects (isOneOf Pattern)
// ============================================================================

// export const CountryDataSourceStudentNationalityInputObject = gqlSchemaBuilder
//   .inputRef<Types.CountryDataSourceStudentNationalityInputGraphql>(
//     "CountryDataSourceStudentNationalityInput"
//   )
//   .implement({
//     fields: () => ({}),
//   });

// export const CountryDataSourceInputObject = gqlSchemaBuilder.inputType(
//   "CountryDataSourceInput",
//   {
//     isOneOf: true,
//     fields: t => ({
//       studentNationality: t.field({
//         type: CountryDataSourceStudentNationalityInputObject,
//       }),
//     }),
//   }
// );

// ============================================================================
// Config Objects
// ============================================================================

export const CountryElementConfigObject = gqlSchemaBuilder
  .objectRef<Types.CountryElementConfig>("CountryElementConfig")
  .implement({
    fields: t => ({
      textProps: t.expose("textProps", { type: TextPropsObject }),
      representation: t.expose("representation", {
        type: CountryRepresentationPothosEnum,
      }),
      // dataSource: t.expose("dataSource", { type: CountryDataSourceUnion }),
    }),
  });

export const CountryElementConfigInputObject = gqlSchemaBuilder
  .inputRef<Types.CountryElementConfigCreateInputGraphql>(
    "CountryElementConfigInput"
  )
  .implement({
    fields: t => ({
      textProps: t.field({ type: TextPropsInputObject, required: true }),
      representation: t.field({
        type: CountryRepresentationPothosEnum,
        required: true,
      }),
      // dataSource: t.field({
      //   type: CountryDataSourceInputObject,
      //   required: true,
      // }),
    }),
  });

export const CountryElementConfigUpdateInputObject = gqlSchemaBuilder
  .inputRef<Types.CountryElementConfigUpdateInputGraphql>(
    "CountryElementConfigUpdateInput"
  )
  .implement({
    fields: t => ({
      textProps: t.field({
        type: TextPropsUpdateInputObject,
        required: false,
      }),
      representation: t.field({
        type: CountryRepresentationPothosEnum,
        required: false,
      }),
      // dataSource: t.field({
      //   type: CountryDataSourceInputObject,
      //   required: false,
      // }),
    }),
  });

// ============================================================================
// Mutation Inputs
// ============================================================================

export const CountryElementCreateInputObject = gqlSchemaBuilder
  .inputRef<Types.CountryElementCreateInputGraphql>(
    "CountryElementCreateInput"
  )
  .implement({
    fields: t => ({
      ...createBaseElementInputFields(t),
      config: t.field({
        type: CountryElementConfigInputObject,
        required: true,
      }),
    }),
  });

export const CountryElementUpdateInputObject = gqlSchemaBuilder
  .inputRef<Types.CountryElementUpdateInputGraphql>(
    "CountryElementUpdateInput"
  )
  .implement({
    fields: t => ({
      ...createBaseElementUpdateInputFields(t),
      config: t.field({
        type: CountryElementConfigUpdateInputObject,
        required: false,
      }),
    }),
  });

// ============================================================================
// Loadable Element Object
// ============================================================================

const CountryElementObjectRef =
  gqlSchemaBuilder.objectRef<Types.CountryElementPothosDefinition>(
    "CountryElement"
  );

export const CountryElementObject = gqlSchemaBuilder.loadableObject<
  Types.CountryElementPothosDefinition | Error,
  number,
  [typeof CertificateElementPothosInterface],
  typeof CountryElementObjectRef
>(CountryElementObjectRef, {
  load: async ids => await CountryElementRepository.loadByIds(ids),
  sort: e => e.id,
  interfaces: [CertificateElementPothosInterface],
  isTypeOf: item =>
    typeof item === "object" &&
    item !== null &&
    "type" in item &&
    item.type === Types.ElementType.COUNTRY,
  fields: t => ({
    config: t.expose("config", { type: CountryElementConfigObject }),
  }),
});