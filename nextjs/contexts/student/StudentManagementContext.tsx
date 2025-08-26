"use client";

import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
} from "react";
import * as Graphql from "@/graphql/generated/types";
import { useStudentGraphQL } from "./StudentGraphQLContext";
import { PaginationInfo, Student } from "@/graphql/generated/types";
import { mapSingleStudent } from "@/utils/student/student-mappers";
import { useNotifications } from "@toolpad/core/useNotifications";
import logger from "@/utils/logger";

type StudentManagementContextType = {
    // States
    students: Student[];
    selectedStudents: number[];
    paginationInfo: PaginationInfo | null | undefined;
    queryParams: Graphql.StudentsQueryVariables;
    loading: boolean;

    // Mutations
    createStudent: (
        variables: Graphql.CreateStudentMutationVariables,
    ) => Promise<boolean>;
    partialUpdateStudent: (
        variables: Graphql.PartialUpdateStudentMutationVariables,
    ) => Promise<boolean>;
    deleteStudent: (id: number) => Promise<boolean>;

    // Query params methods
    setQueryParams: (params: Partial<Graphql.StudentsQueryVariables>) => void;
    toggleStudentSelect: (studentId: number) => void;
    selectAllStudents: () => void;
    clearSelectedStudents: () => void;
};

const StudentManagementContext = createContext<
    StudentManagementContextType | undefined
>(undefined);

export const useStudentManagement = () => {
    const context = useContext(StudentManagementContext);
    if (!context) {
        throw new Error(
            "useStudentManagement must be used within a StudentManagementProvider",
        );
    }
    return context;
};

const DEFAULT_QUERY_PARAMS: Graphql.StudentsQueryVariables = {
    paginationArgs: {
        first: 100,
        page: 1,
    },
    orderBy: [{ column: "NAME", order: "ASC" }],
};

export const StudentManagementProvider: React.FC<{
    children: React.ReactNode;
}> = ({ children }) => {
    const notifications = useNotifications();

    const [students, setStudents] = useState<Student[]>([]);
    const [selectedStudents, setSelectedStudents] = useState<number[]>([]);
    const [paginationInfo, setPaginationInfo] = useState<PaginationInfo | null | undefined>(
        null,
    );
    const [queryParams, setQueryParams] =
        useState<Graphql.StudentsQueryVariables>(DEFAULT_QUERY_PARAMS);

    const [loading, setLoading] = useState(false);

    const {
        studentsQuery,
        createStudentMutation,
        partialUpdateStudentMutation,
        deleteStudentMutation,
    } = useStudentGraphQL();

    // Fetch students when query params change
    useEffect(() => {
        const fetchStudents = async () => {
            setLoading(true);
            try {
                const result: Graphql.StudentsQuery =
                    await studentsQuery(queryParams);
                if (result.students) {
                    setStudents(result.students.data);
                    setPaginationInfo(result.students.paginationInfo);
                }
            } catch (error) {
                logger.error("Error fetching students:", error);
                notifications.show("Failed to fetch students", {
                    severity: "error",
                    autoHideDuration: 3000,
                });
            } finally {
                setLoading(false);
            }
        };

        fetchStudents();
    }, [notifications, queryParams, studentsQuery]);

    const handleSetQueryParams = useCallback(
        (params: Partial<Graphql.StudentsQueryVariables>) => {
            setQueryParams((prev) => ({
                ...prev,
                ...params,
            }));
        },
        [],
    );

    const handleCreateStudent = useCallback(
        async (
            variables: Graphql.CreateStudentMutationVariables,
        ): Promise<boolean> => {
            try {
                const result = await createStudentMutation(variables);
                if (result.data?.createStudent) {
                    const newStudent = mapSingleStudent(result.data);
                    if (newStudent) {
                        setStudents((prev) => [newStudent, ...prev]);
                        notifications.show("Student created successfully", {
                            severity: "success",
                            autoHideDuration: 3000,
                        });
                        return true;
                    }
                }
                notifications.show("Failed to create student", {
                    severity: "error",
                    autoHideDuration: 3000,
                });
                return false;
            } catch (error) {
                logger.error("Error creating student:", error);
                notifications.show("Failed to create student", {
                    severity: "error",
                    autoHideDuration: 3000,
                });
                return false;
            }
        },
        [createStudentMutation, notifications],
    );

    const handlePartialUpdateStudent = useCallback(
        async (
            variables: Graphql.PartialUpdateStudentMutationVariables,
        ): Promise<boolean> => {
            try {
                const result = await partialUpdateStudentMutation(variables);
                if (result.data?.partialUpdateStudent) {
                    const updatedStudent = mapSingleStudent(result.data);
                    if (updatedStudent) {
                        setStudents((prev) =>
                            prev.map((student) =>
                                student.id === updatedStudent.id
                                    ? updatedStudent
                                    : student,
                            ),
                        );
                        notifications.show("Student updated successfully", {
                            severity: "success",
                            autoHideDuration: 3000,
                        });
                        return true;
                    }
                }
                notifications.show("Failed to update student", {
                    severity: "error",
                    autoHideDuration: 3000,
                });
                return false;
            } catch (error) {
                logger.error("Error updating student:", error);
                notifications.show("Failed to update student", {
                    severity: "error",
                    autoHideDuration: 3000,
                });
                return false;
            }
        },
        [notifications, partialUpdateStudentMutation],
    );

    const handleDeleteStudent = useCallback(
        async (id: number): Promise<boolean> => {
            try {
                const result = await deleteStudentMutation({ id });
                if (result.data?.deleteStudent) {
                    setStudents((prev) =>
                        prev.filter((student) => student.id !== id),
                    );
                    notifications.show("Student deleted successfully", {
                        severity: "success",
                        autoHideDuration: 3000,
                    });
                    return true;
                }
                notifications.show("Failed to delete student", {
                    severity: "error",
                    autoHideDuration: 3000,
                });
                return false;
            } catch (error) {
                logger.error("Error deleting student:", error);
                notifications.show("Failed to delete student", {
                    severity: "error",
                    autoHideDuration: 3000,
                });
                return false;
            }
        },
        [deleteStudentMutation, notifications],
    );

    const handleToggleStudentSelect = useCallback((studentId: number) => {
        setSelectedStudents((prev) => {
            // If student is already selected, remove them
            if (prev.includes(studentId)) {
                return prev.filter((id) => id !== studentId);
            }
            // If not selected, clear previous selection and select this student (single select)
            return [studentId];
        });
    }, []);

    const handleSelectAllStudents = useCallback(() => {
        setSelectedStudents(students.map((student) => student.id));
    }, [students]);

    const handleClearSelectedStudents = useCallback(() => {
        setSelectedStudents([]);
    }, []);

    const value : StudentManagementContextType= useMemo(
        () => ({
            students,
            selectedStudents,
            paginationInfo,
            queryParams,
            loading,
            createStudent: handleCreateStudent,
            partialUpdateStudent: handlePartialUpdateStudent,
            deleteStudent: handleDeleteStudent,
            setQueryParams: handleSetQueryParams,
            toggleStudentSelect: handleToggleStudentSelect,
            selectAllStudents: handleSelectAllStudents,
            clearSelectedStudents: handleClearSelectedStudents,
        }),
        [
            students,
            selectedStudents,
            paginationInfo,
            queryParams,
            loading,
            handleCreateStudent,
            handlePartialUpdateStudent,
            handleDeleteStudent,
            handleSetQueryParams,
            handleToggleStudentSelect,
            handleSelectAllStudents,
            handleClearSelectedStudents,
        ],
    );

    return (
        <StudentManagementContext.Provider value={value}>
            {children}
        </StudentManagementContext.Provider>
    );
};
