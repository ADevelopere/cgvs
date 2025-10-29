import { gqlSchemaBuilder } from "@/server/graphql/gqlSchemaBuilder";
import * as Types from "@/server/types/element/output";
import { QRCodeElementRepository } from "@/server/db/repo/element";
import { TemplateRepository } from "@/server/db/repo";
import { TemplatePothosObject } from "@/server/graphql/pothos/template.pothos";
import {
  ElementTypePothosEnum,
  CertificateElementPothosInterface,
  createBaseElementInputFields,
  createBaseElementUpdateInputFields,
} from "./base.element.pothos";

// ============================================================================
// Enums
// ============================================================================

export const QRCodeDataSourceTypePothosEnum = gqlSchemaBuilder.enumType(
  "QRCodeDataSourceType",
  {
    values: Object.values(Types.QRCodeDataSourceType),
  }
);

export const QRCodeErrorCorrectionPothosEnum = gqlSchemaBuilder.enumType(
  "QRCodeErrorCorrection",
  {
    values: Object.values(Types.QRCodeErrorCorrection),
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
    fields: () => ({}),
  });

export const QRCodeDataSourceVerificationCodeInputObject = gqlSchemaBuilder
  .inputRef<Types.QRCodeDataSourceVerificationCodeInputGraphql>(
    "QRCodeDataSourceVerificationCodeInput"
  )
  .implement({
    fields: () => ({}),
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
// Config Objects
// ============================================================================

export const QRCodeElementConfigObject = gqlSchemaBuilder
  .objectRef<Types.QRCodeElementConfig>("QRCodeElementConfig")
  .implement({
    fields: t => ({
      type: t.expose("type", { type: ElementTypePothosEnum }),
      dataSource: t.expose("dataSource", { type: QRCodeDataSourceUnion }),
      errorCorrection: t.expose("errorCorrection", {
        type: QRCodeErrorCorrectionPothosEnum,
      }),
      foregroundColor: t.exposeString("foregroundColor"),
      backgroundColor: t.exposeString("backgroundColor"),
    }),
  });

export const QRCodeElementConfigInputObject = gqlSchemaBuilder
  .inputRef<Types.QRCodeElementConfigInputGraphql>("QRCodeElementConfigInput")
  .implement({
    fields: t => ({
      dataSource: t.field({
        type: QRCodeDataSourceInputObject,
        required: true,
      }),
      errorCorrection: t.field({
        type: QRCodeErrorCorrectionPothosEnum,
        required: true,
      }),
      foregroundColor: t.string({ required: true }),
      backgroundColor: t.string({ required: true }),
    }),
  });

export const QRCodeElementConfigUpdateInputObject = gqlSchemaBuilder
  .inputRef<Types.QRCodeElementConfigUpdateInputGraphql>(
    "QRCodeElementConfigUpdateInput"
  )
  .implement({
    fields: t => ({
      dataSource: t.field({
        type: QRCodeDataSourceInputObject,
      }),
      errorCorrection: t.field({
        type: QRCodeErrorCorrectionPothosEnum,
      }),
      foregroundColor: t.string({ required: false }),
      backgroundColor: t.string({ required: false }),
    }),
  });

// ============================================================================
// Mutation Inputs
// ============================================================================

export const QRCodeElementCreateInputObject = gqlSchemaBuilder
  .inputRef<Types.QRCodeElementCreateInputGraphql>("QRCodeElementCreateInput")
  .implement({
    fields: t => ({
      ...createBaseElementInputFields(t),
      config: t.field({
        type: QRCodeElementConfigInputObject,
        required: true,
      }),
    }),
  });

export const QRCodeElementUpdateInputObject = gqlSchemaBuilder
  .inputRef<Types.QRCodeElementUpdateInputGraphql>("QRCodeElementUpdateInput")
  .implement({
    fields: t => ({
      ...createBaseElementUpdateInputFields(t),
      config: t.field({
        type: QRCodeElementConfigUpdateInputObject,
      }),
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
    // Only element-specific field (config)
    config: t.expose("config", { type: QRCodeElementConfigObject }),
  }),
});

gqlSchemaBuilder.objectFields(QRCodeElementObject, t => ({
  template: t.loadable({
    type: TemplatePothosObject,
    load: (ids: number[]) => TemplateRepository.loadByIds(ids),
    resolve: element => element.templateId,
  }),
}));
