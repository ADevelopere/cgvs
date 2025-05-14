import React, {
    createContext,
    useContext,
    useState,
    useCallback,
    useMemo,
    useEffect,
} from "react";
import { useParams, useSearchParams } from "react-router-dom";
import {
    Box,
    CircularProgress,
    Typography,
    Paper,
} from "@mui/material";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import { useTemplateCategoryManagement } from "./TemplateCategoryManagementContext";
import {
    Template,
    TemplateConfig,
    TemplateConfigQuery,
} from "@/graphql/generated/types";
import { useTemplateGraphQL } from "./TemplateGraphQLContext";
import { mapTemplateConfig } from "@/utils/template/template-mappers";

export type TemplateManagementTabType =
    | "basic"
    | "variables"
    | "editor"
    | "recipients"
    | "preview";

export interface TabError {
    message: string;
}

const defaultConfig: TemplateConfig = {
    maxBackgroundSize: 5125048, // Default 2MB in KB
    allowedFileTypes: ["image/jpeg", "image/png"],
};

interface TemplateManagementContextType {
    activeTab: TemplateManagementTabType;
    unsavedChanges: boolean;
    loadedTabs: TemplateManagementTabType[];
    error: string | undefined;
    tabErrors: Record<TemplateManagementTabType, TabError | undefined>;
    config: TemplateConfig;
    template: Template | undefined;
    loading: boolean;
    setActiveTab: (tab: TemplateManagementTabType) => void;
    setTabLoaded: (tab: TemplateManagementTabType) => void;
    setUnsavedChanges: (hasChanges: boolean) => void;
    setTabError: (tab: TemplateManagementTabType, error: TabError) => void;
    clearTabError: (tab: TemplateManagementTabType) => void;
}

const TemplateManagementContext = createContext<
    TemplateManagementContextType | undefined
>(undefined);

export const TemplateManagementProvider: React.FC<{
    children: React.ReactNode;
}> = ({ children }) => {
    const [searchParams] = useSearchParams();
    const { id } = useParams<{ id: string }>();
    const { allTemplates, templateToManage } =
        useTemplateCategoryManagement();
    const { templateConfigQuery } = useTemplateGraphQL();

    const [config, setConfig] = useState<TemplateConfig>(defaultConfig);

    const [activeTab, setActiveTab] =
        useState<TemplateManagementTabType>("basic");
    const [unsavedChanges, setUnsavedChanges] = useState(false);
    const [loadedTabs, setLoadedTabs] = useState<TemplateManagementTabType[]>(
        [],
    );
    const [error, setError] = useState<string | undefined>(undefined);
    const [tabErrors, setTabErrors] = useState<
        Record<TemplateManagementTabType, TabError | undefined>
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
        const tab = (searchParams.get("tab") ??
            "basic") as TemplateManagementTabType;
        setActiveTab(tab);
    }, [searchParams]);

    const handleSetTabLoaded = useCallback((tab: TemplateManagementTabType) => {
        setLoadedTabs((prevTabs) =>
            prevTabs.includes(tab) ? prevTabs : [...prevTabs, tab],
        );
    }, []);

    const handleSetTabError = useCallback(
        (tab: TemplateManagementTabType, error: TabError) => {
            setTabErrors((prev) => ({
                ...prev,
                [tab]: error,
            }));
        },
        [],
    );

    const handleClearTabError = useCallback(
        (tab: TemplateManagementTabType) => {
            setTabErrors((prev) => ({
                ...prev,
                [tab]: undefined,
            }));
        },
        [],
    );

    useEffect(() => {
        setLoading(true);
        if (templateToManage) {
            settemplate(templateToManage);
        }
        if (id && !templateToManage) {
            const template = allTemplates.find((t) => t.id === id, 10);
            if (!template) {
                setError("Template not found");
                console.error("Template not found");
                setLoading(false);
                return;
            }
            settemplate(template);
        }
        setLoading(false);
    }, [id]);

    // update the template when allTemplates changes
    useEffect(() => {
        if (allTemplates && allTemplates.length > 0) {
            const template = allTemplates.find((t) => t.id === id, 10);
            if (template) {
                settemplate(template);
            }
        }
    }, [allTemplates]);

    const fetchConfig = useCallback(async () => {
        try {
            const data: TemplateConfigQuery = await templateConfigQuery();
            if (data) {
                const config = mapTemplateConfig(data);
                setConfig(config);
            } else {
                setError("Failed to fetch template config");
                setTabErrors((prev) => ({
                    ...prev,
                    basic: {
                        message: "Failed to fetch template config",
                    },
                }));
            }
        } catch (error: any) {
            setError(
                error.response?.data?.message ??
                    "Failed to fetch template config",
            );
            setTabErrors((prev) => ({
                ...prev,
                basic: {
                    message:
                        error.response?.data?.message ??
                        "Failed to fetch template config",
                },
            }));
        }
    }, [templateConfigQuery]);

    useEffect(() => {
        fetchConfig();
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
                    {/* <Button
                        variant="contained"
                        startIcon={<RefreshIcon />}
                        onClick={() => {
                        }}
                    >
                        Try Again
                    </Button> */}
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
