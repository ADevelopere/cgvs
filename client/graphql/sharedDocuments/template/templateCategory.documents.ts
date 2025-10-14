import { TypedDocumentNode, gql } from "@apollo/client";
import * as Graphql from "@/client/graphql/generated/gql/graphql";

export const templateCategoryQueryDocument: TypedDocumentNode<
  Graphql.TemplateCategoryQuery,
  Graphql.TemplateCategoryQueryVariables
> = gql`
  query templateCategory($id: Int!) {
    templateCategory(id: $id) {
      id
      name
      description
      specialType
      order
      createdAt
      updatedAt
    }
  }
`;

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
  query searchTemplateCategories(
    $searchTerm: String!
    $limit: Int
    $includeParentTree: Boolean
  ) {
    searchTemplateCategories(
      searchTerm: $searchTerm
      limit: $limit
      includeParentTree: $includeParentTree
    ) {
      id
      name
      description
      specialType
      order
      parentTree
    }
  }
`;

