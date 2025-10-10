"use client";

import { createContext, useCallback, useContext, useMemo } from "react";
import * as Graphql from "@/client/graphql/generated/gql/graphql";
import * as Document from "@/client/graphql/documents";
import { ApolloLink } from "@apollo/client";
import { useQuery, useMutation } from "@apollo/client/react";
import logger from "@/lib/logger";

type RecipientGraphQLContextType = {
 /**
  * Query to get a single recipient by ID
  * @param variables - The query variables
  */
 recipientQuery: (
  variables: Graphql.RecipientQueryVariables,
 ) => Promise<Graphql.RecipientQuery>;

 /**
  * Query to get recipients by group ID
  * @param variables - The query variables
  */
 recipientsByGroupIdQuery: (
  variables: Graphql.RecipientsByGroupIdQueryVariables,
 ) => Promise<Graphql.RecipientsByGroupIdQuery>;

 /**
  * Query to get recipients by student ID
  * @param variables - The query variables
  */
 recipientsByStudentIdQuery: (
  variables: Graphql.RecipientsByStudentIdQueryVariables,
 ) => Promise<Graphql.RecipientsByStudentIdQuery>;

 /**
  * Mutation to create a new recipient
  * @param variables - The creation recipient variables
  */
 createRecipientMutation: (
  variables: Graphql.CreateRecipientMutationVariables,
 ) => Promise<ApolloLink.Result<Graphql.CreateRecipientMutation>>;

 /**
  * Mutation to create multiple recipients
  * @param variables - The creation recipients variables
  */
 createRecipientsMutation: (
  variables: Graphql.CreateRecipientsMutationVariables,
 ) => Promise<ApolloLink.Result<Graphql.CreateRecipientsMutation>>;

 /**
  * Mutation to delete a recipient
  * @param variables - The delete recipient variables
  */
 deleteRecipientMutation: (
  variables: Graphql.DeleteRecipientMutationVariables,
 ) => Promise<ApolloLink.Result<Graphql.DeleteRecipientMutation>>;

 /**
  * Mutation to delete multiple recipients
  * @param variables - The delete recipients variables
  */
 deleteRecipientsMutation: (
  variables: Graphql.DeleteRecipientsMutationVariables,
 ) => Promise<ApolloLink.Result<Graphql.DeleteRecipientsMutation>>;
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
 recipientGroupId: number;
 templateId: number;
}> = ({ children, recipientGroupId, templateId }) => {
 // Query for single recipient
 const recipientQueryRef = useQuery(Document.recipientQueryDocument, {
  skip: true,
  variables: { id: 0 },
 });

 // Query for recipients by group ID
 const recipientsByGroupIdQueryRef = useQuery(
  Document.recipientsByGroupIdQueryDocument,
  {
   skip: true,
   variables: { recipientGroupId },
  },
 );

 // Query for recipients by student ID
 const recipientsByStudentIdQueryRef = useQuery(
  Document.recipientsByStudentIdQueryDocument,
  {
   skip: true,
   variables: { studentId: 0 },
  },
 );

 // Query wrapper functions
 const recipientQuery = useCallback(
  async (variables: Graphql.RecipientQueryVariables) => {
   const result = await recipientQueryRef.refetch({
    id: variables.id,
   });
   if (!result.data) {
    throw new Error("No data returned from recipient query");
   }
   return result.data;
  },
  [recipientQueryRef],
 );

 const recipientsByGroupIdQuery = useCallback(
  async (variables: Graphql.RecipientsByGroupIdQueryVariables) => {
   const result = await recipientsByGroupIdQueryRef.refetch({
    recipientGroupId: variables.recipientGroupId,
   });
   if (!result.data) {
    throw new Error("No data returned from recipients by group query");
   }
   return result.data;
  },
  [recipientsByGroupIdQueryRef],
 );

 const recipientsByStudentIdQuery = useCallback(
  async (variables: Graphql.RecipientsByStudentIdQueryVariables) => {
   const result = await recipientsByStudentIdQueryRef.refetch({
    studentId: variables.studentId,
   });
   if (!result.data) {
    throw new Error("No data returned from recipients by student query");
   }
   return result.data;
  },
  [recipientsByStudentIdQueryRef],
 );

 // Create recipient mutation
 const [mutateCreate] = useMutation(Document.createRecipientMutationDocument, {
  update(cache, { data }) {
   if (!data?.createRecipient) return;
   const newRecipient = data.createRecipient;
   // Update the recipient group query to include the new recipient and update studentCount
   try {
    const existingGroupData =
     cache.readQuery<Graphql.TemplateRecipientGroupsByTemplateIdQuery>({
      query: Document.templateRecipientGroupsByTemplateIdQueryDocument,
      variables: { templateId },
     });
    if (existingGroupData?.templateRecipientGroupsByTemplateId) {
     const updatedGroups =
      existingGroupData.templateRecipientGroupsByTemplateId.map((group) => {
       if (group.id === recipientGroupId) {
        // Add new recipient
        const updatedRecipients = [...(group.recipients || []), newRecipient];
        // Calculate unique studentIds before
        const prevStudentIds = new Set(
         (group.recipients || []).map((r) => r.studentId).filter(Boolean),
        );
        // If newRecipient.studentId is not in prevStudentIds, increment studentCount
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
       }
       return group;
      });
     cache.writeQuery({
      query: Document.templateRecipientGroupsByTemplateIdQueryDocument,
      variables: { templateId },
      data: {
       templateRecipientGroupsByTemplateId: updatedGroups,
      },
     });
    }
   } catch (error) {
    // Query might not be in cache yet, that's okay
    logger.debug("Could not update recipient group cache:", error);
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
   update(cache, { data }) {
    if (!data?.createRecipients) return;
    const newRecipients = data.createRecipients;
    // Update the recipient group query to include the new recipients and update studentCount
    try {
     const existingGroupData =
      cache.readQuery<Graphql.TemplateRecipientGroupsByTemplateIdQuery>({
       query: Document.templateRecipientGroupsByTemplateIdQueryDocument,
       variables: { templateId },
      });
     if (existingGroupData?.templateRecipientGroupsByTemplateId) {
      const updatedGroups =
       existingGroupData.templateRecipientGroupsByTemplateId.map((group) => {
        if (group.id === recipientGroupId) {
         const updatedRecipients = [
          ...(group.recipients || []),
          ...newRecipients,
         ];
         // Unique studentIds before and after
         const prevStudentIds = new Set(
          (group.recipients || []).map((r) => r.studentId).filter(Boolean),
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
        }
        return group;
       });
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
    newRecipients.forEach((recipient) => {
     if (recipient.studentId) {
      try {
       const existingStudentData = cache.readQuery<Graphql.StudentQuery>({
        query: Document.studentQueryDocument,
        variables: { id: recipient.studentId },
       });

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
  update(cache, { data }) {
   if (!data?.deleteRecipient) return;
   const deletedRecipient = data.deleteRecipient;
   // Update the recipient group query to remove the deleted recipient and update studentCount
   try {
    const existingGroupData =
     cache.readQuery<Graphql.TemplateRecipientGroupsByTemplateIdQuery>({
      query: Document.templateRecipientGroupsByTemplateIdQueryDocument,
      variables: { templateId },
     });
    if (existingGroupData?.templateRecipientGroupsByTemplateId) {
     const updatedGroups =
      existingGroupData.templateRecipientGroupsByTemplateId.map((group) => {
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
      });
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
         recipientRecords: existingStudentData.student.recipientRecords.filter(
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
   update(cache, { data }) {
    if (!data?.deleteRecipients) return;
    const deletedRecipients = data.deleteRecipients;
    const deletedIds = deletedRecipients.map((r) => r.id);
    // Update the recipient group query to remove the deleted recipients and update studentCount
    try {
     const existingGroupData =
      cache.readQuery<Graphql.TemplateRecipientGroupsByTemplateIdQuery>({
       query: Document.templateRecipientGroupsByTemplateIdQueryDocument,
       variables: { templateId },
      });
     if (existingGroupData?.templateRecipientGroupsByTemplateId) {
      const updatedGroups =
       existingGroupData.templateRecipientGroupsByTemplateId.map((group) => {
        if (group.id === recipientGroupId) {
         const updatedRecipients = (group.recipients || []).filter(
          (recipient) => !deletedIds.includes(recipient.id),
         );
         // Find studentIds that were present before but are now gone
         const prevStudentIds = new Set(
          (group.recipients || []).map((r) => r.studentId).filter(Boolean),
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
       });
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
       const existingStudentData = cache.readQuery<Graphql.StudentQuery>({
        query: Document.studentQueryDocument,
        variables: { id: recipient.studentId },
       });

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
   createRecipientMutation,
   createRecipientsMutation,
   deleteRecipientMutation,
   deleteRecipientsMutation,
  }),
  [
   recipientQuery,
   recipientsByGroupIdQuery,
   recipientsByStudentIdQuery,
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
