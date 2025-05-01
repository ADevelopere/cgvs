import { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import axios from '@/utils/axios';
import { Alert, Snackbar } from '@mui/material';
import { Template } from './template.types';
import * as XLSX from 'xlsx';

interface Recipient {
    id: number;
    data: Record<string, any>;
    is_valid: boolean;
    validation_errors: string[] | null;
    created_at: string;
}

interface ValidationResult {
    valid_rows: number;
    total_rows: number;
    errors: Array<{
        row: number;
        errors: string[];
    }>;
}

interface Notification {
    message: string;
    severity: 'success' | 'error';
}

interface TemplateRecipientsContext {
    recipients: Recipient[];
    loading: boolean;
    error: string | null;
    pagination: {
        page: number;
        rowsPerPage: number;
        totalRecipients: number;
    };
    useClientValidation: boolean;
    validationResult: ValidationResult | null;
    isUploading: boolean;
    selectedFile: File | null;
    showImportDialog: boolean;
    confirmDeleteRecipientId: number | null;
    setShowImportDialog: (show: boolean) => void;
    setConfirmDeleteRecipientId: (id: number | null) => void;
    setUseClientValidation: (value: boolean) => void;
    setPagination: (page: number, rowsPerPage: number) => void;
    setSelectedFile: (file: File | null) => void;
    setValidationResult: (result: ValidationResult | null) => void;
    fetchRecipients: (templateId: number, page: number, rowsPerPage: number) => Promise<void>;
    deleteRecipient: (templateId: number, recipientId: number) => Promise<void>;
    validateFile: (templateId: number, file: File) => Promise<ValidationResult>;
    importRecipients: (templateId: number, file: File) => Promise<void>;
    downloadTemplate: (templateId: number) => Promise<void>;
    validateAndSetResult: (templateId: number) => Promise<void>;
    handleImport: (templateId: number) => Promise<void>;
    handleDeleteConfirm: (templateId: number) => Promise<void>;
}

const TemplateRecipientsContext = createContext<TemplateRecipientsContext | undefined>(undefined);

interface TemplateRecipientsProviderProps {
    children: ReactNode;
}

export function TemplateRecipientsProvider({ children }: TemplateRecipientsProviderProps) {
    const [recipients, setRecipients] = useState<Recipient[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [notification, setNotification] = useState<Notification | null>(null);
    const [useClientValidation, setUseClientValidation] = useState(true);
    const [validationResult, setValidationResult] = useState<ValidationResult | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [showImportDialog, setShowImportDialog] = useState(false);
    const [confirmDeleteRecipientId, setConfirmDeleteRecipientId] = useState<number | null>(null);
    const [pagination, setPaginationState] = useState({
        page: 0,
        rowsPerPage: 10,
        totalRecipients: 0
    });

    const showNotification = (message: string, severity: 'success' | 'error') => {
        setNotification({ message, severity });
    };

    const handleCloseNotification = () => {
        setNotification(null);
    };

    const setPagination = useCallback((page: number, rowsPerPage: number) => {
        setPaginationState(prev => ({
            ...prev,
            page,
            rowsPerPage
        }));
    }, []);

    const fetchRecipients = useCallback(async (templateId: number, page: number, rowsPerPage: number) => {
        setLoading(true);
        try {
            const response = await axios.get<{ recipients: { data: Recipient[], total: number } }>(
                `/api/templates/${templateId}/recipients?page=${page + 1}&per_page=${rowsPerPage}`
            );
            setRecipients(response.data.recipients.data);
            setPaginationState(prev => ({
                ...prev,
                totalRecipients: response.data.recipients.total
            }));
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || 'Failed to load recipients';
            setError(errorMessage);
            showNotification(errorMessage, 'error');
        } finally {
            setLoading(false);
        }
    }, []);

    const deleteRecipient = useCallback(async (templateId: number, recipientId: number) => {
        try {
            await axios.delete(`/api/templates/${templateId}/recipients/${recipientId}`);
            setRecipients(prev => prev.filter(r => r.id !== recipientId));
            showNotification('Recipient deleted successfully', 'success');
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || 'Failed to delete recipient';
            showNotification(errorMessage, 'error');
            throw error;
        }
    }, []);

    const validateFile = useCallback(async (templateId: number, file: File): Promise<ValidationResult> => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('use_client_validation', useClientValidation.toString());

        try {
            if (useClientValidation) {
                // Client-side validation logic would go here
                // For now, we'll use server validation as fallback
                const response = await axios.post<ValidationResult>(
                    `/api/templates/${templateId}/recipients/validate`,
                    formData
                );
                return response.data;
            } else {
                const response = await axios.post<ValidationResult>(
                    `/api/templates/${templateId}/recipients/validate`,
                    formData
                );
                return response.data;
            }
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || 'Failed to validate file';
            showNotification(errorMessage, 'error');
            throw error;
        }
    }, [useClientValidation]);

    const importRecipients = useCallback(async (templateId: number, file: File) => {
        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await axios.post(
                `/api/templates/${templateId}/recipients/import`,
                formData
            );
            await fetchRecipients(templateId, pagination.page, pagination.rowsPerPage);
            showNotification('Recipients imported successfully', 'success');
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || 'Failed to import recipients';
            showNotification(errorMessage, 'error');
            throw error;
        }
    }, [fetchRecipients, pagination.page, pagination.rowsPerPage]);

    const downloadTemplate = useCallback(async (templateId: number) => {
        try {
            const response = await axios.get(`/api/templates/${templateId}/recipients/template`, {
                responseType: 'blob'
            });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.download = `template_${templateId}_recipients.xlsx`;
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
            showNotification('Template downloaded successfully', 'success');
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || 'Failed to download template';
            showNotification(errorMessage, 'error');
            throw error;
        }
    }, []);

    const validateAndSetResult = useCallback(async (templateId: number) => {
        if (!selectedFile) return;
        setIsUploading(true);
        try {
            const result = await validateFile(templateId, selectedFile);
            setValidationResult(result);
        } catch (error) {
            // Error handling is done in validateFile
        } finally {
            setIsUploading(false);
        }
    }, [selectedFile, validateFile]);

    const handleImport = useCallback(async (templateId: number) => {
        if (!selectedFile) return;
        setIsUploading(true);
        try {
            await importRecipients(templateId, selectedFile);
            setShowImportDialog(false);
            setSelectedFile(null);
            setValidationResult(null);
        } catch (error) {
            // Error handling is done in importRecipients
        } finally {
            setIsUploading(false);
        }
    }, [selectedFile, importRecipients]);

    const handleDeleteConfirm = useCallback(async (templateId: number) => {
        if (!confirmDeleteRecipientId) return;
        try {
            await deleteRecipient(templateId, confirmDeleteRecipientId);
            await fetchRecipients(templateId, pagination.page, pagination.rowsPerPage);
        } finally {
            setConfirmDeleteRecipientId(null);
        }
    }, [confirmDeleteRecipientId, deleteRecipient, fetchRecipients, pagination.page, pagination.rowsPerPage]);

    const value = {
        recipients,
        loading,
        error,
        pagination,
        useClientValidation,
        validationResult,
        isUploading,
        selectedFile,
        showImportDialog,
        confirmDeleteRecipientId,
        setShowImportDialog,
        setConfirmDeleteRecipientId,
        setUseClientValidation,
        setPagination,
        setSelectedFile,
        setValidationResult,
        fetchRecipients,
        deleteRecipient,
        validateFile,
        importRecipients,
        downloadTemplate,
        validateAndSetResult,
        handleImport,
        handleDeleteConfirm,
    };

    return (
        <TemplateRecipientsContext.Provider value={value}>
            {children}
            <Snackbar
                open={!!notification}
                autoHideDuration={6000}
                onClose={handleCloseNotification}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                {notification ? (
                    <Alert
                        onClose={handleCloseNotification}
                        severity={notification.severity}
                        sx={{ width: '100%' }}
                    >
                        {notification.message}
                    </Alert>
                ) : undefined}
            </Snackbar>
        </TemplateRecipientsContext.Provider>
    );
}

export const useTemplateRecipients = () => {
    const context = useContext(TemplateRecipientsContext);
    if (context === undefined) {
        throw new Error('useTemplateRecipients must be used within a TemplateRecipientsProvider');
    }
    return context;
};
