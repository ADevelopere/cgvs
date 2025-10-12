"use client";

import { createContext, useCallback, useContext, useMemo } from "react";
import * as Graphql from "@/client/graphql/generated/gql/graphql";
import * as Document from "@/client/graphql/documents";
import { ApolloClient } from "@apollo/client";
import { useMutation, useLazyQuery } from "@apollo/client/react";
import logger from "@/lib/logger";

type RecipientGraphQLContextType = {
  /**
   * Query to get a single recipient by ID
   * @param variables - The query variables
   */
  recipientQuery: (
    variables: Graphql.RecipientQueryVariables,
  ) => Promise<ApolloClient.QueryResult<Graphql.RecipientQuery>>;

  /**
   * Query to get recipients by group ID
   * @param variables - The query variables
   */
  recipientsByGroupIdQuery: (
    variables: Graphql.RecipientsByGroupIdQueryVariables,
  ) => Promise<ApolloClient.QueryResult<Graphql.RecipientsByGroupIdQuery>>;

  /**
   * Query to get recipients by student ID
   * @param variables - The query variables
   */
  recipientsByStudentIdQuery: (
    variables: Graphql.RecipientsByStudentIdQueryVariables,
  ) => Promise<ApolloClient.QueryResult<Graphql.RecipientsByStudentIdQuery>>;

  /**
   * Query to get students in a recipient group
   * @param variables - The query variables
   */
  studentsInRecipientGroupQuery: (
    variables: Graphql.StudentsInRecipientGroupQueryVariables,
  ) => Promise<ApolloClient.QueryResult<Graphql.StudentsInRecipientGroupQuery>>;

  /**
   * Query to get students not in a recipient group
   * @param variables - The query variables
   */
  studentsNotInRecipientGroupQuery: (
    variables: Graphql.StudentsNotInRecipientGroupQueryVariables,
  ) => Promise<
    ApolloClient.QueryResult<Graphql.StudentsNotInRecipientGroupQuery>
  >;

  /**
   * Mutation to create a new recipient
   * @param variables - The creation recipient variables
   */
  createRecipientMutation: (
    variables: Graphql.CreateRecipientMutationVariables,
  ) => Promise<ApolloClient.MutateResult<Graphql.CreateRecipientMutation>>;

  /**
   * Mutation to create multiple recipients
   * @param variables - The creation recipients variables
   */
  createRecipientsMutation: (
    variables: Graphql.CreateRecipientsMutationVariables,
  ) => Promise<ApolloClient.MutateResult<Graphql.CreateRecipientsMutation>>;

  /**
   * Mutation to delete a recipient
   * @param variables - The delete recipient variables
   */
  deleteRecipientMutation: (
    variables: Graphql.DeleteRecipientMutationVariables,
  ) => Promise<ApolloClient.MutateResult<Graphql.DeleteRecipientMutation>>;

  /**
   * Mutation to delete multiple recipients
   * @param variables - The delete recipients variables
   */
  deleteRecipientsMutation: (
    variables: Graphql.DeleteRecipientsMutationVariables,
  ) => Promise<ApolloClient.MutateResult<Graphql.DeleteRecipientsMutation>>;
};

const RecipientGraphQLContext = createContext<
  RecipientGraphQLContextType | undefined
>(undefined);

export const useRecipientGraphQL = () => {
  const context = useContext(RecipientGraphQLContext);
  if (!context) {
    throw new Error(
      "useRecipientGraphQL must be used within a RecipientGraphQLProvider",
    );
  }
  return context;
};

export const RecipientGraphQLProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  // Query for single recipient
  const [executeRecipientQuery] = useLazyQuery(
    Document.recipientQueryDocument,
    {
      fetchPolicy: "cache-first",
    },
  );

  // Query for recipients by group ID
  const [executeRecipientsByGroupIdQuery] = useLazyQuery(
    Document.recipientsByGroupIdQueryDocument,
    {
      fetchPolicy: "cache-first",
    },
  );

  // Query for recipients by student ID
  const [executeRecipientsByStudentIdQuery] = useLazyQuery(
    Document.recipientsByStudentIdQueryDocument,
    {
      fetchPolicy: "cache-first",
    },
  );

  // Query for students in recipient group
  const [executeStudentsInGroupQuery] = useLazyQuery(
    Document.studentsInRecipientGroupQueryDocument,
    {
      fetchPolicy: "cache-first",
    },
  );

  // Query for students not in recipient group
  const [executeStudentsNotInGroupQuery] = useLazyQuery(
    Document.studentsNotInRecipientGroupQueryDocument,
    {
      fetchPolicy: "cache-first",
    },
  );

  // Query wrapper functions
  const recipientQuery = useCallback(
    async (variables: Graphql.RecipientQueryVariables) => {
      return executeRecipientQuery({
        variables: {
          id: variables.id,
        },
      });
    },
    [executeRecipientQuery],
  );

  const recipientsByGroupIdQuery = useCallback(
    async (variables: Graphql.RecipientsByGroupIdQueryVariables) => {
      return executeRecipientsByGroupIdQuery({
        variables: {
          recipientGroupId: variables.recipientGroupId,
        },
      });
    },
    [executeRecipientsByGroupIdQuery],
  );

  const recipientsByStudentIdQuery = useCallback(
    async (variables: Graphql.RecipientsByStudentIdQueryVariables) => {
      return executeRecipientsByStudentIdQuery({
        variables: {
          studentId: variables.studentId,
        },
      });
    },
    [executeRecipientsByStudentIdQuery],
  );

  const studentsInRecipientGroupQuery = useCallback(
    async (variables: Graphql.StudentsInRecipientGroupQueryVariables) => {
      return executeStudentsInGroupQuery({
        variables: {
          recipientGroupId: variables.recipientGroupId,
          orderBy: variables.orderBy,
          paginationArgs: variables.paginationArgs,
          filterArgs: variables.filterArgs,
        },
      });
    },
    [executeStudentsInGroupQuery],
  );

  const studentsNotInRecipientGroupQuery = useCallback(
    async (variables: Graphql.StudentsNotInRecipientGroupQueryVariables) => {
      logger.info("studentsNotInRecipientGroupQuery", variables);
      // Don't execute query if recipientGroupId is null
      if (
        variables.recipientGroupId === null ||
        variables.recipientGroupId === undefined
      ) {
        throw new Error(
          "recipientGroupId is required for students not in group query",
        );
      }

      return executeStudentsNotInGroupQuery({
        variables: {
          recipientGroupId: variables.recipientGroupId,
          orderBy: variables.orderBy,
          paginationArgs: variables.paginationArgs,
          filterArgs: variables.filterArgs,
        },
      });
    },
    [executeStudentsNotInGroupQuery],
  );

  // query to fetch recipient group by id, in mutations
  const [executeRecipientGroupByIdQuery] = useLazyQuery(
    Document.templateRecipientGroupByIdQueryDocument,
    {
      fetchPolicy: "cache-first",
    },
  );

  const templateIdByRecipientGroupId = useCallback(
    async (recipientGroupId: number) => {
      const recipientGroup = await executeRecipientGroupByIdQuery({
        variables: { id: recipientGroupId },
      });
      if (!recipientGroupId) {
        throw new Error("Recipient group ID not found");
      }
      const templateId =
        recipientGroup.data?.templateRecipientGroupById?.template?.id;
      if (!templateId) {
        throw new Error("Template ID not found");
      }
      return templateId;
    },
    [executeRecipientGroupByIdQuery],
  );

  // Create recipient mutation
  const [mutateCreate] = useMutation(Document.createRecipientMutationDocument, {
    update(cache, { data }) {
      if (!data?.createRecipient) return;
      const newRecipient = data.createRecipient;

      const recipientGroupId = newRecipient.recipientGroupId;
      const templateId = newRecipient.recipientGroup?.template?.id;

      if (!recipientGroupId || !templateId) {
        throw new Error("Recipient group and template ID are required");
      }

      // Update the recipient group query
      try {
        const existingGroupData =
          cache.readQuery<Graphql.TemplateRecipientGroupsByTemplateIdQuery>({
            query: Document.templateRecipientGroupsByTemplateIdQueryDocument,
            variables: { recipientGroupId },
          });
        if (existingGroupData?.templateRecipientGroupsByTemplateId) {
          const updatedGroups =
            existingGroupData.templateRecipientGroupsByTemplateId.map(
              (group) => {
                if (group.id !== recipientGroupId) return group;

                const updatedRecipients = [
                  ...(group.recipients || []),
                  newRecipient,
                ];
                const prevStudentIds = new Set(
                  (group.recipients || [])
                    .map((r) => r.studentId)
                    .filter(Boolean),
                );
                let updatedStudentCount = group.studentCount ?? 0;
                if (
                  newRecipient.studentId &&
                  !prevStudentIds.has(newRecipient.studentId)
                ) {
                  updatedStudentCount += 1;
                }
                return {
                  ...group,
                  recipients: updatedRecipients,
                  studentCount: updatedStudentCount,
                };
              },
            );
          cache.writeQuery({
            query: Document.templateRecipientGroupsByTemplateIdQueryDocument,
            variables: { templateId },
            data: {
              templateRecipientGroupsByTemplateId: updatedGroups,
            },
          });
        }
      } catch (error) {
        logger.debug("Could not update recipient group cache:", error);
      }

      // Update the main template query cache
      try {
        const existingTemplateData = cache.readQuery<Graphql.TemplateQuery>({
          query: Document.templateQueryDocument,
          variables: { id: templateId },
        });
        if (existingTemplateData?.template?.recipientGroups) {
          const updatedGroups =
            existingTemplateData.template.recipientGroups.map((group) => {
              if (group.id !== recipientGroupId) return group;

              // For template query, we don't have full recipient data, just update count
              const prevCount = group.studentCount ?? 0;
              const shouldIncrement = newRecipient.studentId;
              return {
                ...group,
                studentCount: shouldIncrement ? prevCount + 1 : prevCount,
              };
            });
          cache.writeQuery({
            query: Document.templateQueryDocument,
            variables: { id: templateId },
            data: {
              template: {
                ...existingTemplateData.template,
                recipientGroups: updatedGroups,
              },
            },
          });
        }
      } catch (error) {
        logger.debug("Could not update template cache:", error);
      }

      // Update the student's recipientRecords if student query exists in cache
      if (newRecipient.studentId) {
        try {
          const existingStudentData = cache.readQuery<Graphql.StudentQuery>({
            query: Document.studentQueryDocument,
            variables: { id: newRecipient.studentId },
          });

          if (existingStudentData?.student) {
            cache.writeQuery({
              query: Document.studentQueryDocument,
              variables: { id: newRecipient.studentId },
              data: {
                student: {
                  ...existingStudentData.student,
                  recipientRecords: [
                    ...(existingStudentData.student.recipientRecords || []),
                    newRecipient,
                  ],
                },
              },
            });
          }
        } catch (error) {
          logger.debug("Could not update student cache:", error);
        }
      }
    },
  });

  // Create multiple recipients mutation
  const [mutateCreateMultiple] = useMutation(
    Document.createRecipientsMutationDocument,
    {
      async update(cache, { data }) {
        if (!data || data.createRecipients.length === 0) return;
        const newRecipients = data.createRecipients;

        const recipientGroupId = newRecipients[0]?.recipientGroupId;
        if (!recipientGroupId) {
          throw new Error("Recipient group ID not found");
        }

        const templateId = await templateIdByRecipientGroupId(recipientGroupId);
        // Update the recipient group query (templateRecipientGroupsByTemplateId)
        try {
          const existingGroupData =
            cache.readQuery<Graphql.TemplateRecipientGroupsByTemplateIdQuery>({
              query: Document.templateRecipientGroupsByTemplateIdQueryDocument,
              variables: { templateId },
            });
          if (existingGroupData?.templateRecipientGroupsByTemplateId) {
            const updatedGroups =
              existingGroupData.templateRecipientGroupsByTemplateId.map(
                (group) => {
                  if (group.id !== recipientGroupId) return group;

                  const updatedRecipients = [
                    ...(group.recipients || []),
                    ...newRecipients,
                  ];
                  // Unique studentIds before and after
                  const prevStudentIds = new Set(
                    (group.recipients || [])
                      .map((r) => r.studentId)
                      .filter(Boolean),
                  );
                  const newStudentIds = new Set(
                    updatedRecipients.map((r) => r.studentId).filter(Boolean),
                  );
                  // Count how many new unique studentIds were added
                  let addedUniqueCount = 0;
                  for (const studentId of newStudentIds) {
                    if (!prevStudentIds.has(studentId)) {
                      addedUniqueCount += 1;
                    }
                  }
                  const updatedStudentCount =
                    (group.studentCount ?? 0) + addedUniqueCount;
                  return {
                    ...group,
                    recipients: updatedRecipients,
                    studentCount: updatedStudentCount,
                  };
                },
              );
            cache.writeQuery({
              query: Document.templateRecipientGroupsByTemplateIdQueryDocument,
              variables: { templateId },
              data: {
                templateRecipientGroupsByTemplateId: updatedGroups,
              },
            });
          }
        } catch (error) {
          logger.debug("Could not update recipient group cache:", error);
        }

        // Update the main template query cache (this is what TemplateManagementContext uses)
        try {
          const existingTemplateData = cache.readQuery<Graphql.TemplateQuery>({
            query: Document.templateQueryDocument,
            variables: { id: templateId },
          });
          if (existingTemplateData?.template?.recipientGroups) {
            const updatedGroups =
              existingTemplateData.template.recipientGroups.map((group) => {
                if (group.id !== recipientGroupId) return group;

                // Count unique student IDs being added
                const uniqueStudentIds = new Set(
                  newRecipients.map((r) => r.studentId).filter(Boolean),
                );
                const addedCount = uniqueStudentIds.size;

                return {
                  ...group,
                  studentCount: (group.studentCount ?? 0) + addedCount,
                };
              });
            cache.writeQuery({
              query: Document.templateQueryDocument,
              variables: { id: templateId },
              data: {
                template: {
                  ...existingTemplateData.template,
                  recipientGroups: updatedGroups,
                },
              },
            });
          }
        } catch (error) {
          logger.debug("Could not update template cache:", error);
        }

        // Update each student's recipientRecords if student query exists in cache
        newRecipients.forEach((recipient) => {
          if (recipient.studentId) {
            try {
              const existingStudentData = cache.readQuery<Graphql.StudentQuery>(
                {
                  query: Document.studentQueryDocument,
                  variables: { id: recipient.studentId },
                },
              );

              if (existingStudentData?.student) {
                cache.writeQuery({
                  query: Document.studentQueryDocument,
                  variables: { id: recipient.studentId },
                  data: {
                    student: {
                      ...existingStudentData.student,
                      recipientRecords: [
                        ...(existingStudentData.student.recipientRecords || []),
                        recipient,
                      ],
                    },
                  },
                });
              }
            } catch (error) {
              logger.debug("Could not update student cache:", error);
            }
          }
        });
      },
    },
  );

  // Delete recipient mutation
  const [mutateDelete] = useMutation(Document.deleteRecipientMutationDocument, {
    async update(cache, { data }) {
      if (!data?.deleteRecipient) return;
      const deletedRecipient = data.deleteRecipient;

      const recipientGroupId = deletedRecipient.recipientGroupId;
      if (!recipientGroupId) {
        throw new Error("Recipient group ID not found");
      }

      const templateId = await templateIdByRecipientGroupId(recipientGroupId);
      // Update the recipient group query to remove the deleted recipient and update studentCount
      try {
        const existingGroupData =
          cache.readQuery<Graphql.TemplateRecipientGroupsByTemplateIdQuery>({
            query: Document.templateRecipientGroupsByTemplateIdQueryDocument,
            variables: { templateId },
          });
        if (existingGroupData?.templateRecipientGroupsByTemplateId) {
          const updatedGroups =
            existingGroupData.templateRecipientGroupsByTemplateId.map(
              (group) => {
                if (group.id === recipientGroupId) {
                  const updatedRecipients = (group.recipients || []).filter(
                    (recipient) => recipient.id !== deletedRecipient.id,
                  );
                  // Check if deletedRecipient.studentId is no longer present
                  const remainingStudentIds = new Set(
                    updatedRecipients.map((r) => r.studentId).filter(Boolean),
                  );
                  let updatedStudentCount = group.studentCount ?? 0;
                  if (
                    deletedRecipient.studentId &&
                    !remainingStudentIds.has(deletedRecipient.studentId)
                  ) {
                    updatedStudentCount -= 1;
                  }
                  return {
                    ...group,
                    recipients: updatedRecipients,
                    studentCount: updatedStudentCount,
                  };
                }
                return group;
              },
            );
          cache.writeQuery({
            query: Document.templateRecipientGroupsByTemplateIdQueryDocument,
            variables: { templateId },
            data: {
              templateRecipientGroupsByTemplateId: updatedGroups,
            },
          });
        }
      } catch (error) {
        logger.debug("Could not update recipient group cache:", error);
      }

      // Update the student's recipientRecords if student query exists in cache
      if (deletedRecipient.studentId) {
        try {
          const existingStudentData = cache.readQuery<Graphql.StudentQuery>({
            query: Document.studentQueryDocument,
            variables: { id: deletedRecipient.studentId },
          });

          if (existingStudentData?.student?.recipientRecords) {
            cache.writeQuery({
              query: Document.studentQueryDocument,
              variables: { id: deletedRecipient.studentId },
              data: {
                student: {
                  ...existingStudentData.student,
                  recipientRecords:
                    existingStudentData.student.recipientRecords.filter(
                      (r) => r.id !== deletedRecipient.id,
                    ),
                },
              },
            });
          }
        } catch (error) {
          logger.debug("Could not update student cache:", error);
        }
      }
    },
  });

  // Delete multiple recipients mutation
  const [mutateDeleteMultiple] = useMutation(
    Document.deleteRecipientsMutationDocument,
    {
      async update(cache, { data }) {
        if (!data?.deleteRecipients || data.deleteRecipients.length === 0)
          return;
        const deletedRecipients = data.deleteRecipients;
        const deletedIds = deletedRecipients.map((r) => r.id);

        const recipientGroupId = deletedRecipients[0]?.recipientGroupId;
        if (!recipientGroupId) {
          throw new Error("Recipient group ID not found");
        }

        const templateId = await templateIdByRecipientGroupId(recipientGroupId);
        // Update the recipient group query to remove the deleted recipients and update studentCount
        try {
          const existingGroupData =
            cache.readQuery<Graphql.TemplateRecipientGroupsByTemplateIdQuery>({
              query: Document.templateRecipientGroupsByTemplateIdQueryDocument,
              variables: { templateId },
            });
          if (existingGroupData?.templateRecipientGroupsByTemplateId) {
            const updatedGroups =
              existingGroupData.templateRecipientGroupsByTemplateId.map(
                (group) => {
                  if (group.id === recipientGroupId) {
                    const updatedRecipients = (group.recipients || []).filter(
                      (recipient) => !deletedIds.includes(recipient.id),
                    );
                    // Find studentIds that were present before but are now gone
                    const prevStudentIds = new Set(
                      (group.recipients || [])
                        .map((r) => r.studentId)
                        .filter(Boolean),
                    );
                    const remainingStudentIds = new Set(
                      updatedRecipients.map((r) => r.studentId).filter(Boolean),
                    );
                    let removedUniqueCount = 0;
                    for (const studentId of prevStudentIds) {
                      if (!remainingStudentIds.has(studentId)) {
                        removedUniqueCount += 1;
                      }
                    }
                    const updatedStudentCount =
                      (group.studentCount ?? 0) - removedUniqueCount;
                    return {
                      ...group,
                      recipients: updatedRecipients,
                      studentCount: updatedStudentCount,
                    };
                  }
                  return group;
                },
              );
            cache.writeQuery({
              query: Document.templateRecipientGroupsByTemplateIdQueryDocument,
              variables: { templateId },
              data: {
                templateRecipientGroupsByTemplateId: updatedGroups,
              },
            });
          }
        } catch (error) {
          logger.debug("Could not update recipient group cache:", error);
        }

        // Update each student's recipientRecords if student query exists in cache
        deletedRecipients.forEach((recipient) => {
          if (recipient.studentId) {
            try {
              const existingStudentData = cache.readQuery<Graphql.StudentQuery>(
                {
                  query: Document.studentQueryDocument,
                  variables: { id: recipient.studentId },
                },
              );

              if (existingStudentData?.student?.recipientRecords) {
                cache.writeQuery({
                  query: Document.studentQueryDocument,
                  variables: { id: recipient.studentId },
                  data: {
                    student: {
                      ...existingStudentData.student,
                      recipientRecords:
                        existingStudentData.student.recipientRecords.filter(
                          (r) => r.id !== recipient.id,
                        ),
                    },
                  },
                });
              }
            } catch (error) {
              logger.debug("Could not update student cache:", error);
            }
          }
        });
      },
    },
  );

  const createRecipientMutation = useCallback(
    (variables: Graphql.CreateRecipientMutationVariables) => {
      return mutateCreate({ variables });
    },
    [mutateCreate],
  );

  const createRecipientsMutation = useCallback(
    (variables: Graphql.CreateRecipientsMutationVariables) => {
      return mutateCreateMultiple({ variables });
    },
    [mutateCreateMultiple],
  );

  const deleteRecipientMutation = useCallback(
    (variables: Graphql.DeleteRecipientMutationVariables) => {
      return mutateDelete({ variables });
    },
    [mutateDelete],
  );

  const deleteRecipientsMutation = useCallback(
    (variables: Graphql.DeleteRecipientsMutationVariables) => {
      return mutateDeleteMultiple({ variables });
    },
    [mutateDeleteMultiple],
  );

  const contextValue = useMemo(
    () => ({
      recipientQuery,
      recipientsByGroupIdQuery,
      recipientsByStudentIdQuery,
      studentsInRecipientGroupQuery,
      studentsNotInRecipientGroupQuery,
      createRecipientMutation,
      createRecipientsMutation,
      deleteRecipientMutation,
      deleteRecipientsMutation,
    }),
    [
      recipientQuery,
      recipientsByGroupIdQuery,
      recipientsByStudentIdQuery,
      studentsInRecipientGroupQuery,
      studentsNotInRecipientGroupQuery,
      createRecipientMutation,
      createRecipientsMutation,
      deleteRecipientMutation,
      deleteRecipientsMutation,
    ],
  );

  return (
    <RecipientGraphQLContext.Provider value={contextValue}>
      {children}
    </RecipientGraphQLContext.Provider>
  );
};
