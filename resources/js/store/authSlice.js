import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../utils/axios';

export const login = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      // First, get the CSRF cookie from the root URL
      await axios.get('/sanctum/csrf-cookie', { baseURL: '' });
      
      const response = await axios.post('/login', credentials);
      if (response.data.token) {
        localStorage.setItem('auth_token', response.data.token);
      }
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Login failed');
    }
  }
);

export const checkAuth = createAsyncThunk(
  'auth/checkAuth',
  async (_, { dispatch }) => {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      dispatch(setLoading(false));
      return null;
    }
    
    try {
      // Ensure the token is in the Authorization header
      const response = await axios.get('/user', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.data) {
        return response.data;
      }
      localStorage.removeItem('auth_token');
      return null;
    } catch (error) {
      localStorage.removeItem('auth_token');
      return null;
    }
  }
);

const initialState = {
  user: null,
  token: localStorage.getItem('auth_token'),
  isAuthenticated: !!localStorage.getItem('auth_token'),
  isLoading: true,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isLoading = false;
      localStorage.setItem('auth_token', action.payload.token);
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
      state.isLoading = false;
      localStorage.removeItem('auth_token');
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isLoading = false;
        localStorage.setItem('auth_token', action.payload.token);
      })
      .addCase(login.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload) {
          state.isAuthenticated = true;
          state.user = action.payload;
          state.token = localStorage.getItem('auth_token'); // Ensure token is synced
        } else {
          state.isAuthenticated = false;
          state.user = null;
          state.token = null;
          localStorage.removeItem('auth_token'); // Clear token if auth check fails
        }
      });
  },
});

export const { loginSuccess, logout, setLoading } = authSlice.actions;

export default authSlice.reducer;
