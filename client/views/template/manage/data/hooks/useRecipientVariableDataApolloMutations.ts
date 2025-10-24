"use client";

import { useMutation } from "@apollo/client/react";
import * as Graphql from "@/client/graphql/generated/gql/graphql";
import * as Document from "./recipientVariableData.documents";
import { useRecipientVariableDataStore } from "../stores/useRecipientVariableDataStore";

/**
 * Apollo mutations hook for recipient variable data operations
 * Pure mutations with cache updates - no queries
 */
export const useRecipientVariableDataApolloMutations = () => {
  const store = useRecipientVariableDataStore();

  // Set recipient variable values mutation
  const [setValuesMutation] = useMutation(
    Document.setRecipientVariableValuesMutationDocument,
    {
      update(cache, { data }) {
        if (!data?.setRecipientVariableValues) return;
        const updatedRecipient = data.setRecipientVariableValues;

        // Update in recipientVariableValuesByGroup query cache using store's current query params
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

          // Check if the updated recipient is in the current page/query
          const recipientIndex =
            existingData.recipientVariableValuesByGroup.data.findIndex(
              recipient =>
                recipient.recipientGroupItemId ===
                updatedRecipient.recipientGroupItemId
            );

          // Only update cache if the recipient is in the current query results
          if (recipientIndex !== -1) {
            const updatedData =
              existingData.recipientVariableValuesByGroup.data.map(recipient =>
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
          }
        } catch {
          // Cache doesn't exist yet, will be populated on next query
        }
      },
    }
  );

  return {
    setRecipientVariableValuesMutation: setValuesMutation,
  };
};
