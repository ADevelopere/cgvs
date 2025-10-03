"use client";

import React, { createContext, useContext, useCallback, useMemo } from "react";
import * as Graphql from "@/client/graphql/generated/gql/graphql";
import { ApolloLink } from "@apollo/client";
import { useQuery, useMutation } from "@apollo/client/react";
import * as Document from "@/client/graphql/documents";

type TemplateGraphQLContextType = {
    /**
     * Query to get a single template by ID
     * @param variables - The template query variables
     */
    templateQuery: (
        variables: Graphql.QueryTemplateArgs,
    ) => Promise<Graphql.Template>;

    /**
     * Query to get paginated templates
     * @param variables - The templates query variables
     */
    paginatedTemplatesQuery: (
        variables: Graphql.QueryTemplatesArgs,
    ) => Promise<Graphql.PaginatedTemplatesResponse>;

    templateConfigQuery: () => Promise<Graphql.TemplatesConfigs>;

    /**
     * Mutation to create a new template
     * @param variables - The creation template variables
     */
    createTemplateMutation: (
        variables: Graphql.MutationCreateTemplateArgs,
    ) => Promise<ApolloLink.Result<Graphql.CreateTemplateMutation>>;

    /**
     * Mutation to update an existing template
     * @param variables - The update template variables
     */
    updateTemplateMutation: (
        variables: Graphql.UpdateTemplateMutationVariables,
    ) => Promise<ApolloLink.Result<Graphql.UpdateTemplateMutation>>;

    /**
     * Mutation to delete a template
     * @param variables - The delete template variables
     */
    deleteTemplateMutation: (
        variables: Graphql.DeleteTemplateMutationVariables,
    ) => Promise<ApolloLink.Result<Graphql.DeleteTemplateMutation>>;

    /**
     * Mutation to move a template to the deletion category
     * @param variables - The template ID to move
     */
    suspendTemplateMutation: (
        variables: Graphql.SuspendTemplateMutationVariables,
    ) => Promise<ApolloLink.Result<Graphql.SuspendTemplateMutation>>;

    /**
     * Mutation to restore a template from the deletion category
     * @param variables - The template ID to restore
     */
    unsuspendTemplateMutation: (
        variables: Graphql.MutationUnsuspendTemplateArgs,
    ) => Promise<ApolloLink.Result<Graphql.UnsuspendTemplateMutation>>;
};

const TemplateGraphQLContext = createContext<
    TemplateGraphQLContextType | undefined
>(undefined);

export const useTemplateGraphQL = () => {
    const context = useContext(TemplateGraphQLContext);
    if (!context) {
        throw new Error(
            "useTemplateGraphQL must be used within a TemplateGraphQLProvider",
        );
    }
    return context;
};

export const TemplateGraphQLProvider: React.FC<{
    children: React.ReactNode;
}> = ({ children }) => {
    // Template queries
    const templateQueryRef = useQuery(Document.templateQueryDocument, {
        skip: true,
        variables: { id: 0 }, // Provide a default/dummy value
    });

    const templatesQueryRef = useQuery(
        Document.paginatedTemplatesQueryDocument,
        {
            skip: true,
        },
    );

    const templateConfigQueryRef = useQuery(
        Document.templatesConfigsQueryDocument,
        {
            skip: true,
        },
    );

    // Template query wrapper functions
    const templateQuery = useCallback(
        async (variables: Graphql.QueryTemplateArgs) => {
            const result = await templateQueryRef.refetch({ id: variables.id });
            if (!result.data) {
                throw new Error("No data returned from template query");
            }
            return result.data;
        },
        [templateQueryRef],
    );

    const paginatedTemplatesQuery = useCallback(
        async (variables: Graphql.QueryTemplatesArgs) => {
            const result = await templatesQueryRef.refetch(variables);
            if (!result.data) {
                throw new Error("No data returned from templates query");
            }
            return result.data;
        },
        [templatesQueryRef],
    );

    const templateConfigQuery = useCallback(async () => {
        const result = await templateConfigQueryRef.refetch();
        if (!result.data) {
            throw new Error("No data returned from template config query");
        }
        return result.data;
    }, [templateConfigQueryRef]);

    // Create template mutation
    const [mutateCreate] = useMutation(Document.createTemplateQueryDocument, {
        update(cache, { data }) {
            if (!data) return;

            const templateCategories = cache.readQuery<
                Graphql.TemplateCategory[]
            >({
                query: Document.templateCategoriesQueryDocument,
            });

            if (!templateCategories) return;

            const categoryToUpdate = templateCategories.find(
                (category) => category.id === data.category?.id,
            );

            if (!categoryToUpdate) return;

            const updatedCategories = templateCategories.map((category) => {
                if (category.id === categoryToUpdate.id) {
                    return {
                        ...category,
                        templates: [...(category.templates || []), data],
                    };
                }
                return category;
            });

            cache.writeQuery({
                query: Document.templateCategoriesQueryDocument,
                data: updatedCategories,
            });
        },
    });

    // Update template mutation
    const [mutateUpdate] = useMutation(Document.updateTemplateMutationDocument, {
        update(cache, { data }) {
            if (!data) return;

            const updatedTemplate = data;

            const templateCategories = cache.readQuery<
                Graphql.TemplateCategory[]
            >({
                query: Document.templateCategoriesQueryDocument,
            });

            if (!templateCategories) return;

            // Find the template in its original category to preserve all fields
            let existingTemplate: Partial<Graphql.Template> | null = null;
            let oldCategoryId: number | null | undefined = null;
            templateCategories.forEach((category) => {
                if (!category.templates) return;
                const found = category.templates.find(
                    (t) => t.id === updatedTemplate.id,
                );
                if (found) {
                    existingTemplate = found;
                    oldCategoryId = category.id;
                }
            });

            const updatedCategories = templateCategories.map((category) => {
                const templates = category.templates || [];

                    // If this is the new category, and it's different from the old one
                    if (
                        category.id === updatedTemplate.category?.id &&
                        oldCategoryId !== category.id
                    ) {
                        return {
                            ...category,
                            templates: [
                                ...templates,
                                {
                                    ...existingTemplate,
                                    ...data,
                                },
                            ],
                        };
                    }

                    // If this is the old category and template is moving to a new one
                    if (
                        oldCategoryId === category.id &&
                        updatedTemplate.category?.id !== category.id
                    ) {
                        return {
                            ...category,
                            templates: templates.filter(
                                (t) => t.id !== updatedTemplate.id,
                            ),
                        };
                    }

                    // If the template is staying in the same category, just update it
                    if (category.id === updatedTemplate.category?.id) {
                        return {
                            ...category,
                            templates: templates.map((template) => {
                                if (template.id === updatedTemplate.id) {
                                    return {
                                        ...template,
                                        ...data,
                                    };
                                }
                                return template;
                            }),
                        };
                    }

                    return category;
                },
            );

            cache.writeQuery({
                query: Graphql.TemplateCategoriesDocument,
                data: {
                    templateCategories: updatedCategories,
                },
            });
        },
    });

    // Delete template mutation
    const [mutateDelete] = Graphql.useDeleteTemplateMutation({
        update(cache, { data }) {
            if (!data?.deleteTemplate) return;

            const deletedTemplate = data.deleteTemplate;

            const existingData =
                cache.readQuery<Graphql.TemplateCategoriesQuery>({
                    query: Graphql.TemplateCategoriesDocument,
                });

            if (!existingData?.templateCategories) return;

            const updatedCategories = existingData.templateCategories.map(
                (category) => {
                    if (!category.templates) return category;

                    return {
                        ...category,
                        templates: category.templates.filter(
                            (template: { id: number }) =>
                                template.id !== deletedTemplate.id,
                        ),
                    };
                },
            );

            cache.writeQuery({
                query: Graphql.TemplateCategoriesDocument,
                data: {
                    templateCategories: updatedCategories,
                },
            });
        },
    });

    // Move to deletion category mutation
    const [mutateSuspendTemplate] = Graphql.useSuspendTemplateMutation({
        update(cache, { data }) {
            if (!data?.suspendTemplate) return;

            const suspendedTemplate = data.suspendTemplate;

            const existingData =
                cache.readQuery<Graphql.TemplateCategoriesQuery>({
                    query: Graphql.TemplateCategoriesDocument,
                });

            if (!existingData?.templateCategories) return;

            // Find the template in its original category to preserve all fields
            let existingTemplate: Partial<Graphql.Template> | null = null;
            existingData.templateCategories.forEach((category) => {
                if (!category.templates) return;
                const found = category.templates.find(
                    (t) => t.id === suspendedTemplate.id,
                );
                if (found) existingTemplate = found;
            });

            const updatedCategories = existingData.templateCategories.map(
                (category) => {
                    if (!category.templates) return category;

                    if (category.categorySpecialType === "Suspension") {
                        return {
                            ...category,
                            templates: [
                                ...category.templates,
                                // Merge existing template data with update data
                                {
                                    ...existingTemplate,
                                    ...data.suspendTemplate,
                                },
                            ],
                        };
                    }
                    return {
                        ...category,
                        templates: category.templates.filter(
                            (template: { id: number }) =>
                                template.id !== suspendedTemplate.id,
                        ),
                    };
                },
            );

            cache.writeQuery({
                query: Graphql.TemplateCategoriesDocument,
                data: {
                    templateCategories: updatedCategories,
                },
            });
        },
    });

    // Restore template mutation
    const [mutateUnsuspendTemplate] = Graphql.useUnsuspendTemplateMutation({
        update(cache, { data }) {
            if (!data?.unsuspendTemplate) return;

            const unsuspendedTemplate = data.unsuspendTemplate;

            const existingData =
                cache.readQuery<Graphql.TemplateCategoriesQuery>({
                    query: Graphql.TemplateCategoriesDocument,
                });

            if (!existingData?.templateCategories) return;

            // Find the template in deletion category to preserve all fields
            let existingTemplate: Partial<Graphql.Template> | null | undefined =
                null;
            const suspensionCategory = existingData.templateCategories.find(
                (cat) => cat.categorySpecialType === "Suspension",
            );
            if (suspensionCategory?.templates) {
                existingTemplate = suspensionCategory.templates.find(
                    (t) => t.id === unsuspendedTemplate.id,
                );
            }

            const updatedCategories = existingData.templateCategories.map(
                (category) => {
                    if (!category.templates) return category;

                    if (category.id === unsuspendedTemplate.category.id) {
                        return {
                            ...category,
                            templates: [
                                ...category.templates,
                                // Merge existing template data with update data
                                {
                                    ...existingTemplate,
                                    ...unsuspendedTemplate,
                                },
                            ],
                        };
                    }
                    if (category.categorySpecialType === "Suspension") {
                        return {
                            ...category,
                            templates: category.templates.filter(
                                (template: { id: number }) =>
                                    template.id !== unsuspendedTemplate.id,
                            ),
                        };
                    }
                    return category;
                },
            );

            cache.writeQuery({
                query: Graphql.TemplateCategoriesDocument,
                data: {
                    templateCategories: updatedCategories,
                },
            });
        },
    });

    // Wrapper functions for mutations
    const createTemplateMutation = useCallback(
        async (variables: Graphql.CreateTemplateMutationVariables) => {
            return mutateCreate({
                variables,
            });
        },
        [mutateCreate],
    );

    const updateTemplateMutation = useCallback(
        async (variables: Graphql.UpdateTemplateMutationVariables) => {
            return mutateUpdate({
                variables,
            });
        },
        [mutateUpdate],
    );

    const deleteTemplateMutation = useCallback(
        async (variables: Graphql.DeleteTemplateMutationVariables) => {
            return mutateDelete({
                variables,
            });
        },
        [mutateDelete],
    );

    const suspendTemplateMutation = useCallback(
        async (variables: Graphql.SuspendTemplateMutationVariables) => {
            return mutateSuspendTemplate({
                variables,
            });
        },
        [mutateSuspendTemplate],
    );

    const unsuspendTemplateMutation = useCallback(
        async (variables: Graphql.UnsuspendTemplateMutationVariables) => {
            return mutateUnsuspendTemplate({
                variables,
            });
        },
        [mutateUnsuspendTemplate],
    );

    const contextValue: TemplateGraphQLContextType = useMemo(
        () => ({
            templateQuery,
            paginatedTemplatesQuery,
            templateConfigQuery,
            createTemplateMutation,
            updateTemplateMutation,
            deleteTemplateMutation,
            suspendTemplateMutation,
            unsuspendTemplateMutation,
        }),
        [
            templateQuery,
            paginatedTemplatesQuery,
            templateConfigQuery,
            createTemplateMutation,
            updateTemplateMutation,
            deleteTemplateMutation,
            suspendTemplateMutation,
            unsuspendTemplateMutation,
        ],
    );

    return (
        <TemplateGraphQLContext.Provider value={contextValue}>
            {children}
        </TemplateGraphQLContext.Provider>
    );
};
