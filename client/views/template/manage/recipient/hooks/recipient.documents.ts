import { TypedDocumentNode, gql } from "@apollo/client";
import * as Graphql from "@/client/graphql/generated/gql/graphql";

export const recipientQueryDocument: TypedDocumentNode<
  Graphql.RecipientQuery,
  Graphql.RecipientQueryVariables
> = gql`
  query recipient($id: Int!) {
    recipient(id: $id) {
      id
      studentId
      recipientGroupId
      createdAt
      updatedAt
      student {
        id
        name
        email
        phoneNumber
        dateOfBirth
        nationality
        gender
        createdAt
        updatedAt
      }
      recipientGroup {
        id
      }
    }
  }
`;

export const recipientsByGroupIdQueryDocument: TypedDocumentNode<
  Graphql.RecipientsByGroupIdQuery,
  Graphql.RecipientsByGroupIdQueryVariables
> = gql`
  query recipientsByGroupId($recipientGroupId: Int!) {
    recipientsByGroupId(recipientGroupId: $recipientGroupId) {
      id
      studentId
      recipientGroupId
      createdAt
      updatedAt
      student {
        id
        name
        email
        phoneNumber
        dateOfBirth
        nationality
        gender
        createdAt
        updatedAt
      }
    }
  }
`;

export const recipientsByStudentIdQueryDocument: TypedDocumentNode<
  Graphql.RecipientsByStudentIdQuery,
  Graphql.RecipientsByStudentIdQueryVariables
> = gql`
  query recipientsByStudentId($studentId: Int!) {
    recipientsByStudentId(studentId: $studentId) {
      id
      studentId
      recipientGroupId
      createdAt
      updatedAt
      recipientGroup {
        id
        template {
          id
        }
      }
    }
  }
`;

export const createRecipientMutationDocument: TypedDocumentNode<
  Graphql.CreateRecipientMutation,
  Graphql.CreateRecipientMutationVariables
> = gql`
  mutation createRecipient($input: TemplateRecipientCreateInput!) {
    createRecipient(input: $input) {
      id
      studentId
      recipientGroupId
      createdAt
      updatedAt
      student {
        id
        name
      }
      recipientGroup {
        id
        template {
          id
        }
      }
    }
  }
`;

export const createRecipientsMutationDocument: TypedDocumentNode<
  Graphql.CreateRecipientsMutation,
  Graphql.CreateRecipientsMutationVariables
> = gql`
  mutation createRecipients($input: TemplateRecipientCreateListInput!) {
    createRecipients(input: $input) {
      id
      studentId
      recipientGroupId
      createdAt
      updatedAt
    }
  }
`;

export const deleteRecipientMutationDocument: TypedDocumentNode<
  Graphql.DeleteRecipientMutation,
  Graphql.DeleteRecipientMutationVariables
> = gql`
  mutation deleteRecipient($id: Int!) {
    deleteRecipient(id: $id) {
      id
      studentId
      recipientGroupId
    }
  }
`;

export const deleteRecipientsMutationDocument: TypedDocumentNode<
  Graphql.DeleteRecipientsMutation,
  Graphql.DeleteRecipientsMutationVariables
> = gql`
  mutation deleteRecipients($ids: [Int!]!) {
    deleteRecipients(ids: $ids) {
      id
      studentId
      recipientGroupId
      student {
        id
      }
    }
  }
`;

export {
  studentsInRecipientGroupQueryDocument,
  studentsNotInRecipientGroupQueryDocument,
} from "@/client/views/student/hook/student.documents";
