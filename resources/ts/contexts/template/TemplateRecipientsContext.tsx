import {
    createContext,
    useContext,
    useState,
    ReactNode,
    useCallback,
    useMemo,
} from "react";
import axios from "@/utils/axios";
import { Alert, Snackbar } from "@mui/material";
import { useTemplateVariables } from "./TemplateVariablesContext";
import * as excelUtils from "@/utils/excel/excelUtils";
import { Recipient } from "./template.types";
import { ValidationResult } from "@/utils/excel/types";
import { useTemplateManagement } from "./TemplateManagementContext";

interface Notification {
    message: string;
    severity: "success" | "error";
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
    useClientTemplate: boolean;
    useClientValidation: boolean;
    validationResult: ValidationResult | null;
    isUploading: boolean;
    selectedFile: File | null;
    showImportDialog: boolean;
    confirmDeleteRecipientId: number | null;
    setShowImportDialog: (show: boolean) => void;
    setConfirmDeleteRecipientId: (id: number | null) => void;
    setUseClientTemplate: (value: boolean) => void;
    setUseClientValidation: (value: boolean) => void;
    setPagination: (page: number, rowsPerPage: number) => void;
    setSelectedFile: (file: File | null) => void;
    setValidationResult: (result: ValidationResult | null) => void;
    fetchRecipients: (page: number, rowsPerPage: number) => Promise<void>;
    deleteRecipient: (recipientId: number) => Promise<void>;
    validateFile: (file: File) => Promise<ValidationResult>;
    importRecipients: (file: File) => Promise<void>;
    validateAndSetResult: () => Promise<void>;
    handleImport: () => Promise<void>;
    handleDeleteConfirm: () => Promise<void>;
    // The only two exposed template methods
    getTemplate: () => Promise<{ content: Blob; filename: string } | null>;
    updateRecipient: (recipientId: number, data: any) => Promise<void>;
}

const TemplateRecipientsContext = createContext<
    TemplateRecipientsContext | undefined
>(undefined);

interface TemplateRecipientsProviderProps {
    children: ReactNode;
}

export function TemplateRecipientsProvider({
    children,
}: TemplateRecipientsProviderProps) {
    const { variables } = useTemplateVariables();
    const { template } = useTemplateManagement();
    const templateId = useMemo(() => template?.id, [template?.id]);

    const [recipients, setRecipients] = useState<Recipient[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [notification, setNotification] = useState<Notification | null>(null);
    const [useClientTemplate, setUseClientTemplate] = useState(false);
    const [useClientValidation, setUseClientValidation] = useState(false);
    const [validationResult, setValidationResult] =
        useState<ValidationResult | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [showImportDialog, setShowImportDialog] = useState(false);
    const [confirmDeleteRecipientId, setConfirmDeleteRecipientId] = useState<
        number | null
    >(null);
    const [paginationState, setPaginationState] = useState({
        page: 0,
        rowsPerPage: 10,
        totalRecipients: 0,
    });

    const showNotification = (
        message: string,
        severity: "success" | "error"
    ) => {
        setNotification({ message, severity });
    };

    const handleCloseNotification = () => {
        setNotification(null);
    };

    const setPagination = useCallback((page: number, rowsPerPage: number) => {
        setPaginationState((prev) => ({
            ...prev,
            page,
            rowsPerPage,
        }));
    }, []);

    const fetchRecipients = useCallback(
        async (page: number, rowsPerPage: number) => {
            setLoading(true);
            try {
                const response = await axios.get<{
                    recipients: { data: Recipient[]; total: number };
                }>(
                    `/templates/${templateId}/recipients?page=${
                        page + 1
                    }&per_page=${rowsPerPage}`
                );
                setRecipients(response.data.recipients.data);
                setPaginationState((prev) => ({
                    ...prev,
                    totalRecipients: response.data.recipients.total,
                }));
            } catch (error: any) {
                const errorMessage =
                    error.response?.data?.message ||
                    "Failed to load recipients";
                setError(errorMessage);
                showNotification(errorMessage, "error");
            } finally {
                setLoading(false);
            }
        },
        [templateId]
    );

    const deleteRecipient = useCallback(
        async (recipientId: number) => {
            try {
                await axios.delete(
                    `/templates/${templateId}/recipients/${recipientId}`
                );
                setRecipients((prev) =>
                    prev.filter((r) => r.id !== recipientId)
                );
                showNotification("Recipient deleted successfully", "success");
            } catch (error: any) {
                const errorMessage =
                    error.response?.data?.message ||
                    "Failed to delete recipient";
                showNotification(errorMessage, "error");
                throw error;
            }
        },
        [templateId]
    );

    const validateFile = useCallback(
        async (file: File): Promise<ValidationResult> => {
            const formData = new FormData();
            formData.append("file", file);
            formData.append(
                "use_client_validation",
                useClientValidation.toString()
            );

            try {
                if (useClientValidation) {
                    // Client-side validation logic would go here
                    // For now, we'll use server validation as fallback
                    const response = await axios.post<ValidationResult>(
                        `/templates/${templateId}/recipients/validate`,
                        formData
                    );
                    return response.data;
                } else {
                    const response = await axios.post<ValidationResult>(
                        `/templates/${templateId}/recipients/validate`,
                        formData
                    );
                    return response.data;
                }
            } catch (error: any) {
                const errorMessage =
                    error.response?.data?.message || "Failed to validate file";
                showNotification(errorMessage, "error");
                throw error;
            }
        },
        [useClientValidation]
    );

    const importRecipients = useCallback(
        async (file: File) => {
            const formData = new FormData();
            formData.append("file", file);

            try {
                const response = await axios.post(
                    `/templates/${templateId}/recipients/import`,
                    formData
                );
                await fetchRecipients(
                    paginationState.page,
                    paginationState.rowsPerPage
                );
                showNotification("Recipients imported successfully", "success");
            } catch (error: any) {
                const errorMessage =
                    error.response?.data?.message ||
                    "Failed to import recipients";
                showNotification(errorMessage, "error");
                throw error;
            }
        },
        [
            fetchRecipients,
            paginationState.page,
            paginationState.rowsPerPage,
            templateId,
        ]
    );

    const getTemplate = useCallback(async (): Promise<{
        content: Blob;
        filename: string;
    } | null> => {
        try {
            let content: Blob;
            if (useClientTemplate) {
                if (!variables || variables.length === 0) {
                    showNotification("No template variables defined", "error");
                    return null;
                }
                content = await excelUtils.generateExcelTemplate(variables);
                if (!content || content.size === 0) {
                    showNotification("Generated template is empty", "error");
                    return null;
                }
            } else {
                if (!templateId) {
                    showNotification("Template ID is required", "error");
                    return null;
                }
                console.log('Requesting template download from server...');
                const response = await axios.get(
                    `/admin/templates/${templateId}/recipients/template`,
                    { 
                        responseType: "blob",
                        headers: {
                            'Accept': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
                        }
                    }
                );
                console.log('Server response:', response.status);

                if (!response.data) {
                    showNotification("No template data received from server", "error");
                    return null;
                }

                if (response.status !== 200) {
                    showNotification(`Server returned status ${response.status}`, "error");
                    return null;
                }

                content = new Blob([response.data], {
                    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
                });
                
                if (content.size === 0) {
                    showNotification("Received empty template from server", "error");
                    return null;
                }
            }

            if (!content) {
                showNotification("Failed to generate template content", "error");
                return null;
            }

            return {
                content,
                filename: `template_${templateId}_recipients.xlsx`,
            };
        } catch (error: any) {
            console.error('Template download error:', error);
            const errorMessage = error.response?.data?.message || 
                               error.message || 
                               "Failed to generate Excel template";
            showNotification(errorMessage, "error");
            return null;
        }
    }, [variables, templateId, useClientTemplate]);



    const validateAndSetResult = useCallback(async () => {
        if (!selectedFile) return;
        setIsUploading(true);
        try {
            const result = await validateFile(selectedFile);
            setValidationResult(result);
        } catch (error) {
            // Error handling is done in validateFile
        } finally {
            setIsUploading(false);
        }
    }, [selectedFile, validateFile]);

    const handleImport = useCallback(async () => {
        if (!selectedFile) return;
        setIsUploading(true);
        try {
            await importRecipients(selectedFile);
            setShowImportDialog(false);
            setSelectedFile(null);
            setValidationResult(null);
        } catch (error) {
            // Error handling is done in importRecipients
        } finally {
            setIsUploading(false);
        }
    }, [selectedFile, importRecipients]);

    const handleDeleteConfirm = useCallback(async () => {
        if (!confirmDeleteRecipientId) return;
        try {
            await deleteRecipient(confirmDeleteRecipientId);
            await fetchRecipients(
                paginationState.page,
                paginationState.rowsPerPage
            );
        } finally {
            setConfirmDeleteRecipientId(null);
        }
    }, [
        confirmDeleteRecipientId,
        deleteRecipient,
        fetchRecipients,
        paginationState.page,
        paginationState.rowsPerPage,
    ]);

    const updateRecipient = useCallback(
        async (recipientId: number, data: any): Promise<void> => {
            try {
                const response = await axios.put(
                    `/templates/${templateId}/recipients/${recipientId}`,
                    data
                );

                setRecipients((prev) =>
                    prev.map((recipient) =>
                        recipient.id === recipientId
                            ? { ...recipient, ...response.data }
                            : recipient
                    )
                );

                showNotification("Recipient updated successfully", "success");
            } catch (error: any) {
                const errorMessage =
                    error.response?.data?.message ??
                    "Failed to update recipient";
                showNotification(errorMessage, "error");
                throw error;
            }
        },
        [templateId]
    );

    const value = useMemo(
        () => ({
            recipients,
            loading,
            error,
            pagination: paginationState,
            useClientTemplate,
            useClientValidation,
            validationResult,
            isUploading,
            selectedFile,
            showImportDialog,
            confirmDeleteRecipientId,
            setShowImportDialog,
            setConfirmDeleteRecipientId,
            setUseClientTemplate,
            setUseClientValidation,
            setPagination,
            setSelectedFile,
            setValidationResult,
            fetchRecipients,
            deleteRecipient,
            validateFile,
            importRecipients,
            validateAndSetResult,
            handleImport,
            handleDeleteConfirm,
            getTemplate,
            updateRecipient,
        }),
        [
            recipients,
            loading,
            error,
            paginationState,
            useClientTemplate,
            useClientValidation,
            validationResult,
            isUploading,
            selectedFile,
            showImportDialog,
            confirmDeleteRecipientId,
            setShowImportDialog,
            setConfirmDeleteRecipientId,
            setUseClientTemplate,
            setUseClientValidation,
            setPagination,
            setSelectedFile,
            setValidationResult,
            fetchRecipients,
            deleteRecipient,
            validateFile,
            importRecipients,
            validateAndSetResult,
            handleImport,
            handleDeleteConfirm,
            getTemplate,
            updateRecipient,
        ]
    );

    return (
        <TemplateRecipientsContext.Provider value={value}>
            {children}
            <Snackbar
                open={!!notification}
                autoHideDuration={6000}
                onClose={handleCloseNotification}
                anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            >
                {notification ? (
                    <Alert
                        onClose={handleCloseNotification}
                        severity={notification.severity}
                        sx={{ width: "100%" }}
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
        throw new Error(
            "useTemplateRecipients must be used within a TemplateRecipientsProvider"
        );
    }
    return context;
};
