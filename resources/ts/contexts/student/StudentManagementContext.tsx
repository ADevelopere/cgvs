"use client";

import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useState,
} from "react";
import * as Graphql from "@/graphql/generated/types";
import { useStudentGraphQL } from "./StudentGraphQLContext";
import { PaginatorInfo, Student } from "@/graphql/generated/types";
import { mapSingleStudent } from "@/utils/student/student-mappers";
import { useNotifications } from "@toolpad/core/useNotifications";

type StudentManagementContextType = {
    // States
    students: Student[];
    selectedStudents: string[];
    paginatorInfo: PaginatorInfo | null;
    queryParams: Graphql.StudentsQueryVariables;

    // Mutations
    createStudent: (
        variables: Graphql.CreateStudentMutationVariables,
    ) => Promise<boolean>;
    updateStudent: (
        variables: Graphql.UpdateStudentMutationVariables,
    ) => Promise<boolean>;
    deleteStudent: (id: string) => Promise<boolean>;

    // Query params methods
    setQueryParams: (params: Partial<Graphql.StudentsQueryVariables>) => void;
    toggleStudentSelect: (studentId: string) => void;
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
    first: 100,
    page: 1,
    orderBy: [{ column: "name", order: "ASC" }],
};

export const StudentManagementProvider: React.FC<{
    children: React.ReactNode;
}> = ({ children }) => {
    const notifications = useNotifications();

    const [students, setStudents] = useState<Student[]>([]);
    const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
    const [paginatorInfo, setPaginatorInfo] = useState<PaginatorInfo | null>(
        null,
    );
    const [queryParams, setQueryParams] =
        useState<Graphql.StudentsQueryVariables>(DEFAULT_QUERY_PARAMS);

    const {
        studentsQuery,
        createStudentMutation,
        updateStudentMutation,
        deleteStudentMutation,
    } = useStudentGraphQL();

    // Fetch students when query params change
    useEffect(() => {
        const fetchStudents = async () => {
            try {
                const result: Graphql.StudentsQuery =
                    await studentsQuery(queryParams);
                if (result.students) {
                    setStudents(result.students.data);
                    setPaginatorInfo(result.students.paginatorInfo);
                }
            } catch (error) {
                console.error("Error fetching students:", error);
                notifications.show("Failed to fetch students", {
                    severity: "error",
                    autoHideDuration: 3000,
                });
            }
        };

        fetchStudents();
    }, [queryParams, studentsQuery]);

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
                console.error("Error creating student:", error);
                notifications.show("Failed to create student", {
                    severity: "error",
                    autoHideDuration: 3000,
                });
                return false;
            }
        },
        [createStudentMutation],
    );

    const handleUpdateStudent = useCallback(
        async (
            variables: Graphql.UpdateStudentMutationVariables,
        ): Promise<boolean> => {
            try {
                const result = await updateStudentMutation(variables);
                if (result.data?.updateStudent) {
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
                console.error("Error updating student:", error);
                notifications.show("Failed to update student", {
                    severity: "error",
                    autoHideDuration: 3000,
                });
                return false;
            }
        },
        [updateStudentMutation],
    );

    const handleDeleteStudent = useCallback(
        async (id: string): Promise<boolean> => {
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
                console.error("Error deleting student:", error);
                notifications.show("Failed to delete student", {
                    severity: "error",
                    autoHideDuration: 3000,
                });
                return false;
            }
        },
        [deleteStudentMutation],
    );

    const handleToggleStudentSelect = useCallback((studentId: string) => {
        setSelectedStudents((prev) => {
            // If student is already selected, remove them
            if (prev.includes(studentId)) {
                return prev.filter((id) => id !== studentId);
            }
            // If not selected, clear previous selection and select this student (single select)
            return [studentId];
        });
    }, []);

    return (
        <StudentManagementContext.Provider
            value={{
                students,
                selectedStudents,
                paginatorInfo,
                queryParams,
                createStudent: handleCreateStudent,
                updateStudent: handleUpdateStudent,
                deleteStudent: handleDeleteStudent,
                setQueryParams: handleSetQueryParams,
                toggleStudentSelect: handleToggleStudentSelect,
            }}
        >
            {children}
        </StudentManagementContext.Provider>
    );
};
