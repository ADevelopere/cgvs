"use client";

import React, {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";
import { ApolloClient, InMemoryCache, HttpLink, ApolloLink } from "@apollo/client";
import { ApolloProvider } from "@apollo/client/react";
import { ErrorLink } from "@apollo/client/link/error";
import { useNotifications } from "@toolpad/core/useNotifications";
import ConnectivityTranslations from "@/locale/components/Connectivity";
import useAppTranslation from "@/locale/useAppTranslation";
import logger from "@/utils/logger";

export type NetworkConnectivityContextType = {
    isConnected: boolean;
    isChecking: boolean;
    lastChecked: Date | null;
    checkConnectivity: () => Promise<boolean>;
    setConnected: (connected: boolean) => void;
    notifyIfDisconnected: () => void;
    // Auth token management
    authToken: string | null;
    updateAuthToken: (token: string) => void;
    clearAuthToken: () => void;
};

const NetworkConnectivityContext = createContext<
    NetworkConnectivityContextType | undefined
>(undefined);

export const useNetworkConnectivity = (): NetworkConnectivityContextType => {
    const context = useContext(NetworkConnectivityContext);
    if (!context) {
        throw new Error(
            "useNetworkConnectivity must be used within a NetworkConnectivityProvider",
        );
    }
    return context;
};

// Convenience functions for global access to auth token management
export const useAuthToken = () => {
    const { authToken, updateAuthToken, clearAuthToken } = useNetworkConnectivity();
    return { authToken, updateAuthToken, clearAuthToken };
};

// Configuration
const CONNECTIVITY_CHECK_URL = "http://localhost:8080/health"; // Adjust this to your backend health endpoint
const CONNECTIVITY_CHECK_TIMEOUT = 5000; // 5 seconds

export const AppApolloProvider: React.FC<{
    children: React.ReactNode;
}> = ({ children }) => {
    const notifications = useNotifications();
    const strings: ConnectivityTranslations = useAppTranslation("connectivityTranslations");
    
    const [isConnected, setIsConnected] = useState(true); // Start optimistically
    const [isChecking, setIsChecking] = useState(false);
    const [lastChecked, setLastChecked] = useState<Date | null>(null);
    const [authToken, setAuthToken] = useState<string | null>(null);
    
    // Use refs to track status to avoid dependency issues
    const isConnectedRef = useRef(true);
    const isCheckingRef = useRef(false);
    const authTokenRef = useRef<string | null>(null);

    const checkConnectivity = useCallback(async (): Promise<boolean> => {
        // Prevent multiple simultaneous checks using ref
        if (isCheckingRef.current) return isConnectedRef.current;
        
        isCheckingRef.current = true;
        setIsChecking(true);
        
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), CONNECTIVITY_CHECK_TIMEOUT);

            const response = await fetch(CONNECTIVITY_CHECK_URL, {
                method: "HEAD", // Use HEAD for faster response (no body)
                credentials: "include",
                headers: {
                    "X-Requested-With": "XMLHttpRequest",
                },
                signal: controller.signal,
            }).catch(() => {
                // Catch fetch errors silently - don't log expected connection failures
                return { ok: false, status: 0 };
            });
            
            clearTimeout(timeoutId);
            const connected = response.ok;
            
            // Update both state and ref
            setIsConnected(connected);
            isConnectedRef.current = connected;
            setLastChecked(new Date());
            
            return connected;
        } catch (error) {
            // Only log unexpected errors, not network connectivity failures
            logger.error("Unexpected error during connectivity check:", error);
            setIsConnected(false);
            isConnectedRef.current = false;
            setLastChecked(new Date());
            return false;
        } finally {
            isCheckingRef.current = false;
            setIsChecking(false);
        }
    }, []); // No dependencies needed

    const setConnected = useCallback((connected: boolean) => {
        setIsConnected(connected);
        isConnectedRef.current = connected;
    }, []);

    const notifyIfDisconnected = useCallback(() => {
        if (!isConnectedRef.current) {
            notifications.show(
                `${strings.serverConnectionLost}. ${strings.checkNetworkConnection}.`,
                {
                    severity: "error",
                    autoHideDuration: 5000, // Auto-hide after 5 seconds for less spam
                    actionText: strings.retry,
                    onAction: () => {
                        checkConnectivity().then((connected) => {
                            if (connected) {
                                notifications.show(strings.connectionRestored, {
                                    severity: "success",
                                    autoHideDuration: 3000,
                                });
                            }
                        });
                    },
                }
            );
        }
    }, [notifications, checkConnectivity, strings]);

    // Auth token management functions
    const updateAuthToken = useCallback((token: string) => {
        setAuthToken(token);
        authTokenRef.current = token;
    }, []);

    const clearAuthToken = useCallback(() => {
        setAuthToken(null);
        authTokenRef.current = null;
    }, []);

    // Create Apollo client with simple configuration
    const apolloClient = useMemo(() => {
        const httpLink = new HttpLink({
            uri: "http://localhost:8080/graphql",
            credentials: "include",
        });

        // Auth link to add token to requests
        const authLink = new ApolloLink((operation, forward) => {
            // Get token from ref to access current value
            const token = authTokenRef.current;
            
            operation.setContext({
                headers: {
                    authorization: token ? `Bearer ${token}` : "",
                },
            });

            return forward(operation);
        });

        // Error link to catch network errors and show notifications
        const errorLink = new ErrorLink(({ error }) => {
            // Check if this is a network error
            const isNetworkError = error && 
                (error.message?.includes('fetch') || 
                 error.message?.includes('NetworkError') ||
                 error.message?.includes('Failed to fetch') ||
                 error.message?.includes('Network request failed') ||
                 error.message?.includes('ERR_CONNECTION_REFUSED'));
            
            if (isNetworkError) {
                logger.warn('GraphQL network error detected:', error.message);
                setIsConnected(false);
                isConnectedRef.current = false;
                notifyIfDisconnected();
            }
        });

        // Simple client without complex error handling
        const client = new ApolloClient({
            link: ApolloLink.from([errorLink, authLink, httpLink]),
            cache: new InMemoryCache(),
            defaultOptions: {
                watchQuery: {
                    errorPolicy: "all",
                    notifyOnNetworkStatusChange: true,
                },
                query: {
                    errorPolicy: "all",
                },
            },
        });

        return client;
    }, [notifyIfDisconnected]); // Include notifyIfDisconnected since it's used in the error link

    // Initial connectivity check on mount
    useEffect(() => {
        checkConnectivity();
    }, [checkConnectivity]);

    // Listen for online/offline events
    useEffect(() => {
        const handleOnline = () => {
            logger.info("Browser detected online status");
            checkConnectivity();
        };

        const handleOffline = () => {
            logger.warn("Browser detected offline status");
            setIsConnected(false);
            isConnectedRef.current = false;
            notifyIfDisconnected();
        };

        window.addEventListener("online", handleOnline);
        window.addEventListener("offline", handleOffline);

        return () => {
            window.removeEventListener("online", handleOnline);
            window.removeEventListener("offline", handleOffline);
        };
    }, [checkConnectivity, notifyIfDisconnected]);

    const contextValue = useMemo(
        () => ({
            isConnected,
            isChecking,
            lastChecked,
            checkConnectivity,
            setConnected,
            notifyIfDisconnected,
            authToken,
            updateAuthToken,
            clearAuthToken,
        }),
        [
            isConnected,
            isChecking,
            lastChecked,
            checkConnectivity,
            setConnected,
            notifyIfDisconnected,
            authToken,
            updateAuthToken,
            clearAuthToken,
        ]
    );

    return (
        <NetworkConnectivityContext.Provider value={contextValue}>
            <ApolloProvider client={apolloClient}>
                {children}
            </ApolloProvider>
        </NetworkConnectivityContext.Provider>
    );
};