"use client";

import * as Graphql from "@/client/graphql/generated/gql/graphql";
import {
 createContext,
 useCallback,
 useContext,
 useMemo,
 useState,
} from "react";
import { useNotifications } from "@toolpad/core/useNotifications";
import logger from "@/lib/logger";
import { useTemplateVariableGraphQL } from "@/client/graphql/apollo";

type TemplateVariableManagementContextType = {
 // States
 loading: boolean;

 // Creation mutations for different variable types
 createTemplateTextVariable: (
  variables: Graphql.CreateTemplateTextVariableMutationVariables,
 ) => Promise<boolean>;

 createTemplateNumberVariable: (
  variables: Graphql.CreateTemplateNumberVariableMutationVariables,
 ) => Promise<boolean>;

 createTemplateDateVariable: (
  variables: Graphql.CreateTemplateDateVariableMutationVariables,
 ) => Promise<boolean>;

 createTemplateSelectVariable: (
  variables: Graphql.CreateTemplateSelectVariableMutationVariables,
 ) => Promise<boolean>;

 // Update mutations for different variable types
 updateTemplateTextVariable: (
  variables: Graphql.UpdateTemplateTextVariableMutationVariables,
 ) => Promise<boolean>;

 updateTemplateNumberVariable: (
  variables: Graphql.UpdateTemplateNumberVariableMutationVariables,
 ) => Promise<boolean>;

 updateTemplateDateVariable: (
  variables: Graphql.UpdateTemplateDateVariableMutationVariables,
 ) => Promise<boolean>;

 updateTemplateSelectVariable: (
  variables: Graphql.UpdateTemplateSelectVariableMutationVariables,
 ) => Promise<boolean>;

 // Delete mutation (common for all types)
 deleteTemplateVariable: (id: number) => Promise<boolean>;
};

const TemplateVariableManagementContext = createContext<
 TemplateVariableManagementContextType | undefined
>(undefined);

export const useTemplateVariableManagement = () => {
 const context = useContext(TemplateVariableManagementContext);
 if (!context) {
  throw new Error(
   "useTemplateVariableManagement must be used within a TemplateVariableManagementProvider",
  );
 }
 return context;
};

export const TemplateVariableManagementProvider: React.FC<{
 children: React.ReactNode;
}> = ({ children }) => {
 const notifications = useNotifications();

 const [loading, setLoading] = useState(false);

 const {
  createTemplateTextVariableMutation,
  updateTemplateTextVariableMutation,
  createTemplateNumberVariableMutation,
  updateTemplateNumberVariableMutation,
  createTemplateDateVariableMutation,
  updateTemplateDateVariableMutation,
  createTemplateSelectVariableMutation,
  updateTemplateSelectVariableMutation,
  deleteTemplateVariableMutation,
 } = useTemplateVariableGraphQL();

 // Text template variable handlers
 const handleCreateTemplateTextVariable = useCallback(
  async (
   variables: Graphql.CreateTemplateTextVariableMutationVariables,
  ): Promise<boolean> => {
   logger.log("Creating text variable", variables);
   setLoading(true);
   try {
    const result = await createTemplateTextVariableMutation({
     input: {
      ...variables.input,
     },
    });

    if (result.data?.createTemplateTextVariable) {
     notifications.show("Text variable created successfully", {
      severity: "success",
      autoHideDuration: 3000,
     });
     return true;
    }
    notifications.show("Failed to create text variable", {
     severity: "error",
     autoHideDuration: 3000,
    });
    return false;
   } catch (error) {
    logger.error("Error creating text variable:", error);
    notifications.show("Failed to create text variable", {
     severity: "error",
     autoHideDuration: 3000,
    });
    return false;
   } finally {
    setLoading(false);
   }
  },
  [createTemplateTextVariableMutation, notifications],
 );

 const handleUpdateTemplateTextVariable = useCallback(
  async (
   variables: Graphql.UpdateTemplateTextVariableMutationVariables,
  ): Promise<boolean> => {
   setLoading(true);
   try {
    const result = await updateTemplateTextVariableMutation(variables);
    if (result.data?.updateTemplateTextVariable) {
     notifications.show("Text variable updated successfully", {
      severity: "success",
      autoHideDuration: 3000,
     });
     return true;
    }
    notifications.show("Failed to update text variable", {
     severity: "error",
     autoHideDuration: 3000,
    });
    return false;
   } catch (error) {
    logger.error("Error updating text variable:", error);
    notifications.show("Failed to update text variable", {
     severity: "error",
     autoHideDuration: 3000,
    });
    return false;
   } finally {
    setLoading(false);
   }
  },
  [notifications, updateTemplateTextVariableMutation],
 );

 // Number template variable handlers
 const handleCreateTemplateNumberVariable = useCallback(
  async (
   variables: Graphql.CreateTemplateNumberVariableMutationVariables,
  ): Promise<boolean> => {
   setLoading(true);
   try {
    const result = await createTemplateNumberVariableMutation({
     input: {
      ...variables.input,
     },
    });
    if (result.data?.createTemplateNumberVariable) {
     notifications.show("Number variable created successfully", {
      severity: "success",
      autoHideDuration: 3000,
     });
     return true;
    }
    notifications.show("Failed to create number variable", {
     severity: "error",
     autoHideDuration: 3000,
    });
    return false;
   } catch (error) {
    logger.error("Error creating number variable:", error);
    notifications.show("Failed to create number variable", {
     severity: "error",
     autoHideDuration: 3000,
    });
    return false;
   } finally {
    setLoading(false);
   }
  },
  [createTemplateNumberVariableMutation, notifications],
 );

 const handleUpdateTemplateNumberVariable = useCallback(
  async (
   variables: Graphql.UpdateTemplateNumberVariableMutationVariables,
  ): Promise<boolean> => {
   setLoading(true);
   try {
    const result = await updateTemplateNumberVariableMutation(variables);
    if (result.data?.updateTemplateNumberVariable) {
     notifications.show("Number variable updated successfully", {
      severity: "success",
      autoHideDuration: 3000,
     });
     return true;
    }
    notifications.show("Failed to update number variable", {
     severity: "error",
     autoHideDuration: 3000,
    });
    return false;
   } catch (error) {
    logger.error("Error updating number variable:", error);
    notifications.show("Failed to update number variable", {
     severity: "error",
     autoHideDuration: 3000,
    });
    return false;
   } finally {
    setLoading(false);
   }
  },
  [notifications, updateTemplateNumberVariableMutation],
 );

 // Date template variable handlers
 const handleCreateTemplateDateVariable = useCallback(
  async (
   variables: Graphql.CreateTemplateDateVariableMutationVariables,
  ): Promise<boolean> => {
   setLoading(true);
   try {
    const result = await createTemplateDateVariableMutation({
     input: {
      ...variables.input,
     },
    });
    if (result.data?.createTemplateDateVariable) {
     notifications.show("Date variable created successfully", {
      severity: "success",
      autoHideDuration: 3000,
     });
     return true;
    }
    notifications.show("Failed to create date variable", {
     severity: "error",
     autoHideDuration: 3000,
    });
    return false;
   } catch (error) {
    logger.error("Error creating date variable:", error);
    notifications.show("Failed to create date variable", {
     severity: "error",
     autoHideDuration: 3000,
    });
    return false;
   } finally {
    setLoading(false);
   }
  },
  [createTemplateDateVariableMutation, notifications],
 );

 const handleUpdateTemplateDateVariable = useCallback(
  async (
   variables: Graphql.UpdateTemplateDateVariableMutationVariables,
  ): Promise<boolean> => {
   setLoading(true);
   try {
    const result = await updateTemplateDateVariableMutation(variables);
    if (result.data?.updateTemplateDateVariable) {
     notifications.show("Date variable updated successfully", {
      severity: "success",
      autoHideDuration: 3000,
     });
     return true;
    }
    notifications.show("Failed to update date variable", {
     severity: "error",
     autoHideDuration: 3000,
    });
    return false;
   } catch (error) {
    logger.error("Error updating date variable:", error);
    notifications.show("Failed to update date variable", {
     severity: "error",
     autoHideDuration: 3000,
    });
    return false;
   } finally {
    setLoading(false);
   }
  },
  [notifications, updateTemplateDateVariableMutation],
 );

 // Select template variable handlers
 const handleCreateTemplateSelectVariable = useCallback(
  async (
   variables: Graphql.CreateTemplateSelectVariableMutationVariables,
  ): Promise<boolean> => {
   setLoading(true);
   try {
    const result = await createTemplateSelectVariableMutation({
     input: {
      ...variables.input,
     },
    });
    if (result.data?.createTemplateSelectVariable) {
     notifications.show("Select variable created successfully", {
      severity: "success",
      autoHideDuration: 3000,
     });
     return true;
    }
    notifications.show("Failed to create select variable", {
     severity: "error",
     autoHideDuration: 3000,
    });
    return false;
   } catch (error) {
    logger.error("Error creating select variable:", error);
    notifications.show("Failed to create select variable", {
     severity: "error",
     autoHideDuration: 3000,
    });
    return false;
   } finally {
    setLoading(false);
   }
  },
  [createTemplateSelectVariableMutation, notifications],
 );

 const handleUpdateTemplateSelectVariable = useCallback(
  async (
   variables: Graphql.UpdateTemplateSelectVariableMutationVariables,
  ): Promise<boolean> => {
   setLoading(true);
   try {
    const result = await updateTemplateSelectVariableMutation(variables);
    if (result.data?.updateTemplateSelectVariable) {
     notifications.show("Select variable updated successfully", {
      severity: "success",
      autoHideDuration: 3000,
     });
     return true;
    }
    notifications.show("Failed to update select variable", {
     severity: "error",
     autoHideDuration: 3000,
    });
    return false;
   } catch (error) {
    logger.error("Error updating select variable:", error);
    notifications.show("Failed to update select variable", {
     severity: "error",
     autoHideDuration: 3000,
    });
    return false;
   } finally {
    setLoading(false);
   }
  },
  [notifications, updateTemplateSelectVariableMutation],
 );

 // Delete template variable handler
 const handleDeleteTemplateVariable = useCallback(
  async (id: number): Promise<boolean> => {
   setLoading(true);
   try {
    const result = await deleteTemplateVariableMutation({ id });
    if (result.data?.deleteTemplateVariable) {
     notifications.show("Variable deleted successfully", {
      severity: "success",
      autoHideDuration: 3000,
     });
     return true;
    }
    notifications.show("Failed to delete variable", {
     severity: "error",
     autoHideDuration: 3000,
    });
    return false;
   } catch (error) {
    logger.error("Error deleting variable:", error);
    notifications.show("Failed to delete variable", {
     severity: "error",
     autoHideDuration: 3000,
    });
    return false;
   } finally {
    setLoading(false);
   }
  },
  [deleteTemplateVariableMutation, notifications],
 );

 const value: TemplateVariableManagementContextType = useMemo(
  () => ({
   loading,
   createTemplateTextVariable: handleCreateTemplateTextVariable,
   updateTemplateTextVariable: handleUpdateTemplateTextVariable,
   createTemplateNumberVariable: handleCreateTemplateNumberVariable,
   updateTemplateNumberVariable: handleUpdateTemplateNumberVariable,
   createTemplateDateVariable: handleCreateTemplateDateVariable,
   updateTemplateDateVariable: handleUpdateTemplateDateVariable,
   createTemplateSelectVariable: handleCreateTemplateSelectVariable,
   updateTemplateSelectVariable: handleUpdateTemplateSelectVariable,
   deleteTemplateVariable: handleDeleteTemplateVariable,
  }),
  [
   loading,
   handleCreateTemplateTextVariable,
   handleUpdateTemplateTextVariable,
   handleCreateTemplateNumberVariable,
   handleUpdateTemplateNumberVariable,
   handleCreateTemplateDateVariable,
   handleUpdateTemplateDateVariable,
   handleCreateTemplateSelectVariable,
   handleUpdateTemplateSelectVariable,
   handleDeleteTemplateVariable,
  ],
 );

 return (
  <TemplateVariableManagementContext.Provider value={value}>
   {children}
  </TemplateVariableManagementContext.Provider>
 );
};
