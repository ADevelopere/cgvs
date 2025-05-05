import React, {
    createContext,
    useContext,
    useState,
    useCallback,
    useMemo,
    useEffect,
} from "react";
import { useParams, useSearchParams } from "react-router-dom";
import axios from "@/utils/axios";
import { Template, TemplateConfig } from "./template.types";
import {
    Box,
    CircularProgress,
    Typography,
    Button,
    Paper,
} from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import { useTemplate } from "./TemplatesContext";

export type TabType =
    | "basic"
    | "variables"
    | "editor"
    | "recipients"
    | "preview";

export interface TabError {
    message: string;
}

const defaultConfig: TemplateConfig = {
    maxFileSize: 2048, // Default 2MB in KB
};

interface TemplateManagementContextType {
    activeTab: TabType;
    unsavedChanges: boolean;
    loadedTabs: TabType[];
    error: string | undefined;
    tabErrors: Record<TabType, TabError | undefined>;
    config: TemplateConfig;
    template: Template;
    loading: boolean;
    setActiveTab: (tab: TabType) => void;
    setTabLoaded: (tab: TabType) => void;
    setUnsavedChanges: (hasChanges: boolean) => void;
    setTabError: (tab: TabType, error: TabError) => void;
    clearTabError: (tab: TabType) => void;
    fetchTemplate: (id: number) => Promise<void>;
    fetchConfig: () => Promise<void>;
    saveTemplate: (data: FormData) => Promise<void>;
}

const TemplateManagementContext = createContext<
    TemplateManagementContextType | undefined
>(undefined);

export const TemplateManagementProvider: React.FC<{
    children: React.ReactNode;
}> = ({ children }) => {
    const [searchParams] = useSearchParams();
    const { id } = useParams<{ id: string }>();
    const { templateToManage } = useTemplate();

    const [config, setConfig] = useState<TemplateConfig>(defaultConfig);

    const [activeTab, setActiveTab] = useState<TabType>("basic");
    const [unsavedChanges, setUnsavedChanges] = useState(false);
    const [loadedTabs, setLoadedTabs] = useState<TabType[]>([]);
    const [error, setError] = useState<string | undefined>(undefined);
    const [tabErrors, setTabErrors] = useState<
        Record<TabType, TabError | undefined>
    >({
        basic: undefined,
        variables: undefined,
        editor: undefined,
        recipients: undefined,
        preview: undefined,
    });

    const [template, settemplate] = useState<Template | undefined>(
        templateToManage,
    );

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const tab = (searchParams.get("tab") || "basic") as TabType;
        setActiveTab(tab);
    }, [searchParams]);

    const handleSetTabLoaded = useCallback((tab: TabType) => {
        setLoadedTabs((prevTabs) =>
            prevTabs.includes(tab) ? prevTabs : [...prevTabs, tab],
        );
    }, []);

    const handleSetTabError = useCallback((tab: TabType, error: TabError) => {
        setTabErrors((prev) => ({
            ...prev,
            [tab]: error,
        }));
    }, []);

    const handleClearTabError = useCallback((tab: TabType) => {
        setTabErrors((prev) => ({
            ...prev,
            [tab]: undefined,
        }));
    }, []);

    const fetchTemplate = useCallback(async (id: number) => {
        setLoading(true);
        try {
            const response = await axios.get<Template>(
                `/admin/templates/${id}`,
            );
            settemplate(response.data);
            setLoading(false);
        } catch (error: any) {
            setError(
                error.response?.data?.message || "Failed to fetch template",
            );
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (templateToManage) {
            settemplate(templateToManage);
        }
        if (id && !templateToManage) {
            fetchTemplate(parseInt(id, 10));
        }
    }, [id, fetchTemplate]);

    const fetchConfig = useCallback(async () => {
        try {
            const response = await axios.get<TemplateConfig>(
                "/admin/templates/config",
            );
            setConfig(response.data);
        } catch (error: any) {
            // setError(error.response?.data?.message || "Failed to fetch config");
            setTabErrors((prev) => ({
                ...prev,
                basic: {
                    message:
                        error.response?.data?.message ||
                        "Failed to fetch config",
                },
            }));
        }
    }, []);

    useEffect(() => {
        fetchConfig().catch((error: Error) => {
            console.error("Error fetching config:", error);
        });
    }, [fetchConfig]);

    const saveTemplate = useCallback(
        async (formData: FormData) => {
            try {
                const url = template
                    ? `/admin/templates/${template.id}`
                    : "/admin/templates";
                const method = "post";

                // Add _method field for Laravel to handle PUT requests if it's an update
                if (template) {
                    formData.append("_method", "PUT");
                }

                const response = await axios({
                    method,
                    url,
                    data: formData,
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                });

                settemplate(response.data);
                setUnsavedChanges(false);
                return response.data;
            } catch (error: any) {
                throw new Error(
                    error.response?.data?.message ||
                        "An error occurred while saving the template",
                );
            }
        },
        [template],
    );

    const value = useMemo(
        () => ({
            activeTab,
            unsavedChanges,
            loadedTabs,
            error,
            tabErrors,
            config,
            template,
            loading,
            setActiveTab,
            setTabLoaded: handleSetTabLoaded,
            setUnsavedChanges,
            setTabError: handleSetTabError,
            clearTabError: handleClearTabError,
            fetchTemplate,
            fetchConfig,
            saveTemplate,
        }),
        [
            activeTab,
            unsavedChanges,
            loadedTabs,
            error,
            tabErrors,
            template,
            loading,
            handleSetTabLoaded,
            handleSetTabError,
            handleClearTabError,
            fetchTemplate,
            saveTemplate,
        ],
    );

    if (loading) {
        return (
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    width: "100%",
                    height: "100%",
                }}
            >
                <CircularProgress />
            </Box>
        );
    }

    if (error || !template) {
        return (
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    width: "100%",
                    height: "100%",
                    p: 3,
                }}
            >
                <Paper
                    elevation={3}
                    sx={{
                        p: 4,
                        textAlign: "center",
                        maxWidth: 400,
                        width: "100%",
                    }}
                >
                    <ErrorOutlineIcon
                        color="error"
                        sx={{ fontSize: 64, mb: 2 }}
                    />
                    <Typography variant="h6" color="error" gutterBottom>
                        Error Loading Template
                    </Typography>
                    <Typography color="text.secondary" sx={{ mb: 3 }}>
                        {error}
                    </Typography>
                    <Button
                        variant="contained"
                        startIcon={<RefreshIcon />}
                        onClick={() => {
                            setError(undefined);
                            if (id) {
                                fetchTemplate(parseInt(id, 10));
                            }
                        }}
                    >
                        Try Again
                    </Button>
                </Paper>
            </Box>
        );
    }

    return (
        <TemplateManagementContext.Provider value={value}>
            {children}
        </TemplateManagementContext.Provider>
    );
};

export const useTemplateManagement = () => {
    const context = useContext(TemplateManagementContext);
    if (context === undefined) {
        throw new Error(
            "useTemplateManagement must be used within a TemplateManagementProvider",
        );
    }
    return context;
};
