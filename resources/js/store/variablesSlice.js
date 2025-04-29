import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../utils/axios.js';

export const fetchVariables = createAsyncThunk(
  'variables/fetchVariables',
  async (templateId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/admin/templates/${templateId}/variables`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch variables');
    }
  }
);

export const createVariable = createAsyncThunk(
  'variables/createVariable',
  async ({ templateId, data }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`/admin/templates/${templateId}/variables`, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create variable');
    }
  }
);

export const updateVariable = createAsyncThunk(
  'variables/updateVariable',
  async ({ templateId, variableId, data }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`/admin/templates/${templateId}/variables/${variableId}`, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update variable');
    }
  }
);

export const deleteVariable = createAsyncThunk(
  'variables/deleteVariable',
  async ({ templateId, variableId }, { rejectWithValue }) => {
    try {
      await axios.delete(`/admin/templates/${templateId}/variables/${variableId}`);
      return variableId;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete variable');
    }
  }
);

const initialState = {
  variables: [],
  loading: false,
  error: null
};

const variablesSlice = createSlice({
  name: 'variables',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchVariables.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchVariables.fulfilled, (state, action) => {
        state.loading = false;
        state.variables = action.payload;
      })
      .addCase(fetchVariables.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createVariable.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createVariable.fulfilled, (state, action) => {
        state.loading = false;
        state.variables.push(action.payload);
      })
      .addCase(createVariable.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateVariable.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateVariable.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.variables.findIndex(v => v.id === action.payload.id);
        if (index !== -1) {
          state.variables[index] = action.payload;
        }
      })
      .addCase(updateVariable.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteVariable.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteVariable.fulfilled, (state, action) => {
        state.loading = false;
        state.variables = state.variables.filter(v => v.id !== action.payload);
      })
      .addCase(deleteVariable.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export default variablesSlice.reducer;
