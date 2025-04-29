import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "@/utils/axios";
import { RootState } from "./store.types";

export type VariableType = "text" | "date" | "number" | "gender";

export type TemplateVariable = {
    id: number;
    template_id: number;
    name: string;
    type: VariableType;
    description?: string;
    validation_rules?: Record<string, any>;
    preview_value?: string;
    created_at: string;
    updated_at: string;
};

export type VariablesState = {
    variables: TemplateVariable[];
    loading: boolean;
    error: string | null;
};

interface CreateVariablePayload {
    templateId: number;
    data: Omit<
        TemplateVariable,
        "id" | "template_id" | "created_at" | "updated_at"
    >;
}

interface UpdateVariablePayload extends CreateVariablePayload {
    variableId: number;
}

interface DeleteVariablePayload {
    templateId: number;
    variableId: number;
}

export const fetchVariables = createAsyncThunk<
    TemplateVariable[],
    number,
    { rejectValue: string }
>("variables/fetchVariables", async (templateId, { rejectWithValue }) => {
    try {
        const response = await axios.get<TemplateVariable[]>(
            `/admin/templates/${templateId}/variables`
        );
        return response.data;
    } catch (error: any) {
        return rejectWithValue(
            error.response?.data?.message || "Failed to fetch variables"
        );
    }
});

export const createVariable = createAsyncThunk<
    TemplateVariable,
    CreateVariablePayload,
    { rejectValue: string }
>(
    "variables/createVariable",
    async ({ templateId, data }, { rejectWithValue }) => {
        try {
            const response = await axios.post<TemplateVariable>(
                `/admin/templates/${templateId}/variables`,
                data
            );
            return response.data;
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to create variable"
            );
        }
    }
);

export const updateVariable = createAsyncThunk<
    TemplateVariable,
    UpdateVariablePayload,
    { rejectValue: string }
>(
    "variables/updateVariable",
    async ({ templateId, variableId, data }, { rejectWithValue }) => {
        try {
            const response = await axios.put<TemplateVariable>(
                `/admin/templates/${templateId}/variables/${variableId}`,
                data
            );
            return response.data;
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to update variable"
            );
        }
    }
);

export const deleteVariable = createAsyncThunk<
    number,
    DeleteVariablePayload,
    { rejectValue: string }
>(
    "variables/deleteVariable",
    async ({ templateId, variableId }, { rejectWithValue }) => {
        try {
            await axios.delete(
                `/admin/templates/${templateId}/variables/${variableId}`
            );
            return variableId;
        } catch (error: any) {
            return rejectWithValue(
                error.response?.data?.message || "Failed to delete variable"
            );
        }
    }
);

const initialState: VariablesState = {
    variables: [],
    loading: false,
    error: null,
};

const variablesSlice = createSlice({
    name: "variables",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchVariables.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(
                fetchVariables.fulfilled,
                (state, action: PayloadAction<TemplateVariable[]>) => {
                    state.loading = false;
                    state.variables = action.payload;
                }
            )
            .addCase(fetchVariables.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload ?? "An error occurred";
            })
            .addCase(createVariable.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(
                createVariable.fulfilled,
                (state, action: PayloadAction<TemplateVariable>) => {
                    state.loading = false;
                    state.variables.push(action.payload);
                }
            )
            .addCase(createVariable.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload ?? "An error occurred";
            })
            .addCase(updateVariable.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(
                updateVariable.fulfilled,
                (state, action: PayloadAction<TemplateVariable>) => {
                    state.loading = false;
                    const index = state.variables.findIndex(
                        (v) => v.id === action.payload.id
                    );
                    if (index !== -1) {
                        state.variables[index] = action.payload;
                    }
                }
            )
            .addCase(updateVariable.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload ?? "An error occurred";
            })
            .addCase(deleteVariable.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(
                deleteVariable.fulfilled,
                (state, action: PayloadAction<number>) => {
                    state.loading = false;
                    state.variables = state.variables.filter(
                        (v) => v.id !== action.payload
                    );
                }
            )
            .addCase(deleteVariable.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload ?? "An error occurred";
            });
    },
});

export const selectVariables = (state: RootState) => state.variables.variables;
export const selectLoading = (state: RootState) => state.variables.loading;
export const selectError = (state: RootState) => state.variables.error;

export default variablesSlice.reducer;
