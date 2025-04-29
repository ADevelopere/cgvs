import {
    createContext,
    useContext,
    useReducer,
    ReactNode,
    useCallback,
    useEffect,
} from "react";
import axios from "@/utils/axios";
import { Template, TemplateConfig } from "./template.types";

// Types


type TemplateState = {
    templates: Template[];
    loading: boolean;
    error: string | null;
    currentTemplate: Template | null;
    config: TemplateConfig;
};

type TemplateCreateData = {
    name: string;
    description?: string;
    background?: File;
};

// Actions
type TemplateAction =
    | { type: "SET_LOADING" }
    | { type: "SET_ERROR"; payload: string | null }
    | { type: "SET_TEMPLATES"; payload: Template[] }
    | { type: "SET_CURRENT_TEMPLATE"; payload: Template | null }
    | { type: "SET_CONFIG"; payload: TemplateConfig }
    | { type: "ADD_TEMPLATE"; payload: Template };

// Context
type TemplateContextType = {
    state: TemplateState;
    fetchTemplates: () => Promise<void>;
    fetchTemplate: (id: number) => Promise<void>;
    createTemplate: (templateData: TemplateCreateData) => Promise<void>;
    fetchConfig: () => Promise<void>;
};

const initialState: TemplateState = {
    templates: [],
    loading: false,
    error: null,
    currentTemplate: null,
    config: {
        maxFileSize: 2048, // Default 2MB in KB
    },
};

const TemplateContext = createContext<TemplateContextType | undefined>(
    undefined
);

// Reducer
function templateReducer(
    state: TemplateState,
    action: TemplateAction
): TemplateState {
    switch (action.type) {
        case "SET_LOADING":
            return { ...state, loading: true, error: null };
        case "SET_ERROR":
            return { ...state, loading: false, error: action.payload };
        case "SET_TEMPLATES":
            return { ...state, loading: false, templates: action.payload };
        case "SET_CURRENT_TEMPLATE":
            return {
                ...state,
                loading: false,
                currentTemplate: action.payload,
            };
        case "SET_CONFIG":
            return { ...state, config: action.payload };
        case "ADD_TEMPLATE":
            return {
                ...state,
                loading: false,
                templates: [...state.templates, action.payload],
            };
        default:
            return state;
    }
}

// Provider
export function TemplateProvider({ children }: { children: ReactNode }) {
    const [state, dispatch] = useReducer(templateReducer, initialState);

    const fetchTemplates = useCallback(async () => {
        dispatch({ type: "SET_LOADING" });
        try {
            const response = await axios.get<Template[]>("/admin/templates");
            const templates = Array.isArray(response.data) ? response.data : [];
            dispatch({ type: "SET_TEMPLATES", payload: templates });
        } catch (error: any) {
            dispatch({
                type: "SET_ERROR",
                payload:
                    error.response?.data?.message ||
                    "Failed to fetch templates",
            });
        }
    }, []);

    const fetchTemplate = useCallback(async (id: number) => {
        dispatch({ type: "SET_LOADING" });
        try {
            const response = await axios.get<Template>(
                `/admin/templates/${id}`
            );
            dispatch({ type: "SET_CURRENT_TEMPLATE", payload: response.data });
        } catch (error: any) {
            dispatch({
                type: "SET_ERROR",
                payload:
                    error.response?.data?.message || "Failed to fetch template",
            });
        }
    }, []);

    const createTemplate = useCallback(
        async (templateData: TemplateCreateData) => {
            dispatch({ type: "SET_LOADING" });
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
                dispatch({ type: "ADD_TEMPLATE", payload: response.data });
            } catch (error: any) {
                dispatch({
                    type: "SET_ERROR",
                    payload:
                        error.response?.data?.errors ||
                        error.response?.data?.message ||
                        "Failed to create template",
                });
            }
        },
        []
    );

    const fetchConfig = useCallback(async () => {
        try {
            const response = await axios.get<TemplateConfig>(
                "/admin/templates/config"
            );
            dispatch({ type: "SET_CONFIG", payload: response.data });
        } catch (error: any) {
            dispatch({
                type: "SET_ERROR",
                payload:
                    error.response?.data?.message || "Failed to fetch config",
            });
        }
    }, []);

    useEffect(() => {
        fetchConfig().catch((error: Error) => {
            console.error("Error fetching config:", error);
        });
    }, [fetchConfig]);

    const value = {
        state,
        fetchTemplates,
        fetchTemplate,
        createTemplate,
        fetchConfig,
    };

    return (
        <TemplateContext.Provider value={value}>
            {children}
        </TemplateContext.Provider>
    );
}

// Custom hooks
export function useTemplate() {
    const context = useContext(TemplateContext);
    if (context === undefined) {
        throw new Error("useTemplate must be used within a TemplateProvider");
    }
    return context;
}

// Selector hooks
export const useTemplates = () => useTemplate().state.templates;
export const useCurrentTemplate = () => useTemplate().state.currentTemplate;
export const useTemplateLoading = () => useTemplate().state.loading;
export const useTemplateError = () => useTemplate().state.error;
export const useTemplateConfig = () => useTemplate().state.config;
