"use client";

import React, { createContext, useContext, useCallback, useMemo } from "react";
import { ApolloClient } from "@apollo/client";
import { useLazyQuery } from "@apollo/client/react";
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



  const contextValue: TemplateGraphQLContextType = useMemo(
    () => ({
      templateQuery,
      paginatedTemplatesQuery,
      templateConfigQuery,
      templatesByCategoryIdQuery,
      suspendedTemplatesQuery,

    }),
    [
      templateQuery,
      paginatedTemplatesQuery,
      templateConfigQuery,
      templatesByCategoryIdQuery,
      suspendedTemplatesQuery,

    ],
  );

  return (
    <TemplateGraphQLContext.Provider value={contextValue}>
      {children}
    </TemplateGraphQLContext.Provider>
  );
};
