import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../utils/axios.js';

export const fetchTemplates = createAsyncThunk(
  'templates/fetchTemplates',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('/admin/templates');
      return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch templates');
    }
  }
);

export const fetchConfig = createAsyncThunk(
  'templates/fetchConfig',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('/admin/templates/config');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch config');
    }
  }
);

export const createTemplate = createAsyncThunk(
  'templates/createTemplate',
  async (templateData, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      
      // Add the name and description fields
      formData.append('name', templateData.name || '');
      formData.append('description', templateData.description || '');
      
      // Add the background file if it exists
      if (templateData.background instanceof File) {
        formData.append('background', templateData.background);
      }
      
      console.log('Sending template data:', {
        name: templateData.name,
        description: templateData.description,
        hasBackground: !!templateData.background
      });
      
      const response = await axios.post('/admin/templates', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Accept': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Template creation error:', error.response?.data);
      return rejectWithValue(
        error.response?.data?.errors || 
        error.response?.data?.message || 
        'Failed to create template'
      );
    }
  }
);

const initialState = {
  templates: [],
  loading: false,
  error: null,
  currentTemplate: null,
  config: {
    maxFileSize: 2048 // Default 2MB in KB
  }
};

const templateSlice = createSlice({
  name: 'templates',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTemplates.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTemplates.fulfilled, (state, action) => {
        state.loading = false;
        state.templates = action.payload;
      })
      .addCase(fetchTemplates.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchConfig.fulfilled, (state, action) => {
        state.config = action.payload;
      })
      .addCase(createTemplate.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createTemplate.fulfilled, (state, action) => {
        state.loading = false;
        state.templates.push(action.payload);
      })
      .addCase(createTemplate.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export default templateSlice.reducer;
