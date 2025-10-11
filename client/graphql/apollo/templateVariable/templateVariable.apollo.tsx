"use client";

import { createContext, useCallback, useContext, useMemo } from "react";
import * as Graphql from "@/client/graphql/generated/gql/graphql";
import * as Document from "@/client/graphql/documents";
import { ApolloLink } from "@apollo/client";
import { useMutation } from "@apollo/client/react";
import {
 TemplateTextVariableGraphQLProvider,
 useTemplateTextVariableGraphQL,
} from "./templateTextVariable.apollo";
import {
 TemplateNumberVariableGraphQLProvider,
 useTemplateNumberVariableGraphQL,
} from "./templateNumberVariable.apollo";
import {
 TemplateDateVariableGraphQLProvider,
 useTemplateDateVariableGraphQL,
} from "./templateDateVariable.apollo";
import {
 TemplateSelectVariableGraphQLProvider,
 useTemplateSelectVariableGraphQL,
} from "./templateSelectVariable.apollo";

type TemplateVariableGraphQLContextType = {
 /**
  * Mutation to create a new text template variable
  * @param variables - The creation text template variable variables
  */
 createTemplateTextVariableMutation: (
  variables: Graphql.CreateTemplateTextVariableMutationVariables,
 ) => Promise<ApolloLink.Result<Graphql.CreateTemplateTextVariableMutation>>;

 /**
  * Mutation to update an existing text template variable
  * @param variables - The update text template variable variables
  */
 updateTemplateTextVariableMutation: (
  variables: Graphql.UpdateTemplateTextVariableMutationVariables,
 ) => Promise<ApolloLink.Result<Graphql.UpdateTemplateTextVariableMutation>>;

 /**
  * Mutation to create a new number template variable
  * @param variables - The creation number template variable variables
  */
 createTemplateNumberVariableMutation: (
  variables: Graphql.CreateTemplateNumberVariableMutationVariables,
 ) => Promise<ApolloLink.Result<Graphql.CreateTemplateNumberVariableMutation>>;

 /**
  * Mutation to update an existing number template variable
  * @param variables - The update number template variable variables
  */
 updateTemplateNumberVariableMutation: (
  variables: Graphql.UpdateTemplateNumberVariableMutationVariables,
 ) => Promise<ApolloLink.Result<Graphql.UpdateTemplateNumberVariableMutation>>;

 /**
  * Mutation to create a new date template variable
  * @param variables - The creation date template variable variables
  */
 createTemplateDateVariableMutation: (
  variables: Graphql.CreateTemplateDateVariableMutationVariables,
 ) => Promise<ApolloLink.Result<Graphql.CreateTemplateDateVariableMutation>>;

 /**
  * Mutation to update an existing date template variable
  * @param variables - The update date template variable variables
  */
 updateTemplateDateVariableMutation: (
  variables: Graphql.UpdateTemplateDateVariableMutationVariables,
 ) => Promise<ApolloLink.Result<Graphql.UpdateTemplateDateVariableMutation>>;

 /**
  * Mutation to create a new select template variable
  * @param variables - The creation select template variable variables
  */
 createTemplateSelectVariableMutation: (
  variables: Graphql.CreateTemplateSelectVariableMutationVariables,
 ) => Promise<ApolloLink.Result<Graphql.CreateTemplateSelectVariableMutation>>;

 /**
  * Mutation to update an existing select template variable
  * @param variables - The update select template variable variables
  */
 updateTemplateSelectVariableMutation: (
  variables: Graphql.UpdateTemplateSelectVariableMutationVariables,
 ) => Promise<ApolloLink.Result<Graphql.UpdateTemplateSelectVariableMutation>>;

 /**
  * Mutation to delete a template variable
  * @param variables - The delete template variable variables
  */
 deleteTemplateVariableMutation: (
  variables: Graphql.DeleteTemplateVariableMutationVariables,
 ) => Promise<ApolloLink.Result<Graphql.DeleteTemplateVariableMutation>>;
};

const TemplateVariableGraphQLContext = createContext<
 TemplateVariableGraphQLContextType | undefined
>(undefined);

export const useTemplateVariableGraphQL = () => {
 const context = useContext(TemplateVariableGraphQLContext);
 if (!context) {
  throw new Error(
   "useTemplateVariableGraphQL must be used within a TemplateVariableGraphQLProvider",
  );
 }
 return context;
};

export const Provider: React.FC<{
 children: React.ReactNode;
}> = ({ children }) => {
 // Get functions from individual hooks
 const textContext = useTemplateTextVariableGraphQL();
 const numberContext = useTemplateNumberVariableGraphQL();
 const dateContext = useTemplateDateVariableGraphQL();
 const selectContext = useTemplateSelectVariableGraphQL();

 // Delete template variable mutation
 const [mutateDelete] = useMutation(
  Document.deleteTemplateVariableMutationDocument,
  {
   update(cache, { data }) {
    if (!data?.deleteTemplateVariable) return;
    const deletedVar = data.deleteTemplateVariable;

    if (!deletedVar.template?.id) {
     throw new Error("Template ID is required");
    }

    const existingData = cache.readQuery<Graphql.TemplateQuery>({
     query: Graphql.TemplateDocument,
     variables: { id: deletedVar.template?.id },
    });

    if (!existingData?.template?.variables) return;

    // Remove the variable from the template's variables array
    cache.writeQuery({
     query: Graphql.TemplateDocument,
     variables: { id: deletedVar.template?.id },
     data: {
      template: {
       ...existingData.template,
       variables: existingData.template.variables.filter(
        (variable) => variable.id !== deletedVar.id,
       ),
      },
     },
    });
   },
  },
 );

 const deleteTemplateVariableMutation = useCallback(
  (variables: Graphql.DeleteTemplateVariableMutationVariables) => {
   return mutateDelete({ variables });
  },
  [mutateDelete],
 );

 const contextValue = useMemo(
  () => ({
   // Text template variable mutations
   createTemplateTextVariableMutation:
    textContext.createTemplateTextVariableMutation,
   updateTemplateTextVariableMutation:
    textContext.updateTemplateTextVariableMutation,

   // Number template variable mutations
   createTemplateNumberVariableMutation:
    numberContext.createTemplateNumberVariableMutation,
   updateTemplateNumberVariableMutation:
    numberContext.updateTemplateNumberVariableMutation,

   // Date template variable mutations
   createTemplateDateVariableMutation:
    dateContext.createTemplateDateVariableMutation,
   updateTemplateDateVariableMutation:
    dateContext.updateTemplateDateVariableMutation,

   // Select template variable mutations
   createTemplateSelectVariableMutation:
    selectContext.createTemplateSelectVariableMutation,
   updateTemplateSelectVariableMutation:
    selectContext.updateTemplateSelectVariableMutation,

   // Delete mutation (available in any context, we'll take it from text)
   deleteTemplateVariableMutation: deleteTemplateVariableMutation,
  }),
  [
   textContext,
   numberContext,
   dateContext,
   selectContext,
   deleteTemplateVariableMutation,
  ],
 );

 return (
  <TemplateVariableGraphQLContext.Provider value={contextValue}>
   {children}
  </TemplateVariableGraphQLContext.Provider>
 );
};

const WithGraphQL: React.FC<{
 children: React.ReactNode;
}> = ({ children }) => {
 return (
  <TemplateTextVariableGraphQLProvider>
   <TemplateNumberVariableGraphQLProvider>
    <TemplateDateVariableGraphQLProvider>
     <TemplateSelectVariableGraphQLProvider>
      <Provider>{children}</Provider>
     </TemplateSelectVariableGraphQLProvider>
    </TemplateDateVariableGraphQLProvider>
   </TemplateNumberVariableGraphQLProvider>
  </TemplateTextVariableGraphQLProvider>
 );
};

export const TemplateVariableGraphQLProvider = WithGraphQL;
