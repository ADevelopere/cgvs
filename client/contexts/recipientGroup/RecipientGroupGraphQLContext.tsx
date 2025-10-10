"use client";

import { createContext, useCallback, useContext, useMemo } from "react";
import * as Graphql from "@/client/graphql/generated/gql/graphql";
import * as Document from "@/client/graphql/documents";
import { ApolloLink } from "@apollo/client";
import { useQuery, useMutation } from "@apollo/client/react";

type RecipientGroupGraphQLContextType = {
    /**
     * Query to get recipient groups by template ID
     * @param variables - The query variables
     */
    templateRecipientGroupsByTemplateIdQuery: (
        variables: Graphql.TemplateRecipientGroupsByTemplateIdQueryVariables,
    ) => Promise<Graphql.TemplateRecipientGroupsByTemplateIdQuery>;

    /**
     * Mutation to create a new recipient group
     * @param variables - The creation recipient group variables
     */
    createTemplateRecipientGroupMutation: (
        variables: Graphql.CreateTemplateRecipientGroupMutationVariables,
    ) => Promise<
        ApolloLink.Result<Graphql.CreateTemplateRecipientGroupMutation>
    >;

    /**
     * Mutation to update an existing recipient group
     * @param variables - The update recipient group variables
     */
    updateTemplateRecipientGroupMutation: (
        variables: Graphql.UpdateTemplateRecipientGroupMutationVariables,
    ) => Promise<
        ApolloLink.Result<Graphql.UpdateTemplateRecipientGroupMutation>
    >;

    /**
     * Mutation to delete a recipient group
     * @param variables - The delete recipient group variables
     */
    deleteTemplateRecipientGroupMutation: (
        variables: Graphql.DeleteTemplateRecipientGroupMutationVariables,
    ) => Promise<
        ApolloLink.Result<Graphql.DeleteTemplateRecipientGroupMutation>
    >;
};

const RecipientGroupGraphQLContext = createContext<
    RecipientGroupGraphQLContextType | undefined
>(undefined);

export const useRecipientGroupGraphQL = () => {
    const context = useContext(RecipientGroupGraphQLContext);
    if (!context) {
        throw new Error(
            "useRecipientGroupGraphQL must be used within a RecipientGroupGraphQLProvider",
        );
    }
    return context;
};

export const RecipientGroupGraphQLProvider: React.FC<{
    children: React.ReactNode;
    templateId: number;
}> = ({ children, templateId }) => {
    // Query for recipient groups by template ID
    const recipientGroupsQueryRef = useQuery(
        Document.templateRecipientGroupsByTemplateIdQueryDocument,
        {
            skip: true,
            variables: { templateId },
        },
    );

    // Query wrapper function
    const templateRecipientGroupsByTemplateIdQuery = useCallback(
        async (
            variables: Graphql.TemplateRecipientGroupsByTemplateIdQueryVariables,
        ) => {
            const result = await recipientGroupsQueryRef.refetch({
                templateId: variables.templateId,
            });
            if (!result.data) {
                throw new Error(
                    "No data returned from recipient groups query",
                );
            }
            return result.data;
        },
        [recipientGroupsQueryRef],
    );

    // Create recipient group mutation
    const [mutateCreate] = useMutation(
        Document.createTemplateRecipientGroupMutationDocument,
        {
            update(cache, { data }) {
                if (!data?.createTemplateRecipientGroup) return;

                const existingData = cache.readQuery<Graphql.TemplateQuery>({
                    query: Document.templateQueryDocument,
                    variables: { id: templateId },
                });

                if (!existingData?.template) return;

                // Add the new recipient group to the template's recipientGroups array
                cache.writeQuery({
                    query: Document.templateQueryDocument,
                    variables: { id: templateId },
                    data: {
                        template: {
                            ...existingData.template,
                            recipientGroups: [
                                ...(existingData.template.recipientGroups || []),
                                data.createTemplateRecipientGroup,
                            ],
                        },
                    },
                });
            },
        },
    );

    // Update recipient group mutation
    const [mutateUpdate] = useMutation(
        Document.updateTemplateRecipientGroupMutationDocument,
        {
            update(cache, { data }) {
                if (!data?.updateTemplateRecipientGroup) return;
                const updatedRecipientGroup = data.updateTemplateRecipientGroup;

                const existingData = cache.readQuery<Graphql.TemplateQuery>({
                    query: Document.templateQueryDocument,
                    variables: { id: templateId },
                });

                if (!existingData?.template?.recipientGroups) return;

                // Update the recipient group in the template's recipientGroups array
                const updatedRecipientGroups =
                    existingData.template.recipientGroups.map(
                        (recipientGroup) =>
                            recipientGroup.id === updatedRecipientGroup.id
                                ? updatedRecipientGroup
                                : recipientGroup,
                    );

                cache.writeQuery({
                    query: Document.templateQueryDocument,
                    variables: { id: templateId },
                    data: {
                        template: {
                            ...existingData.template,
                            recipientGroups: updatedRecipientGroups,
                        },
                    },
                });
            },
        },
    );

    // Delete recipient group mutation
    const [mutateDelete] = useMutation(
        Document.deleteTemplateRecipientGroupMutationDocument,
        {
            update(cache, { data }) {
                if (!data?.deleteTemplateRecipientGroup) return;
                const deletedRecipientGroup = data.deleteTemplateRecipientGroup;

                const existingData = cache.readQuery<Graphql.TemplateQuery>({
                    query: Document.templateQueryDocument,
                    variables: { id: templateId },
                });

                if (!existingData?.template?.recipientGroups) return;

                // Remove the recipient group from the template's recipientGroups array
                const updatedRecipientGroups =
                    existingData.template.recipientGroups.filter(
                        (recipientGroup) =>
                            recipientGroup.id !== deletedRecipientGroup.id,
                    );

                cache.writeQuery({
                    query: Document.templateQueryDocument,
                    variables: { id: templateId },
                    data: {
                        template: {
                            ...existingData.template,
                            recipientGroups: updatedRecipientGroups,
                        },
                    },
                });
            },
        },
    );

    const createTemplateRecipientGroupMutation = useCallback(
        (
            variables: Graphql.CreateTemplateRecipientGroupMutationVariables,
        ) => {
            return mutateCreate({ variables });
        },
        [mutateCreate],
    );

    const updateTemplateRecipientGroupMutation = useCallback(
        (
            variables: Graphql.UpdateTemplateRecipientGroupMutationVariables,
        ) => {
            return mutateUpdate({ variables });
        },
        [mutateUpdate],
    );

    const deleteTemplateRecipientGroupMutation = useCallback(
        (
            variables: Graphql.DeleteTemplateRecipientGroupMutationVariables,
        ) => {
            return mutateDelete({ variables });
        },
        [mutateDelete],
    );

    const contextValue = useMemo(
        () => ({
            templateRecipientGroupsByTemplateIdQuery,
            createTemplateRecipientGroupMutation,
            updateTemplateRecipientGroupMutation,
            deleteTemplateRecipientGroupMutation,
        }),
        [
            templateRecipientGroupsByTemplateIdQuery,
            createTemplateRecipientGroupMutation,
            updateTemplateRecipientGroupMutation,
            deleteTemplateRecipientGroupMutation,
        ],
    );

    return (
        <RecipientGroupGraphQLContext.Provider value={contextValue}>
            {children}
        </RecipientGroupGraphQLContext.Provider>
    );
};

