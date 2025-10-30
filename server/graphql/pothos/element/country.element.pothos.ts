import { gqlSchemaBuilder } from "@/server/graphql/gqlSchemaBuilder";
import * as Types from "@/server/types/element";
import { CountryElementRepository } from "@/server/db/repo/element";
import {
  CertificateElementPothosInterface,
  CertificateElementBaseInputObject,
} from "./base.element.pothos";
import { InputFieldBuilder, SchemaTypes } from "@pothos/core";
import {
  createTextPropsFieldFromEntity,
  TextPropsInputObject,
} from "./textProps.pothos";

// ============================================================================
// Enums
// ============================================================================

export const CountryRepresentationPothosEnum = gqlSchemaBuilder.enumType(
  "CountryRepresentation",
  { values: Object.values(Types.CountryRepresentation) }
);

// ============================================================================
// Mutation Inputs
// ============================================================================
export const CountryElementCountryPropsInputObject = gqlSchemaBuilder
  .inputRef<Types.CountryElementCountryPropsInput>(
    "CountryElementCountryPropsInput"
  )
  .implement({
    fields: t => ({
      representation: t.field({
        type: CountryRepresentationPothosEnum,
        required: true,
      }),
    }),
  });

const createCountryElementInputFields = <Types extends SchemaTypes>(
  t: InputFieldBuilder<Types, "InputObject">
) => ({
  base: t.field({
    type: CertificateElementBaseInputObject,
    required: true,
  }),
  textProps: t.field({ type: TextPropsInputObject, required: true }),
  countryProps: t.field({
    type: CountryElementCountryPropsInputObject,
    required: true,
  }),
});

export const CountryElementInputObject = gqlSchemaBuilder
  .inputRef<Types.CountryElementInputGraphql>("CountryElementInput")
  .implement({
    fields: t => ({
      ...createCountryElementInputFields(t),
    }),
  });

export const CountryElementUpdateInputObject = gqlSchemaBuilder
  .inputRef<Types.CountryElementUpdateInputGraphql>("CountryElementUpdateInput")
  .implement({
    fields: t => ({
      id: t.int({ required: true }),
      ...createCountryElementInputFields(t),
    }),
  });

// ============================================================================
// Loadable Element Object
// ============================================================================
export const CountryElementCountryPropsPothosObject = gqlSchemaBuilder
  .objectRef<Types.CountryElementCountryProps>("CountryElementCountryProps")
  .implement({
    fields: t => ({
      representation: t.expose("representation", {
        type: CountryRepresentationPothosEnum,
      }),
    }),
  });

const CountryElementObjectRef =
  gqlSchemaBuilder.objectRef<Types.CountryElementOutput>("CountryElement");

export const CountryElementObject = gqlSchemaBuilder.loadableObject<
  Types.CountryElementOutput | Error,
  number,
  [typeof CertificateElementPothosInterface],
  typeof CountryElementObjectRef
>(CountryElementObjectRef, {
  load: async ids => await CountryElementRepository.loadByIds(ids),
  sort: e => e.base.id,
  interfaces: [CertificateElementPothosInterface],
  isTypeOf: item =>
    typeof item === "object" &&
    item !== null &&
    "type" in item &&
    item.type === Types.ElementType.COUNTRY,
  fields: t => ({
    textProps: createTextPropsFieldFromEntity(t),
    countryProps: t.expose("countryProps", {
      type: CountryElementCountryPropsPothosObject,
    }),
  }),
});
