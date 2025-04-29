import { ReactNode, useState, useCallback } from 'react';
import axios from '@/utils/axios';
import { TemplateVariable } from './template.types';
import { createContext, useContext } from "react";
import { Alert, Snackbar } from '@mui/material';

interface Notification {
    message: string;
    severity: 'success' | 'error';
}

export interface TemplateVariablesContext {
    variables: TemplateVariable[];
    loading: boolean;
    error: string | null;
    fetchVariables: (templateId: number) => Promise<void>;
    createVariable: (
        templateId: number,
        data: Omit<
            TemplateVariable,
            "id" | "template_id" | "created_at" | "updated_at"
        >
    ) => Promise<void>;
    updateVariable: (
        templateId: number,
        variableId: number,
        data: Omit<
            TemplateVariable,
            "id" | "template_id" | "created_at" | "updated_at"
        >
    ) => Promise<void>;
    deleteVariable: (templateId: number, variableId: number) => Promise<void>;
}

export const TemplateVariablesContext = createContext<
    TemplateVariablesContext | undefined
>(undefined);

interface VariablesProviderProps {
    children: ReactNode;
}

export function TemplateVariablesProvider({ children }: VariablesProviderProps) {
    const [variables, setVariables] = useState<TemplateVariable[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [notification, setNotification] = useState<Notification | null>(null);

    const showNotification = (message: string, severity: 'success' | 'error') => {
        setNotification({ message, severity });
    };

    const handleCloseNotification = () => {
        setNotification(null);
    };

    const fetchVariables = useCallback(async (templateId: number) => {
        setLoading(true);
        try {
            const response = await axios.get<TemplateVariable[]>(
                `/admin/templates/${templateId}/variables`
            );
            setVariables(response.data);
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || 'Failed to fetch variables';
            setError(errorMessage);
            showNotification(errorMessage, 'error');
        } finally {
            setLoading(false);
        }
    }, []);

    const createVariable = useCallback(async (
        templateId: number,
        data: Omit<TemplateVariable, 'id' | 'template_id' | 'created_at' | 'updated_at'>
    ) => {
        try {
            const response = await axios.post<TemplateVariable>(
                `/admin/templates/${templateId}/variables`,
                data
            );
            setVariables(prev => [...prev, response.data]);
            showNotification('Variable created successfully', 'success');
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || 'Failed to create variable';
            showNotification(errorMessage, 'error');
            throw error;
        }
    }, []);

    const updateVariable = useCallback(async (
        templateId: number,
        variableId: number,
        data: Omit<TemplateVariable, 'id' | 'template_id' | 'created_at' | 'updated_at'>
    ) => {
        try {
            const response = await axios.put<TemplateVariable>(
                `/admin/variables/${variableId}`,
                data
            );
            setVariables(prev =>
                prev.map(variable =>
                    variable.id === variableId ? response.data : variable
                )
            );
            showNotification('Variable updated successfully', 'success');
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || 'Failed to update variable';
            showNotification(errorMessage, 'error');
            throw error;
        }
    }, []);

    const deleteVariable = useCallback(async (templateId: number, variableId: number) => {
        try {
            await axios.delete(`/admin/variables/${variableId}`);
            setVariables(prev =>
                prev.filter(variable => variable.id !== variableId)
            );
            showNotification('Variable deleted successfully', 'success');
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || 'Failed to delete variable';
            showNotification(errorMessage, 'error');
            throw error;
        }
    }, []);

    const value = {
        variables,
        loading,
        error,
        fetchVariables,
        createVariable,
        updateVariable,
        deleteVariable,
    };

    return (
        <TemplateVariablesContext.Provider value={value}>
            {children}
            {notification && (
                <Snackbar
                    open={true}
                    autoHideDuration={6000}
                    onClose={handleCloseNotification}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                >
                    <Alert
                        onClose={handleCloseNotification}
                        severity={notification.severity}
                        variant="filled"
                    >
                        {notification.message}
                    </Alert>
                </Snackbar>
            )}
        </TemplateVariablesContext.Provider>
    );
}


export const useTemplateVariables = () => {
    const context = useContext(TemplateVariablesContext);
    if (context === undefined) {
        throw new Error("useVariables must be used within a VariablesProvider");
    }
    return context;
};
