import {
    createContext,
    useContext,
    useState,
    ReactNode,
    useCallback,
    useEffect,
    useMemo,
} from "react";
import axios from "@/utils/axios";
import { Template, TemplateConfig } from "./template.types";
import { useNavigate } from "react-router-dom";

type Templatecreated_ata = {
    name: string;
    description?: string;
    background?: File;
};

// Context
type TemplatesContextType = {
    templates: Template[];
    loading: boolean;
    error: string | null;
    config: TemplateConfig;
    templateToManage?: Template;
    fetchTemplates: () => Promise<void>;
    createTemplate: (templateData: Templatecreated_ata) => Promise<void>;
    fetchConfig: () => Promise<void>;
    manageTemplate: (templateId: number) => void;
};

const defaultConfig: TemplateConfig = {
    maxFileSize: 2048, // Default 2MB in KB
};

const TemplateContext = createContext<TemplatesContextType | undefined>(
    undefined
);

// Provider
export function TemplateProvider({ children }: { children: ReactNode }) {
    const navigate = useNavigate();
    const [templates, setTemplates] = useState<Template[]>([]);
    const [templateToManage, setTemplateToManage] = useState<Template | undefined>(
        undefined
    );
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [config, setConfig] = useState<TemplateConfig>(defaultConfig);

    const fetchTemplates = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get<Template[]>("/admin/templates");
            const templates = Array.isArray(response.data) ? response.data : [];
            setTemplates(templates);
        } catch (error: any) {
            setError(
                error.response?.data?.message || "Failed to fetch templates"
            );
        } finally {
            setLoading(false);
        }
    }, []);

    const createTemplate = useCallback(
        async (templateData: Templatecreated_ata) => {
            setLoading(true);
            setError(null);
            try {
                const formData = new FormData();
                formData.append("name", templateData.name || "");
                formData.append("description", templateData.description || "");

                if (templateData.background instanceof File) {
                    formData.append("background", templateData.background);
                }

                const response = await axios.post<Template>(
                    "/admin/templates",
                    formData,
                    {
                        headers: {
                            "Content-Type": "multipart/form-data",
                            Accept: "application/json",
                        },
                    }
                );
                setTemplates((prev) => [...prev, response.data]);
            } catch (error: any) {
                setError(
                    error.response?.data?.errors ||
                        error.response?.data?.message ||
                        "Failed to create template"
                );
            } finally {
                setLoading(false);
            }
        },
        []
    );

    const fetchConfig = useCallback(async () => {
        try {
            const response = await axios.get<TemplateConfig>(
                "/admin/templates/config"
            );
            setConfig(response.data);
        } catch (error: any) {
            setError(error.response?.data?.message || "Failed to fetch config");
        }
    }, []);

    useEffect(() => {
        fetchConfig().catch((error: Error) => {
            console.error("Error fetching config:", error);
        });
    }, [fetchConfig]);

    const manageTemplate = useCallback(
        (templateId: number) => {
            const template = templates.find((t) => t.id === templateId);
            if (!template) {
                setError("Template not found");
                console.error("Template not found");
                return;
            }
            setTemplateToManage(template);
            navigate(`/admin/templates/${templateId}/manage`);
        },
        [navigate, templates]
    );

    const value = useMemo(
        () => ({
            templates,
            templateToManage,
            loading,
            error,
            config,
            fetchTemplates,
            createTemplate,
            fetchConfig,
            manageTemplate,
        }),
        [
            templates,
            loading,
            error,
            config,
            fetchTemplates,
            createTemplate,
            fetchConfig,
        ]
    );

    return (
        <TemplateContext.Provider value={value}>
            {children}
        </TemplateContext.Provider>
    );
}

// Custom hook
export function useTemplate() {
    const context = useContext(TemplateContext);
    if (context === undefined) {
        throw new Error("useTemplate must be used within a TemplateProvider");
    }
    return context;
}
