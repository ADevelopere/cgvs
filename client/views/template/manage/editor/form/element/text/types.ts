import type {
  TextElementCreateInput,
  TextElementUpdateInput,
  TextDataSourceInput as TextDataSourceInputGQL,
  TextDataSourceType,
  FontReferenceInput as FontReferenceInputGQL,
  FontSource,
  ElementAlignment,
  ElementOverflow,
  StudentTextField,
  CertificateTextField,
  TemplateTextVariable,
  TemplateSelectVariable,
  Font,
  TextPropsInput as TextPropsInputGQL,
} from "@/client/graphql/generated/gql/graphql";

// ============================================================================
// WORKING STATE TYPES (Discriminated Unions - match backend structure)
// ============================================================================

// Data source working state (with type discriminator)
export type TextDataSourceState =
  | { type: "STATIC"; value: string }
  | { type: "STUDENT_TEXT_FIELD"; field: StudentTextField }
  | { type: "CERTIFICATE_TEXT_FIELD"; field: CertificateTextField }
  | { type: "TEMPLATE_TEXT_VARIABLE"; variableId: number }
  | { type: "TEMPLATE_SELECT_VARIABLE"; variableId: number };

// Font reference working state (with type discriminator)
export type FontReferenceState =
  | { type: "GOOGLE"; identifier: string }
  | { type: "SELF_HOSTED"; fontId: number };

// Text props working state
export type TextPropsState = {
  fontRef: FontReferenceState;
  fontSize: number;
  color: string;
  overflow: ElementOverflow;
};

// Base element working state
export type BaseElementState = {
  templateId: number;
  name: string;
  description: string;
  positionX: number;
  positionY: number;
  width: number;
  height: number;
  alignment: ElementAlignment;
  renderOrder: number;
};

// Complete text element working state
export type TextElementState = BaseElementState & {
  textProps: TextPropsState;
  dataSource: TextDataSourceState;
};

// ============================================================================
// TYPE-SAFE UPDATE FUNCTIONS
// ============================================================================

export type UpdateStateFn<T> = <K extends keyof T>(
  key: K,
  value: T[K]
) => void;
export type ValidateFieldFn<T> = <K extends keyof T>(
  key: K,
  value: T[K]
) => string | undefined;

// ============================================================================
// MODULAR ERROR TYPES
// ============================================================================

export type BaseElementFormErrors = {
  templateId?: string;
  name?: string;
  description?: string;
  positionX?: string;
  positionY?: string;
  width?: string;
  height?: string;
  alignment?: string;
  renderOrder?: string;
};

export type TextPropsFormErrors = {
  color?: string;
  fontSize?: string;
  overflow?: string;
  fontRef?: string;
  fontIdentifier?: string;
  fontId?: string;
};

export type DataSourceFormErrors = {
  value?: string; // for STATIC
  field?: string; // for STUDENT_TEXT_FIELD / CERTIFICATE_TEXT_FIELD
  variableId?: string; // for TEMPLATE_TEXT_VARIABLE / TEMPLATE_SELECT_VARIABLE
};

export type TextElementFormErrors = {
  base: BaseElementFormErrors;
  textProps: TextPropsFormErrors;
  dataSource: DataSourceFormErrors;
};

// ============================================================================
// SPECIFIC UPDATE FUNCTION TYPES
// ============================================================================

export type UpdateBaseElementFn = UpdateStateFn<BaseElementState>;
export type UpdateTextPropsFn = UpdateStateFn<TextPropsState>;
export type UpdateDataSourceFn = (dataSource: TextDataSourceState) => void;
export type UpdateFontRefFn = (fontRef: FontReferenceState) => void;

// ============================================================================
// CONVERSION UTILITIES
// ============================================================================

// Convert working state to GraphQL input
export const textDataSourceToGraphQL = (
  state: TextDataSourceState
): TextDataSourceInputGQL => {
  switch (state.type) {
    case "STATIC":
      return { static: { value: state.value } };
    case "STUDENT_TEXT_FIELD":
      return { studentField: { field: state.field } };
    case "CERTIFICATE_TEXT_FIELD":
      return { certificateField: { field: state.field } };
    case "TEMPLATE_TEXT_VARIABLE":
      return { templateTextVariable: { variableId: state.variableId } };
    case "TEMPLATE_SELECT_VARIABLE":
      return { templateSelectVariable: { variableId: state.variableId } };
  }
};

export const fontReferenceToGraphQL = (
  state: FontReferenceState
): FontReferenceInputGQL => {
  switch (state.type) {
    case "GOOGLE":
      return { google: { identifier: state.identifier } };
    case "SELF_HOSTED":
      return { selfHosted: { fontId: state.fontId } };
  }
};

export const textPropsToGraphQL = (
  state: TextPropsState
): TextPropsInputGQL => {
  return {
    ...state,
    fontRef: fontReferenceToGraphQL(state.fontRef),
  };
};

// ============================================================================
// RE-EXPORTS
// ============================================================================

export type {
  TextDataSourceType,
  FontSource,
  ElementAlignment,
  ElementOverflow,
  StudentTextField,
  CertificateTextField,
  TemplateTextVariable,
  TemplateSelectVariable,
  Font,
  TextElementCreateInput,
  TextElementUpdateInput,
};

