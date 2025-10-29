import { gqlSchemaBuilder } from "@/server/graphql/gqlSchemaBuilder";
import * as Types from "@/server/types/element";
import { QRCodeElementRepository } from "@/server/db/repo/element";
import {
  CertificateElementPothosInterface,
  createBaseElementInputFields,
  createBaseElementUpdateInputFields,
} from "./base.element.pothos";

// ============================================================================
// Enums
// ============================================================================

export const QRCodeErrorCorrectionPothosEnum = gqlSchemaBuilder.enumType(
  "QRCodeErrorCorrection",
  {
    values: Object.values(Types.QRCodeErrorCorrection),
  }
);

// ============================================================================
// Mutation Inputs
// ============================================================================

export const QRCodeElementCreateInputObject = gqlSchemaBuilder
  .inputRef<Types.QRCodeElementCreateInputGraphql>("QRCodeElementCreateInput")
  .implement({
    fields: t => ({
      ...createBaseElementInputFields(t),
      errorCorrection: t.field({
        type: QRCodeErrorCorrectionPothosEnum,
        required: true,
      }),
      foregroundColor: t.string({ required: true }),
      backgroundColor: t.string({ required: true }),
    }),
  });

export const QRCodeElementUpdateInputObject = gqlSchemaBuilder
  .inputRef<Types.QRCodeElementUpdateInputGraphql>("QRCodeElementUpdateInput")
  .implement({
    fields: t => ({
      ...createBaseElementUpdateInputFields(t),
      errorCorrection: t.field({
        type: QRCodeErrorCorrectionPothosEnum,
      }),
      foregroundColor: t.string(),
      backgroundColor: t.string(),
    }),
  });

// ============================================================================
// Loadable Element Object
// ============================================================================

const QRCodeElementObjectRef =
  gqlSchemaBuilder.objectRef<Types.QRCodeElementPothosDefinition>(
    "QRCodeElement"
  );

export const QRCodeElementObject = gqlSchemaBuilder.loadableObject<
  Types.QRCodeElementPothosDefinition | Error,
  number,
  [typeof CertificateElementPothosInterface],
  typeof QRCodeElementObjectRef
>(QRCodeElementObjectRef, {
  load: async ids => await QRCodeElementRepository.loadByIds(ids),
  sort: e => e.id,
  interfaces: [CertificateElementPothosInterface],
  isTypeOf: item =>
    typeof item === "object" &&
    item !== null &&
    "type" in item &&
    item.type === Types.ElementType.QR_CODE,
  fields: t => ({
    errorCorrection: t.expose("errorCorrection", {
      type: QRCodeErrorCorrectionPothosEnum,
    }),
    foregroundColor: t.exposeString("foregroundColor"),
    backgroundColor: t.exposeString("backgroundColor"),
  }),
});