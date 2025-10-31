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

export const QRCodeDataSourceTypePothosEnum = gqlSchemaBuilder.enumType(
  "QRCodeDataSourceType",
  {
    values: Object.values(Types.QRCodeDataSourceType),
  }
);

// ============================================================================
// Data Source Objects (Output)
// ============================================================================

export const QRCodeDataSourceVerificationUrlObject = gqlSchemaBuilder
  .objectRef<
    Extract<
      Types.QRCodeDataSource,
      { type: Types.QRCodeDataSourceType.VERIFICATION_URL }
    >
  >("QRCodeDataSourceVerificationUrl")
  .implement({
    fields: t => ({
      type: t.expose("type", { type: QRCodeDataSourceTypePothosEnum }),
    }),
  });

export const QRCodeDataSourceVerificationCodeObject = gqlSchemaBuilder
  .objectRef<
    Extract<
      Types.QRCodeDataSource,
      { type: Types.QRCodeDataSourceType.VERIFICATION_CODE }
    >
  >("QRCodeDataSourceVerificationCode")
  .implement({
    fields: t => ({
      type: t.expose("type", { type: QRCodeDataSourceTypePothosEnum }),
    }),
  });

// ============================================================================
// Data Source Union (Output)
// ============================================================================

export const QRCodeDataSourceUnion = gqlSchemaBuilder.unionType(
  "QRCodeDataSource",
  {
    types: [
      QRCodeDataSourceVerificationUrlObject,
      QRCodeDataSourceVerificationCodeObject,
    ],
    resolveType: ds => {
      switch (ds.type) {
        case Types.QRCodeDataSourceType.VERIFICATION_URL:
          return "QRCodeDataSourceVerificationUrl";
        case Types.QRCodeDataSourceType.VERIFICATION_CODE:
          return "QRCodeDataSourceVerificationCode";
        default: {
          const exhaustiveCheck: never = ds;
          throw new Error(
            `Unknown QRCodeDataSource type: ${(exhaustiveCheck as { type: string }).type}`
          );
        }
      }
    },
  }
);

// ============================================================================
// Data Source Input Objects (isOneOf Pattern)
// ============================================================================

export const QRCodeDataSourceVerificationUrlInputObject = gqlSchemaBuilder
  .inputRef<Types.QRCodeDataSourceVerificationUrlInputGraphql>(
    "QRCodeDataSourceVerificationUrlInput"
  )
  .implement({
    fields: _t => ({}), // No fields - VERIFICATION_URL has no parameters
  });

export const QRCodeDataSourceVerificationCodeInputObject = gqlSchemaBuilder
  .inputRef<Types.QRCodeDataSourceVerificationCodeInputGraphql>(
    "QRCodeDataSourceVerificationCodeInput"
  )
  .implement({
    fields: _t => ({}), // No fields - VERIFICATION_CODE has no parameters
  });

export const QRCodeDataSourceInputObject = gqlSchemaBuilder.inputType(
  "QRCodeDataSourceInput",
  {
    isOneOf: true,
    fields: t => ({
      verificationUrl: t.field({
        type: QRCodeDataSourceVerificationUrlInputObject,
      }),
      verificationCode: t.field({
        type: QRCodeDataSourceVerificationCodeInputObject,
      }),
    }),
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
  dataSource: t.field({
    type: QRCodeDataSourceInputObject,
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
    qrCodeDataSource: t.expose("qrCodeDataSource", {
      type: QRCodeDataSourceUnion,
    }),
  }),
});
