// "use client";

// import * as Graphql from "@/client/graphql/generated/gql/graphql";
// import {
//  createContext,
//  useCallback,
//  useContext,
//  useMemo,
//  useState,
// } from "react";
// import logger from "@/lib/logger";
// import { useTemplateVariableService } from "@/client/graphql/service";

// type TemplateVariableManagementContextType = {
//  // States
//  loading: boolean;

//  // Creation mutations for different variable types
//  createTemplateTextVariable: (
//   variables: Graphql.CreateTemplateTextVariableMutationVariables,
//  ) => Promise<boolean>;

//  createTemplateNumberVariable: (
//   variables: Graphql.CreateTemplateNumberVariableMutationVariables,
//  ) => Promise<boolean>;

//  createTemplateDateVariable: (
//   variables: Graphql.CreateTemplateDateVariableMutationVariables,
//  ) => Promise<boolean>;

//  createTemplateSelectVariable: (
//   variables: Graphql.CreateTemplateSelectVariableMutationVariables,
//  ) => Promise<boolean>;

//  // Update mutations for different variable types
//  updateTemplateTextVariable: (
//   variables: Graphql.UpdateTemplateTextVariableMutationVariables,
//  ) => Promise<boolean>;

//  updateTemplateNumberVariable: (
//   variables: Graphql.UpdateTemplateNumberVariableMutationVariables,
//  ) => Promise<boolean>;

//  updateTemplateDateVariable: (
//   variables: Graphql.UpdateTemplateDateVariableMutationVariables,
//  ) => Promise<boolean>;

//  updateTemplateSelectVariable: (
//   variables: Graphql.UpdateTemplateSelectVariableMutationVariables,
//  ) => Promise<boolean>;

//  // Delete mutation (common for all types)
//  deleteTemplateVariable: (id: number) => Promise<boolean>;
// };

// const TemplateVariableManagementContext = createContext<
//  TemplateVariableManagementContextType | undefined
// >(undefined);

// export const useTemplateVariableManagement = () => {
//  const context = useContext(TemplateVariableManagementContext);
//  if (!context) {
//   throw new Error(
//    "useTemplateVariableManagement must be used within a TemplateVariableManagementProvider",
//   );
//  }
//  return context;
// };

// export const TemplateVariableManagementProvider: React.FC<{
//  children: React.ReactNode;
// }> = ({ children }) => {
//  const [loading, setLoading] = useState(false);
//  const variableService = useTemplateVariableService();

//  // Text template variable handlers
//  const handleCreateTemplateTextVariable = useCallback(
//   async (
//    variables: Graphql.CreateTemplateTextVariableMutationVariables,
//   ): Promise<boolean> => {
//    logger.log("Creating text variable", variables);
//    setLoading(true);
//    try {
//     const result = await variableService.createTextVariable(variables.input);
//     return !!result;
//    } finally {
//     setLoading(false);
//    }
//   },
//   [variableService],
//  );

//  const handleUpdateTemplateTextVariable = useCallback(
//   async (
//    variables: Graphql.UpdateTemplateTextVariableMutationVariables,
//   ): Promise<boolean> => {
//    setLoading(true);
//    try {
//     const result = await variableService.updateTextVariable(variables.input);
//     return !!result;
//    } finally {
//     setLoading(false);
//    }
//   },
//   [variableService],
//  );

//  // Number template variable handlers
//  const handleCreateTemplateNumberVariable = useCallback(
//   async (
//    variables: Graphql.CreateTemplateNumberVariableMutationVariables,
//   ): Promise<boolean> => {
//    setLoading(true);
//    try {
//     const result = await variableService.createNumberVariable(variables.input);
//     return !!result;
//    } finally {
//     setLoading(false);
//    }
//   },
//   [variableService],
//  );

//  const handleUpdateTemplateNumberVariable = useCallback(
//   async (
//    variables: Graphql.UpdateTemplateNumberVariableMutationVariables,
//   ): Promise<boolean> => {
//    setLoading(true);
//    try {
//     const result = await variableService.updateNumberVariable(variables.input);
//     return !!result;
//    } finally {
//     setLoading(false);
//    }
//   },
//   [variableService],
//  );

//  // Date template variable handlers
//  const handleCreateTemplateDateVariable = useCallback(
//   async (
//    variables: Graphql.CreateTemplateDateVariableMutationVariables,
//   ): Promise<boolean> => {
//    setLoading(true);
//    try {
//     const result = await variableService.createDateVariable(variables.input);
//     return !!result;
//    } finally {
//     setLoading(false);
//    }
//   },
//   [variableService],
//  );

//  const handleUpdateTemplateDateVariable = useCallback(
//   async (
//    variables: Graphql.UpdateTemplateDateVariableMutationVariables,
//   ): Promise<boolean> => {
//    setLoading(true);
//    try {
//     const result = await variableService.updateDateVariable(variables.input);
//     return !!result;
//    } finally {
//     setLoading(false);
//    }
//   },
//   [variableService],
//  );

//  // Select template variable handlers
//  const handleCreateTemplateSelectVariable = useCallback(
//   async (
//    variables: Graphql.CreateTemplateSelectVariableMutationVariables,
//   ): Promise<boolean> => {
//    setLoading(true);
//    try {
//     const result = await variableService.createSelectVariable(variables.input);
//     return !!result;
//    } finally {
//     setLoading(false);
//    }
//   },
//   [variableService],
//  );

//  const handleUpdateTemplateSelectVariable = useCallback(
//   async (
//    variables: Graphql.UpdateTemplateSelectVariableMutationVariables,
//   ): Promise<boolean> => {
//    setLoading(true);
//    try {
//     const result = await variableService.updateSelectVariable(variables.input);
//     return !!result;
//    } finally {
//     setLoading(false);
//    }
//   },
//   [variableService],
//  );

//  // Delete template variable handler
//  const handleDeleteTemplateVariable = useCallback(
//   async (id: number): Promise<boolean> => {
//    setLoading(true);
//    try {
//     return await variableService.deleteVariable(id);
//    } finally {
//     setLoading(false);
//    }
//   },
//   [variableService],
//  );

//  const value: TemplateVariableManagementContextType = useMemo(
//   () => ({
//    loading,
//    createTemplateTextVariable: handleCreateTemplateTextVariable,
//    updateTemplateTextVariable: handleUpdateTemplateTextVariable,
//    createTemplateNumberVariable: handleCreateTemplateNumberVariable,
//    updateTemplateNumberVariable: handleUpdateTemplateNumberVariable,
//    createTemplateDateVariable: handleCreateTemplateDateVariable,
//    updateTemplateDateVariable: handleUpdateTemplateDateVariable,
//    createTemplateSelectVariable: handleCreateTemplateSelectVariable,
//    updateTemplateSelectVariable: handleUpdateTemplateSelectVariable,
//    deleteTemplateVariable: handleDeleteTemplateVariable,
//   }),
//   [
//    loading,
//    handleCreateTemplateTextVariable,
//    handleUpdateTemplateTextVariable,
//    handleCreateTemplateNumberVariable,
//    handleUpdateTemplateNumberVariable,
//    handleCreateTemplateDateVariable,
//    handleUpdateTemplateDateVariable,
//    handleCreateTemplateSelectVariable,
//    handleUpdateTemplateSelectVariable,
//    handleDeleteTemplateVariable,
//   ],
//  );

//  return (
//   <TemplateVariableManagementContext.Provider value={value}>
//    {children}
//   </TemplateVariableManagementContext.Provider>
//  );
// };
