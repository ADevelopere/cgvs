import { TypedDocumentNode, gql } from "@apollo/client";
import * as Graphql from "@/client/graphql/generated/gql/graphql";

export const templateVariablesByTemplateIdQueryDocument: TypedDocumentNode<
  Graphql.TemplateVariablesByTemplateIdQuery,
  Graphql.TemplateVariablesByTemplateIdQueryVariables
> = gql`
  query templateVariablesByTemplateId($templateId: Int!) {
    templateVariablesByTemplateId(templateId: $templateId) {
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
  }
`;

export const createTemplateTextVariableMutationDocument: TypedDocumentNode<
  Graphql.CreateTemplateTextVariableMutation,
  Graphql.CreateTemplateTextVariableMutationVariables
> = gql`
  mutation createTemplateTextVariable($input: TemplateTextVariableCreateInput!) {
    createTemplateTextVariable(input: $input) {
      id
      name
      description
      type
      required
      order
      minLength
      maxLength
      pattern
      previewValue
      template {
        id
        name
      }
      createdAt
      updatedAt
    }
  }
`;

export const createTemplateNumberVariableMutationDocument: TypedDocumentNode<
  Graphql.CreateTemplateNumberVariableMutation,
  Graphql.CreateTemplateNumberVariableMutationVariables
> = gql`
  mutation createTemplateNumberVariable($input: TemplateNumberVariableCreateInput!) {
    createTemplateNumberVariable(input: $input) {
      id
      name
      description
      type
      required
      order
      minValue
      maxValue
      decimalPlaces
      previewValue
      template {
        id
        name
      }
      createdAt
      updatedAt
    }
  }
`;

export const createTemplateDateVariableMutationDocument: TypedDocumentNode<
  Graphql.CreateTemplateDateVariableMutation,
  Graphql.CreateTemplateDateVariableMutationVariables
> = gql`
  mutation createTemplateDateVariable($input: TemplateDateVariableCreateInput!) {
    createTemplateDateVariable(input: $input) {
      id
      name
      description
      type
      required
      order
      minDate
      maxDate
      format
      previewValue
      template {
        id
        name
      }
      createdAt
      updatedAt
    }
  }
`;

export const createTemplateSelectVariableMutationDocument: TypedDocumentNode<
  Graphql.CreateTemplateSelectVariableMutation,
  Graphql.CreateTemplateSelectVariableMutationVariables
> = gql`
  mutation createTemplateSelectVariable($input: TemplateSelectVariableCreateInput!) {
    createTemplateSelectVariable(input: $input) {
      id
      name
      description
      type
      required
      order
      options
      multiple
      previewValue
      template {
        id
        name
      }
      createdAt
      updatedAt
    }
  }
`;

export const updateTemplateTextVariableMutationDocument: TypedDocumentNode<
  Graphql.UpdateTemplateTextVariableMutation,
  Graphql.UpdateTemplateTextVariableMutationVariables
> = gql`
  mutation updateTemplateTextVariable($input: TemplateTextVariableUpdateInput!) {
    updateTemplateTextVariable(input: $input) {
      id
      name
      description
      type
      required
      order
      minLength
      maxLength
      pattern
      previewValue
      template {
        id
        name
      }
      createdAt
      updatedAt
    }
  }
`;

export const updateTemplateNumberVariableMutationDocument: TypedDocumentNode<
  Graphql.UpdateTemplateNumberVariableMutation,
  Graphql.UpdateTemplateNumberVariableMutationVariables
> = gql`
  mutation updateTemplateNumberVariable($input: TemplateNumberVariableUpdateInput!) {
    updateTemplateNumberVariable(input: $input) {
      id
      name
      description
      type
      required
      order
      minValue
      maxValue
      decimalPlaces
      previewValue
      template {
        id
        name
      }
      createdAt
      updatedAt
    }
  }
`;

export const updateTemplateDateVariableMutationDocument: TypedDocumentNode<
  Graphql.UpdateTemplateDateVariableMutation,
  Graphql.UpdateTemplateDateVariableMutationVariables
> = gql`
  mutation updateTemplateDateVariable($input: TemplateDateVariableUpdateInput!) {
    updateTemplateDateVariable(input: $input) {
      id
      name
      description
      type
      required
      order
      minDate
      maxDate
      format
      previewValue
      template {
        id
        name
      }
      createdAt
      updatedAt
    }
  }
`;

export const updateTemplateSelectVariableMutationDocument: TypedDocumentNode<
  Graphql.UpdateTemplateSelectVariableMutation,
  Graphql.UpdateTemplateSelectVariableMutationVariables
> = gql`
  mutation updateTemplateSelectVariable($input: TemplateSelectVariableUpdateInput!) {
    updateTemplateSelectVariable(input: $input) {
      id
      name
      description
      type
      required
      order
      options
      multiple
      previewValue
      template {
        id
        name
      }
      createdAt
      updatedAt
    }
  }
`;

export const deleteTemplateVariableMutationDocument: TypedDocumentNode<
  Graphql.DeleteTemplateVariableMutation,
  Graphql.DeleteTemplateVariableMutationVariables
> = gql`
  mutation deleteTemplateVariable($id: Int!) {
    deleteTemplateVariable(id: $id) {
      id
      name
      template {
        id
        name
      }
    }
  }
`;
