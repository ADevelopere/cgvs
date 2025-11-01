import * as GQL from "@/client/graphql/generated/gql/graphql";
import { FormErrors, UpdateStateFn } from "../types";

export type TemplateConfigFormState =
  | GQL.TemplateConfigCreateInput
  | GQL.TemplateConfigUpdateInput;

export type TemplateConfigFormErrors = FormErrors<TemplateConfigFormState>;

export type TemplateConfigFormUpdateFn = UpdateStateFn<TemplateConfigFormState>;