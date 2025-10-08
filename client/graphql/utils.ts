"use client";

import { useCallback } from "react";
import { ApolloClient, ErrorLike, OperationVariables } from "@apollo/client";
import * as ApolloReact from "@apollo/client/react";
import logger from "@/lib/logger";

export function useQueryWrapper<T, V extends OperationVariables>(
    lazyQueryResult: ApolloReact.useLazyQuery.ResultTuple<T, V>,
) {
    const [execute] = lazyQueryResult;
    return useCallback(
        async (variables: V) => {
            const result = await execute({ variables }).catch((err) => {
                logger.warn("Error executing query:", err);
                throw err;
            });
            if (result.error) {
                logger.warn("Error executing query:", result.error);
                throw result.error;
            }
            if (!result.data) {
                throw new Error("No data returned from query");
            }
            return result.data;
        },
        [execute],
    );
}

export function useMutationWrapper<T, V extends OperationVariables>(
    mutationResult: ApolloReact.useMutation.ResultTuple<T, V>,
) {
    const [mutate] = mutationResult;
    return useCallback(
        async (variables: V) => {
            const result: ApolloClient.MutateResult<T> = await mutate({
                variables,
            });
            const error: ErrorLike | undefined = result.error;
            if (error) {
                logger.warn("Error executing mutation:", error);
                throw new Error(error.message);
            }
            if (!result.data) {
                throw new Error("No data returned from mutation");
            }
            return result.data;
        },
        [mutate],
    );
}
