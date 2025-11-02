import * as GQL from "@/client/graphql/generated/gql/graphql";
import { FormErrors, UpdateStateFn, ValidateFieldFn } from "../types";

export type TemplateConfigFormState =
  | GQL.TemplateConfigCreateInput
  | GQL.TemplateConfigUpdateInput;

type SanitizedTemplateConfigFormState = Omit<
  TemplateConfigFormState,
  "id"
  //  | "templateId"
>;

export type TemplateConfigFormErrors =
  FormErrors<SanitizedTemplateConfigFormState>;

export type TemplateConfigFormUpdateFn =
  UpdateStateFn<SanitizedTemplateConfigFormState>;

export type TemplateConfigFormValidateFn =
  ValidateFieldFn<SanitizedTemplateConfigFormState>;
