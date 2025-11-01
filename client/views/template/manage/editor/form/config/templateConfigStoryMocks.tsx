import * as GQL from "@/client/graphql/generated/gql/graphql";

// ============================================================================
// MOCK DATA
// ============================================================================

export const mockTemplate: GQL.Template = {
  __typename: "Template",
  id: 1,
  name: "Certificate of Achievement",
  description: "A professional certificate template",
  imageUrl: null,
  imageFile: null,
  order: 1,
  category: null,
  preSuspensionCategory: null,
  recipientGroups: null,
  variables: null,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

export const mockTemplateConfig: GQL.TemplateConfig = {
  __typename: "TemplateConfig",
  id: 1,
  width: 1920,
  height: 1080,
  language: GQL.AppLanguage.Ar,
  templateId: 1,
  template: null,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

export const mockTemplateConfigArabic: GQL.TemplateConfig = {
  ...mockTemplateConfig,
  id: 2,
  language: GQL.AppLanguage.Ar,
};
