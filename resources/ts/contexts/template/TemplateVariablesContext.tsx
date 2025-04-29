import { ReactNode, useState, useCallback } from 'react';
import axios from '@/utils/axios';
import { TemplateVariable } from './template.types';
import { createContext, useContext } from "react";

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

    const fetchVariables = useCallback(async (templateId: number) => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get<TemplateVariable[]>(
                `/admin/templates/${templateId}/variables`
            );
            setVariables(response.data);
        } catch (error: any) {
            setError(error.response?.data?.message || 'Failed to fetch variables');
        } finally {
            setLoading(false);
        }
    }, []);

    const createVariable = useCallback(async (
        templateId: number,
        data: Omit<TemplateVariable, 'id' | 'template_id' | 'created_at' | 'updated_at'>
    ) => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.post<TemplateVariable>(
                `/admin/templates/${templateId}/variables`,
                data
            );
            setVariables(prev => [...prev, response.data]);
        } catch (error: any) {
            setError(error.response?.data?.message || 'Failed to create variable');
            throw error;
        } finally {
            setLoading(false);
        }
    }, []);

    const updateVariable = useCallback(async (
        templateId: number,
        variableId: number,
        data: Omit<TemplateVariable, 'id' | 'template_id' | 'created_at' | 'updated_at'>
    ) => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.put<TemplateVariable>(
                `/admin/templates/${templateId}/variables/${variableId}`,
                data
            );
            setVariables(prev =>
                prev.map(variable =>
                    variable.id === variableId ? response.data : variable
                )
            );
        } catch (error: any) {
            setError(error.response?.data?.message || 'Failed to update variable');
            throw error;
        } finally {
            setLoading(false);
        }
    }, []);

    const deleteVariable = useCallback(async (templateId: number, variableId: number) => {
        setLoading(true);
        setError(null);
        try {
            await axios.delete(
                `/admin/templates/${templateId}/variables/${variableId}`
            );
            setVariables(prev =>
                prev.filter(variable => variable.id !== variableId)
            );
        } catch (error: any) {
            setError(error.response?.data?.message || 'Failed to delete variable');
            throw error;
        } finally {
            setLoading(false);
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
