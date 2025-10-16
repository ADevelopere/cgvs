import { TypedDocumentNode, gql } from "@apollo/client";
import * as Graphql from "@/client/graphql/generated/gql/graphql";

export const createTemplateCategoryMutationDocument: TypedDocumentNode<
  Graphql.CreateTemplateCategoryMutation,
  Graphql.CreateTemplateCategoryMutationVariables
> = gql`
  mutation createTemplateCategory($input: TemplateCategoryCreateInput!) {
    createTemplateCategory(input: $input) {
      id
      name
      description
      specialType
      parentCategory {
        id
      }
      order
      createdAt
      updatedAt
    }
  }
`;

export const deleteTemplateCategoryMutationDocument: TypedDocumentNode<
  Graphql.DeleteTemplateCategoryMutation,
  Graphql.DeleteTemplateCategoryMutationVariables
> = gql`
  mutation deleteTemplateCategory($id: Int!) {
    deleteTemplateCategory(id: $id) {
      id
      name
      parentCategory {
        id
      }
    }
  }
`;

export const updateTemplateCategoryMutationDocument: TypedDocumentNode<
  Graphql.UpdateTemplateCategoryMutation,
  Graphql.UpdateTemplateCategoryMutationVariables
> = gql`
  mutation updateTemplateCategory($input: TemplateCategoryUpdateInput!) {
    updateTemplateCategory(input: $input) {
      id
      name
      description
      specialType
      parentCategory {
        id
      }
      order
      createdAt
      updatedAt
    }
  }
`;

export const suspendedTemplatesQueryDocument: TypedDocumentNode<
  Graphql.SuspendedTemplatesQuery,
  Graphql.SuspendedTemplatesQueryVariables
> = gql`
  query suspendedTemplates {
    suspendedTemplates {
      id
      name
      description
      imageUrl
      order
      createdAt
      updatedAt
      category {
        id
      }
      preSuspensionCategory {
        id
      }
    }
  }
`;