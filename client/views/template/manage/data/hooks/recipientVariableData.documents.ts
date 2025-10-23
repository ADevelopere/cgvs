import { TypedDocumentNode, gql } from "@apollo/client";
import * as Graphql from "@/client/graphql/generated/gql/graphql";

export const recipientVariableValuesByGroupQueryDocument: TypedDocumentNode<
  Graphql.RecipientVariableValuesByGroupQuery,
  Graphql.RecipientVariableValuesByGroupQueryVariables
> = gql`
  query recipientVariableValuesByGroup(
    $recipientGroupId: Int!
    $limit: Int
    $offset: Int
  ) {
    recipientVariableValuesByGroup(
      recipientGroupId: $recipientGroupId
      limit: $limit
      offset: $offset
    ) {
      data {
        recipientGroupItemId
        studentId
        studentName
        variableValues
      }
      total
    }
  }
`;

export const setRecipientVariableValuesMutationDocument: TypedDocumentNode<
  Graphql.SetRecipientVariableValuesMutation,
  Graphql.SetRecipientVariableValuesMutationVariables
> = gql`
  mutation setRecipientVariableValues(
    $recipientGroupItemId: Int!
    $values: [VariableValueInput!]!
  ) {
    setRecipientVariableValues(
      recipientGroupItemId: $recipientGroupItemId
      values: $values
    ) {
      recipientGroupItemId
      studentId
      studentName
      variableValues
    }
  }
`;
