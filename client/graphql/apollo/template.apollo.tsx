"use client";

import React, { createContext, useContext, useCallback, useMemo } from "react";
import { ApolloClient } from "@apollo/client";
import { useMutation, useLazyQuery } from "@apollo/client/react";
import * as Document from "@/client/graphql/documents";
import * as Graphql from "@/client/graphql/generated/gql/graphql";
import logger from "@/lib/logger";

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

      // Update the category cache using single category query by ID
      try {
        const categoryData = cache.readQuery<Graphql.TemplateCategoryQuery>({
          query: Document.templateCategoryQueryDocument,
          variables: { id: categoryId },
        });

        if (categoryData?.templateCategory) {
          cache.writeQuery({
            query: Document.templateCategoryQueryDocument,
            variables: { id: categoryId },
            data: {
              templateCategory: {
                ...categoryData.templateCategory,
                templates: [
                  ...(categoryData.templateCategory.templates || []),
                  createdTemplate,
                ],
              },
            },
          });
        }
      } catch {
        // Category might not be in cache, that's okay
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

      // If category hasn't changed, only update the template query cache
      if (oldCategoryId === newCategoryId) {
        cache.writeQuery({
          query: Document.templateQueryDocument,
          variables: { id: updatedTemplate.id },
          data: {
            template: newTemplate,
          },
        });
        return;
      }

      // Category has changed, update only the two specific categories of concern
      // using single category queries by ID
      if (oldCategoryId !== newCategoryId) {
        // Update old category - remove the template
        try {
          const oldCategoryData =
            cache.readQuery<Graphql.TemplateCategoryQuery>({
              query: Document.templateCategoryQueryDocument,
              variables: { id: oldCategoryId },
            });

          if (oldCategoryData?.templateCategory) {
            const updatedTemplates =
              oldCategoryData.templateCategory.templates?.filter(
                (t: Graphql.Template) => t.id !== updatedTemplate.id,
              );

            cache.writeQuery({
              query: Document.templateCategoryQueryDocument,
              variables: { id: oldCategoryId },
              data: {
                templateCategory: {
                  ...oldCategoryData.templateCategory,
                  templates: updatedTemplates,
                },
              },
            });
          }
        } catch {
          // Old category might not be in cache, that's okay
        }

        // Update new category - add the template
        try {
          const newCategoryData =
            cache.readQuery<Graphql.TemplateCategoryQuery>({
              query: Document.templateCategoryQueryDocument,
              variables: { id: newCategoryId },
            });

          if (newCategoryData?.templateCategory) {
            cache.writeQuery({
              query: Document.templateCategoryQueryDocument,
              variables: { id: newCategoryId },
              data: {
                templateCategory: {
                  ...newCategoryData.templateCategory,
                  templates: [
                    ...(newCategoryData.templateCategory.templates || []),
                    newTemplate,
                  ],
                },
              },
            });
          }
        } catch {
          // New category might not be in cache, that's okay
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

      // Update the category cache using single category query by ID
      try {
        const categoryData = cache.readQuery<Graphql.TemplateCategoryQuery>({
          query: Document.templateCategoryQueryDocument,
          variables: { id: categoryId },
        });

        if (categoryData?.templateCategory) {
          const updatedTemplates =
            categoryData.templateCategory.templates?.filter(
              (template: Graphql.Template) =>
                template.id !== deletedTemplate.id,
            );

          cache.writeQuery({
            query: Document.templateCategoryQueryDocument,
            variables: { id: categoryId },
            data: {
              templateCategory: {
                ...categoryData.templateCategory,
                templates: updatedTemplates,
              },
            },
          });
        }
      } catch {
        // Category might not be in cache, that's okay
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

        // Remove template from old category using category query by ID
        try {
          const oldCategoryData =
            cache.readQuery<Graphql.TemplateCategoryQuery>({
              query: Document.templateCategoryQueryDocument,
              variables: { id: oldCategoryId },
            });

          if (oldCategoryData?.templateCategory) {
            const updatedTemplates =
              oldCategoryData.templateCategory.templates?.filter(
                (t: Graphql.Template) => t.id !== suspendedTemplate.id,
              );

            cache.writeQuery({
              query: Document.templateCategoryQueryDocument,
              variables: { id: oldCategoryId },
              data: {
                templateCategory: {
                  ...oldCategoryData.templateCategory,
                  templates: updatedTemplates,
                },
              },
            });
          }
        } catch {
          // Old category might not be in cache, that's okay
        }

        // Add template to suspension category using suspension query
        let suspensionCategoryUpdated = false;
        try {
          const suspensionCategoryData =
            cache.readQuery<Graphql.SuspensionTemplateCategoryQuery>({
              query: Document.suspenionTemplateCategoryQueryDocument,
            });

          if (suspensionCategoryData?.suspensionTemplateCategory) {
            cache.writeQuery({
              query: Document.suspenionTemplateCategoryQueryDocument,
              data: {
                suspensionTemplateCategory: {
                  ...suspensionCategoryData.suspensionTemplateCategory,
                  templates: [
                    ...(suspensionCategoryData.suspensionTemplateCategory
                      .templates || []),
                    suspendedTemplate,
                  ],
                },
              },
            });
            suspensionCategoryUpdated = true;
          }
        } catch {
          // Suspension category might not be in cache using suspension query
        }

        // Fallback: If suspension category not found using suspension query,
        // try finding it using full template categories document
        if (!suspensionCategoryUpdated) {
          try {
            logger.warn(
              "Suspension category not found using suspenionTemplateCategoryQueryDocument, falling back to templateCategoriesDocument",
            );

            const existingData =
              cache.readQuery<Graphql.TemplateCategoriesQuery>({
                query: Graphql.TemplateCategoriesDocument,
              });

            if (existingData?.templateCategories) {
              const suspensionCategory = existingData.templateCategories.find(
                (category) => category.specialType === "Suspension",
              );

              if (suspensionCategory) {
                const updatedCategories = existingData.templateCategories.map(
                  (category) => {
                    if (category.specialType === "Suspension") {
                      return {
                        ...category,
                        templates: [
                          ...(category.templates || []),
                          suspendedTemplate,
                        ],
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
              }
            }
          } catch (error) {
            logger.error(
              "Failed to update suspension category using templateCategoriesDocument:",
              error,
            );
          }
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

        // Remove template from suspension category using suspension query
        let suspensionCategoryUpdated = false;
        try {
          const suspensionCategoryData =
            cache.readQuery<Graphql.SuspensionTemplateCategoryQuery>({
              query: Document.suspenionTemplateCategoryQueryDocument,
            });

          if (suspensionCategoryData?.suspensionTemplateCategory) {
            const updatedTemplates = (
              suspensionCategoryData.suspensionTemplateCategory.templates || []
            ).filter((t: Graphql.Template) => t.id !== unsuspendedTemplate.id);

            cache.writeQuery({
              query: Document.suspenionTemplateCategoryQueryDocument,
              data: {
                suspensionTemplateCategory: {
                  ...suspensionCategoryData.suspensionTemplateCategory,
                  templates: updatedTemplates,
                },
              },
            });
            suspensionCategoryUpdated = true;
          }
        } catch {
          // Suspension category might not be in cache using suspension query
        }

        // Fallback: If suspension category not found using suspension query,
        // try finding it using full template categories document
        if (!suspensionCategoryUpdated) {
          try {
            logger.warn(
              "Suspension category not found using suspenionTemplateCategoryQueryDocument for unsuspend, falling back to templateCategoriesDocument",
            );

            const existingData =
              cache.readQuery<Graphql.TemplateCategoriesQuery>({
                query: Graphql.TemplateCategoriesDocument,
              });

            if (existingData?.templateCategories) {
              const suspensionCategory = existingData.templateCategories.find(
                (category) => category.specialType === "Suspension",
              );

              if (suspensionCategory) {
                const updatedCategories = existingData.templateCategories.map(
                  (category) => {
                    if (category.specialType === "Suspension") {
                      return {
                        ...category,
                        templates: (category.templates || []).filter(
                          (template) => template.id !== unsuspendedTemplate.id,
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
              }
            }
          } catch (error) {
            logger.error(
              "Failed to update suspension category using templateCategoriesDocument for unsuspend:",
              error,
            );
          }
        }

        // Add template to destination category using category query by ID
        try {
          const newCategoryData =
            cache.readQuery<Graphql.TemplateCategoryQuery>({
              query: Document.templateCategoryQueryDocument,
              variables: { id: newCategoryId },
            });

          if (newCategoryData?.templateCategory) {
            cache.writeQuery({
              query: Document.templateCategoryQueryDocument,
              variables: { id: newCategoryId },
              data: {
                templateCategory: {
                  ...newCategoryData.templateCategory,
                  templates: [
                    ...(newCategoryData.templateCategory.templates || []),
                    unsuspendedTemplate,
                  ],
                },
              },
            });
          }
        } catch {
          // Destination category might not be in cache, that's okay
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
