import { TypedDocumentNode, gql } from "@apollo/client";
import * as Graphql from "@/client/graphql/generated/gql/graphql";

export const templateQueryDocument: TypedDocumentNode<
  Graphql.TemplateQuery,
  Graphql.TemplateQueryVariables
> = gql`
  query template($id: Int!) {
    template(id: $id) {
      id
      name
      description
      imageUrl
      order
      createdAt
      updatedAt

      category {
        id
        name
      }

      preSuspensionCategory {
        id
        name
      }

      variables {
        id
        name
        description
        order
        required
        previewValue
        type
        createdAt
        updatedAt
        ... on TemplateDateVariable {
          createdAt
          description
          format
          id
          maxDate
          minDate
          name
          order
          previewValue
          required
          template {
            id
          }
          type
          updatedAt
        }
        ... on TemplateNumberVariable {
          createdAt
          decimalPlaces
          description
          id
          maxValue
          minValue
          name
          order
          previewValue
          required
          template {
            id
          }
          type
          updatedAt
        }
        ... on TemplateSelectVariable {
          createdAt
          description
          id
          multiple
          name
          options
          order
          previewValue
          required
          template {
            id
          }
          type
          updatedAt
        }
        ... on TemplateTextVariable {
          createdAt
          description
          id
          maxLength
          minLength
          name
          order
          pattern
          previewValue
          required
          template {
            id
          }
          type
          updatedAt
        }
      }

      recipientGroups {
        id
        name
        description
        date
        studentCount
        createdAt
        updatedAt
        template {
          id
          name
        }
      }
    }
  }
`;

export const paginatedTemplatesQueryDocument: TypedDocumentNode<
  Graphql.TemplatesQuery,
  Graphql.TemplatesQueryVariables
> = gql`
  query templates($pagination: PaginationArgs) {
    templates(pagination: $pagination) {
      data {
        id
        name
        description
        imageUrl
        category {
          id
          name
        }
        order
        preSuspensionCategory {
          id
          name
        }

        variables {
          id
          name
          description
          order
          required
          previewValue
          type
          createdAt
          updatedAt
          ... on TemplateDateVariable {
            createdAt
            description
            format
            id
            maxDate
            minDate
            name
            order
            previewValue
            required
            template {
              id
            }
            type
            updatedAt
          }
          ... on TemplateNumberVariable {
            createdAt
            decimalPlaces
            description
            id
            maxValue
            minValue
            name
            order
            previewValue
            required
            template {
              id
            }
            type
            updatedAt
          }
          ... on TemplateSelectVariable {
            createdAt
            description
            id
            multiple
            name
            options
            order
            previewValue
            required
            template {
              id
            }
            type
            updatedAt
          }
          ... on TemplateTextVariable {
            createdAt
            description
            id
            maxLength
            minLength
            name
            order
            pattern
            previewValue
            required
            template {
              id
            }
            type
            updatedAt
          }
        }

        recipientGroups {
          id
          name
          description
          date
          studentCount
          createdAt
          updatedAt
          template {
            id
            name
          }
        }

        createdAt
        updatedAt
      }
      pageInfo {
        count
        currentPage
        firstItem
        hasMorePages
        lastItem
        lastPage
        perPage
        total
      }
    }
  }
`;

export const templatesConfigsQueryDocument: TypedDocumentNode<Graphql.TemplatesConfigsQuery> = gql`
  query TemplatesConfigs {
    templatesConfigs {
      configs {
        key
        value
      }
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
