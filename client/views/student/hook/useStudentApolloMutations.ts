"use client";

import { useMutation, useApolloClient } from "@apollo/client/react";
import { gql, ApolloCache } from "@apollo/client";
import * as Graphql from "@/client/graphql/generated/gql/graphql";
import * as Document from "./student.documents";
import { useStudentStore } from "../stores/useStudentStore";

/**
 * Apollo mutations hook for student operations
 * Pure mutations with cache updates - no queries
 */
export const useStudentApolloMutations = () => {
  const store = useStudentStore();
  const client = useApolloClient();

  /**
   * Evicts student cache for current query params and deletes all other cached variations
   * This ensures the current view refetches while removing stale cache entries
   */
  const evictStudentsCache = () => {
    // Create ref to params (don't access directly in callbacks)
    const currentParams = store.queryParams;

    // Evict current params (will refetch)
    client.cache.evict({
      id: "ROOT_QUERY",
      fieldName: "students",
      args: {
        paginationArgs: currentParams.paginationArgs,
        orderBy: currentParams.orderBy,
        filterArgs: currentParams.filterArgs,
      },
    });

    // Delete all other cached variations
    client.cache.modify({
      id: "ROOT_QUERY",
      fields: {
        students(existingRef, { DELETE, storeFieldName }) {
          if (!storeFieldName) return existingRef;

          // If not current params, delete it
          if (
            !storeFieldName.includes(
              JSON.stringify(currentParams.paginationArgs)
            )
          ) {
            return DELETE;
          }

          return existingRef;
        },
      },
    });

    client.cache.gc();
  };

  // Create student mutation
  const [createMutation] = useMutation(Document.createStudentMutationDocument, {
    update() {
      evictStudentsCache();
    },
  });

  // Update student mutation
  const [updateMutation] = useMutation(
    Document.partiallyUpdateStudentMutationDocument,
    {
      optimisticResponse: vars => {
        try {
          // Read existing student from cache using fragment
          const existingStudent = client.cache.readFragment<
            Graphql.StudentQuery["student"]
          >({
            id: client.cache.identify({
              __typename: "Student",
              id: vars.input.id,
            }),
            fragment: gql`
              fragment StudentFields on Student {
                id
                name
                gender
                nationality
                dateOfBirth
                email
                phoneNumber
                createdAt
                updatedAt
              }
            `,
          });

          // Merge updates with existing data
          // Use 'in' operator to distinguish null (intentional clear) from undefined (preserve)
          const optimisticStudent = {
            __typename: "Student" as const,
            id: vars.input.id,
            name:
              "name" in vars.input
                ? (vars.input.name ?? "")
                : (existingStudent?.name ?? ""),
            gender:
              "gender" in vars.input
                ? vars.input.gender
                : (existingStudent?.gender ?? null),
            nationality:
              "nationality" in vars.input
                ? vars.input.nationality
                : (existingStudent?.nationality ?? null),
            dateOfBirth:
              "dateOfBirth" in vars.input
                ? vars.input.dateOfBirth
                : (existingStudent?.dateOfBirth ?? null),
            email:
              "email" in vars.input
                ? vars.input.email
                : (existingStudent?.email ?? null),
            phoneNumber:
              "phoneNumber" in vars.input
                ? vars.input.phoneNumber
                : (existingStudent?.phoneNumber ?? null),
            createdAt: existingStudent?.createdAt ?? null,
            updatedAt: existingStudent?.updatedAt ?? null,
          };

          return {
            __typename: "Mutation" as const,
            partiallyUpdateStudent: optimisticStudent,
          };
        } catch {
          // Fallback: return partial data only if cache read fails
          return {
            __typename: "Mutation" as const,
            partiallyUpdateStudent: {
              __typename: "Student" as const,
              id: vars.input.id,
              name: vars.input.name ?? "",
              gender: vars.input.gender ?? null,
              nationality: vars.input.nationality ?? null,
              dateOfBirth: vars.input.dateOfBirth ?? null,
              email: vars.input.email ?? null,
              phoneNumber: vars.input.phoneNumber ?? null,
              createdAt: null,
              updatedAt: null,
            },
          };
        }
      },
      update(cache, { data }) {
        if (!data?.partiallyUpdateStudent) return;
        const updatedStudent = data.partiallyUpdateStudent;

        // Defer cache update to not block UI
        setTimeout(() => {
          try {
            // Create ref to params
            const currentParams = store.queryParams;

            // Update in students query cache
            const existingData = cache.readQuery<Graphql.StudentsQuery>({
              query: Document.studentsQueryDocument,
              variables: {
                paginationArgs: currentParams.paginationArgs,
                orderBy: currentParams.orderBy,
                filterArgs: currentParams.filterArgs,
              },
            });

            if (!existingData?.students?.data) return;

            const updatedStudents = existingData.students.data.map(student =>
              student.id === updatedStudent.id ? updatedStudent : student
            );

            cache.writeQuery({
              query: Document.studentsQueryDocument,
              variables: {
                paginationArgs: currentParams.paginationArgs,
                orderBy: currentParams.orderBy,
                filterArgs: currentParams.filterArgs,
              },
              data: {
                students: {
                  ...existingData.students,
                  data: updatedStudents,
                },
              },
            });
          } catch {
            // Cache doesn't exist yet, will be populated on next query
          }
        }, 0);
      },
    }
  );

  // Delete student mutation
  const [deleteMutation] = useMutation(Document.deleteStudentMutationDocument, {
    update() {
      evictStudentsCache();
    },
  });

  return {
    createStudentMutation: createMutation,
    partialUpdateStudentMutation: updateMutation,
    deleteStudentMutation: deleteMutation,
  };
};
