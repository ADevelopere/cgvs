"use client";

import * as Graphql from "@/client/graphql/generated/gql/graphql";
import React, {
 createContext,
 useCallback,
 useContext,
 useMemo,
 useState,
 useEffect,
 useRef,
} from "react";
import { useNotifications } from "@toolpad/core/useNotifications";
import {
 RecipientGraphQLProvider,
 useRecipientGraphQL,
} from "../../graphql/apollo/recipient.apollo";
import logger from "@/lib/logger";
import { useAppTranslation } from "@/client/locale";
import { usePageNavigation } from "../navigation/usePageNavigation";
import { isAbortError } from "@/client/utils/errorUtils";
import { useTemplateManagement } from "../template/TemplateManagementContext";

type RecipientManagementContextType = {
 // State
 loading: boolean;
 selectedGroupId: number | null;
 students: Graphql.Student[];
 pageInfo: Graphql.PageInfo | null;
 invalidGroupId: number | null;

 // Group selection
 setSelectedGroupId: (groupId: number | null) => void;

 // Operations
 addStudentsToGroup: (studentIds: (string | number)[]) => Promise<boolean>;
 fetchStudentsNotInGroup: (
  recipientGroupId: number | null,
  orderBy?: Graphql.StudentsOrderByClause[],
  paginationArgs?: Graphql.PaginationArgs,
  filterArgs?: Graphql.StudentFilterArgs,
 ) => Promise<void>;

 // Pagination and filtering
 onPageChange: (page: number) => void;
 onRowsPerPageChange: (rowsPerPage: number) => void;
 setFilters: (filters: Graphql.StudentFilterArgs | null) => void;
 setSort: (sort: Graphql.StudentsOrderByClause[] | null) => void;
};

const RecipientManagementContext = createContext<
 RecipientManagementContextType | undefined
>(undefined);

export const useRecipientManagement = () => {
 const context = useContext(RecipientManagementContext);
 if (!context) {
  throw new Error(
   "useRecipientManagement must be used within a RecipientManagementProvider",
  );
 }
 return context;
};

const ManagementProvider: React.FC<{
 children: React.ReactNode;
 selectedGroupId: number;
 setSelectedGroupId: (groupId: number | null) => void;
}> = React.memo(
 ({ children, selectedGroupId, setSelectedGroupId }) => {
  const notifications = useNotifications();
  const strings = useAppTranslation("recipientGroupTranslations");

  // Use refs for stable references to notifications and strings
  const notificationsRef = useRef(notifications);
  const stringsRef = useRef(strings);

  // Update refs when values change
  useEffect(() => {
   notificationsRef.current = notifications;
  }, [notifications]);

  useEffect(() => {
   stringsRef.current = strings;
  }, [strings]);

  const [loading, setLoading] = useState(false);
  const [students, setStudents] = useState<Graphql.Student[]>([]);
  const [pageInfo, setPageInfo] = useState<Graphql.PageInfo | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(50);
  const [filters, setFilters] = useState<Graphql.StudentFilterArgs | null>(
   null,
  );
  const [sort, setSort] = useState<Graphql.StudentsOrderByClause[] | null>(
   null,
  );

  const { studentsNotInRecipientGroupQuery, createRecipientsMutation } =
   useRecipientGraphQL();

  const fetchStudentsNotInGroup = useCallback(
   async (
    recipientGroupId: number | null,
    orderBy?: Graphql.StudentsOrderByClause[],
    paginationArgs?: Graphql.PaginationArgs,
    filterArgs?: Graphql.StudentFilterArgs,
   ) => {
    // Don't fetch if recipientGroupId is null
    if (recipientGroupId === null) {
     setStudents([]);
     setPageInfo(null);
     setLoading(false);
     return;
    }

    setLoading(true);
    try {
     const result = await studentsNotInRecipientGroupQuery({
      recipientGroupId,
      orderBy,
      paginationArgs,
      filterArgs,
     });

     if (result.studentsNotInRecipientGroup) {
      setStudents(result.studentsNotInRecipientGroup.data as Graphql.Student[]);
      if (result.studentsNotInRecipientGroup.pageInfo) {
       setPageInfo(result.studentsNotInRecipientGroup.pageInfo);
      }
     }
    } catch (error) {
     // Don't show error notification if the request was aborted (e.g., during navigation)
     if (!isAbortError(error)) {
      logger.error("Error fetching students not in group:", error);
      notificationsRef.current.show(stringsRef.current.errorAddingToGroup, {
       severity: "error",
       autoHideDuration: 3000,
      });
     } else {
      logger.debug("Query aborted (likely due to navigation):", error);
     }
    } finally {
     setLoading(false);
    }
   },
   [studentsNotInRecipientGroupQuery],
  );

  const addStudentsToGroup = useCallback(
   async (studentIds: (string | number)[]): Promise<boolean> => {
    if (selectedGroupId === null || studentIds.length === 0) {
     return false;
    }

    setLoading(true);
    try {
     // Convert string IDs to numbers
     const numericIds = studentIds.map((id) =>
      typeof id === "string" ? parseInt(id, 10) : id,
     );

     const result = await createRecipientsMutation({
      input: {
       recipientGroupId: selectedGroupId,
       studentIds: numericIds,
      },
     });

     if (result.data?.createRecipients) {
      notificationsRef.current.show(stringsRef.current.addedToGroup, {
       severity: "success",
       autoHideDuration: 3000,
      });

      // Refresh the student list
      await fetchStudentsNotInGroup(selectedGroupId);

      return true;
     }

     notificationsRef.current.show(stringsRef.current.errorAddingToGroup, {
      severity: "error",
      autoHideDuration: 3000,
     });
     return false;
    } catch (error) {
     logger.error("Error adding students to group:", error);
     notificationsRef.current.show(stringsRef.current.errorAddingToGroup, {
      severity: "error",
      autoHideDuration: 3000,
     });
     return false;
    } finally {
     setLoading(false);
    }
   },
   [selectedGroupId, createRecipientsMutation, fetchStudentsNotInGroup],
  );

  // Fetch students when group changes
  useEffect(() => {
   if (selectedGroupId) {
    fetchStudentsNotInGroup(
     selectedGroupId,
     sort || undefined,
     { page: currentPage, first: rowsPerPage },
     filters || undefined,
    );
   } else {
    // Clear students when no group is selected
    setStudents([]);
    setPageInfo(null);
   }
  }, [
   selectedGroupId,
   currentPage,
   rowsPerPage,
   filters,
   sort,
   fetchStudentsNotInGroup,
  ]);

  const onPageChange = useCallback((page: number) => {
   setCurrentPage(page);
  }, []);

  const onRowsPerPageChange = useCallback((rowsPerPage: number) => {
   setRowsPerPage(rowsPerPage);
   setCurrentPage(1);
  }, []);

  const contextValue = useMemo(
   () => ({
    loading,
    selectedGroupId,
    students,
    pageInfo,
    invalidGroupId: null, // Always null since we only render when valid group exists
    setSelectedGroupId,
    addStudentsToGroup,
    fetchStudentsNotInGroup,
    onPageChange,
    onRowsPerPageChange,
    setFilters,
    setSort,
   }),
   [
    loading,
    selectedGroupId,
    students,
    pageInfo,
    setSelectedGroupId,
    addStudentsToGroup,
    fetchStudentsNotInGroup,
    onPageChange,
    onRowsPerPageChange,
   ],
  );

  return (
   <RecipientManagementContext.Provider value={contextValue}>
    {children}
   </RecipientManagementContext.Provider>
  );
 },
 (prevProps, nextProps) => {
  // Only recreate if selectedGroupId changes
  return prevProps.selectedGroupId === nextProps.selectedGroupId;
 },
);
ManagementProvider.displayName = "ManagementProvider";

// Placeholder context for when no valid group is available
const createPlaceholderContext = (): RecipientManagementContextType => ({
 loading: false,
 selectedGroupId: null,
 students: [],
 pageInfo: null,
 invalidGroupId: null,
 setSelectedGroupId: () => {},
 addStudentsToGroup: async () => false,
 fetchStudentsNotInGroup: async () => {},
 onPageChange: () => {},
 onRowsPerPageChange: () => {},
 setFilters: () => {},
 setSort: () => {},
});

const GroupIdProvider: React.FC<{
 children: React.ReactNode;
}> = ({ children }) => {
 const { template } = useTemplateManagement();
 const { getParam, updateParams } = usePageNavigation();

 const [selectedGroupId, setSelectedGroupIdState] = useState<number | null>(
  null,
 );
 const [invalidGroupId, setInvalidGroupId] = useState<number | null>(null);

 // Memoize the current group ID param to avoid unnecessary effect triggers
 const groupIdParam = useMemo(() => getParam("groupId"), [getParam]);

 // Sync selectedGroupId with URL params and template changes
 useEffect(() => {
  let resolvedGroupId: number | null = null;

  // Try to get group ID from URL parameter first
  if (groupIdParam) {
   const groupId = parseInt(groupIdParam as string, 10);
   if (!isNaN(groupId)) {
    // Validate that the groupId exists in the current template's recipientGroups
    const validGroup = template?.recipientGroups?.find((g) => g.id === groupId);
    if (validGroup) {
     resolvedGroupId = groupId;
    }
   }
  }

  // Fall back to first available group ID
  if (resolvedGroupId === null) {
   resolvedGroupId = template?.recipientGroups?.[0]?.id || null;
  }

  // Only update state if the resolved group ID is actually different
  if (resolvedGroupId !== selectedGroupId) {
   setSelectedGroupIdState(resolvedGroupId);
  }

  // Handle invalid group ID case
  const newInvalidGroupId = (() => {
   if (groupIdParam) {
    const groupId = parseInt(groupIdParam as string, 10);
    if (
     !isNaN(groupId) &&
     !template?.recipientGroups?.find((g) => g.id === groupId)
    ) {
     return groupId;
    }
   }
   return null;
  })();

  // Only update invalidGroupId if it's actually different
  if (newInvalidGroupId !== invalidGroupId) {
   setInvalidGroupId(newInvalidGroupId);
  }
 }, [
  template?.id,
  template?.recipientGroups,
  groupIdParam,
  selectedGroupId,
  invalidGroupId,
 ]);

 const setSelectedGroupId = useCallback(
  (groupId: number | null) => {
   setSelectedGroupIdState(groupId);
   if (groupId) {
    updateParams({ groupId: groupId.toString() }, { merge: true });
   } else {
    updateParams({ groupId: undefined }, { merge: true });
   }
  },
  [updateParams],
 );

 // Memoize the placeholder context to prevent unnecessary re-renders
 const placeholderContext = useMemo(() => {
  const context = createPlaceholderContext();
  context.invalidGroupId = invalidGroupId;
  context.setSelectedGroupId = setSelectedGroupId;
  return context;
 }, [invalidGroupId, setSelectedGroupId]);

 // If no valid group ID is available, return placeholder context
 if (selectedGroupId === null) {
  return (
   <RecipientManagementContext.Provider value={placeholderContext}>
    {children}
   </RecipientManagementContext.Provider>
  );
 }

 return (
  <ManagementProvider
   selectedGroupId={selectedGroupId}
   setSelectedGroupId={setSelectedGroupId}
  >
   {children}
  </ManagementProvider>
 );
};

export const RecipientManagementProvider: React.FC<{
 children: React.ReactNode;
 templateId: number;
}> = ({ children, templateId }) => {
 return (
  <RecipientGraphQLProvider templateId={templateId}>
   <GroupIdProvider>{children}</GroupIdProvider>
  </RecipientGraphQLProvider>
 );
};
