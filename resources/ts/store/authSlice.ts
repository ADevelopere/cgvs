import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "@/utils/axios";

export type User ={
    id: number;
    name: string;
    email: string;
    is_admin: boolean;
    email_verified_at?: string;
    created_at: string;
    updated_at: string;
}

export type LoginCredentials ={
    email: string;
    password: string;
}

export type LoginResponse ={
    user: User;
    token: string;
}

export type AuthState = {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
};

export const login = createAsyncThunk<
    LoginResponse,
    LoginCredentials,
    { rejectValue: string }
>("auth/login", async (credentials, { rejectWithValue }) => {
    try {
        // First, get the CSRF cookie from the root URL
        await axios.get("/sanctum/csrf-cookie", { baseURL: "" });

        const response = await axios.post<LoginResponse>("/login", credentials);
        if (response.data.token) {
            localStorage.setItem("auth_token", response.data.token);
        }
        return response.data;
    } catch (error: any) {
        return rejectWithValue(error.response?.data || "Login failed");
    }
});

export const checkAuth = createAsyncThunk<User | null>(
    "auth/checkAuth",
    async (_, { dispatch }) => {
        const token = localStorage.getItem("auth_token");
        if (!token) {
            dispatch(setLoading(false));
            return null;
        }

        try {
            // Ensure the token is in the Authorization header
            const response = await axios.get<User>("/user", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (response.data) {
                return response.data;
            }
            localStorage.removeItem("auth_token");
            return null;
        } catch (error) {
            localStorage.removeItem("auth_token");
            return null;
        }
    }
);

const initialState: AuthState = {
    user: null,
    token: localStorage.getItem("auth_token"),
    isAuthenticated: !!localStorage.getItem("auth_token"),
    isLoading: true,
};

export const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        loginSuccess: (state, action: PayloadAction<LoginResponse>) => {
            state.isAuthenticated = true;
            state.user = action.payload.user;
            state.token = action.payload.token;
            state.isLoading = false;
            localStorage.setItem("auth_token", action.payload.token);
        },
        logout: (state) => {
            state.isAuthenticated = false;
            state.user = null;
            state.token = null;
            state.isLoading = false;
            localStorage.removeItem("auth_token");
        },
        setLoading: (state, action: PayloadAction<boolean>) => {
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
                localStorage.setItem("auth_token", action.payload.token);
            })
            .addCase(login.rejected, (state) => {
                state.isLoading = false;
            })
            .addCase(checkAuth.fulfilled, (state, action) => {
                state.isLoading = false;
                if (action.payload) {
                    state.isAuthenticated = true;
                    state.user = action.payload;
                    state.token = localStorage.getItem("auth_token"); // Ensure token is synced
                } else {
                    state.isAuthenticated = false;
                    state.user = null;
                    state.token = null;
                    localStorage.removeItem("auth_token"); // Clear token if auth check fails
                }
            });
    },
});

export const { loginSuccess, logout, setLoading } = authSlice.actions;

export default authSlice.reducer;
