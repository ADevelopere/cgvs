import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "@/utils/axios";

export type Template = {
    id: number;
    name: string;
    description?: string;
    background_path?: string;
    required_variables?: string[];
    is_active: boolean;
    created_at: string;
    updated_at: string;
    deleted_at?: string;
};

export type TemplateState = {
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

export type TemplateConfig = {
    maxFileSize: number; // in KB
};

export const fetchTemplates = createAsyncThunk<
    Template[],
    void,
    { rejectValue: string }
>("templates/fetchTemplates", async (_, { rejectWithValue }) => {
    try {
        const response = await axios.get<Template[]>("/admin/templates");
        return Array.isArray(response.data) ? response.data : [];
    } catch (error: any) {
        return rejectWithValue(
            error.response?.data?.message || "Failed to fetch templates"
        );
    }
});

export const fetchConfig = createAsyncThunk<
    TemplateConfig,
    void,
    { rejectValue: string }
>("templates/fetchConfig", async (_, { rejectWithValue }) => {
    try {
        const response = await axios.get<TemplateConfig>(
            "/admin/templates/config"
        );
        return response.data;
    } catch (error: any) {
        return rejectWithValue(
            error.response?.data?.message || "Failed to fetch config"
        );
    }
});

export const fetchTemplate = createAsyncThunk<
    Template,
    number,
    { rejectValue: string }
>("templates/fetchTemplate", async (id, { rejectWithValue }) => {
    try {
        const response = await axios.get<Template>(`/admin/templates/${id}`);
        return response.data;
    } catch (error: any) {
        return rejectWithValue(
            error.response?.data?.message || "Failed to fetch template"
        );
    }
});

export const createTemplate = createAsyncThunk<
    Template,
    TemplateCreateData,
    { rejectValue: string }
>("templates/createTemplate", async (templateData, { rejectWithValue }) => {
    try {
        const formData = new FormData();

        // Add the name and description fields
        formData.append("name", templateData.name || "");
        formData.append("description", templateData.description || "");

        // Add the background file if it exists
        if (templateData.background instanceof File) {
            formData.append("background", templateData.background);
        }

        console.log("Sending template data:", {
            name: templateData.name,
            description: templateData.description,
            hasBackground: !!templateData.background,
        });

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
        return response.data;
    } catch (error: any) {
        console.error("Template creation error:", error.response?.data);
        return rejectWithValue(
            error.response?.data?.errors ||
                error.response?.data?.message ||
                "Failed to create template"
        );
    }
});

const initialState: TemplateState = {
    templates: [],
    loading: false,
    error: null,
    currentTemplate: null,
    config: {
        maxFileSize: 2048, // Default 2MB in KB
    },
};

const templateSlice = createSlice({
    name: "templates",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchTemplates.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(
                fetchTemplates.fulfilled,
                (state, action: PayloadAction<Template[]>) => {
                    state.loading = false;
                    state.templates = action.payload;
                }
            )
            .addCase(fetchTemplates.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload ?? "An error occurred";
            })
            .addCase(
                fetchConfig.fulfilled,
                (state, action: PayloadAction<TemplateConfig>) => {
                    state.config = action.payload;
                }
            )
            .addCase(createTemplate.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(
                createTemplate.fulfilled,
                (state, action: PayloadAction<Template>) => {
                    state.loading = false;
                    state.templates.push(action.payload);
                }
            )
            .addCase(createTemplate.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload ?? "An error occurred";
            })
            .addCase(fetchTemplate.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(
                fetchTemplate.fulfilled,
                (state, action: PayloadAction<Template>) => {
                    state.loading = false;
                    state.currentTemplate = action.payload;
                }
            )
            .addCase(fetchTemplate.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload ?? "An error occurred";
            });
    },
});

// Type-safe selectors
export const selectTemplates = (state: {
    templates: TemplateState;
}): Template[] => state.templates.templates;
export const selectCurrentTemplate = (state: {
    templates: TemplateState;
}): Template | null => state.templates.currentTemplate;
export const selectLoading = (state: { templates: TemplateState }): boolean =>
    state.templates.loading;
export const selectError = (state: {
    templates: TemplateState;
}): string | null => state.templates.error;
export const selectConfig = (state: {
    templates: TemplateState;
}): TemplateConfig => state.templates.config;

export default templateSlice.reducer;
