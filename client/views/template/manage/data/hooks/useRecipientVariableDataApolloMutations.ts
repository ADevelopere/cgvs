"use client";

import { useMutation } from "@apollo/client/react";
import * as Graphql from "@/client/graphql/generated/gql/graphql";
import * as Document from "./recipientVariableData.documents";

/**
 * Apollo mutations hook for recipient variable data operations
 * Pure mutations with cache updates - no queries
 */
export const useRecipientVariableDataApolloMutations = () => {
  // Set recipient variable values mutation
  const [setValuesMutation] = useMutation(
    Document.setRecipientVariableValuesMutationDocument,
    {
      update(cache, { data }) {
        if (!data?.setRecipientVariableValues) return;
        const updatedRecipient = data.setRecipientVariableValues;

        // Update in recipientVariableValuesByGroup query cache
        // We need to find all possible query variables that might contain this recipient
        const cacheData = cache.extract() as Record<string, unknown>;
        const cacheKeys = cacheData.ROOT_QUERY;
        if (!cacheKeys || typeof cacheKeys !== "object") return;

        // Find all recipientVariableValuesByGroup queries in cache
        Object.keys(cacheKeys).forEach(key => {
          if (key.startsWith("recipientVariableValuesByGroup(")) {
            try {
              const variablesStr = key
                .replace("recipientVariableValuesByGroup(", "")
                .replace(")", "");
              const variables = JSON.parse(variablesStr) as {
                recipientGroupId: number;
                limit?: number;
                offset?: number;
              };
              const existingData =
                cache.readQuery<Graphql.RecipientVariableValuesByGroupQuery>({
                  query: Document.recipientVariableValuesByGroupQueryDocument,
                  variables,
                });

              if (!existingData?.recipientVariableValuesByGroup?.data) return;

              // Update the specific recipient in the data array
              const updatedData =
                existingData.recipientVariableValuesByGroup.data.map(
                  recipient =>
                    recipient.recipientGroupItemId ===
                    updatedRecipient.recipientGroupItemId
                      ? updatedRecipient
                      : recipient
                );

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
            } catch {
              // Skip invalid cache keys
            }
          }
        });
      },
    }
  );

  return {
    setRecipientVariableValuesMutation: setValuesMutation,
  };
};
