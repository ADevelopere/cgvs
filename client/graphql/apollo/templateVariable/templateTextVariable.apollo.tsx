"use client";

import { createContext, useCallback, useContext, useMemo } from "react";
import * as Graphql from "@/client/graphql/generated/gql/graphql";
import * as Document from "@/client/graphql/documents";
import { ApolloClient } from "@apollo/client";
import { useMutation } from "@apollo/client/react";

type TemplateTextVariableGraphQLContextType = {
 /**
  * Mutation to create a new text template variable
  * @param variables - The creation text template variable variables
  */
 createTemplateTextVariableMutation: (
  variables: Graphql.CreateTemplateTextVariableMutationVariables,
 ) => Promise<
  ApolloClient.MutateResult<Graphql.CreateTemplateTextVariableMutation>
 >;

 /**
  * Mutation to update an existing text template variable
  * @param variables - The update text template variable variables
  */
 updateTemplateTextVariableMutation: (
  variables: Graphql.UpdateTemplateTextVariableMutationVariables,
 ) => Promise<
  ApolloClient.MutateResult<Graphql.UpdateTemplateTextVariableMutation>
 >;
};

const TemplateTextVariableGraphQLContext = createContext<
 TemplateTextVariableGraphQLContextType | undefined
>(undefined);

export const useTemplateTextVariableGraphQL = () => {
 const context = useContext(TemplateTextVariableGraphQLContext);
 if (!context) {
  throw new Error(
   "useTemplateTextVariableGraphQL must be used within a TemplateTextVariableGraphQLProvider",
  );
 }
 return context;
};

export const TemplateTextVariableGraphQLProvider: React.FC<{
 children: React.ReactNode;
}> = ({ children }) => {
 // Create text template variable mutation
 const [mutateCreate] = useMutation(
  Document.createTemplateTextVariableMutationDocument,
  {
   update(cache, { data }) {
    if (!data?.createTemplateTextVariable) return;
    const createdVar = data.createTemplateTextVariable;

    if (!createdVar.template?.id) {
     throw new Error("Template ID is required");
    }

    const existingData = cache.readQuery<Graphql.TemplateQuery>({
     query: Graphql.TemplateDocument,
     variables: { id: createdVar.template?.id },
    });

    if (!existingData?.template?.variables) return;

    // Add the new variable to the template's variables array
    cache.writeQuery({
     query: Graphql.TemplateDocument,
     variables: { id: createdVar.template?.id },
     data: {
      template: {
       ...existingData.template,
       variables: [...existingData.template.variables, createdVar],
      },
     },
    });
   },
  },
 );

 // Update text template variable mutation
 const [mutateUpdate] = useMutation(
  Document.updateTemplateTextVariableMutationDocument,
  {
   update(cache, { data }) {
    if (!data?.updateTemplateTextVariable) return;
    const updatedVar = data.updateTemplateTextVariable;

    if (!updatedVar.template?.id) {
     throw new Error("Template ID is required");
    }

    const existingData = cache.readQuery<Graphql.TemplateQuery>({
     query: Graphql.TemplateDocument,
     variables: { id: updatedVar.template?.id },
    });

    if (!existingData?.template?.variables) return;

    // Update the variable in the template's variables array and sort by order
    const updatedVariables = existingData.template.variables
     .map((variable) => (variable.id === updatedVar.id ? updatedVar : variable))
     .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

    cache.writeQuery({
     query: Graphql.TemplateDocument,
     variables: { id: updatedVar.template?.id },
     data: {
      template: {
       ...existingData.template,
       variables: updatedVariables,
      },
     },
    });
   },
  },
 );

 const createTemplateTextVariableMutation = useCallback(
  (variables: Graphql.CreateTemplateTextVariableMutationVariables) => {
   return mutateCreate({ variables });
  },
  [mutateCreate],
 );

 const updateTemplateTextVariableMutation = useCallback(
  (variables: Graphql.UpdateTemplateTextVariableMutationVariables) => {
   return mutateUpdate({ variables });
  },
  [mutateUpdate],
 );

 const contextValue = useMemo(
  () => ({
   createTemplateTextVariableMutation,
   updateTemplateTextVariableMutation,
  }),
  [createTemplateTextVariableMutation, updateTemplateTextVariableMutation],
 );

 return (
  <TemplateTextVariableGraphQLContext.Provider value={contextValue}>
   {children}
  </TemplateTextVariableGraphQLContext.Provider>
 );
};
