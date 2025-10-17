"use client";

import { useMutation } from "@apollo/client/react";
import * as Graphql from "@/client/graphql/generated/gql/graphql";
import * as Document from "./recipient.documents";

export const useRecipientApolloMutations = () => {
  const [createMutation] = useMutation(
    Document.createRecipientMutationDocument,
    {
      update(cache, { data }) {
        if (!data?.createRecipient) return;
        const newRecipient = data.createRecipient;
        const recipientGroupId = newRecipient.recipientGroupId;

        if (!recipientGroupId) return;

        // Update recipientsByGroupId query cache
        try {
          const existingData = cache.readQuery({
            query: Document.recipientsByGroupIdQueryDocument,
            variables: { recipientGroupId },
          });

          if (existingData?.recipientsByGroupId) {
            cache.writeQuery({
              query: Document.recipientsByGroupIdQueryDocument,
              variables: { recipientGroupId },
              data: {
                recipientsByGroupId: [
                  ...existingData.recipientsByGroupId,
                  newRecipient,
                ],
              },
            });
          }
        } catch {
          // Cache doesn't exist yet, will be populated on next query
        }
      },
    },
  );

  const [createMultipleMutation] = useMutation(
    Document.createRecipientsMutationDocument,
    {
      update(cache, { data }) {
        if (!data?.createRecipients || data.createRecipients.length === 0)
          return;
        const newRecipients = data.createRecipients;
        const recipientGroupId = newRecipients[0]?.recipientGroupId;

        if (!recipientGroupId) return;

        // Update recipientsByGroupId query cache
        try {
          const existingData = cache.readQuery({
            query: Document.recipientsByGroupIdQueryDocument,
            variables: { recipientGroupId },
          });

          if (existingData?.recipientsByGroupId) {
            cache.writeQuery({
              query: Document.recipientsByGroupIdQueryDocument,
              variables: { recipientGroupId },
              data: {
                recipientsByGroupId: [
                  ...existingData.recipientsByGroupId,
                  ...newRecipients,
                ],
              },
            });
          }
        } catch {
          // Cache doesn't exist yet
        }
      },
    },
  );

  const [deleteMutation] = useMutation(
    Document.deleteRecipientMutationDocument,
    {
      update(cache, { data }) {
        if (!data?.deleteRecipient) return;
        const deletedRecipient = data.deleteRecipient;
        const recipientGroupId = deletedRecipient.recipientGroupId;

        if (!recipientGroupId) return;

        // Update recipientsByGroupId query cache
        try {
          const existingData = cache.readQuery({
            query: Document.recipientsByGroupIdQueryDocument,
            variables: { recipientGroupId },
          });

          if (existingData?.recipientsByGroupId) {
            cache.writeQuery({
              query: Document.recipientsByGroupIdQueryDocument,
              variables: { recipientGroupId },
              data: {
                recipientsByGroupId: existingData.recipientsByGroupId.filter(
                  (r) => r.id !== deletedRecipient.id,
                ),
              },
            });
          }
        } catch {
          // Cache doesn't exist yet
        }
      },
    },
  );

  const [deleteMultipleMutation] = useMutation(
    Document.deleteRecipientsMutationDocument,
    {
      update(cache, { data }) {
        if (!data?.deleteRecipients || data.deleteRecipients.length === 0)
          return;
        const deletedRecipients = data.deleteRecipients;
        const recipientGroupId = deletedRecipients[0]?.recipientGroupId;
        const deletedIds = deletedRecipients.map((r) => r.id);

        if (!recipientGroupId) return;

        // Update recipientsByGroupId query cache
        try {
          const existingData = cache.readQuery({
            query: Document.recipientsByGroupIdQueryDocument,
            variables: { recipientGroupId },
          });

          if (existingData?.recipientsByGroupId) {
            cache.writeQuery({
              query: Document.recipientsByGroupIdQueryDocument,
              variables: { recipientGroupId },
              data: {
                recipientsByGroupId: existingData.recipientsByGroupId.filter(
                  (r) => !deletedIds.includes(r.id),
                ),
              },
            });
          }
        } catch {
          // Cache doesn't exist yet
        }
      },
    },
  );

  return {
    createRecipient: (variables: Graphql.CreateRecipientMutationVariables) =>
      createMutation({ variables }),
    createRecipients: (variables: Graphql.CreateRecipientsMutationVariables) =>
      createMultipleMutation({ variables }),
    deleteRecipient: (variables: Graphql.DeleteRecipientMutationVariables) =>
      deleteMutation({ variables }),
    deleteRecipients: (variables: Graphql.DeleteRecipientsMutationVariables) =>
      deleteMultipleMutation({ variables }),
  };
};
