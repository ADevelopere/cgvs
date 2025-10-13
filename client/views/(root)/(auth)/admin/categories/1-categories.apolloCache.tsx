"use client";

import React from "react";
import { ApolloCache, gql } from "@apollo/client";
import * as Document from "./0-categories.documents";
import * as Graphql from "@/client/graphql/generated/gql/graphql";
import { useMutation } from "@apollo/client/react";
import { templateQueryDocument } from "@/client/graphql/documents";

type TemplateCategoryGraphQLContextType = {
  /**
   * Mutation to create a new template category
   * @param variables - The create template category variables
   */
  createTemplateCategoryMutation: useMutation.MutationFunction<
    Graphql.CreateTemplateCategoryMutation,
    {
      input: Graphql.TemplateCategoryCreateInput;
    },
    ApolloCache
  >;

  /**
   * Mutation to update an existing template category
   * @param variables - The update template category variables
   */
  updateTemplateCategoryMutation: useMutation.MutationFunction<
    Graphql.UpdateTemplateCategoryMutation,
    {
      input: Graphql.TemplateCategoryUpdateInput;
    },
    ApolloCache
  >;

  /**
   * Mutation to delete a template category
   * @param variables - The delete template category variables
   */
  deleteTemplateCategoryMutation: useMutation.MutationFunction<
    Graphql.DeleteTemplateCategoryMutation,
    {
      id: Graphql.Scalars["Int"]["input"];
    },
    ApolloCache
  >;

  createTemplateMutation: useMutation.MutationFunction<
    Graphql.CreateTemplateMutation,
    {
      input: Graphql.TemplateCreateInput;
    },
    ApolloCache
  >;

  updateTemplateMutation: useMutation.MutationFunction<
    Graphql.UpdateTemplateMutation,
    {
      input: Graphql.TemplateUpdateInput;
    },
    ApolloCache
  >;

  deleteTemplateMutation: useMutation.MutationFunction<
    Graphql.DeleteTemplateMutation,
    {
      id: Graphql.Scalars["Int"]["input"];
    },
    ApolloCache
  >;

  suspendTemplateMutation: useMutation.MutationFunction<
    Graphql.SuspendTemplateMutation,
    {
      id: Graphql.Scalars["Int"]["input"];
    },
    ApolloCache
  >;

  unsuspendTemplateMutation: useMutation.MutationFunction<
    Graphql.UnsuspendTemplateMutation,
    {
      id: Graphql.Scalars["Int"]["input"];
    },
    ApolloCache
  >;
};

const TemplateCategoryGraphQLContext = React.createContext<
  TemplateCategoryGraphQLContextType | undefined
>(undefined);

export const useTemplateCategoryGraphQL = () => {
  const context = React.useContext(TemplateCategoryGraphQLContext);
  if (!context) {
    throw new Error(
      "useTemplateCategoryGraphQL must be used within a TemplateCategoryGraphQLProvider",
    );
  }
  return context;
};

export const TemplateCategoryGraphQLProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  // Create category mutation - simplified with cache.updateQuery
  const [createTemplateCategoryMutation] = useMutation(
    Document.createTemplateCategoryMutationDocument,
    {
      update(cache, { data }) {
        if (!data?.createTemplateCategory) return;
        const newCategory = data.createTemplateCategory;
        const parentId = newCategory.parentCategory?.id;

        // Add to parent's children query cache (null for root categories)
        cache.updateQuery<Graphql.CategoryChildrenQuery>(
          {
            query: Document.categoryChildrenQueryDocument,
            variables: { parentCategoryId: parentId ?? null },
          },
          (existing) => {
            if (!existing?.categoryChildren) return existing;
            return {
              categoryChildren: [...existing.categoryChildren, newCategory],
            };
          },
        );
      },
    },
  );

  // Update category mutation - simplified with cache.updateQuery
  const [updateTemplateCategoryMutation] = useMutation(
    Document.updateTemplateCategoryMutationDocument,
    {
      update(cache, { data }) {
        if (!data?.updateTemplateCategory) return;
        const updated = data.updateTemplateCategory;
        const newParentId = updated.parentCategory?.id;

        // Get old parent to detect changes
        const oldCat = cache.readFragment<{
          parentCategory?: { id: number } | null;
        }>({
          id: cache.identify({
            __typename: "TemplateCategory",
            id: updated.id,
          }),
          fragment: gql`
            fragment Old on TemplateCategory {
              parentCategory {
                id
              }
            }
          `,
        });
        const oldParentId = oldCat?.parentCategory?.id;

        if (oldParentId === newParentId) {
          // Same parent - update in place
          cache.updateQuery<Graphql.CategoryChildrenQuery>(
            {
              query: Document.categoryChildrenQueryDocument,
              variables: { parentCategoryId: newParentId ?? null },
            },
            (existing) => {
              if (!existing?.categoryChildren) return existing;
              return {
                categoryChildren: existing.categoryChildren.map((c) =>
                  c.id === updated.id ? { ...c, ...updated } : c,
                ),
              };
            },
          );
        } else {
          // Parent changed - remove from old, add to new
          // Remove from old parent
          cache.updateQuery<Graphql.CategoryChildrenQuery>(
            {
              query: Document.categoryChildrenQueryDocument,
              variables: { parentCategoryId: oldParentId ?? null },
            },
            (existing) => {
              if (!existing?.categoryChildren) return existing;
              return {
                categoryChildren: existing.categoryChildren.filter(
                  (c) => c.id !== updated.id,
                ),
              };
            },
          );

          // Add to new parent
          cache.updateQuery<Graphql.CategoryChildrenQuery>(
            {
              query: Document.categoryChildrenQueryDocument,
              variables: { parentCategoryId: newParentId ?? null },
            },
            (existing) => {
              if (!existing?.categoryChildren) return existing;
              return {
                categoryChildren: [...existing.categoryChildren, updated],
              };
            },
          );
        }
      },
    },
  );

  // Delete category mutation - simplified with cache.updateQuery
  const [deleteTemplateCategoryMutation] = useMutation(
    Document.deleteTemplateCategoryMutationDocument,
    {
      update(cache, { data }) {
        if (!data?.deleteTemplateCategory) return;
        const deleted = data.deleteTemplateCategory;
        const parentId = deleted.parentCategory?.id;

        // Remove from parent's children query (null for root categories)
        cache.updateQuery<Graphql.CategoryChildrenQuery>(
          {
            query: Document.categoryChildrenQueryDocument,
            variables: { parentCategoryId: parentId ?? null },
          },
          (existing) => {
            if (!existing?.categoryChildren) return existing;
            return {
              categoryChildren: existing.categoryChildren.filter(
                (c) => c.id !== deleted.id,
              ),
            };
          },
        );
      },
    },
  );

  // Create template mutation
  const [createTemplateMutation] = useMutation(
    Document.createTemplateQueryDocument,
    {
      update(cache, { data }) {
        if (!data?.createTemplate) return;
        const createdTemplate = data.createTemplate;

        const categoryId = createdTemplate.category?.id;

        // Skip if category doesn't exist
        if (!categoryId) {
          return;
        }

        // Update the templatesByCategoryId cache
        try {
          const categoryTemplatesData =
            cache.readQuery<Graphql.TemplatesByCategoryIdQuery>({
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
    },
  );

  // Update template mutation
  const [updateTemplateMutation] = useMutation(
    Document.updateTemplateMutationDocument,
    {
      update(cache, { data }) {
        if (!data?.updateTemplate) return;

        const updatedTemplate = data.updateTemplate;

        // First, get the old template to check the old category ID
        // Only update if template exists in cache
        let existingTemplateData: Graphql.TemplateQuery | null = null;
        try {
          existingTemplateData = cache.readQuery<Graphql.TemplateQuery>({
            query: templateQueryDocument,
            variables: { id: updatedTemplate.id },
          });
        } catch {
          // Template not in cache, skip update
          return;
        }

        if (!existingTemplateData?.template) {
          // Template not in cache, skip update
          return;
        }

        const oldTemplate = existingTemplateData.template;
        const oldCategoryId = oldTemplate.category?.id;
        const newCategoryId = updatedTemplate.category?.id;

        // Skip if categories don't exist
        if (!oldCategoryId || !newCategoryId) {
          return;
        }

        const newTemplate: Graphql.Template = {
          ...oldTemplate,
          ...updatedTemplate,
        };

        // Update the template query cache
        cache.writeQuery({
          query: templateQueryDocument,
          variables: { id: updatedTemplate.id },
          data: {
            template: newTemplate,
          },
        });

        // If category hasn't changed, update the category's templates cache
        if (oldCategoryId === newCategoryId) {
          try {
            const categoryTemplatesData =
              cache.readQuery<Graphql.TemplatesByCategoryIdQuery>({
                query: Document.templatesByCategoryIdQueryDocument,
                variables: { categoryId: newCategoryId },
              });

            if (categoryTemplatesData?.templatesByCategoryId) {
              const updatedTemplates =
                categoryTemplatesData.templatesByCategoryId.map(
                  (t: Graphql.Template) =>
                    t.id === updatedTemplate.id ? newTemplate : t,
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
    },
  );

  // Delete template mutation
  const [deleteTemplateMutation] = useMutation(
    Document.deleteTemplateMutationDocument,
    {
      update(cache, { data }) {
        if (!data?.deleteTemplate) return;

        const deletedTemplate = data.deleteTemplate;
        const categoryId = deletedTemplate.category?.id;

        // Skip if category doesn't exist
        if (!categoryId) {
          return;
        }

        // Update the templatesByCategoryId cache
        try {
          const categoryTemplatesData =
            cache.readQuery<Graphql.TemplatesByCategoryIdQuery>({
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
    },
  );

  // Move to deletion category mutation
  const [suspendTemplateMutation] = useMutation(
    Document.suspendTemplateMutationDocument,
    {
      update(cache, { data }) {
        if (!data?.suspendTemplate) return;

        const suspendedTemplate = data.suspendTemplate;

        // Use preSuspensionCategory from the suspended template
        const oldCategoryId = suspendedTemplate.preSuspensionCategory?.id;

        // Skip if old category doesn't exist
        if (!oldCategoryId) {
          return;
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
  const [unsuspendTemplateMutation] = useMutation(
    Document.unsuspendTemplateMutationDocument,
    {
      update(cache, { data }) {
        if (!data?.unsuspendTemplate) return;

        const unsuspendedTemplate = data.unsuspendTemplate;

        // Get the destination category ID from the unsuspended template
        const newCategoryId = unsuspendedTemplate.category?.id;

        // Skip if destination category doesn't exist
        if (!newCategoryId) {
          return;
        }

        // Remove template from suspended templates cache
        try {
          const suspendedTemplatesData =
            cache.readQuery<Graphql.SuspendedTemplatesQuery>({
              query: Document.suspendedTemplatesQueryDocument,
            });

          if (suspendedTemplatesData?.suspendedTemplates) {
            const updatedTemplates =
              suspendedTemplatesData.suspendedTemplates.filter(
                (t: Graphql.Template) => t.id !== unsuspendedTemplate.id,
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

  const contextValue = React.useMemo(
    () => ({
      createTemplateCategoryMutation,
      updateTemplateCategoryMutation,
      deleteTemplateCategoryMutation,
      createTemplateMutation,
      updateTemplateMutation,
      deleteTemplateMutation,
      suspendTemplateMutation,
      unsuspendTemplateMutation,
    }),
    [
      createTemplateCategoryMutation,
      updateTemplateCategoryMutation,
      deleteTemplateCategoryMutation,
      createTemplateMutation,
      updateTemplateMutation,
      deleteTemplateMutation,
      suspendTemplateMutation,
      unsuspendTemplateMutation,
    ],
  );

  return (
    <TemplateCategoryGraphQLContext.Provider value={contextValue}>
      {children}
    </TemplateCategoryGraphQLContext.Provider>
  );
};
