import { TypedDocumentNode, gql } from "@apollo/client";
import * as Graphql from "@/client/graphql/generated/gql/graphql";

export const templateConfigQueryDocument: TypedDocumentNode<
  Graphql.TemplateConfigQuery,
  Graphql.TemplateConfigQueryVariables
> = gql`
  query templateConfig($templateConfigId: Int!) {
    templateConfig(id: $templateConfigId) {
      createdAt
      height
      id
      language
      updatedAt
      width
      templateId
    }
  }
`;

export const templateConfigsByTemplateIdQueryDocument: TypedDocumentNode<
  Graphql.TemplateConfigsByTemplateIdQuery,
  Graphql.TemplateConfigsByTemplateIdQueryVariables
> = gql`
  query TemplateConfigsByTemplateId($templateId: Int!) {
    templateConfigsByTemplateId(templateId: $templateId) {
      createdAt
      height
      id
      language
      updatedAt
      width
      templateId
    }
  }
`;

export const createTemplateConfigMutationDocument: TypedDocumentNode<
  Graphql.CreateTemplateConfigMutation,
  Graphql.CreateTemplateConfigMutationVariables
> = gql`
  mutation CreateTemplateConfig($input: TemplateConfigCreateInput!) {
    createTemplateConfig(input: $input) {
      createdAt
      height
      id
      language
      updatedAt
      width
      templateId
    }
  }
`;

export const updateTemplateConfigMutationDocument: TypedDocumentNode<
  Graphql.UpdateTemplateConfigMutation,
  Graphql.UpdateTemplateConfigMutationVariables
> = gql`
  mutation updateTemplateConfig($input: TemplateConfigUpdateInput!) {
    updateTemplateConfig(input: $input) {
      createdAt
      height
      id
      language
      updatedAt
      width
      templateId
    }
  }
`;
