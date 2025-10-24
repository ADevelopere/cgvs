"use client";

import { useMutation } from "@apollo/client/react";
import * as Graphql from "@/client/graphql/generated/gql/graphql";
import * as Document from "./student.documents";

/**
 * Apollo mutations hook for student operations
 * Pure mutations with cache updates - no queries
 */
export const useStudentApolloMutations = () => {
  // Create student mutation
  const [createMutation] = useMutation(Document.createStudentMutationDocument, {
    update(cache, { data }) {
      if (!data?.createStudent) return;

      // Add to students query cache
      const existingData = cache.readQuery<Graphql.StudentsQuery>({
        query: Document.studentsQueryDocument,
        variables: {
          paginationArgs: { first: 100, page: 1 },
          orderBy: [{ column: "NAME", order: "ASC" }],
        },
      });

      if (!existingData?.students?.data) return;

      cache.writeQuery({
        query: Document.studentsQueryDocument,
        variables: {
          paginationArgs: { first: 100, page: 1 },
          orderBy: [{ column: "NAME", order: "ASC" }],
        },
        data: {
          students: {
            ...existingData.students,
            data: [data.createStudent, ...existingData.students.data],
          },
        },
      });
    },
  });

  // Update student mutation
  const [updateMutation] = useMutation(
    Document.partiallyUpdateStudentMutationDocument,
    {
      update(cache, { data }) {
        if (!data?.partiallyUpdateStudent) return;
        const updatedStudent = data.partiallyUpdateStudent;

        // Update in students query cache
        const existingData = cache.readQuery<Graphql.StudentsQuery>({
          query: Document.studentsQueryDocument,
          variables: {
            paginationArgs: { first: 100, page: 1 },
            orderBy: [{ column: "NAME", order: "ASC" }],
          },
        });

        if (!existingData?.students?.data) return;

        const updatedStudents = existingData.students.data.map(student =>
          student.id === updatedStudent.id ? updatedStudent : student
        );

        cache.writeQuery({
          query: Document.studentsQueryDocument,
          variables: {
            paginationArgs: { first: 100, page: 1 },
            orderBy: [{ column: "NAME", order: "ASC" }],
          },
          data: {
            students: {
              ...existingData.students,
              data: updatedStudents,
            },
          },
        });
      },
    }
  );

  // Delete student mutation
  const [deleteMutation] = useMutation(Document.deleteStudentMutationDocument, {
    update(cache, { data }) {
      if (!data?.deleteStudent) return;
      const deletedStudent = data.deleteStudent;

      // Remove from students query cache
      const existingData = cache.readQuery<Graphql.StudentsQuery>({
        query: Document.studentsQueryDocument,
        variables: {
          paginationArgs: { first: 100, page: 1 },
          orderBy: [{ column: "NAME", order: "ASC" }],
        },
      });

      if (!existingData?.students?.data) return;

      cache.writeQuery({
        query: Document.studentsQueryDocument,
        variables: {
          paginationArgs: { first: 100, page: 1 },
          orderBy: [{ column: "NAME", order: "ASC" }],
        },
        data: {
          students: {
            ...existingData.students,
            data: existingData.students.data.filter(
              student => student.id !== deletedStudent.id
            ),
          },
        },
      });
    },
  });

  return {
    createStudentMutation: createMutation,
    partialUpdateStudentMutation: updateMutation,
    deleteStudentMutation: deleteMutation,
  };
};
