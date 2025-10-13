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

export const templatesByCategoryIdQueryDocument: TypedDocumentNode<
  Graphql.TemplatesByCategoryIdQuery,
  Graphql.TemplatesByCategoryIdQueryVariables
> = gql`
  query templatesByCategoryId(
    $categoryId: Int
    $paginationArgs: PaginationArgs
    $filterArgs: TemplateFilterArgs
    $orderBy: [TemplatesOrderByClause!]
  ) {
    templatesByCategoryId(
      categoryId: $categoryId
      paginationArgs: $paginationArgs
      filterArgs: $filterArgs
      orderBy: $orderBy
    ) {
      data {
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
      pageInfo {
        count
        currentPage
        firstItem
        lastItem
        hasMorePages
        lastPage
        perPage
        total
      }
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

export const createTemplateQueryDocument: TypedDocumentNode<
  Graphql.CreateTemplateMutation,
  Graphql.CreateTemplateMutationVariables
> = gql`
  mutation createTemplate($input: TemplateCreateInput!) {
    createTemplate(input: $input) {
      id
      name
      description
      imageUrl
      category {
        id
      }
      order
      preSuspensionCategory {
        id
      }
      createdAt
      updatedAt
    }
  }
`;

export const suspendTemplateMutationDocument: TypedDocumentNode<
  Graphql.SuspendTemplateMutation,
  Graphql.SuspendTemplateMutationVariables
> = gql`
  mutation suspendTemplate($id: Int!) {
    suspendTemplate(id: $id) {
      id
      name
      description
      imageUrl
      category {
        id
      }
      order
      preSuspensionCategory {
        id
      }
      createdAt
      updatedAt
    }
  }
`;

export const unsuspendTemplateMutationDocument: TypedDocumentNode<
  Graphql.UnsuspendTemplateMutation,
  Graphql.UnsuspendTemplateMutationVariables
> = gql`
  mutation unsuspendTemplate($id: Int!) {
    unsuspendTemplate(id: $id) {
      id
      name
      description
      imageUrl
      category {
        id
      }
      order
      preSuspensionCategory {
        id
      }
      createdAt
      updatedAt
    }
  }
`;

export const updateTemplateMutationDocument: TypedDocumentNode<
  Graphql.UpdateTemplateMutation,
  Graphql.UpdateTemplateMutationVariables
> = gql`
  mutation updateTemplate($input: TemplateUpdateInput!) {
    updateTemplate(input: $input) {
      id
      name
      description
      imageUrl
      category {
        id
      }
      order
      preSuspensionCategory {
        id
      }
      createdAt
      updatedAt
    }
  }
`;

export const deleteTemplateMutationDocument: TypedDocumentNode<
  Graphql.DeleteTemplateMutation,
  Graphql.DeleteTemplateMutationVariables
> = gql`
  mutation deleteTemplate($id: Int!) {
    deleteTemplate(id: $id) {
      id
      name
      category {
        id
      }
    }
  }
`;
