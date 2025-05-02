import {
    createContext,
    useContext,
    useState,
    ReactNode,
    useCallback,
    useMemo,
    useEffect,
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
    importRecipients: (file: File) => Promise<any>;
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
    const { template } = useTemplateManagement();
    const templateId = useMemo(() => template?.id, [template?.id]);
    const { variables } = useTemplateVariables();

    const [recipients, setRecipients] = useState<Recipient[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [notification, setNotification] = useState<Notification | null>(null);
    const [useClientTemplate, setUseClientTemplate] = useState(true);
    const [useClientValidation, setUseClientValidation] = useState(true);
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
                    `/admin/templates/${templateId}/recipients?page=${
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

    useEffect(() => {
        fetchRecipients(paginationState.page, paginationState.rowsPerPage);
    }, [
        templateId,
        paginationState.page,
        paginationState.rowsPerPage,
        fetchRecipients,
        variables
    ]);

    const deleteRecipient = useCallback(
        async (recipientId: number) => {
            try {
                await axios.delete(
                    `/admin/templates/${templateId}/recipients/${recipientId}`
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

    const importRecipients = useCallback(
        async (file: File) => {
            setIsUploading(true);
            try {
                let validationResult = null;

                if (useClientValidation) {
                    // Validate in browser first
                    validationResult = await excelUtils.validateExcelInBrowser(
                        file,
                        variables
                    );

                    // Check for validation errors
                    if (
                        validationResult.errors &&
                        validationResult.errors.length > 0
                    ) {
                        setValidationResult(validationResult);
                        throw new Error("Validation failed");
                    }
                }

                // Validation passed or useClientValidation is false, proceed with import
                const formData = new FormData();
                formData.append("file", file, file.name); // Include filename explicitly
                formData.append("validated", useClientValidation ? "1" : "0");

                // Debug logging
                console.log("File being uploaded:", {
                    name: file.name,
                    type: file.type,
                    size: file.size,
                });
                console.log("FormData entries:");
                for (let pair of formData.entries()) {
                    console.log(pair[0], pair[1]);
                }

                try {
                    const response = await axios.post(
                        `/admin/templates/${templateId}/recipients/import`,
                        formData,
                        {
                            headers: {
                                "Content-Type": "multipart/form-data",
                            },
                        }
                    );
                    await fetchRecipients(
                        paginationState.page,
                        paginationState.rowsPerPage
                    );
                    showNotification(response.data.message, "success");
                    setValidationResult(null);
                    return response.data;
                } catch (error: any) {
                    // Handle server-side validation errors
                    if (error.response?.status === 422) {
                        const result = {
                            valid_rows: error.response.data.valid_rows || 0,
                            total_rows: error.response.data.total_rows || 0,
                            errors: error.response.data.errors,
                        };
                        setValidationResult(result);
                        showNotification(
                            "Validation failed. Please check the errors below.",
                            "error"
                        );
                        throw error;
                    }

                    // Handle other errors
                    const errorMessage =
                        error.response?.data?.message ||
                        "Failed to import recipients";
                    showNotification(errorMessage, "error");
                    throw error;
                }
            } catch (error: any) {
                const errorMessage = error.message || "Failed to process file";
                showNotification(errorMessage, "error");
                throw error;
            } finally {
                setIsUploading(false);
            }
        },
        [
            fetchRecipients,
            paginationState.page,
            paginationState.rowsPerPage,
            templateId,
            useClientValidation,
            variables,
        ]
    );

    const getTemplate = useCallback(async (): Promise<{
        content: Blob;
        filename: string;
    } | null> => {
        try {
            let content: Blob;
            let serverResponse: any = null;

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
                console.log("Requesting template download from server...");
                serverResponse = await axios.get(
                    `/admin/templates/${templateId}/recipients/template`,
                    {
                        responseType: "blob",
                        headers: {
                            Accept: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                        },
                    }
                );
                console.log("Server response:", serverResponse.status);

                if (!serverResponse.data) {
                    showNotification(
                        "No template data received from server",
                        "error"
                    );
                    return null;
                }

                if (serverResponse.status !== 200) {
                    showNotification(
                        `Server returned status ${serverResponse.status}`,
                        "error"
                    );
                    return null;
                }

                content = new Blob([serverResponse.data], {
                    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                });

                if (content.size === 0) {
                    showNotification(
                        "Received empty template from server",
                        "error"
                    );
                    return null;
                }
            }

            if (!content) {
                showNotification(
                    "Failed to generate template content",
                    "error"
                );
                return null;
            }

            // Set filename based on generation method
            const filename = useClientTemplate
                ? `template_${templateId}_recipients_client.xlsx`
                : serverResponse?.headers?.["content-disposition"]
                      ?.split("filename=")[1]
                      ?.replace(/"/g, "") ||
                  `template_${templateId}_recipients_server.xlsx`;

            return {
                content,
                filename,
            };
        } catch (error: any) {
            console.error("Template download error:", error);
            const errorMessage =
                error.response?.data?.message ||
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
            if (useClientValidation) {
                const result = await excelUtils.validateExcelInBrowser(
                    selectedFile,
                    variables
                );
                setValidationResult(result);
            } else {
                // If not using client validation, just import directly
                await importRecipients(selectedFile);
                setShowImportDialog(false);
                setSelectedFile(null);
                setValidationResult(null);
            }
        } catch (error) {
            // Error handling is done in the respective functions
        } finally {
            setIsUploading(false);
        }
    }, [selectedFile, useClientValidation, variables, importRecipients]);

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
                // Validate key variable value
                const keyVariable = variables.find((v) => v.is_key);
                if (keyVariable && data.data[keyVariable.name] === "") {
                    throw new Error(
                        `${keyVariable.name} cannot be empty as it's a key identifier`
                    );
                }

                const response = await axios.put(
                    `/admin/templates/${templateId}/recipients/${recipientId}`,
                    data
                );

                setRecipients((prev) =>
                    prev.map((r) => (r.id === recipientId ? response.data : r))
                );

                showNotification("Recipient updated successfully", "success");
            } catch (error: any) {
                const errorMessage =
                    error.response?.data?.message ||
                    error.message ||
                    "Failed to update recipient";
                showNotification(errorMessage, "error");
                throw error;
            }
        },
        [templateId, variables]
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
