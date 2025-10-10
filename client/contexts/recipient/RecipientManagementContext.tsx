"use client";

import * as Graphql from "@/client/graphql/generated/gql/graphql";
import {
 createContext,
 useCallback,
 useContext,
 useMemo,
 useState,
 useEffect,
} from "react";
import { useNotifications } from "@toolpad/core/useNotifications";
import {
 RecipientGraphQLProvider,
 useRecipientGraphQL,
} from "./RecipientGraphQLContext";
import logger from "@/lib/logger";
import { useAppTranslation } from "@/client/locale";
import { usePageNavigation } from "../navigation/usePageNavigation";
import { isAbortError } from "@/client/utils/errorUtils";

type RecipientManagementContextType = {
    // State
    loading: boolean;
    selectedGroupId: number | null;
    students: Graphql.Student[];
    pageInfo: Graphql.PageInfo | null;

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
}> = ({ children }) => {
 const notifications = useNotifications();
 const strings = useAppTranslation("recipientGroupTranslations");
 const { updateParams, getParam } = usePageNavigation();

    const [loading, setLoading] = useState(false);
    const [selectedGroupId, setSelectedGroupIdState] = useState<number | null>(
        null,
    );
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

 // Sync selectedGroupId with URL params
 useEffect(() => {
  const groupIdParam = getParam("groupId");
  if (groupIdParam) {
   const groupId = parseInt(groupIdParam as string, 10);
   if (!isNaN(groupId)) {
    setSelectedGroupIdState(groupId);
   }
  }
 }, [getParam]);

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

 const fetchStudentsNotInGroup = useCallback(
  async (
   recipientGroupId: number | null,
   orderBy: Graphql.StudentsOrderByClause[] = [],
   paginationArgs: Graphql.PaginationArgs = {
    page: currentPage,
    first: rowsPerPage,
   },
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
     notifications.show(strings.errorAddingToGroup, {
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
  [
   studentsNotInRecipientGroupQuery,
   notifications,
   strings,
   currentPage,
   rowsPerPage,
  ],
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
                    notifications.show(strings.addedToGroup, {
                        severity: "success",
                        autoHideDuration: 3000,
                    });

                    // Refresh the student list
                    await fetchStudentsNotInGroup(selectedGroupId);

                    return true;
                }

                notifications.show(strings.errorAddingToGroup, {
                    severity: "error",
                    autoHideDuration: 3000,
                });
                return false;
            } catch (error) {
                logger.error("Error adding students to group:", error);
                notifications.show(strings.errorAddingToGroup, {
                    severity: "error",
                    autoHideDuration: 3000,
                });
                return false;
            } finally {
                setLoading(false);
            }
        },
        [selectedGroupId, createRecipientsMutation, notifications, strings, fetchStudentsNotInGroup],
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
};

export const RecipientManagementProvider: React.FC<{
 children: React.ReactNode;
 recipientGroupId: number | null;
 templateId: number;
}> = ({ children, recipientGroupId, templateId }) => {
 return (
  <RecipientGraphQLProvider
   recipientGroupId={recipientGroupId}
   templateId={templateId}
  >
   <ManagementProvider>{children}</ManagementProvider>
  </RecipientGraphQLProvider>
 );
};
