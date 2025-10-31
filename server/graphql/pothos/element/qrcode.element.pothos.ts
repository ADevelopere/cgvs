import { gqlSchemaBuilder } from "@/server/graphql/gqlSchemaBuilder";
import * as Types from "@/server/types/element";
import { QRCodeElementRepository } from "@/server/db/repo/element";
import {
  CertificateElementBaseInputObject,
  CertificateElementPothosInterface,
  isOfElement,
} from "./base.element.pothos";
import { InputFieldBuilder, SchemaTypes } from "@pothos/core";

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

const createQRCodeElementSpecPropsInputFields = <Types extends SchemaTypes>(
  t: InputFieldBuilder<Types, "InputObject">
) => ({
  errorCorrection: t.field({
    type: QRCodeErrorCorrectionPothosEnum,
    required: true,
  }),
  foregroundColor: t.string({ required: true }),
  backgroundColor: t.string({ required: true }),
});

export const QRCodeElementSpecPropsInputObject = gqlSchemaBuilder
  .inputRef<Types.QRCodeElementSpecPropsInput>("QRCodeElementSpecPropsInput")
  .implement({
    fields: t => ({
      ...createQRCodeElementSpecPropsInputFields(t),
    }),
  });

const createQRCodeElementInputFields = <Types extends SchemaTypes>(
  t: InputFieldBuilder<Types, "InputObject">
) => ({
  base: t.field({
    type: CertificateElementBaseInputObject,
    required: true,
  }),
  qrCodeProps: t.field({
    type: QRCodeElementSpecPropsInputObject,
    required: true,
  }),
});

export const QRCodeElementInputObject = gqlSchemaBuilder
  .inputRef<Types.QRCodeElementInputGraphql>("QRCodeElementInput")
  .implement({
    fields: t => ({
      ...createQRCodeElementInputFields(t),
    }),
  });

export const QRCodeElementUpdateInputObject = gqlSchemaBuilder
  .inputRef<Types.QRCodeElementUpdateInputGraphql>("QRCodeElementUpdateInput")
  .implement({
    fields: t => ({
      id: t.int({ required: true }),
      ...createQRCodeElementInputFields(t),
    }),
  });

// ============================================================================
// Loadable Element Object
// ============================================================================

export const QRCodeElementSpecPropsObject = gqlSchemaBuilder
  .objectRef<Types.QRCodeElementSpecProps>("QRCodeElementSpecProps")
  .implement({
    fields: t => ({
      elementId: t.exposeInt("elementId"),
      errorCorrection: t.expose("errorCorrection", {
        type: QRCodeErrorCorrectionPothosEnum,
      }),
      foregroundColor: t.exposeString("foregroundColor"),
      backgroundColor: t.exposeString("backgroundColor"),
    }),
  });

const QRCodeElementObjectRef =
  gqlSchemaBuilder.objectRef<Types.QRCodeElementOutput>("QRCodeElement");

export const QRCodeElementObject = gqlSchemaBuilder.loadableObject<
  Types.QRCodeElementOutput | Error,
  number,
  [typeof CertificateElementPothosInterface],
  typeof QRCodeElementObjectRef
>(QRCodeElementObjectRef, {
  load: async ids => await QRCodeElementRepository.loadByIds(ids),
  sort: e => e.base.id,
  interfaces: [CertificateElementPothosInterface],
  isTypeOf: item => isOfElement(item, Types.ElementType.QR_CODE),
  fields: t => ({
    qrCodeProps: t.expose("qrCodeProps", {
      type: QRCodeElementSpecPropsObject,
    }),
  }),
});
