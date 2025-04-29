import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "@/utils/axios";

export type User = {
    id: number;
    name: string;
    email: string;
    is_admin: boolean;
    email_verified_at?: string;
    created_at: string;
    updated_at: string;
};

export type LoginCredentials = {
    email: string;
    password: string;
};

export type AuthContextType = {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (credentials: LoginCredentials) => Promise<void>;
    logout: () => void;
    checkAuth: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(
        localStorage.getItem("auth_token")
    );
    const [isAuthenticated, setIsAuthenticated] = useState(!!token);
    const [isLoading, setIsLoading] = useState(true);

    const login = async (credentials: LoginCredentials) => {
        setIsLoading(true);
        try {
            await axios.get("/sanctum/csrf-cookie", { baseURL: "" });
            const response = await axios.post<{ user: User; token: string }>(
                "/login",
                credentials
            );
            const { user, token } = response.data;
            setUser(user);
            setToken(token);
            setIsAuthenticated(true);
            localStorage.setItem("auth_token", token);
        } catch (error) {
            console.error("Login failed", error);
        } finally {
            setIsLoading(false);
        }
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        setIsAuthenticated(false);
        localStorage.removeItem("auth_token");
    };

    const checkAuth = async () => {
        setIsLoading(true);
        const storedToken = localStorage.getItem("auth_token");
        if (!storedToken) {
            logout();
            setIsLoading(false);
            return;
        }

        try {
            const response = await axios.get<User>("/user", {
                headers: { Authorization: `Bearer ${storedToken}` },
            });
            setUser(response.data);
            setToken(storedToken);
            setIsAuthenticated(true);
        } catch (error) {
            console.error("Auth check failed", error);
            logout();
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        checkAuth();
    }, []);

    return (
        <AuthContext.Provider
            value={{
                user,
                token,
                isAuthenticated,
                isLoading,
                login,
                logout,
                checkAuth,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
