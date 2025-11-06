import * as GQL from "@/client/graphql/generated/gql/graphql";
import { Action, FormErrors, UpdateStateFn, ValidateFieldFn } from "../types";

type State = GQL.TemplateConfigCreateInput | GQL.TemplateConfigUpdateInput;

export type TemplateConfigFormState = Omit<
  State,
  "id"
  //  | "templateId"
>;

export type TemplateConfigUpdateAction = Action<TemplateConfigFormState>;

export type TemplateConfigFormErrors = FormErrors<TemplateConfigFormState>;

export type TemplateConfigFormUpdateFn = UpdateStateFn<TemplateConfigFormState>;

export type TemplateConfigFormValidateFn = ValidateFieldFn<TemplateConfigFormState, string | undefined>;
