"use client";

import React, { createContext, useContext, useCallback, useMemo } from "react";
import { ApolloClient } from "@apollo/client";
import { useMutation, useLazyQuery } from "@apollo/client/react";
import * as Document from "@/client/graphql/documents";
import * as Graphql from "@/client/graphql/generated/gql/graphql";

type TemplateGraphQLContextType = {
  /**
   * Query to get a single template by ID
   * @param variables - The template query variables
   */
  templateQuery: (
    variables: Graphql.TemplateQueryVariables,
  ) => Promise<ApolloClient.QueryResult<Graphql.TemplateQuery>>;

  /**
   * Query to get paginated templates
   * @param variables - The templates query variables
   */
  paginatedTemplatesQuery: (
    variables: Graphql.TemplatesQueryVariables,
  ) => Promise<ApolloClient.QueryResult<Graphql.TemplatesQuery>>;

  templateConfigQuery: () => Promise<
    ApolloClient.QueryResult<Graphql.TemplatesConfigsQuery>
  >;

  /**
   * Query to get templates by category ID
   * @param variables - The category ID
   */
  templatesByCategoryIdQuery: (
    variables: Graphql.TemplatesByCategoryIdQueryVariables,
  ) => Promise<ApolloClient.QueryResult<Graphql.TemplatesByCategoryIdQuery>>;

  /**
   * Query to get all suspended templates
   */
  suspendedTemplatesQuery: () => Promise<
    ApolloClient.QueryResult<Graphql.SuspendedTemplatesQuery>
  >;

  /**
   * Mutation to create a new template
   * @param variables - The creation template variables
   */
  createTemplateMutation: (
    variables: Graphql.CreateTemplateMutationVariables,
  ) => Promise<ApolloClient.MutateResult<Graphql.CreateTemplateMutation>>;

  /**
   * Mutation to update an existing template
   * @param variables - The update template variables
   */
  updateTemplateMutation: (
    variables: Graphql.UpdateTemplateMutationVariables,
  ) => Promise<ApolloClient.MutateResult<Graphql.UpdateTemplateMutation>>;

  /**
   * Mutation to delete a template
   * @param variables - The delete template variables
   */
  deleteTemplateMutation: (
    variables: Graphql.DeleteTemplateMutationVariables,
  ) => Promise<ApolloClient.MutateResult<Graphql.DeleteTemplateMutation>>;

  /**
   * Mutation to move a template to the deletion category
   * @param variables - The template ID to move
   */
  suspendTemplateMutation: (
    variables: Graphql.SuspendTemplateMutationVariables,
  ) => Promise<ApolloClient.MutateResult<Graphql.SuspendTemplateMutation>>;

  /**
   * Mutation to restore a template from the deletion category
   * @param variables - The template ID to restore
   */
  unsuspendTemplateMutation: (
    variables: Graphql.UnsuspendTemplateMutationVariables,
  ) => Promise<ApolloClient.MutateResult<Graphql.UnsuspendTemplateMutation>>;
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
  const [executeTemplateQuery] = useLazyQuery(Document.templateQueryDocument, {
    fetchPolicy: "cache-first",
  });

  const [executePaginatedTemplatesQuery] = useLazyQuery(
    Document.paginatedTemplatesQueryDocument,
    {
      fetchPolicy: "cache-first",
    },
  );

  const [executeTemplateConfigQuery] = useLazyQuery(
    Document.templatesConfigsQueryDocument,
    {
      fetchPolicy: "cache-first",
    },
  );

  const [executeTemplatesByCategoryIdQuery] = useLazyQuery(
    Document.templatesByCategoryIdQueryDocument,
    {
      fetchPolicy: "cache-first",
    },
  );

  const [executeSuspendedTemplatesQuery] = useLazyQuery(
    Document.suspendedTemplatesQueryDocument,
    {
      fetchPolicy: "cache-first",
    },
  );

  // Template query wrapper functions
  const templateQuery = useCallback(
    async (variables: Graphql.QueryTemplateArgs) => {
      return executeTemplateQuery({
        variables: { id: variables.id },
      });
    },
    [executeTemplateQuery],
  );

  const paginatedTemplatesQuery = useCallback(
    async (variables: Graphql.QueryTemplatesArgs) => {
      return executePaginatedTemplatesQuery({ variables });
    },
    [executePaginatedTemplatesQuery],
  );

  const templateConfigQuery = useCallback(async () => {
    return executeTemplateConfigQuery();
  }, [executeTemplateConfigQuery]);

  const templatesByCategoryIdQuery = useCallback(
    async (variables: Graphql.TemplatesByCategoryIdQueryVariables) => {
      return executeTemplatesByCategoryIdQuery({ variables });
    },
    [executeTemplatesByCategoryIdQuery],
  );

  const suspendedTemplatesQuery = useCallback(async () => {
    return executeSuspendedTemplatesQuery();
  }, [executeSuspendedTemplatesQuery]);

  // Create template mutation
  const [mutateCreate] = useMutation(Document.createTemplateQueryDocument, {
    update(cache, { data }) {
      if (!data?.createTemplate) return;
      const createdTemplate = data.createTemplate;

      const categoryId = createdTemplate.category?.id;

      // Category must exist
      if (!categoryId) {
        throw new Error(
          `Category not found for created template ${createdTemplate.id}. Template must have a valid category.`,
        );
      }

      // Update the templatesByCategoryId cache
      try {
        const categoryTemplatesData = cache.readQuery<Graphql.TemplatesByCategoryIdQuery>({
          query: Document.templatesByCategoryIdQueryDocument,
          variables: { categoryId },
        });

        if (categoryTemplatesData?.templatesByCategoryId) {
          cache.writeQuery({
            query: Document.templatesByCategoryIdQueryDocument,
            variables: { categoryId },
            data: {
              templatesByCategoryId: [
                ...categoryTemplatesData.templatesByCategoryId,
                createdTemplate,
              ],
            },
          });
        }
      } catch {
        // Templates might not be in cache yet, that's okay
      }
    },
  });

  // Update template mutation
  const [mutateUpdate] = useMutation(Document.updateTemplateMutationDocument, {
    update(cache, { data }) {
      if (!data?.updateTemplate) return;

      const updatedTemplate = data.updateTemplate;

      // First, get the old template to check the old category ID
      // Template must exist in cache when updating
      const existingTemplateData = cache.readQuery<Graphql.TemplateQuery>({
        query: Document.templateQueryDocument,
        variables: { id: updatedTemplate.id },
      });

      if (!existingTemplateData?.template) {
        throw new Error(
          `Template with id ${updatedTemplate.id} not found in cache. Template must be in cache before updating.`,
        );
      }

      const oldTemplate = existingTemplateData.template;
      const oldCategoryId = oldTemplate.category?.id;
      const newCategoryId = updatedTemplate.category?.id;

      // Both categories must exist
      if (!oldCategoryId) {
        throw new Error(
          `Old category not found for template ${updatedTemplate.id}. Template must have a valid category.`,
        );
      }

      if (!newCategoryId) {
        throw new Error(
          `New category not found in update data for template ${updatedTemplate.id}. Template must have a valid category.`,
        );
      }

      const newTemplate: Graphql.Template = {
        ...oldTemplate,
        ...updatedTemplate,
      };

      // Update the template query cache
      cache.writeQuery({
        query: Document.templateQueryDocument,
        variables: { id: updatedTemplate.id },
        data: {
          template: newTemplate,
        },
      });

      // If category hasn't changed, update the category's templates cache
      if (oldCategoryId === newCategoryId) {
        try {
          const categoryTemplatesData = cache.readQuery<Graphql.TemplatesByCategoryIdQuery>({
            query: Document.templatesByCategoryIdQueryDocument,
            variables: { categoryId: newCategoryId },
          });

          if (categoryTemplatesData?.templatesByCategoryId) {
            const updatedTemplates = categoryTemplatesData.templatesByCategoryId.map(
              (t: Graphql.Template) => (t.id === updatedTemplate.id ? newTemplate : t)
            );

            cache.writeQuery({
              query: Document.templatesByCategoryIdQueryDocument,
              variables: { categoryId: newCategoryId },
              data: {
                templatesByCategoryId: updatedTemplates,
              },
            });
          }
        } catch {
          // Templates might not be in cache, that's okay
        }
        return;
      }

      // Category has changed, update both categories' template caches
      if (oldCategoryId !== newCategoryId) {
        // Update old category - remove the template
        try {
          const oldCategoryTemplatesData =
            cache.readQuery<Graphql.TemplatesByCategoryIdQuery>({
              query: Document.templatesByCategoryIdQueryDocument,
              variables: { categoryId: oldCategoryId },
            });

          if (oldCategoryTemplatesData?.templatesByCategoryId) {
            const updatedTemplates =
              oldCategoryTemplatesData.templatesByCategoryId.filter(
                (t: Graphql.Template) => t.id !== updatedTemplate.id,
              );

            cache.writeQuery({
              query: Document.templatesByCategoryIdQueryDocument,
              variables: { categoryId: oldCategoryId },
              data: {
                templatesByCategoryId: updatedTemplates,
              },
            });
          }
        } catch {
          // Old category templates might not be in cache, that's okay
        }

        // Update new category - add the template
        try {
          const newCategoryTemplatesData =
            cache.readQuery<Graphql.TemplatesByCategoryIdQuery>({
              query: Document.templatesByCategoryIdQueryDocument,
              variables: { categoryId: newCategoryId },
            });

          if (newCategoryTemplatesData?.templatesByCategoryId) {
            cache.writeQuery({
              query: Document.templatesByCategoryIdQueryDocument,
              variables: { categoryId: newCategoryId },
              data: {
                templatesByCategoryId: [
                  ...newCategoryTemplatesData.templatesByCategoryId,
                  newTemplate,
                ],
              },
            });
          }
        } catch {
          // New category templates might not be in cache, that's okay
        }
      }
    },
  });

  // Delete template mutation
  const [mutateDelete] = useMutation(Document.deleteTemplateMutationDocument, {
    update(cache, { data }) {
      if (!data?.deleteTemplate) return;

      const deletedTemplate = data.deleteTemplate;
      const categoryId = deletedTemplate.category?.id;

      // Category must exist
      if (!categoryId) {
        throw new Error(
          `Category not found for deleted template ${deletedTemplate.id}. Template must have a valid category.`,
        );
      }

      // Update the templatesByCategoryId cache
      try {
        const categoryTemplatesData = cache.readQuery<Graphql.TemplatesByCategoryIdQuery>({
          query: Document.templatesByCategoryIdQueryDocument,
          variables: { categoryId },
        });

        if (categoryTemplatesData?.templatesByCategoryId) {
          const updatedTemplates =
            categoryTemplatesData.templatesByCategoryId.filter(
              (template: Graphql.Template) =>
                template.id !== deletedTemplate.id,
            );

          cache.writeQuery({
            query: Document.templatesByCategoryIdQueryDocument,
            variables: { categoryId },
            data: {
              templatesByCategoryId: updatedTemplates,
            },
          });
        }
      } catch {
        // Templates might not be in cache, that's okay
      }
    },
  });

  // Move to deletion category mutation
  const [mutateSuspendTemplate] = useMutation(
    Document.suspendTemplateMutationDocument,
    {
      update(cache, { data }) {
        if (!data?.suspendTemplate) return;

        const suspendedTemplate = data.suspendTemplate;

        // Use preSuspensionCategory from the suspended template
        const oldCategoryId = suspendedTemplate.preSuspensionCategory?.id;

        // Old category must exist
        if (!oldCategoryId) {
          throw new Error(
            `PreSuspensionCategory not found for template ${suspendedTemplate.id}. Template must have a valid preSuspensionCategory.`,
          );
        }

        // Remove template from old category's templatesByCategoryId cache
        try {
          const oldCategoryTemplatesData =
            cache.readQuery<Graphql.TemplatesByCategoryIdQuery>({
              query: Document.templatesByCategoryIdQueryDocument,
              variables: { categoryId: oldCategoryId },
            });

          if (oldCategoryTemplatesData?.templatesByCategoryId) {
            const updatedTemplates =
              oldCategoryTemplatesData.templatesByCategoryId.filter(
                (t: Graphql.Template) => t.id !== suspendedTemplate.id,
              );

            cache.writeQuery({
              query: Document.templatesByCategoryIdQueryDocument,
              variables: { categoryId: oldCategoryId },
              data: {
                templatesByCategoryId: updatedTemplates,
              },
            });
          }
        } catch {
          // Old category templates might not be in cache, that's okay
        }

        // Add template to suspended templates cache
        try {
          const suspendedTemplatesData =
            cache.readQuery<Graphql.SuspendedTemplatesQuery>({
              query: Document.suspendedTemplatesQueryDocument,
            });

          if (suspendedTemplatesData?.suspendedTemplates) {
            cache.writeQuery({
              query: Document.suspendedTemplatesQueryDocument,
              data: {
                suspendedTemplates: [
                  ...suspendedTemplatesData.suspendedTemplates,
                  suspendedTemplate,
                ],
              },
            });
          }
        } catch {
          // Suspended templates might not be in cache yet, that's okay
        }
      },
    },
  );

  // Restore template mutation
  const [mutateUnsuspendTemplate] = useMutation(
    Document.unsuspendTemplateMutationDocument,
    {
      update(cache, { data }) {
        if (!data?.unsuspendTemplate) return;

        const unsuspendedTemplate = data.unsuspendTemplate;

        // Get the destination category ID from the unsuspended template
        const newCategoryId = unsuspendedTemplate.category?.id;

        // Destination category must exist
        if (!newCategoryId) {
          throw new Error(
            `Destination category not found for template ${unsuspendedTemplate.id}. Template must have a valid category for unsuspension.`,
          );
        }

        // Remove template from suspended templates cache
        try {
          const suspendedTemplatesData =
            cache.readQuery<Graphql.SuspendedTemplatesQuery>({
              query: Document.suspendedTemplatesQueryDocument,
            });

          if (suspendedTemplatesData?.suspendedTemplates) {
            const updatedTemplates = suspendedTemplatesData.suspendedTemplates.filter(
              (t: Graphql.Template) => t.id !== unsuspendedTemplate.id
            );

            cache.writeQuery({
              query: Document.suspendedTemplatesQueryDocument,
              data: {
                suspendedTemplates: updatedTemplates,
              },
            });
          }
        } catch {
          // Suspended templates might not be in cache, that's okay
        }

        // Add template to destination category's templatesByCategoryId cache
        try {
          const newCategoryTemplatesData =
            cache.readQuery<Graphql.TemplatesByCategoryIdQuery>({
              query: Document.templatesByCategoryIdQueryDocument,
              variables: { categoryId: newCategoryId },
            });

          if (newCategoryTemplatesData?.templatesByCategoryId) {
            cache.writeQuery({
              query: Document.templatesByCategoryIdQueryDocument,
              variables: { categoryId: newCategoryId },
              data: {
                templatesByCategoryId: [
                  ...newCategoryTemplatesData.templatesByCategoryId,
                  unsuspendedTemplate,
                ],
              },
            });
          }
        } catch {
          // Destination category templates might not be in cache, that's okay
        }
      },
    },
  );

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
      templatesByCategoryIdQuery,
      suspendedTemplatesQuery,
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
      templatesByCategoryIdQuery,
      suspendedTemplatesQuery,
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
