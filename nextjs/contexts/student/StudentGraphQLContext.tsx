"use client";

import { createContext, useCallback, useContext, useMemo } from "react";
import * as Graphql from "@/graphql/generated/types";
import { FetchResult } from "@apollo/client";

type StudentGraphQLContextType = {
    /**
     * Query to get a single student by ID
     * @param variables - The student query variables
     */
    studentQuery: (
        variables: Graphql.QueryStudentArgs,
    ) => Promise<Graphql.StudentQuery>;

    /**
     * Query to get paginated students
     * @param variables - The students query variables
     */
    studentsQuery: (
        variables: Graphql.StudentsQueryVariables,
    ) => Promise<Graphql.StudentsQuery>;

    /**
     * Mutation to create a new student
     * @param variables - The creation student variables
     */
    createStudentMutation: (
        variables: Graphql.CreateStudentMutationVariables,
    ) => Promise<FetchResult<Graphql.CreateStudentMutation>>;

    /**
     * Mutation to update an existing student
     * @param variables - The update student variables
     */
    partialUpdateStudentMutation: (
        variables: Graphql.PartialUpdateStudentMutationVariables,
    ) => Promise<FetchResult<Graphql.PartialUpdateStudentMutation>>;

    /**
     * Mutation to delete a student
     * @param variables - The delete student variables
     */
    deleteStudentMutation: (
        variables: Graphql.DeleteStudentMutationVariables,
    ) => Promise<FetchResult<Graphql.DeleteStudentMutation>>;
};

const StudentGraphQLContext = createContext<
    StudentGraphQLContextType | undefined
>(undefined);

export const useStudentGraphQL = () => {
    const context = useContext(StudentGraphQLContext);
    if (!context) {
        throw new Error(
            "useStudentGraphQL must be used within a StudentGraphQLProvider",
        );
    }
    return context;
};

export const StudentGraphQLProvider: React.FC<{
    children: React.ReactNode;
    queryVariables?: Graphql.StudentsQueryVariables;
}> = ({ children, queryVariables }) => {
    // Student queries
    const studentQueryRef = Graphql.useStudentQuery({
        skip: true,
    });

    const studentsQueryRef = Graphql.useStudentsQuery({
        skip: true,
    });

    // Student query wrapper functions
    const studentQuery = useCallback(
        async (variables: Graphql.QueryStudentArgs) => {
            const result = await studentQueryRef.refetch({ id: variables.id });
            if (!result.data) {
                throw new Error("No data returned from student query");
            }
            return result.data;
        },
        [studentQueryRef],
    );

    const studentsQuery = useCallback(
        async (variables: Graphql.StudentsQueryVariables) => {
            const result = await studentsQueryRef.refetch(variables);
            if (!result.data) {
                throw new Error("No data returned from students query");
            }
            return result.data;
        },
        [studentsQueryRef],
    );

    // Create student mutation
    const [mutateCreate] = Graphql.useCreateStudentMutation({
        update(cache, { data }) {
            if (!data?.createStudent) return;

            const existingData = cache.readQuery<Graphql.StudentsQuery>({
                query: Graphql.StudentsDocument,
                variables: queryVariables,
            });

            if (!existingData?.students?.data) return;

            cache.writeQuery({
                query: Graphql.StudentsDocument,
                variables: queryVariables,
                data: {
                    students: {
                        ...existingData.students,
                        data: [
                            data.createStudent,
                            ...existingData.students.data,
                        ],
                    },
                },
            });
        },
    });

    // Update student mutation
    const [mutateUpdate] = Graphql.usePartialUpdateStudentMutation({
        update(cache, { data }) {
            if (!data?.partialUpdateStudent) return;

            const existingData = cache.readQuery<Graphql.StudentsQuery>({
                query: Graphql.StudentsDocument,
                variables: queryVariables,
            });

            if (!existingData?.students?.data) return;

            const updatedStudents = existingData.students.data.map((student) =>
                student.id === data.partialUpdateStudent.id
                    ? data.partialUpdateStudent
                    : student,
            );

            cache.writeQuery({
                query: Graphql.StudentsDocument,
                variables: queryVariables,
                data: {
                    students: {
                        ...existingData.students,
                        data: updatedStudents,
                    },
                },
            });
        },
    });

    // Delete student mutation
    const [mutateDelete] = Graphql.useDeleteStudentMutation({
        update(cache, { data }) {
            if (!data?.deleteStudent) return;

            const existingData = cache.readQuery<Graphql.StudentsQuery>({
                query: Graphql.StudentsDocument,
                variables: queryVariables,
            });

            if (!existingData?.students?.data) return;

            cache.writeQuery({
                query: Graphql.StudentsDocument,
                variables: queryVariables,
                data: {
                    students: {
                        ...existingData.students,
                        data: existingData.students.data.filter(
                            (student) => student.id !== data.deleteStudent.id,
                        ),
                    },
                },
            });
        },
    });

    const createStudentMutation = useCallback(
        (variables: Graphql.CreateStudentMutationVariables) => {
            return mutateCreate({ variables });
        },
        [mutateCreate],
    );

    const partialUpdateStudentMutation = useCallback(
        (variables: Graphql.PartialUpdateStudentMutationVariables) => {
            return mutateUpdate({ variables });
        },
        [mutateUpdate],
    );

    const deleteStudentMutation = useCallback(
        (variables: Graphql.DeleteStudentMutationVariables) => {
            return mutateDelete({ variables });
        },
        [mutateDelete],
    );

    const contextValue: StudentGraphQLContextType = useMemo(
        () => ({
            studentQuery,
            studentsQuery,
            createStudentMutation,
            partialUpdateStudentMutation,
            deleteStudentMutation,
        }),
        [
            studentQuery,
            studentsQuery,
            createStudentMutation,
            partialUpdateStudentMutation,
            deleteStudentMutation,
        ],
    );

    return (
        <StudentGraphQLContext.Provider value={contextValue}>
            {children}
        </StudentGraphQLContext.Provider>
    );
};
