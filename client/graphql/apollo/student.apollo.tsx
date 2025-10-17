// "use client";

// import { createContext, useCallback, useContext, useMemo } from "react";
// import * as Graphql from "@/client/graphql/generated/gql/graphql";
// import * as Document from "@/client/graphql/sharedDocuments";
// import { ApolloClient } from "@apollo/client";
// import { useMutation, useLazyQuery } from "@apollo/client/react";

// type StudentGraphQLContextType = {
//  /**
//   * Query to get a single student by ID
//   * @param variables - The student query variables
//   */
//  studentQuery: (
//   variables: Graphql.QueryStudentArgs,
//  ) => Promise<ApolloClient.QueryResult<Graphql.StudentQuery>>;

//  /**
//   * Query to get paginated students
//   * @param variables - The students query variables
//   */
//  studentsQuery: (
//   variables: Graphql.StudentsQueryVariables,
//  ) => Promise<ApolloClient.QueryResult<Graphql.StudentsQuery>>;

//  /**
//   * Mutation to create a new student
//   * @param variables - The creation student variables
//   */
//  createStudentMutation: (
//   variables: Graphql.CreateStudentMutationVariables,
//  ) => Promise<ApolloClient.MutateResult<Graphql.CreateStudentMutation>>;

//  /**
//   * Mutation to update an existing student
//   * @param variables - The update student variables
//   */
//  partialUpdateStudentMutation: (
//   variables: Graphql.PartiallyUpdateStudentMutationVariables,
//  ) => Promise<
//   ApolloClient.MutateResult<Graphql.PartiallyUpdateStudentMutation>
//  >;

//  /**
//   * Mutation to delete a student
//   * @param variables - The delete student variables
//   */
//  deleteStudentMutation: (
//   variables: Graphql.DeleteStudentMutationVariables,
//  ) => Promise<ApolloClient.MutateResult<Graphql.DeleteStudentMutation>>;
// };

// const StudentGraphQLContext = createContext<
//  StudentGraphQLContextType | undefined
// >(undefined);

// export const useStudentGraphQL = () => {
//  const context = useContext(StudentGraphQLContext);
//  if (!context) {
//   throw new Error(
//    "useStudentGraphQL must be used within a StudentGraphQLProvider",
//   );
//  }
//  return context;
// };

// export const StudentGraphQLProvider: React.FC<{
//  children: React.ReactNode;
//  queryVariables?: Graphql.StudentsQueryVariables;
// }> = ({ children, queryVariables }) => {
//  // Student queries
//  const [executeStudentQuery] = useLazyQuery(Document.studentQueryDocument);

//  const [executeStudentsQuery] = useLazyQuery(Document.studentsQueryDocument);

//  // Student query wrapper functions
//  const studentQuery = useCallback(
//   async (variables: Graphql.QueryStudentArgs) => {
//    return executeStudentQuery({ variables: { id: variables.id } });
//   },
//   [executeStudentQuery],
//  );

//  const studentsQuery = useCallback(
//   async (variables: Graphql.StudentsQueryVariables) => {
//    return executeStudentsQuery({ variables });
//   },
//   [executeStudentsQuery],
//  );

//  // Create student mutation
//  const [mutateCreate] = useMutation(Document.createStudentMutationDocument, {
//   update(cache, { data }) {
//    if (!data?.createStudent) return;

//    const existingData = cache.readQuery<Graphql.StudentsQuery>({
//     query: Graphql.StudentsDocument,
//     variables: queryVariables,
//    });

//    if (!existingData?.students?.data) return;

//    cache.writeQuery({
//     query: Graphql.StudentsDocument,
//     variables: queryVariables,
//     data: {
//      students: {
//       ...existingData.students,
//       data: [data.createStudent, ...existingData.students.data],
//      },
//     },
//    });
//   },
//  });

//  // Update student mutation
//  const [mutateUpdate] = useMutation(
//   Document.partiallyUpdateStudentMutationDocument,
//   {
//    update(cache, { data }) {
//     if (!data?.partiallyUpdateStudent) return;
//     const updatedStudent = data.partiallyUpdateStudent;
//     const existingData = cache.readQuery<Graphql.StudentsQuery>({
//      query: Graphql.StudentsDocument,
//      variables: queryVariables,
//     });

//     if (!existingData?.students?.data) return;

//     const updatedStudents = existingData.students.data.map((student) =>
//      student.id === updatedStudent.id ? updatedStudent : student,
//     );

//     cache.writeQuery({
//      query: Graphql.StudentsDocument,
//      variables: queryVariables,
//      data: {
//       students: {
//        ...existingData.students,
//        data: updatedStudents,
//       },
//      },
//     });
//    },
//   },
//  );

//  // Delete student mutation
//  const [mutateDelete] = useMutation(Document.deleteStudentMutationDocument, {
//   update(cache, { data }) {
//    if (!data?.deleteStudent) return;
//    const deletedStudent = data.deleteStudent;

//    const existingData = cache.readQuery<Graphql.StudentsQuery>({
//     query: Graphql.StudentsDocument,
//     variables: queryVariables,
//    });

//    if (!existingData?.students?.data) return;

//    cache.writeQuery({
//     query: Graphql.StudentsDocument,
//     variables: queryVariables,
//     data: {
//      students: {
//       ...existingData.students,
//       data: existingData.students.data.filter(
//        (student) => student.id !== deletedStudent.id,
//       ),
//      },
//     },
//    });
//   },
//  });

//  const createStudentMutation = useCallback(
//   (variables: Graphql.CreateStudentMutationVariables) => {
//    return mutateCreate({ variables });
//   },
//   [mutateCreate],
//  );

//  const partialUpdateStudentMutation = useCallback(
//   (variables: Graphql.PartiallyUpdateStudentMutationVariables) => {
//    return mutateUpdate({ variables });
//   },
//   [mutateUpdate],
//  );

//  const deleteStudentMutation = useCallback(
//   (variables: Graphql.DeleteStudentMutationVariables) => {
//    return mutateDelete({ variables });
//   },
//   [mutateDelete],
//  );

//  const contextValue: StudentGraphQLContextType = useMemo(
//   () => ({
//    studentQuery,
//    studentsQuery,
//    createStudentMutation,
//    partialUpdateStudentMutation,
//    deleteStudentMutation,
//   }),
//   [
//    studentQuery,
//    studentsQuery,
//    createStudentMutation,
//    partialUpdateStudentMutation,
//    deleteStudentMutation,
//   ],
//  );

//  return (
//   <StudentGraphQLContext.Provider value={contextValue}>
//    {children}
//   </StudentGraphQLContext.Provider>
//  );
// };
