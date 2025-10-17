import { TypedDocumentNode, gql } from "@apollo/client";
import * as Graphql from "@/client/graphql/generated/gql/graphql";

export const templateRecipientGroupByIdQueryDocument: TypedDocumentNode<
  Graphql.TemplateRecipientGroupByIdQuery,
  Graphql.TemplateRecipientGroupByIdQueryVariables
> = gql`
  query templateRecipientGroupById($id: Int!) {
    templateRecipientGroupById(id: $id) {
      id
      name
      description
      date
      studentCount
      createdAt
      updatedAt
      template {
        id
      }
    }
  }
`;

export const templateRecipientGroupsByTemplateIdQueryDocument: TypedDocumentNode<
  Graphql.TemplateRecipientGroupsByTemplateIdQuery,
  Graphql.TemplateRecipientGroupsByTemplateIdQueryVariables
> = gql`
  query templateRecipientGroupsByTemplateId($templateId: Int!) {
    templateRecipientGroupsByTemplateId(templateId: $templateId) {
      id
      name
      description
      date
      studentCount
      createdAt
      updatedAt
      template {
        id
      }
    }
  }
`;

export const createTemplateRecipientGroupMutationDocument: TypedDocumentNode<
  Graphql.CreateTemplateRecipientGroupMutation,
  Graphql.CreateTemplateRecipientGroupMutationVariables
> = gql`
  mutation createTemplateRecipientGroup(
    $input: TemplateRecipientGroupCreateInput!
  ) {
    createTemplateRecipientGroup(input: $input) {
      id
      name
      description
      date
      studentCount
      createdAt
      updatedAt
      template {
        id
      }
    }
  }
`;

export const updateTemplateRecipientGroupMutationDocument: TypedDocumentNode<
  Graphql.UpdateTemplateRecipientGroupMutation,
  Graphql.UpdateTemplateRecipientGroupMutationVariables
> = gql`
  mutation updateTemplateRecipientGroup(
    $input: TemplateRecipientGroupUpdateInput!
  ) {
    updateTemplateRecipientGroup(input: $input) {
      id
      name
      description
      date
      studentCount
      createdAt
      updatedAt
      template {
        id
      }
    }
  }
`;

export const deleteTemplateRecipientGroupMutationDocument: TypedDocumentNode<
  Graphql.DeleteTemplateRecipientGroupMutation,
  Graphql.DeleteTemplateRecipientGroupMutationVariables
> = gql`
  mutation deleteTemplateRecipientGroup($id: Int!) {
    deleteTemplateRecipientGroup(id: $id) {
      id
      name
      description
      template {
        id
      }
    }
  }
`;
