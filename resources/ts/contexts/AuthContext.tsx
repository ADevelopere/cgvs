import React, {
    createContext,
    useContext,
    useState,
    useEffect,
    useCallback,
    useMemo,
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

    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(
        localStorage.getItem("auth_token"),
    );

    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

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

    const login = useCallback(
        async (credentials: LoginMutationVariables): Promise<boolean> => {
            setIsLoading(true);
            clearError();

            try {
                const response = await loginMutation({
                    variables: {
                        email: credentials.email,
                        password: credentials.password,
                    },
                });

                if (response.data?.login.token) {
                    const { user: graphqlUser, token } = response.data.login;
                    // Convert GraphQL user to our User type
                    const fullUser: User = {
                        ...graphqlUser,
                        isAdmin: graphqlUser.isAdmin,
                        created_at: new Date().toISOString(),
                        updated_at: new Date().toISOString(),
                    };

                    setUser(fullUser);
                    setToken(token);
                    setIsAuthenticated(true);
                    saveAuthToken(token);
                    return true;
                }
                setError("Invalid response from server");
                return false;
            } catch (error) {
                console.error("Login failed", error);
                if (error instanceof ApolloError) {
                    // Handle GraphQL errors
                    const firstError = error.graphQLErrors[0];
                    setError(
                        firstError?.message ||
                            "An error occurred while trying to sign in.",
                    );
                } else {
                    setError(
                        "An error occurred while trying to sign in. Please try again.",
                    );
                }
                return false;
            } finally {
                setIsLoading(false);
            }
        },
        [loginMutation, clearError],
    );

    const checkAuth = useCallback(async () => {
        const storedToken = getAuthToken();
        if (!storedToken) {
            logout();
            setIsLoading(false);
            return;
        }

        try {
            const { data } = await apolloClient.query<MeQuery>({
                query: MeDocument,
            });

            if (data.me) {
                // Convert GraphQL user to our User type
                const fullUser: User = {
                    ...data.me,
                    isAdmin: data.me.isAdmin,
                    created_at: new Date().toISOString(), // These fields aren't in the GraphQL schema
                    updated_at: new Date().toISOString(), // These fields aren't in the GraphQL schema
                };
                setUser(fullUser);
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
    }, [logout, apolloClient]);

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
        ],
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
