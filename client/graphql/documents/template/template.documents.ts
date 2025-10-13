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
  query templatesByCategoryId($categoryId: Int!) {
    templatesByCategoryId(categoryId: $categoryId) {
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
