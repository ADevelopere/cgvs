// "use client";

// import React from "react";
// import * as Graphql from "@/client/graphql/generated/gql/graphql";
// import { RecipientGraphQLProvider } from "@/client/graphql/apollo";
// import { useRecipientService } from "@/client/graphql/service";

// type RecipientManagementContextType = {
//   // State
//   loading: boolean;
//   selectedGroupId: number | null;
//   students: Graphql.Student[];
//   pageInfo: Graphql.PageInfo | null;
//   invalidGroupId: number | null;

//   // Group selection
//   setSelectedGroupId: (groupId: number | null) => void;

//   // Operations
//   addStudentsToGroup: (studentIds: number[]) => Promise<boolean>;

//   // Pagination and filtering
//   onPageChange: (page: number) => void;
//   onRowsPerPageChange: (rowsPerPage: number) => void;
//   setFilters: (filters: Graphql.StudentFilterArgs | null) => void;
//   setSort: (sort: Graphql.StudentsOrderByClause[] | null) => void;
// };

// const RecipientManagementContext = React.createContext<
//   RecipientManagementContextType | undefined
// >(undefined);

// export const useRecipientManagement = () => {
//   const context = React.useContext(RecipientManagementContext);
//   if (!context) {
//     throw new Error(
//       "useRecipientManagement must be used within a RecipientManagementProvider",
//     );
//   }
//   return context;
// };

// const ManagementProvider: React.FC<{
//   children: React.ReactNode;
//   selectedGroupId: number;
//   setSelectedGroupId: (groupId: number | null) => void;
// }> = React.memo(
//   ({ children, selectedGroupId, setSelectedGroupId }) => {
//     const [loading, setLoading] = React.useState(false);
//     const [students, setStudents] = React.useState<Graphql.Student[]>([]);
//     const [pageInfo, setPageInfo] = React.useState<Graphql.PageInfo | null>(
//       null,
//     );
//     const [currentPage, setCurrentPage] = React.useState(1);
//     const [rowsPerPage, setRowsPerPage] = React.useState(50);
//     const [filters, setFilters] =
//       React.useState<Graphql.StudentFilterArgs | null>(null);
//     const [sort, setSort] = React.useState<
//       Graphql.StudentsOrderByClause[] | null
//     >(null);

//     const recipientService = useRecipientService();

//     const fetchStudentsNotInGroup = React.useCallback(
//       async (
//         recipientGroupId: number | null,
//         orderBy?: Graphql.StudentsOrderByClause[],
//         paginationArgs?: Graphql.PaginationArgs,
//         filterArgs?: Graphql.StudentFilterArgs,
//       ) => {
//         // Don't fetch if recipientGroupId is null
//         if (recipientGroupId === null) {
//           setStudents([]);
//           setPageInfo(null);
//           setLoading(false);
//           return;
//         }

//         setLoading(true);
//         try {
//           const result = await recipientService.fetchStudentsNotInGroup(
//             recipientGroupId,
//             orderBy,
//             paginationArgs,
//             filterArgs,
//           );

//           setStudents(result.students);
//           setPageInfo(result.pageInfo);
//         } finally {
//           setLoading(false);
//         }
//       },
//       [recipientService],
//     );

//     const addStudentsToGroup = React.useCallback(
//       async (studentIds: number[]): Promise<boolean> => {
//         if (selectedGroupId === null || studentIds.length === 0) {
//           return false;
//         }

//         setLoading(true);
//         try {
//           const createdRecipients = await recipientService.addStudentsToGroup(
//             selectedGroupId,
//             studentIds,
//           );

//           if (createdRecipients.length > 0) {
//             // Refresh the student list
//             await fetchStudentsNotInGroup(selectedGroupId);
//             return true;
//           }

//           return false;
//         } finally {
//           setLoading(false);
//         }
//       },
//       [selectedGroupId, recipientService, fetchStudentsNotInGroup],
//     );

//     // Fetch students when group changes
//     React.useEffect(() => {
//       if (selectedGroupId) {
//         fetchStudentsNotInGroup(
//           selectedGroupId,
//           sort || undefined,
//           { page: currentPage, first: rowsPerPage },
//           filters || undefined,
//         );
//       } else {
//         // Clear students when no group is selected
//         setStudents([]);
//         setPageInfo(null);
//       }
//     }, [
//       selectedGroupId,
//       currentPage,
//       rowsPerPage,
//       filters,
//       sort,
//       fetchStudentsNotInGroup,
//     ]);

//     const onPageChange = React.useCallback((page: number) => {
//       setCurrentPage(page);
//     }, []);

//     const onRowsPerPageChange = React.useCallback((rowsPerPage: number) => {
//       setRowsPerPage(rowsPerPage);
//       setCurrentPage(1);
//     }, []);

//     const contextValue = React.useMemo(
//       () => ({
//         loading,
//         selectedGroupId,
//         students,
//         pageInfo,
//         invalidGroupId: null, // Always null since we only render when valid group exists
//         setSelectedGroupId,
//         addStudentsToGroup,
//         onPageChange,
//         onRowsPerPageChange,
//         setFilters,
//         setSort,
//       }),
//       [
//         loading,
//         selectedGroupId,
//         students,
//         pageInfo,
//         setSelectedGroupId,
//         addStudentsToGroup,
//         onPageChange,
//         onRowsPerPageChange,
//       ],
//     );

//     return (
//       <RecipientManagementContext.Provider value={contextValue}>
//         {children}
//       </RecipientManagementContext.Provider>
//     );
//   },
//   (prevProps, nextProps) => {
//     // Only recreate if selectedGroupId changes
//     return prevProps.selectedGroupId === nextProps.selectedGroupId;
//   },
// );
// ManagementProvider.displayName = "ManagementProvider";

// // Placeholder context for when no valid group is available
// const createPlaceholderContext = (): RecipientManagementContextType => ({
//   loading: false,
//   selectedGroupId: null,
//   students: [],
//   pageInfo: null,
//   invalidGroupId: null,
//   setSelectedGroupId: () => {},
//   addStudentsToGroup: async () => false,
//   onPageChange: () => {},
//   onRowsPerPageChange: () => {},
//   setFilters: () => {},
//   setSort: () => {},
// });

// const GroupIdProvider: React.FC<{
//   children: React.ReactNode;
// }> = ({ children }) => {
//   const [selectedGroupId, setSelectedGroupIdState] = React.useState<
//     number | null
//   >(null);
//   const [invalidGroupId, setInvalidGroupId] = React.useState<number | null>(
//     null,
//   );

//   const setSelectedGroupId = React.useCallback((groupId: number | null) => {
//     setSelectedGroupIdState(groupId);
//   }, []);

//   // Memoize the placeholder context to prevent unnecessary re-renders
//   const placeholderContext = React.useMemo(() => {
//     const context = createPlaceholderContext();
//     context.invalidGroupId = invalidGroupId;
//     context.setSelectedGroupId = setSelectedGroupId;
//     return context;
//   }, [invalidGroupId, setSelectedGroupId]);

//   // If no valid group ID is available, return placeholder context
//   if (selectedGroupId === null) {
//     return (
//       <RecipientManagementContext.Provider value={placeholderContext}>
//         {children}
//       </RecipientManagementContext.Provider>
//     );
//   }

//   return (
//     <ManagementProvider
//       selectedGroupId={selectedGroupId}
//       setSelectedGroupId={setSelectedGroupId}
//     >
//       {children}
//     </ManagementProvider>
//   );
// };

// export const RecipientManagementProvider: React.FC<{
//   children: React.ReactNode;
//   templateId: number;
// }> = ({ children }) => {
//   return (
//     <RecipientGraphQLProvider>
//       <GroupIdProvider>{children}</GroupIdProvider>
//     </RecipientGraphQLProvider>
//   );
// };
