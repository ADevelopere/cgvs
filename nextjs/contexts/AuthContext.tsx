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
            await apolloClient.resetStore();
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
                const response = await loginMutation({
                    variables: {
                        input: {
                            email: credentials.input.email,
                            password: credentials.input.password,
                        },
                    },
                });

                if (response?.data?.login) {
                    if (response?.data?.login?.token) {
                        const { user: graphqlUser, token } = response.data.login;
                        const fullUser: User = {
                            ...graphqlUser,
                            isAdmin: graphqlUser.isAdmin,
                            createdAt: new Date().toISOString(),
                            updatedAt: new Date().toISOString(),
                        };

                        setUser(fullUser);
                        setToken(token);
                        setIsAuthenticated(true);
                        saveAuthToken(token);

                        // Redirect after successful login
                        handlePostLoginRedirect(redirectUrl);

                        return true;
                    }
                } else {
                    setError("Invalid login credentials");
                    return false;
                }

                setError("Invalid response from server");
                console.log("Invalid response from server", "loginMutation", response);

                return false;
            } catch (error) {
                console.error("Login failed", error);
                if (error instanceof ApolloError) {
                    const firstError = error.graphQLErrors[0];
                    setError(
                        firstError?.message || "An error occurred while trying to sign in."
                    );
                } else {
                    setError("An error occurred while trying to sign in. Please try again.");
                }
                return false;
            } finally {
                setIsLoading(false);
            }
        },
        [loginMutation, clearError]
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

        let timeoutId: NodeJS.Timeout | undefined;
        const timeoutPromise = new Promise<never>((_, reject) => {
            timeoutId = setTimeout(() => {
                setIsTimedOut(true);
                reject(new Error("Auth check timed out"));
            }, 10000); // 10 second timeout
        });

        try {
            const result = (await Promise.race([
                apolloClient.query<MeQuery>({
                    query: MeDocument,
                }),
                timeoutPromise,
            ])) as { data: MeQuery };

            if (timeoutId) {
                clearTimeout(timeoutId);
            }

            if (result?.data?.me) {
                const fullUser: User = {
                    ...result.data.me,
                    isAdmin: result.data.me.isAdmin,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                };
                setUser(fullUser);
                setToken(storedToken);
                setIsAuthenticated(true);
            } else {
                throw new Error("Invalid response from server");
            }
        } catch (error) {
            console.error("Auth check failed", error);
            setError(
                error instanceof Error
                    ? error.message
                    : "Failed to check authentication",
            );
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
