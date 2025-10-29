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

// ============================================================================
// Mutation Inputs
// ============================================================================

export const CountryElementCreateInputObject = gqlSchemaBuilder
  .inputRef<Types.CountryElementCreateInputGraphql>("CountryElementCreateInput")
  .implement({
    fields: t => ({
      ...createBaseElementInputFields(t),
      textProps: t.field({ type: TextPropsInputObject, required: true }),
      representation: t.field({
        type: CountryRepresentationPothosEnum,
        required: true,
      }),
    }),
  });

export const CountryElementUpdateInputObject = gqlSchemaBuilder
  .inputRef<Types.CountryElementUpdateInputGraphql>("CountryElementUpdateInput")
  .implement({
    fields: t => ({
      ...createBaseElementUpdateInputFields(t),
      textProps: t.field({
        type: TextPropsUpdateInputObject,
      }),
      representation: t.field({
        type: CountryRepresentationPothosEnum,
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
    textProps: t.expose("textProps", { type: TextPropsObject }),
    representation: t.expose("representation", {
      type: CountryRepresentationPothosEnum,
    }),
  }),
});
