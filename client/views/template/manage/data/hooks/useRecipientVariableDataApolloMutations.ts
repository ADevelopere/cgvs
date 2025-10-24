"use client";

import { useMutation } from "@apollo/client/react";
import * as Graphql from "@/client/graphql/generated/gql/graphql";
import * as Document from "./recipientVariableData.documents";
import { useRecipientVariableDataStore } from "../stores/useRecipientVariableDataStore";

/**
 * Apollo mutations hook for recipient variable data operations
 * Pure mutations with cache updates and optimistic responses
 */
export const useRecipientVariableDataApolloMutations = () => {
  const store = useRecipientVariableDataStore();

  // Set recipient variable values mutation
  const [setValuesMutation] = useMutation(
    Document.setRecipientVariableValuesMutationDocument,
    {
      optimisticResponse: (vars) => {
        // Lightweight - only return the updated fields, no cache read
        const valuesArray = Array.isArray(vars.values)
          ? vars.values
          : [vars.values];

        const variableValues = valuesArray.reduce(
          (acc: Record<number, string>, { variableId, value }) => {
            acc[variableId] = value;
            return acc;
          },
          {} as Record<number, string>
        );

        return {
          __typename: "Mutation" as const,
          setRecipientVariableValues: {
            __typename: "RecipientWithVariableValues" as const,
            recipientGroupItemId: vars.recipientGroupItemId,
            studentId: null,
            studentName: null,
            variableValues,
          },
        };
      },
      update(cache, { data }) {
        if (!data?.setRecipientVariableValues) return;
        const updatedRecipient = data.setRecipientVariableValues;

        // Defer cache update to not block UI
        setTimeout(() => {
          try {
            const variables = {
              recipientGroupId: store.queryParams.recipientGroupId,
              limit: store.queryParams.limit,
              offset: store.queryParams.offset,
            };

            const existingData =
              cache.readQuery<Graphql.RecipientVariableValuesByGroupQuery>({
                query: Document.recipientVariableValuesByGroupQueryDocument,
                variables,
              });

            if (!existingData?.recipientVariableValuesByGroup?.data) return;

            // Find and update recipient, merging variableValues properly
            let found = false;
            const updatedData =
              existingData.recipientVariableValuesByGroup.data.map(
                recipient => {
                  if (
                    recipient.recipientGroupItemId ===
                    updatedRecipient.recipientGroupItemId
                  ) {
                    found = true;
                    // Merge: keep all existing data + apply updates
                    return {
                      ...recipient,
                      variableValues: {
                        ...recipient.variableValues,
                        ...updatedRecipient.variableValues,
                      },
                    };
                  }
                  return recipient;
                }
              );

            // Only write to cache if the recipient was found
            if (found) {
              cache.writeQuery({
                query: Document.recipientVariableValuesByGroupQueryDocument,
                variables,
                data: {
                  recipientVariableValuesByGroup: {
                    ...existingData.recipientVariableValuesByGroup,
                    data: updatedData,
                  },
                },
              });
            }
          } catch {
            // Cache doesn't exist yet, will be populated on next query
          }
        }, 0);
      },
    }
  );

  return {
    setRecipientVariableValuesMutation: setValuesMutation,
  };
};
