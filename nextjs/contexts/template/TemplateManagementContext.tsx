import React, {
    createContext,
    useContext,
    useState,
    useCallback,
    useMemo,
    useEffect,
} from "react";
import { useParams, useSearchParams } from "next/navigation";
import { Box, CircularProgress, Typography, Paper } from "@mui/material";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import { useTemplateCategoryManagement } from "./TemplateCategoryManagementContext";
import {
    Template,
    TemplateConfig,
    TemplateConfigQuery,
    useTemplateQuery,
} from "@/graphql/generated/types";
import { useTemplateGraphQL } from "./TemplateGraphQLContext";
import {
    mapSingleTemplate,
    mapTemplateConfig,
} from "@/utils/template/template-mappers";

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
    const searchParams = useSearchParams();
    const params = useParams<{ id: string }>();
    const id = params?.id;
    const { allTemplates, templateToManage } = useTemplateCategoryManagement();
    const { templateConfigQuery } = useTemplateGraphQL();

    const {
        data: apolloTemplateData,
        loading: apolloLoading,
        error: apolloError,
    } = useTemplateQuery({
        variables: { id: id ? parseInt(id, 10) : 0 },
        skip: !id,
        fetchPolicy: "cache-and-network", // This ensures we get cache updates and network updates
    });

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
        console.log("Fetching template data...");
        const fetchTemplate = async () => {
            setLoading(true);
            try {
                let template: Template | undefined | null = undefined;
                // First set from templateToManage if available
                if (templateToManage) {
                    template = templateToManage;
                }

                // Then check allTemplates for immediate UI update
                if (id && !templateToManage) {
                    const templateId = parseInt(id, 10);
                    const localTemplate = allTemplates.find((t) => t.id === templateId);
                    template = localTemplate;
                }

                // Finally, if we have Apollo data with additional fields, use that
                if (apolloTemplateData?.template) {
                    const t = mapSingleTemplate(apolloTemplateData);
                    if (t) {
                        template = t;
                    }
                }
                if (template) {
                    settemplate(template);
                } else {
                    setError("Template not found");
                    console.error("Template not found");
                }
            } catch (error: any) {
                setError(error.message ?? "Failed to load template");
                console.error("Error loading template:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchTemplate();
    }, [id, templateToManage, allTemplates, apolloTemplateData]);

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
