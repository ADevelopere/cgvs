import { gqlSchemaBuilder } from "@/server/graphql/gqlSchemaBuilder";
import * as Types from "@/server/types/element";
import { TemplateRepository, ElementRepository } from "@/server/db/repo";
import { TemplatePothosObject } from "@/server/graphql/pothos/template.pothos";
import type { InputFieldBuilder, SchemaTypes } from "@pothos/core";
import {
  ElementAlignmentPothosEnum,
  ElementTypePothosEnum,
} from "./elementEnum.pothos";

// ============================================================================
// Element Order Update Input (for batch operations)
// ============================================================================

export const ElementOrderUpdateInputObject = gqlSchemaBuilder
  .inputRef<Types.ElementOrderUpdateInput>("ElementOrderUpdateInput")
  .implement({
    fields: t => ({
      id: t.int({ required: true }),
      renderOrder: t.int({ required: true }),
    }),
  });

// ============================================================================
// Input Field Helpers (to reduce duplication across element types)
// ============================================================================
/**
 * Helper to create shared base element input fields for create operations
 * All fields are required
 */
export const createBaseElementInputFields = <Types extends SchemaTypes>(
  t: InputFieldBuilder<Types, "InputObject">
) => ({
  name: t.string({ required: true }),
  description: t.string({ required: true }),
  positionX: t.int({ required: true }),
  positionY: t.int({ required: true }),
  width: t.int({ required: true }),
  height: t.int({ required: true }),
  alignment: t.field({ type: ElementAlignmentPothosEnum, required: true }),
  hidden: t.boolean({ required: false }),
  renderOrder: t.int({ required: true }),
});

export const CertificateElementBaseInputObject = gqlSchemaBuilder
  .inputRef<Types.CertificateElementBaseInput>("CertificateElementBaseInput")
  .implement({
    fields: t => ({
      templateId: t.int({ required: true }),
      ...createBaseElementInputFields(t),
    }),
  });

export const CertificateElementBaseUpdateInputObject = gqlSchemaBuilder
  .inputRef<Types.CertificateElementBaseUpdateInput>(
    "CertificateElementBaseUpdateInput"
  )
  .implement({
    fields: t => ({
      id: t.int({ required: true }),
      ...createBaseElementInputFields(t),
    }),
  });

// ============================================================================
// CertificateElement Interface (shared fields for all element types)
// ============================================================================

export const CertificateElementBaseObject = gqlSchemaBuilder
  .objectRef<Types.CertificateElementEntity>("CertificateElementBase")
  .implement({
    fields: t => ({
      id: t.exposeInt("id", { nullable: false }),
      name: t.exposeString("name", { nullable: false }),
      description: t.exposeString("description"),
      type: t.field({
        type: ElementTypePothosEnum,
        nullable: false,
        resolve: element => element.type as Types.ElementType,
      }),
      positionX: t.exposeInt("positionX", { nullable: false }),
      positionY: t.exposeInt("positionY", { nullable: false }),
      width: t.exposeInt("width", { nullable: false }),
      height: t.exposeInt("height", { nullable: false }),
      alignment: t.field({
        type: ElementAlignmentPothosEnum,
        nullable: false,
        resolve: element => element.alignment as Types.ElementAlignment,
      }),
      hidden: t.exposeBoolean("hidden", { nullable: false }),
      renderOrder: t.exposeInt("renderOrder", { nullable: false }),
      createdAt: t.expose("createdAt", { type: "DateTime", nullable: false }),
      updatedAt: t.expose("updatedAt", { type: "DateTime", nullable: false }),
    }),
  });

export const CertificateElementInterfaceObjectRef =
  gqlSchemaBuilder.loadableInterfaceRef<
    Types.CertificateElementInterface,
    number
  >("CertificateElement", {
    load: async ids => await ElementRepository.loadByIds(ids),
  });

export const CertificateElementPothosInterface =
  gqlSchemaBuilder.loadableInterface<
    Types.CertificateElementInterface,
    number,
    [],
    typeof CertificateElementInterfaceObjectRef
  >(CertificateElementInterfaceObjectRef, {
    load: async ids => await ElementRepository.loadByIds(ids),
    sort: e => e.base.id,
    fields: t => ({
      base: t.expose("base", {
        type: CertificateElementBaseObject,
        nullable: false,
      }),
    }),
  });

// Add template field using interfaceFields (separate from interface definition)
gqlSchemaBuilder.interfaceFields(CertificateElementPothosInterface, t => ({
  template: t.loadable({
    type: TemplatePothosObject,
    load: (ids: number[]) => TemplateRepository.loadByIds(ids),
    resolve: element => element.base.templateId,
  }),
}));

export const isOfElement = (
  item: unknown,
  type: Types.ElementType
): item is Types.TextElementOutput => {
  return (
    typeof item === "object" &&
    item !== null &&
    "base" in item &&
    item.base !== null &&
    typeof item.base === "object" &&
    "type" in item.base &&
    item.base.type === type
  );
};
