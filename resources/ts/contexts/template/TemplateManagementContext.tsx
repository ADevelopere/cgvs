import React, {
    createContext,
    useContext,
    useState,
    useCallback,
    useMemo,
    useEffect,
} from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import axios from "@/utils/axios";
import { Template, TemplateConfig } from "./template.types";
import { Box, CircularProgress, Typography, Button, Paper } from "@mui/material";
import RefreshIcon from '@mui/icons-material/Refresh';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

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
    template: Template | null;
    loading: boolean;
    setActiveTab: (tab: TabType) => void;
    setTabLoaded: (tab: TabType) => void;
    setUnsavedChanges: (hasChanges: boolean) => void;
    setTabError: (tab: TabType, error: TabError) => void;
    clearTabError: (tab: TabType) => void;
    fetchTemplate: (id: number) => Promise<void>;
    fetchConfig: () => Promise<void>;
}

const TemplateManagementContext = createContext<
    TemplateManagementContextType | undefined
>(undefined);

export const TemplateManagementProvider: React.FC<{
    children: React.ReactNode;
}> = ({ children }) => {
    const [searchParams] = useSearchParams();
    const { id } = useParams<{ id: string }>();

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

    const [template, settemplate] = useState<Template | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const tab = (searchParams.get("tab") || "basic") as TabType;
        setActiveTab(tab);
    }, [searchParams]);

    const handleSetTabLoaded = useCallback((tab: TabType) => {
        setLoadedTabs((prevTabs) =>
            prevTabs.includes(tab) ? prevTabs : [...prevTabs, tab]
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
        console.log("Fetching template with ID:", id);
        setLoading(true);
        try {
            const response = await axios.get<Template>(
                `/admin/templates/${id}`
            );
            settemplate(response.data);
            setLoading(false);
            console.log("Template fetched successfully:", response.data);
        } catch (error: any) {
            setError(
                error.response?.data?.message || "Failed to fetch template"
            );
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (id) {
            fetchTemplate(parseInt(id, 10));
        }
    }, [id, fetchTemplate]);

    const fetchConfig = useCallback(async () => {
        try {
            const response = await axios.get<TemplateConfig>(
                "/admin/templates/config"
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
        ]
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
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: '100%',
                    height: '100%',
                    p: 3
                }}
            >
                <Paper
                    elevation={3}
                    sx={{
                        p: 4,
                        textAlign: 'center',
                        maxWidth: 400,
                        width: '100%'
                    }}
                >
                    <ErrorOutlineIcon color="error" sx={{ fontSize: 64, mb: 2 }} />
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
            "useTemplateManagement must be used within a TemplateManagementProvider"
        );
    }
    return context;
};
