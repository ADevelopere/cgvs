"use client";

import {
    useLoginMutation,
    useLogoutMutation,
    useRefreshTokenMutation,
    LoginMutationVariables,
    User,
} from "@/graphql/generated/types";
import { clearClientAuth, updateAuthToken } from "@/utils/apollo";
import { ErrorOutline as ErrorIcon } from "@mui/icons-material";
import { Box, Button, CircularProgress, Typography } from "@mui/material";
import { ApolloError, useApolloClient } from "@apollo/client";
import React, {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";

// A simple UI for the initial loading state
const LoadingUI: React.FC<{ onRetry: () => void; error?: string | null }> = ({ onRetry, error }) => (
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
        {error ? (
            <>
                <ErrorIcon color="error" sx={{ fontSize: 48 }} />
                <Typography color="error" gutterBottom>
                    {error}
                </Typography>
                <Button variant="contained" onClick={onRetry} sx={{ mt: 2 }}>
                    Try Again
                </Button>
            </>
        ) : (
            <>
                <CircularProgress size={48} />
                <Typography>Checking authentication...</Typography>
            </>
        )}
    </Box>
);

// The shape of the authentication context
export type AuthContextType = {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
    login: (credentials: LoginMutationVariables, redirectUrl?: string | null) => Promise<boolean>;
    logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const apolloClient = useApolloClient();
    const [loginMutation] = useLoginMutation();
    const [logoutMutation] = useLogoutMutation();
    const [refreshTokenMutation] = useRefreshTokenMutation();

    const [user, setUser] = useState<User | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const isFirstRender = useRef(true);

    const checkAuth = useCallback(async () => {
        try {
            const { data } = await refreshTokenMutation();
            if (data?.refreshToken?.token && data.refreshToken.user) {
                updateAuthToken(data.refreshToken.token);
                setUser(data.refreshToken.user as User);
                setIsAuthenticated(true);
            } else {
                setIsAuthenticated(false);
                setUser(null);
            }
        } catch (error) {
            console.error("Auth check failed", error);
            setIsAuthenticated(false);
            setUser(null);
        }
    }, [refreshTokenMutation]);

    const logout = useCallback(async () => {
        try {
            await logoutMutation();
        } catch (error) {
            console.error("Logout mutation failed", error);
        } finally {
            clearClientAuth();
            // Perform a hard redirect to ensure all state is cleared.
            window.location.href = "/login";
        }
    }, [logoutMutation]);

    const login = useCallback(
        async (credentials: LoginMutationVariables, redirectUrl: string | null = null): Promise<boolean> => {
            setError(null);
            try {
                const { data, errors } = await loginMutation({ variables: { input: credentials.input } });

                if (errors) throw new ApolloError({ graphQLErrors: errors });

                if (data?.login?.token && data.login.user) {
                    updateAuthToken(data.login.token);
                    // Perform a hard redirect to break any race conditions and ensure a clean state.
                    window.location.href = redirectUrl || "/admin/dashboard";
                    return true;
                } else {
                    throw new Error("Invalid server response during login.");
                }
            } catch (err) {
                console.error("Login failed", err);
                setError("Failed to sign in. Please check your credentials.");
                return false;
            }
        },
        [loginMutation]
    );

    useEffect(() => {
        const performInitialCheck = async () => {
            setIsLoading(true);
            await checkAuth();
            setIsLoading(false);
            isFirstRender.current = false;
        };

        performInitialCheck();
    }, [checkAuth]);

    const contextValue = useMemo(
        () => ({ user, isAuthenticated, isLoading, error, login, logout }),
        [user, isAuthenticated, isLoading, error, login, logout]
    );

    if (isFirstRender.current) {
        return <LoadingUI onRetry={checkAuth} error={error} />;
    }

    return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
