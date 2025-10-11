"use client";

import { useCallback, useMemo } from "react";
import * as Graphql from "@/client/graphql/generated/gql/graphql";
import { useRecipientGraphQL } from "@/client/graphql/apollo/recipient.apollo";
import { useNotifications } from "@toolpad/core/useNotifications";
import { useAppTranslation } from "@/client/locale";
import logger from "@/lib/logger";
import { isAbortError } from "@/client/utils/errorUtils";

/**
 * Recipient Service Hook
 *
 * Provides data operations for recipients without state management.
 * All functions return values directly and handle errors internally
 * by logging and showing notifications.
 *
 * Note: No type casting ("as") is used. All null/undefined cases are
 * handled explicitly with type guards.
 */
export const useRecipientService = () => {
 const apollo = useRecipientGraphQL();
 const notifications = useNotifications();
 const strings = useAppTranslation("recipientGroupTranslations");

 /**
  * Fetch students not in a recipient group
  * Returns empty array if recipientGroupId is null
  */
 const fetchStudentsNotInRecipientGroup = useCallback(
  async (
   recipientGroupId: number | null,
   orderBy?: Graphql.StudentsOrderByClause[],
   paginationArgs?: Graphql.PaginationArgs,
   filterArgs?: Graphql.StudentFilterArgs,
  ): Promise<{
   students: Graphql.Student[];
   pageInfo: Graphql.PageInfo | null;
  }> => {
   // Return empty result if recipientGroupId is not provided
   if (!recipientGroupId) {
    return { students: [], pageInfo: null };
   }

   try {
    const result = await apollo.studentsNotInRecipientGroupQuery({
     recipientGroupId,
     orderBy,
     paginationArgs,
     filterArgs,
    });

    // Handle nested Maybe types: studentsNotInRecipientGroup can be null/undefined
    const studentsResponse = result.studentsNotInRecipientGroup;
    const students = studentsResponse.data;
    const pageInfo = studentsResponse.pageInfo;

    return { students, pageInfo };
   } catch (error) {
    // Don't show error notification if the request was aborted (e.g., during navigation)
    if (!isAbortError(error)) {
     logger.error("Error fetching students not in group:", error);
     notifications.show(strings.errorAddingToGroup, {
      severity: "error",
      autoHideDuration: 3000,
     });
    } else {
     logger.debug("Query aborted (likely due to navigation):", error);
    }
    return { students: [], pageInfo: null };
   }
  },
  [apollo, notifications, strings],
 );

 /**
  * Fetch students in a recipient group
  * Returns empty array if recipientGroupId is null
  */
 const fetchStudentsInRecipientGroup = useCallback(
  async (
   recipientGroupId: number | null,
   orderBy?: Graphql.StudentsOrderByClause[],
   paginationArgs?: Graphql.PaginationArgs,
   filterArgs?: Graphql.StudentFilterArgs,
  ): Promise<{
   students: Graphql.Student[];
   pageInfo: Graphql.PageInfo | null;
  }> => {
   // Return empty result if recipientGroupId is null
   if (recipientGroupId === null) {
    return { students: [], pageInfo: null };
   }

   try {
    const result = await apollo.studentsInRecipientGroupQuery({
     recipientGroupId,
     orderBy,
     paginationArgs,
     filterArgs,
    });

    // Handle nested Maybe types
    const studentsResponse = result.studentsInRecipientGroup;
    const students = studentsResponse.data;
    const pageInfo = studentsResponse.pageInfo;

    return { students, pageInfo };
   } catch (error) {
    // Don't show error notification if the request was aborted
    if (!isAbortError(error)) {
     logger.error("Error fetching students in group:", error);
     notifications.show(strings.errorAddingToGroup, {
      severity: "error",
      autoHideDuration: 3000,
     });
    } else {
     logger.debug("Query aborted (likely due to navigation):", error);
    }
    return { students: [], pageInfo: null };
   }
  },
  [apollo, notifications, strings],
 );

 /**
  * Fetch a single recipient by ID
  */
 const fetchRecipient = useCallback(
  async (id: number): Promise<Graphql.TemplateRecipient | null | undefined> => {
   try {
    const result = await apollo.recipientQuery({ id });

    const recipient = result.recipient;
    return recipient;
   } catch (error) {
    logger.error("Error fetching recipient:", error);
    notifications.show("Error fetching recipient", {
     severity: "error",
     autoHideDuration: 3000,
    });
    return null;
   }
  },
  [apollo, notifications],
 );

 /**
  * Fetch recipients by group ID
  */
 const fetchRecipientsByGroupId = useCallback(
  async (recipientGroupId: number): Promise<Graphql.TemplateRecipient[]> => {
   try {
    const result = await apollo.recipientsByGroupIdQuery({
     recipientGroupId,
    });

    return result.recipientsByGroupId;
   } catch (error) {
    logger.error("Error fetching recipients by group:", error);
    notifications.show("Error fetching recipients", {
     severity: "error",
     autoHideDuration: 3000,
    });
    return [];
   }
  },
  [apollo, notifications],
 );

 /**
  * Fetch recipients by student ID
  */
 const fetchRecipientsByStudentId = useCallback(
  async (studentId: number): Promise<Graphql.TemplateRecipient[]> => {
   try {
    const result = await apollo.recipientsByStudentIdQuery({ studentId });

    return result.recipientsByStudentId;
   } catch (error) {
    logger.error("Error fetching recipients by student:", error);
    notifications.show("Error fetching recipients", {
     severity: "error",
     autoHideDuration: 3000,
    });
    return [];
   }
  },
  [apollo, notifications],
 );

 /**
  * Add a single student to a recipient group
  */
 const addSingleStudentToRecipientGroup = useCallback(
  async (
   input: Graphql.TemplateRecipientCreateInput,
  ): Promise<Graphql.TemplateRecipient | null> => {
   try {
    const result = await apollo.createRecipientMutation({ input });

    if (result.data) {
     notifications.show("Recipient created successfully", {
      severity: "success",
      autoHideDuration: 3000,
     });
     return result.data.createRecipient;
    }

    notifications.show("Error creating recipient", {
     severity: "error",
     autoHideDuration: 3000,
    });
    return null;
   } catch (error) {
    logger.error("Error creating recipient:", error);
    notifications.show("Error creating recipient", {
     severity: "error",
     autoHideDuration: 3000,
    });
    return null;
   }
  },
  [apollo, notifications],
 );

 /**
  * Add students to a recipient group
  * Returns array of created recipients on success, empty array on failure
  */
 const addStudentsToRecipientGroup = useCallback(
  async (
   recipientGroupId: number,
   studentIds: (string | number)[],
  ): Promise<Graphql.TemplateRecipient[]> => {
   if (studentIds.length === 0) {
    return [];
   }

   try {
    // Convert string IDs to numbers
    const numericIds = studentIds.map((id) =>
     typeof id === "string" ? parseInt(id, 10) : id,
    );

    const result = await apollo.createRecipientsMutation({
     input: {
      recipientGroupId,
      studentIds: numericIds,
     },
    });

    const createdRecipients = result.data?.createRecipients;

    if (!createdRecipients) {
     notifications.show(strings.errorAddingToGroup, {
      severity: "error",
      autoHideDuration: 3000,
     });
     return [];
    }

    if (createdRecipients.length > 0) {
     notifications.show(strings.addedToGroup, {
      severity: "success",
      autoHideDuration: 3000,
     });
    }

    return createdRecipients;
   } catch (error) {
    logger.error("Error adding students to group:", error);
    notifications.show(strings.errorAddingToGroup, {
     severity: "error",
     autoHideDuration: 3000,
    });
    return [];
   }
  },
  [apollo, notifications, strings],
 );

 /**
  * Remove a single student from a recipient group
  */
 const deleteSingleRecipient = useCallback(
  async (id: number): Promise<boolean> => {
   try {
    const result = await apollo.deleteRecipientMutation({ id });

    if (result.data) {
     notifications.show("Recipient deleted successfully", {
      severity: "success",
      autoHideDuration: 3000,
     });
     return true;
    }

    notifications.show("Error deleting recipient", {
     severity: "error",
     autoHideDuration: 3000,
    });
    return false;
   } catch (error) {
    logger.error("Error deleting recipient:", error);
    notifications.show("Error deleting recipient", {
     severity: "error",
     autoHideDuration: 3000,
    });
    return false;
   }
  },
  [apollo, notifications],
 );

 /**
  * Remove multiple students from a recipient group
  */
 const deleteRecipients = useCallback(
  async (ids: number[]): Promise<boolean> => {
   try {
    if (ids.length === 0) {
     return false;
    }

    const result = await apollo.deleteRecipientsMutation({ ids });

    if (result.data?.deleteRecipients) {
     notifications.show("Recipients deleted successfully", {
      severity: "success",
      autoHideDuration: 3000,
     });
     return true;
    }

    notifications.show("Error deleting recipients", {
     severity: "error",
     autoHideDuration: 3000,
    });
    return false;
   } catch (error) {
    logger.error("Error deleting recipients:", error);
    notifications.show("Error deleting recipients", {
     severity: "error",
     autoHideDuration: 3000,
    });
    return false;
   }
  },
  [apollo, notifications],
 );

 return useMemo(
  () => ({
   fetchStudentsNotInGroup: fetchStudentsNotInRecipientGroup,
   fetchStudentsInGroup: fetchStudentsInRecipientGroup,
   addStudentsToGroup: addStudentsToRecipientGroup,
   fetchRecipient,
   fetchRecipientsByGroupId,
   fetchRecipientsByStudentId,
   createRecipient: addSingleStudentToRecipientGroup,
   deleteRecipient: deleteSingleRecipient,
   deleteRecipients,
  }),
  [
   fetchStudentsNotInRecipientGroup,
   fetchStudentsInRecipientGroup,
   addStudentsToRecipientGroup,
   fetchRecipient,
   fetchRecipientsByGroupId,
   fetchRecipientsByStudentId,
   addSingleStudentToRecipientGroup,
   deleteSingleRecipient,
   deleteRecipients,
  ],
 );
};
