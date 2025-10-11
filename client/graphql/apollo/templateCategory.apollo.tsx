"use client";

import React, { createContext, useContext, useCallback } from "react";
import { ApolloClient } from "@apollo/client";
import * as Document from "@/client/graphql/documents";
import * as Graphql from "@/client/graphql/generated/gql/graphql";
import { useMutation, useLazyQuery } from "@apollo/client/react";

type TemplateCategoryGraphQLContextType = {
 /**
  * Query to fetch all template categories in a flat structure
  */
 templateCategoriesQuery: () => Promise<
  ApolloClient.QueryResult<Graphql.TemplateCategoriesQuery>
 >;

 /**
  * Query to fetch a single template category by ID
  */
 templateCategoryQuery: (
  variables: Graphql.QueryTemplateCategoryArgs,
 ) => Promise<ApolloClient.QueryResult<Graphql.TemplateCategoryQuery>>;

 /**
  * Mutation to create a new template category
  * @param variables - The create template category variables
  */
 createTemplateCategoryMutation: (
  variables: Graphql.CreateTemplateCategoryMutationVariables,
 ) => Promise<
  ApolloClient.MutateResult<Graphql.CreateTemplateCategoryMutation>
 >;

 /**
  * Mutation to update an existing template category
  * @param variables - The update template category variables
  */
 updateTemplateCategoryMutation: (
  variables: Graphql.UpdateTemplateCategoryMutationVariables,
 ) => Promise<
  ApolloClient.MutateResult<Graphql.UpdateTemplateCategoryMutation>
 >;

 /**
  * Mutation to delete a template category
  * @param variables - The delete template category variables
  */
 deleteTemplateCategoryMutation: (
  variables: Graphql.DeleteTemplateCategoryMutationVariables,
 ) => Promise<
  ApolloClient.MutateResult<Graphql.DeleteTemplateCategoryMutation>
 >;
};

const TemplateCategoryGraphQLContext = createContext<
 TemplateCategoryGraphQLContextType | undefined
>(undefined);

export const useTemplateCategoryGraphQL = () => {
 const context = useContext(TemplateCategoryGraphQLContext);
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
 // Query for fetching flat categories
 const [executeTemplateCategoriesQuery] = useLazyQuery(
  Document.templateCategoriesQueryDocument,
  {
   fetchPolicy: "cache-first",
  },
 );

 // Query for fetching single category
 const [executeTemplateCategoryQuery] = useLazyQuery(
  Document.templateCategoryQueryDocument,
  {
   fetchPolicy: "cache-first",
  },
 );

 // Create category mutation
 const [mutateCreate] = useMutation(
  Document.createTemplateCategoryMutationDocument,
  {
   update(cache, { data }) {
    if (!data?.createTemplateCategory) return;

    const existingData = cache.readQuery<Graphql.TemplateCategoriesQuery>({
     query: Graphql.TemplateCategoriesDocument,
    });

    if (!existingData?.templateCategories) return;

    cache.writeQuery({
     query: Graphql.TemplateCategoriesDocument,
     data: {
      templateCategories: [
       ...existingData.templateCategories,
       {
        ...data.createTemplateCategory,
        templates: [],
       },
      ],
     },
    });
   },
  },
 );

 // Update category mutation
 const [mutateUpdate] = useMutation(
  Document.updateTemplateCategoryMutationDocument,
  {
   update(cache, { data }) {
    if (!data?.updateTemplateCategory) return;
    const updatedCategory = data.updateTemplateCategory;
    const updateTemplateCategory = data.updateTemplateCategory;
    const existingData = cache.readQuery<Graphql.TemplateCategoriesQuery>({
     query: Graphql.TemplateCategoriesDocument,
    });

    if (!existingData?.templateCategories) return;

    const updatedData = existingData.templateCategories.map((category) =>
     category.id === updatedCategory.id
      ? {
         ...updateTemplateCategory,
         templates: category.templates,
        }
      : category,
    );

    cache.writeQuery({
     query: Graphql.TemplateCategoriesDocument,
     data: {
      templateCategories: updatedData,
     },
    });
   },
  },
 );

 // Delete category mutation
 const [mutateDelete] = useMutation(
  Document.deleteTemplateCategoryMutationDocument,
  {
   update(cache, { data }) {
    if (!data?.deleteTemplateCategory) return;
    const deleteTemplateCategory = data.deleteTemplateCategory;
    const existingData = cache.readQuery<Graphql.TemplateCategoriesQuery>({
     query: Graphql.TemplateCategoriesDocument,
    });

    if (!existingData?.templateCategories) return;

    const updatedData = existingData.templateCategories.filter(
     (category) => category.id !== deleteTemplateCategory.id,
    );

    cache.writeQuery({
     query: Graphql.TemplateCategoriesDocument,
     data: {
      templateCategories: updatedData,
     },
    });
   },
  },
 );

 // Wrapper functions for mutations and queries
 const templateCategoriesQuery = useCallback(async () => {
  return executeTemplateCategoriesQuery();
 }, [executeTemplateCategoriesQuery]);

 const templateCategoryQuery = useCallback(
  async (variables: Graphql.QueryTemplateCategoryArgs) => {
   return executeTemplateCategoryQuery({ variables });
  },
  [executeTemplateCategoryQuery],
 );

 const createTemplateCategoryMutation = useCallback(
  async (variables: Graphql.CreateTemplateCategoryMutationVariables) => {
   return mutateCreate({
    variables,
   });
  },
  [mutateCreate],
 );

 const updateTemplateCategoryMutation = useCallback(
  async (variables: Graphql.UpdateTemplateCategoryMutationVariables) => {
   return mutateUpdate({
    variables,
   });
  },
  [mutateUpdate],
 );

 const deleteTemplateCategoryMutation = useCallback(
  async (variables: Graphql.DeleteTemplateCategoryMutationVariables) => {
   return mutateDelete({
    variables,
   });
  },
  [mutateDelete],
 );

 const contextValue = React.useMemo(
  () => ({
   templateCategoriesQuery,
   templateCategoryQuery,
   createTemplateCategoryMutation,
   updateTemplateCategoryMutation,
   deleteTemplateCategoryMutation,
  }),
  [
   templateCategoriesQuery,
   templateCategoryQuery,
   createTemplateCategoryMutation,
   updateTemplateCategoryMutation,
   deleteTemplateCategoryMutation,
  ],
 );

 return (
  <TemplateCategoryGraphQLContext.Provider value={contextValue}>
   {children}
  </TemplateCategoryGraphQLContext.Provider>
 );
};
