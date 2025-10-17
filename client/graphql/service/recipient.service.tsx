// "use client";

// import { useCallback, useMemo } from "react";
// import * as Graphql from "@/client/graphql/generated/gql/graphql";
// import { useRecipientGraphQL } from "@/client/graphql/apollo/recipient.apollo";
// import { useNotifications } from "@toolpad/core/useNotifications";
// import { useAppTranslation } from "@/client/locale";
// import logger from "@/lib/logger";
// import { isAbortError } from "@/client/utils/errorUtils";

// /**
//  * Recipient Service Hook
//  *
//  * Provides data operations for recipients without state management.
//  * All functions return values directly and handle errors internally
//  * by logging and showing notifications.
//  *
//  * Note: No type casting ("as") is used. All null/undefined cases are
//  * handled explicitly with type guards.
//  */
// export const useRecipientService = () => {
//  const apollo = useRecipientGraphQL();
//  const notifications = useNotifications();
//  const strings = useAppTranslation("recipientTranslations");

//  /**
//   * Fetch students not in a recipient group
//   * Returns empty array if recipientGroupId is null
//   */
//  const fetchStudentsNotInRecipientGroup = useCallback(
//   async (
//    recipientGroupId: number | null,
//    orderBy?: Graphql.StudentsOrderByClause[],
//    paginationArgs?: Graphql.PaginationArgs,
//    filterArgs?: Graphql.StudentFilterArgs,
//   ): Promise<{
//    students: Graphql.Student[];
//    pageInfo: Graphql.PageInfo | null;
//   }> => {
//    // Return empty result if recipientGroupId is not provided
//    if (!recipientGroupId) {
//     return { students: [], pageInfo: null };
//    }

//    try {
//     const result = await apollo.studentsNotInRecipientGroupQuery({
//      recipientGroupId,
//      orderBy,
//      paginationArgs,
//      filterArgs,
//     });

//     if (result.data) {
//      // Handle nested Maybe types: studentsNotInRecipientGroup can be null/undefined
//      const studentsResponse = result.data.studentsNotInRecipientGroup;
//      const students = studentsResponse.data;
//      const pageInfo = studentsResponse.pageInfo;

//      return { students, pageInfo };
//     }

//     logger.error(
//      `Error fetching students not in group, id: ${recipientGroupId}`,
//      result.error,
//     );
//     notifications.show(strings.errorFetchingStudentsNotInGroup, {
//      severity: "error",
//      autoHideDuration: 3000,
//     });

//     return { students: [], pageInfo: null };
//    } catch (error) {
//     // Don't show error notification if the request was aborted (e.g., during navigation)
//     if (!isAbortError(error)) {
//      logger.error("Error fetching students not in group:", error);
//      notifications.show(strings.errorFetchingStudentsNotInGroup, {
//       severity: "error",
//       autoHideDuration: 3000,
//      });
//     } else {
//      logger.debug("Query aborted (likely due to navigation):", error);
//     }
//     return { students: [], pageInfo: null };
//    }
//   },
//   [apollo, notifications, strings],
//  );

//  /**
//   * Fetch students in a recipient group
//   * Returns empty array if recipientGroupId is null
//   */
//  const fetchStudentsInRecipientGroup = useCallback(
//   async (
//    recipientGroupId: number | null,
//    orderBy?: Graphql.StudentsOrderByClause[],
//    paginationArgs?: Graphql.PaginationArgs,
//    filterArgs?: Graphql.StudentFilterArgs,
//   ): Promise<{
//    students: Graphql.Student[];
//    pageInfo: Graphql.PageInfo | null;
//   }> => {
//    // Return empty result if recipientGroupId is null
//    if (recipientGroupId === null) {
//     return { students: [], pageInfo: null };
//    }

//    try {
//     const result = await apollo.studentsInRecipientGroupQuery({
//      recipientGroupId,
//      orderBy,
//      paginationArgs,
//      filterArgs,
//     });

//     if (result.data) {
//      // Handle nested Maybe types
//      const studentsResponse = result.data.studentsInRecipientGroup;
//      const students = studentsResponse.data;
//      const pageInfo = studentsResponse.pageInfo;

//      return { students, pageInfo };
//     }

//     logger.error(
//      `Error fetching students in group, id: ${recipientGroupId}`,
//      result.error,
//     );
//     notifications.show(strings.errorFetchingStudentsInGroup, {
//      severity: "error",
//      autoHideDuration: 3000,
//     });
//     return { students: [], pageInfo: null };
//    } catch (error) {
//     // Don't show error notification if the request was aborted
//     if (!isAbortError(error)) {
//      logger.error("Error fetching students in group:", error);
//      notifications.show(strings.errorFetchingStudentsInGroup, {
//       severity: "error",
//       autoHideDuration: 3000,
//      });
//     } else {
//      logger.debug("Query aborted (likely due to navigation):", error);
//     }
//     return { students: [], pageInfo: null };
//    }
//   },
//   [apollo, notifications, strings],
//  );

//  /**
//   * Fetch a single recipient by ID
//   */
//  const fetchRecipient = useCallback(
//   async (id: number): Promise<Graphql.TemplateRecipient | null | undefined> => {
//    try {
//     const result = await apollo.recipientQuery({ id });

//     if (result.data) {
//      return result.data.recipient;
//     }
//    } catch (error) {
//     logger.error("Error fetching recipient:", error);
//     notifications.show(strings.errorFetchingRecipient, {
//      severity: "error",
//      autoHideDuration: 3000,
//     });
//     return null;
//    }
//   },
//   [apollo, notifications, strings],
//  );

//  /**
//   * Fetch recipients by group ID
//   */
//  const fetchRecipientsByGroupId = useCallback(
//   async (recipientGroupId: number): Promise<Graphql.TemplateRecipient[]> => {
//    try {
//     const result = await apollo.recipientsByGroupIdQuery({
//      recipientGroupId,
//     });

//     if (result.data) {
//      return result.data.recipientsByGroupId;
//     }

//     logger.error("Error fetching recipients by group:", result.error);
//     notifications.show(strings.errorFetchingRecipients, {
//      severity: "error",
//      autoHideDuration: 3000,
//     });
//     return [];
//    } catch (error) {
//     logger.error("Error fetching recipients by group:", error);
//     notifications.show(strings.errorFetchingRecipients, {
//      severity: "error",
//      autoHideDuration: 3000,
//     });
//     return [];
//    }
//   },
//   [apollo, notifications, strings],
//  );

//  /**
//   * Fetch recipients by student ID
//   */
//  const fetchRecipientsByStudentId = useCallback(
//   async (studentId: number): Promise<Graphql.TemplateRecipient[]> => {
//    try {
//     const result = await apollo.recipientsByStudentIdQuery({ studentId });

//     if (result.data) {
//      return result.data.recipientsByStudentId;
//     }

//     logger.error("Error fetching recipients by student:", result.error);
//     notifications.show(strings.errorFetchingRecipients, {
//      severity: "error",
//      autoHideDuration: 3000,
//     });
//     return [];
//    } catch (error) {
//     logger.error("Error fetching recipients by student:", error);
//     notifications.show(strings.errorFetchingRecipients, {
//      severity: "error",
//      autoHideDuration: 3000,
//     });
//     return [];
//    }
//   },
//   [apollo, notifications, strings],
//  );

//  /**
//   * Add a single student to a recipient group
//   */
//  const addSingleStudentToRecipientGroup = useCallback(
//   async (
//    input: Graphql.TemplateRecipientCreateInput,
//   ): Promise<Graphql.TemplateRecipient | null> => {
//    try {
//     const result = await apollo.createRecipientMutation({ input });

//     if (result.data) {
//      notifications.show(strings.recipientCreated, {
//       severity: "success",
//       autoHideDuration: 3000,
//      });
//      return result.data.createRecipient;
//     }

//     logger.error("Error creating recipient:", result.error);

//     notifications.show(strings.errorCreatingRecipient, {
//      severity: "error",
//      autoHideDuration: 3000,
//     });
//     return null;
//    } catch (error) {
//     logger.error("Error creating recipient:", error);
//     notifications.show(strings.errorCreatingRecipient, {
//      severity: "error",
//      autoHideDuration: 3000,
//     });
//     return null;
//    }
//   },
//   [apollo, notifications, strings],
//  );

//  /**
//   * Add students to a recipient group
//   * Returns array of created recipients on success, empty array on failure
//   */
//  const addStudentsToRecipientGroup = useCallback(
//   async (
//    recipientGroupId: number,
//    studentIds: number[],
//   ): Promise<Graphql.TemplateRecipient[]> => {
//    if (studentIds.length === 0) {
//     return [];
//    }

//    try {
//     const result = await apollo.createRecipientsMutation({
//      input: {
//       recipientGroupId,
//       studentIds,
//      },
//     });

//     if (result.data && result.data.createRecipients.length > 0) {
//      notifications.show(strings.addedToGroup, {
//       severity: "success",
//       autoHideDuration: 3000,
//      });
//      return result.data.createRecipients;
//     }

//     logger.error("Error adding students to group:", result.error);
//     notifications.show(strings.errorAddingToGroup, {
//      severity: "error",
//      autoHideDuration: 3000,
//     });
//     return [];
//    } catch (error) {
//     logger.error("Error adding students to group:", error);
//     notifications.show(strings.errorAddingToGroup, {
//      severity: "error",
//      autoHideDuration: 3000,
//     });
//     return [];
//    }
//   },
//   [apollo, notifications, strings],
//  );

//  /**
//   * Remove a single student from a recipient group
//   */
//  const deleteSingleRecipient = useCallback(
//   async (id: number): Promise<boolean> => {
//    try {
//     const result = await apollo.deleteRecipientMutation({ id });

//     if (result.data) {
//      notifications.show(strings.recipientDeleted, {
//       severity: "success",
//       autoHideDuration: 3000,
//      });
//      return true;
//     }

//     logger.error("Error deleting recipient:", result.error);
//     notifications.show(strings.errorDeletingRecipient, {
//      severity: "error",
//      autoHideDuration: 3000,
//     });
//     return false;
//    } catch (error) {
//     logger.error("Error deleting recipient:", error);
//     notifications.show(strings.errorDeletingRecipient, {
//      severity: "error",
//      autoHideDuration: 3000,
//     });
//     return false;
//    }
//   },
//   [apollo, notifications, strings],
//  );

//  /**
//   * Remove multiple students from a recipient group
//   */
//  const deleteRecipients = useCallback(
//   async (ids: number[]): Promise<boolean> => {
//    try {
//     if (ids.length === 0) {
//      return false;
//     }

//     const result = await apollo.deleteRecipientsMutation({ ids });

//     if (result.data) {
//      notifications.show(strings.recipientsDeleted, {
//       severity: "success",
//       autoHideDuration: 3000,
//      });
//      return true;
//     }

//     logger.error("Error deleting recipients:", result.error);
//     notifications.show(strings.errorDeletingRecipients, {
//      severity: "error",
//      autoHideDuration: 3000,
//     });
//     return false;
//    } catch (error) {
//     logger.error("Error deleting recipients:", error);
//     notifications.show(strings.errorDeletingRecipients, {
//      severity: "error",
//      autoHideDuration: 3000,
//     });
//     return false;
//    }
//   },
//   [apollo, notifications, strings],
//  );

//  return useMemo(
//   () => ({
//    fetchStudentsNotInGroup: fetchStudentsNotInRecipientGroup,
//    fetchStudentsInGroup: fetchStudentsInRecipientGroup,
//    addStudentsToGroup: addStudentsToRecipientGroup,
//    fetchRecipient,
//    fetchRecipientsByGroupId,
//    fetchRecipientsByStudentId,
//    createRecipient: addSingleStudentToRecipientGroup,
//    deleteRecipient: deleteSingleRecipient,
//    deleteRecipients,
//   }),
//   [
//    fetchStudentsNotInRecipientGroup,
//    fetchStudentsInRecipientGroup,
//    addStudentsToRecipientGroup,
//    fetchRecipient,
//    fetchRecipientsByGroupId,
//    fetchRecipientsByStudentId,
//    addSingleStudentToRecipientGroup,
//    deleteSingleRecipient,
//    deleteRecipients,
//   ],
//  );
// };
