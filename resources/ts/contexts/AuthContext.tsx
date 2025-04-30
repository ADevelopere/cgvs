import React, {
    createContext,
    useContext,
    useState,
    useEffect,
    useCallback,
    useMemo,
} from "react";
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

export type LoginResponse = {
    user: User;
    token: string;
};

export type AuthContextType = {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
    login: (credentials: LoginCredentials) => Promise<boolean>;
    logout: () => void;
    checkAuth: () => Promise<void>;
    clearError: () => void;
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
    const [error, setError] = useState<string | null>(null);

    const clearError = useCallback(() => setError(null), []);

    const logout = useCallback(() => {
        setUser(null);
        setToken(null);
        setIsAuthenticated(false);
        localStorage.removeItem("auth_token");
    }, []);

    const login = useCallback(
        async (credentials: LoginCredentials): Promise<boolean> => {
            setIsLoading(true);
            clearError();

            try {
                // Get the CSRF cookie from the root URL
                await axios.get("/sanctum/csrf-cookie", { baseURL: "" });

                const response = await axios.post<LoginResponse>(
                    "/login",
                    credentials
                );

                if (response.data.token) {
                    const { user, token } = response.data;
                    setUser(user);
                    setToken(token);
                    setIsAuthenticated(true);
                    localStorage.setItem("auth_token", token);
                    return true;
                }
                setError("Invalid response from server");
                return false;
            } catch (error: any) {
                console.error("Login failed", error);
                if (error.response?.status === 422) {
                    // Handle validation errors
                    if (error.response.data?.errors) {
                        const firstErrorArray = Object.values(
                            error.response.data.errors
                        )[0];
                        if (
                            Array.isArray(firstErrorArray) &&
                            firstErrorArray.length > 0
                        ) {
                            setError(firstErrorArray[0]);
                        } else {
                            setError(
                                error.response.data?.message ||
                                    "Invalid credentials"
                            );
                        }
                    } else {
                        setError("Invalid credentials");
                    }
                } else {
                    setError(
                        "An error occurred while trying to sign in. Please try again."
                    );
                }
                return false;
            } finally {
                setIsLoading(false);
            }
        },
        [clearError]
    );

    const checkAuth = useCallback(async () => {
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

            if (response.data) {
                setUser(response.data);
                setToken(storedToken);
                setIsAuthenticated(true);
            } else {
                logout();
            }
        } catch (error) {
            console.error("Auth check failed", error);
            logout();
        } finally {
            setIsLoading(false);
        }
    }, [logout]);

    // Check authentication status when the component mounts
    useEffect(() => {
        checkAuth();
    }, [checkAuth]);

    const contextValue = useMemo(
        () => ({
            user,
            token,
            isAuthenticated,
            isLoading,
            error,
            login,
            logout,
            checkAuth,
            clearError,
        }),
        [
            user,
            token,
            isAuthenticated,
            isLoading,
            error,
            login,
            logout,
            checkAuth,
            clearError,
        ]
    );

    return (
        <AuthContext.Provider value={contextValue}>
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
