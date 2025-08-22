"use client";

import React, {
    createContext,
    useContext,
    useState,
    useEffect,
    useCallback,
    useMemo,
    useRef,
} from "react";
import { ApolloError, useApolloClient } from "@apollo/client";
import {
    useLoginMutation,
    useLogoutMutation,
    MeDocument,
    MeQuery,
    User,
    LoginMutationVariables,
} from "@/graphql/generated/types";
import { saveAuthToken, clearAuthToken, getAuthToken } from "@/utils/auth";
import { Box, CircularProgress, Typography, Button } from "@mui/material";
import { ErrorOutline as ErrorIcon } from "@mui/icons-material";
import { loadFromLocalStorage } from "@/utils/localStorage";
import { useRouter } from "next/navigation";

// Loading Component to avoid conditional hook calls
const LoadingUI: React.FC<{
    isLoading: boolean;
    error: string | null;
    isTimedOut: boolean;
    onRetry: () => void;
}> = ({ isLoading, error, isTimedOut, onRetry }) => {
    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                height: "100vh",
                gap: 2,
            }}
        >
            {isLoading ? (
                <>
                    <CircularProgress size={48} />
                    <Typography>Checking authentication...</Typography>
                </>
            ) : error ? (
                <>
                    <ErrorIcon color="error" sx={{ fontSize: 48 }} />
                    <Typography color="error" gutterBottom>
                        {isTimedOut ? "Authentication check timed out" : error}
                    </Typography>
                    <Button
                        variant="contained"
                        onClick={onRetry}
                        sx={{ mt: 2 }}
                    >
                        Try Again
                    </Button>
                </>
            ) : null}
        </Box>
    );
};

// Rest of context type and creation
export type AuthContextType = {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
    login: (credentials: LoginMutationVariables) => Promise<boolean>;
    logout: () => void;
    checkAuth: () => Promise<void>;
    clearError: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const apolloClient = useApolloClient();
    const [loginMutation] = useLoginMutation();
    const [logoutMutation] = useLogoutMutation();
    const router = useRouter();

    // Group all state declarations together
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(
        loadFromLocalStorage("auth_token"),
    );
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isTimedOut, setIsTimedOut] = useState(false);

    // Refs after state
    const isFirstRender = useRef(true);

    const clearError = useCallback(() => setError(null), []);

    const logout = useCallback(async () => {
        try {
            await logoutMutation();
        } catch (error) {
            console.error("Logout failed", error);
        } finally {
            setUser(null);
            setToken(null);
            setIsAuthenticated(false);
            clearAuthToken();
            apolloClient.resetStore();
        }
    }, [logoutMutation, apolloClient]);

    // Add a function to handle redirection after login
    const handlePostLoginRedirect = (redirectUrl: string | null) => {
        if (redirectUrl) {
            window.location.href = redirectUrl;
        } else {
            window.location.href = "/admin/dashboard";
        }
    };

    // Modify the login function to include redirection
    const login = useCallback(
        async (credentials: LoginMutationVariables, redirectUrl: string | null = null): Promise<boolean> => {
            setIsLoading(true);
            clearError();

            try {
                const { data, errors } = await loginMutation({
                    variables: {
                        input: {
                            email: credentials.input.email,
                            password: credentials.input.password,
                        },
                    },
                });

                if (errors) {
                    throw new ApolloError({ graphQLErrors: errors });
                }

                if (data?.login?.token && data.login.user) {
                    const { user: graphqlUser, token } = data.login;
                    setUser(graphqlUser as User);
                    setToken(token);
                    setIsAuthenticated(true);
                    saveAuthToken(token);
                    handlePostLoginRedirect(redirectUrl);
                    return true;
                } else {
                    throw new Error("Invalid response from server: token or user missing.");
                }
            } catch (error) {
                console.error("Login failed", error);
                if (error instanceof ApolloError) {
                    const firstError = error.graphQLErrors[0];
                    setError(firstError?.message || "An error occurred while trying to sign in.");
                } else if (error instanceof Error) {
                    setError(error.message);
                } else {
                    setError("An unknown error occurred while trying to sign in.");
                }
                return false;
            } finally {
                setIsLoading(false);
            }
        },
        [loginMutation, clearError, handlePostLoginRedirect]
    );

    // Modify the checkAuth function to handle redirection
    const checkAuth = useCallback(async () => {
        const storedToken = getAuthToken();
        if (!storedToken) {
            logout();
            setIsLoading(false);
            isFirstRender.current = false;
            router.push("/login"); // Redirect to login if no token
            return;
        }

        try {
            const { data, errors } = await apolloClient.query<MeQuery>({
                query: MeDocument,
            });

            if (errors) {
                throw new ApolloError({ graphQLErrors: errors });
            }

            if (data?.me) {
                setUser(data.me as User);
                setToken(storedToken);
                setIsAuthenticated(true);
            } else {
                throw new Error("Invalid response from server: User data is missing.");
            }
        } catch (error) {
            console.error("Auth check failed", error);
            if (error instanceof ApolloError) {
                const firstError = error.graphQLErrors[0];
                setError(firstError?.message || "An error occurred during authentication check.");
            } else if (error instanceof Error) {
                setError(error.message);
            } else {
                setError("An unknown error occurred during authentication check.");
            }
            logout();
            router.push("/login"); // Redirect to login on failure
        } finally {
            setIsLoading(false);
            isFirstRender.current = false;
        }
    }, [logout, apolloClient, router]);

    // Check authentication status when the component mounts
    useEffect(() => {
        checkAuth();
    }, [checkAuth]);

    const retryCheck = useCallback(() => {
        setIsLoading(true);
        setError(null);
        setIsTimedOut(false);
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
        ],
    );

    if (isFirstRender.current) {
        return (
            <LoadingUI
                isLoading={isLoading}
                error={error}
                isTimedOut={isTimedOut}
                onRetry={retryCheck}
            />
        );
    }

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
