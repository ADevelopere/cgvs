"use client";

import { useMutation } from "@apollo/client/react";
import * as Graphql from "@/client/graphql/generated/gql/graphql";
import * as Document from "./recipient.documents";
import { templateRecipientGroupsByTemplateIdQueryDocument } from "../../recipientGroup/hooks/recipientGroup.documents";
import { ApolloCache } from "@apollo/client";
import { useRecipientStore } from "../stores/useRecipientStore";

export const useRecipientApolloMutations = (templateId?: number) => {
  const { studentsNotInGroupQueryParams, studentsInGroupQueryParams } =
    useRecipientStore();

  // Utility function to evict cache
  const evictStudents = (cache: ApolloCache) => {
    try {
      cache.evict({
        fieldName: "studentsNotInRecipientGroup",
        args: studentsNotInGroupQueryParams,
      });
      cache.evict({
        fieldName: "studentsInRecipientGroup",
        args: studentsInGroupQueryParams,
      });
      cache.gc(); // Garbage collect to clean up evicted data
    } catch {
      // Cache doesn't exist yet, will be populated on next query
    }
  };

  const [createMutation] = useMutation(
    Document.createRecipientMutationDocument,
    {
      update(cache, { data }) {
        if (!data?.createRecipient) return;
        const newRecipient = data.createRecipient;
        const recipientGroupId = newRecipient.recipientGroupId;

        if (!recipientGroupId) return;

        // Update templateRecipientGroupsByTemplateId query cache - increment studentCount
        if (templateId) {
          try {
            const existingGroupsData = cache.readQuery({
              query: templateRecipientGroupsByTemplateIdQueryDocument,
              variables: { templateId },
            });

            if (existingGroupsData?.templateRecipientGroupsByTemplateId) {
              const updatedGroups =
                existingGroupsData.templateRecipientGroupsByTemplateId.map(
                  group =>
                    group.id === recipientGroupId
                      ? {
                          ...group,
                          studentCount: (group.studentCount || 0) + 1,
                        }
                      : group
                );

              cache.writeQuery({
                query: templateRecipientGroupsByTemplateIdQueryDocument,
                variables: { templateId },
                data: {
                  templateRecipientGroupsByTemplateId: updatedGroups,
                },
              });
            }
          } catch {
            // Cache doesn't exist yet, will be populated on next query
          }
        }
        // Ensure related queries will refetch
        evictStudents(cache);
      },
    }
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

        // Update templateRecipientGroupsByTemplateId query cache - increment studentCount
        if (templateId) {
          try {
            const existingGroupsData = cache.readQuery({
              query: templateRecipientGroupsByTemplateIdQueryDocument,
              variables: { templateId },
            });

            if (existingGroupsData?.templateRecipientGroupsByTemplateId) {
              const updatedGroups =
                existingGroupsData.templateRecipientGroupsByTemplateId.map(
                  group =>
                    group.id === recipientGroupId
                      ? {
                          ...group,
                          studentCount:
                            (group.studentCount || 0) + newRecipients.length,
                        }
                      : group
                );

              cache.writeQuery({
                query: templateRecipientGroupsByTemplateIdQueryDocument,
                variables: { templateId },
                data: {
                  templateRecipientGroupsByTemplateId: updatedGroups,
                },
              });
            }
          } catch {
            // Cache doesn't exist yet, will be populated on next query
          }
        }
        // Ensure related queries will refetch
        evictStudents(cache);
      },
    }
  );

  const [deleteMutation] = useMutation(
    Document.deleteRecipientMutationDocument,
    {
      update(cache, { data }) {
        if (!data?.deleteRecipient) return;
        const deletedRecipient = data.deleteRecipient;
        const recipientGroupId = deletedRecipient.recipientGroupId;

        if (!recipientGroupId) return;

        // Update templateRecipientGroupsByTemplateId query cache - decrement studentCount
        if (templateId) {
          try {
            const existingGroupsData = cache.readQuery({
              query: templateRecipientGroupsByTemplateIdQueryDocument,
              variables: { templateId },
            });

            if (existingGroupsData?.templateRecipientGroupsByTemplateId) {
              const updatedGroups =
                existingGroupsData.templateRecipientGroupsByTemplateId.map(
                  group =>
                    group.id === recipientGroupId
                      ? {
                          ...group,
                          studentCount: Math.max(
                            (group.studentCount || 0) - 1,
                            0
                          ),
                        }
                      : group
                );

              cache.writeQuery({
                query: templateRecipientGroupsByTemplateIdQueryDocument,
                variables: { templateId },
                data: {
                  templateRecipientGroupsByTemplateId: updatedGroups,
                },
              });
            }
          } catch {
            // Cache doesn't exist yet, will be populated on next query
          }
        }
        // Ensure related queries will refetch
        evictStudents(cache);
      },
    }
  );

  const [deleteMultipleMutation] = useMutation(
    Document.deleteRecipientsMutationDocument,
    {
      update(cache, { data }) {
        if (!data?.deleteRecipients || data.deleteRecipients.length === 0)
          return;
        const deletedRecipients = data.deleteRecipients;
        const recipientGroupId = deletedRecipients[0]?.recipientGroupId;

        if (!recipientGroupId) return;

        // Update templateRecipientGroupsByTemplateId query cache - decrement studentCount
        if (templateId) {
          try {
            const existingGroupsData = cache.readQuery({
              query: templateRecipientGroupsByTemplateIdQueryDocument,
              variables: { templateId },
            });

            if (existingGroupsData?.templateRecipientGroupsByTemplateId) {
              const updatedGroups =
                existingGroupsData.templateRecipientGroupsByTemplateId.map(
                  group =>
                    group.id === recipientGroupId
                      ? {
                          ...group,
                          studentCount: Math.max(
                            (group.studentCount || 0) -
                              deletedRecipients.length,
                            0
                          ),
                        }
                      : group
                );

              cache.writeQuery({
                query: templateRecipientGroupsByTemplateIdQueryDocument,
                variables: { templateId },
                data: {
                  templateRecipientGroupsByTemplateId: updatedGroups,
                },
              });
            }
          } catch {
            // Cache doesn't exist yet, will be populated on next query
          }
        }
        // Ensure related queries will refetch
        evictStudents(cache);
      },
    }
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
