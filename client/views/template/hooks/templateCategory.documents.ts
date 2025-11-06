import { TypedDocumentNode, gql } from "@apollo/client";
import * as Graphql from "@/client/graphql/generated/gql/graphql";

export const categoryChildrenQueryDocument: TypedDocumentNode<
  Graphql.CategoryChildrenQuery,
  Graphql.CategoryChildrenQueryVariables
> = gql`
  query categoryChildren($parentCategoryId: Int) {
    categoryChildren(parentCategoryId: $parentCategoryId) {
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

export const searchTemplateCategoriesQueryDocument: TypedDocumentNode<
  Graphql.SearchTemplateCategoriesQuery,
  Graphql.SearchTemplateCategoriesQueryVariables
> = gql`
  query searchTemplateCategories($searchTerm: String!, $limit: Int, $includeParentTree: Boolean) {
    searchTemplateCategories(searchTerm: $searchTerm, limit: $limit, includeParentTree: $includeParentTree) {
      id
      name
      description
      specialType
      order
      parentTree
    }
  }
`;

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
