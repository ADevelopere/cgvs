import { gqlSchemaBuilder } from "@/server/graphql/gqlSchemaBuilder";
import * as Types from "@/server/types/element";
import { GenderElementRepository } from "@/server/db/repo/element";
import {
  TextPropsObject,
  TextPropsInputObject,
  TextPropsUpdateInputObject,
  CertificateElementPothosInterface,
  createBaseElementInputFields,
  createBaseElementUpdateInputFields,
} from "./base.element.pothos";

// ============================================================================
// Mutation Inputs
// ============================================================================

export const GenderElementCreateInputObject = gqlSchemaBuilder
  .inputRef<Types.GenderElementCreateInputGraphql>("GenderElementCreateInput")
  .implement({
    fields: t => ({
      ...createBaseElementInputFields(t),
      textProps: t.field({ type: TextPropsInputObject, required: true }),
    }),
  });

export const GenderElementUpdateInputObject = gqlSchemaBuilder
  .inputRef<Types.GenderElementUpdateInputGraphql>("GenderElementUpdateInput")
  .implement({
    fields: t => ({
      ...createBaseElementUpdateInputFields(t),
      textProps: t.field({ type: TextPropsUpdateInputObject }),
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
    textProps: t.expose("textProps", { type: TextPropsObject }),
  }),
});