"use client";

import { createContext, useCallback, useContext, useMemo } from "react";
import * as Graphql from "@/client/graphql/generated/gql/graphql";
import * as Document from "@/client/graphql/documents";
import { ApolloClient } from "@apollo/client";
import { useMutation } from "@apollo/client/react";

type TemplateNumberVariableGraphQLContextType = {
 /**
  * Mutation to create a new number template variable
  * @param variables - The creation number template variable variables
  */
 createTemplateNumberVariableMutation: (
  variables: Graphql.CreateTemplateNumberVariableMutationVariables,
 ) => Promise<
  ApolloClient.MutateResult<Graphql.CreateTemplateNumberVariableMutation>
 >;

 /**
  * Mutation to update an existing number template variable
  * @param variables - The update number template variable variables
  */
 updateTemplateNumberVariableMutation: (
  variables: Graphql.UpdateTemplateNumberVariableMutationVariables,
 ) => Promise<
  ApolloClient.MutateResult<Graphql.UpdateTemplateNumberVariableMutation>
 >;
};

const TemplateNumberVariableGraphQLContext = createContext<
 TemplateNumberVariableGraphQLContextType | undefined
>(undefined);

export const useTemplateNumberVariableGraphQL = () => {
 const context = useContext(TemplateNumberVariableGraphQLContext);
 if (!context) {
  throw new Error(
   "useTemplateNumberVariableGraphQL must be used within a TemplateNumberVariableGraphQLProvider",
  );
 }
 return context;
};

export const TemplateNumberVariableGraphQLProvider: React.FC<{
 children: React.ReactNode;
}> = ({ children }) => {
 // Create number template variable mutation
 const [mutateCreate] = useMutation(
  Document.createTemplateNumberVariableMutationDocument,
  {
   update(cache, { data }) {
    if (!data?.createTemplateNumberVariable) return;
    const createdVar = data.createTemplateNumberVariable;
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

 // Update number template variable mutation
 const [mutateUpdate] = useMutation(
  Document.updateTemplateNumberVariableMutationDocument,
  {
   update(cache, { data }) {
    if (!data?.updateTemplateNumberVariable) return;
    const updatedVar = data.updateTemplateNumberVariable;
    if (!updatedVar.template?.id) {
     throw new Error("Template ID is required");
    }

    const existingData = cache.readQuery<Graphql.TemplateQuery>({
     query: Graphql.TemplateDocument,
     variables: { id: updatedVar.template?.id },
    });

    if (!existingData?.template?.variables) return;

    // Update the variable in the template's variables array
    const updatedVariables = existingData.template.variables.map((variable) =>
     variable.id === updatedVar.id ? updatedVar : variable,
    );

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

 const createTemplateNumberVariableMutation = useCallback(
  (variables: Graphql.CreateTemplateNumberVariableMutationVariables) => {
   return mutateCreate({ variables });
  },
  [mutateCreate],
 );

 const updateTemplateNumberVariableMutation = useCallback(
  (variables: Graphql.UpdateTemplateNumberVariableMutationVariables) => {
   return mutateUpdate({ variables });
  },
  [mutateUpdate],
 );

 const contextValue = useMemo(
  () => ({
   createTemplateNumberVariableMutation,
   updateTemplateNumberVariableMutation,
  }),
  [createTemplateNumberVariableMutation, updateTemplateNumberVariableMutation],
 );

 return (
  <TemplateNumberVariableGraphQLContext.Provider value={contextValue}>
   {children}
  </TemplateNumberVariableGraphQLContext.Provider>
 );
};
