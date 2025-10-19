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
import {
  ApolloClient,
  InMemoryCache,
  HttpLink,
  ApolloLink,
  Observable,
} from "@apollo/client";
import { ApolloProvider } from "@apollo/client/react";
import { ErrorLink } from "@apollo/client/link/error";
import { useNotifications } from "@toolpad/core/useNotifications";
import { ConnectivityTranslations } from "@/client/locale/components/Connectivity";
import { useAppTranslation } from "@/client/locale";
// import { connectApolloClientToVSCodeDevTools } from "@apollo/client-devtools-vscode";

export type NetworkConnectivityContextType = {
  isConnected: boolean;
  isChecking: boolean;
  lastChecked: Date | null;
  checkConnectivity: () => Promise<boolean>;
  setConnected: (connected: boolean) => void;
  notifyIfDisconnected: () => void;
  authToken: string | null;
  updateAuthToken: (token: string) => void;
  clearAuthData: () => void;
};

const NetworkConnectivityContext = createContext<
  NetworkConnectivityContextType | undefined
>(undefined);

export const useNetworkConnectivity = (): NetworkConnectivityContextType => {
  const context = useContext(NetworkConnectivityContext);
  if (!context) {
    throw new Error(
      "useNetworkConnectivity must be used within a NetworkConnectivityProvider"
    );
  }
  return context;
};

// Convenience functions for global access to auth token management
export const useAuthToken = () => {
  const { authToken, updateAuthToken, clearAuthData } =
    useNetworkConnectivity();
  return {
    authToken,
    updateAuthToken,
    clearAuthData,
  };
};

// Configuration
const CONNECTIVITY_CHECK_URL = "/api/graphql"; // Check GraphQL endpoint availability
const CONNECTIVITY_CHECK_TIMEOUT = 5000; // 5 seconds
const MIN_CHECK_INTERVAL = 2000; // Minimum 2 seconds between checks

export const AppApolloProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const notifications = useNotifications();
  const strings: ConnectivityTranslations = useAppTranslation(
    "connectivityTranslations"
  );

  const [isConnected, setIsConnected] = useState(true); // Start optimistically
  const [isChecking, setIsChecking] = useState(false);
  const [lastChecked, setLastChecked] = useState<Date | null>(null);
  const [authToken, setAuthToken] = useState<string | null>(null); // Always start with no token

  // Use refs to track status to avoid dependency issues
  const isConnectedRef = useRef(true);
  const isCheckingRef = useRef(false);
  const authTokenRef = useRef<string | null>(null); // Always start with no token
  const initialCheckDoneRef = useRef(false);
  const lastCheckTimeRef = useRef(0); // Track last check time to prevent spam

  const checkConnectivity = useCallback(async (): Promise<boolean> => {
    // Prevent multiple simultaneous checks using ref
    if (isCheckingRef.current) return isConnectedRef.current;

    // Throttle checks to prevent spam
    const now = Date.now();
    if (now - lastCheckTimeRef.current < MIN_CHECK_INTERVAL) {
      return isConnectedRef.current;
    }
    lastCheckTimeRef.current = now;

    isCheckingRef.current = true;
    setIsChecking(true);

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(
        () => controller.abort(),
        CONNECTIVITY_CHECK_TIMEOUT
      );

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
    } catch {
      // Only log unexpected errors, not network connectivity failures
      setIsConnected(false);
      isConnectedRef.current = false;
      setLastChecked(new Date());
      return false;
    } finally {
      isCheckingRef.current = false;
      setIsChecking(false);
      initialCheckDoneRef.current = true;
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
            checkConnectivity().then(connected => {
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

  // Auth token management functions - memory-only storage
  const updateAuthToken = useCallback((token: string) => {
    setAuthToken(token);
    authTokenRef.current = token;
  }, []);

  const clearAuthData = useCallback(() => {
    setAuthToken(null);
    authTokenRef.current = null;
    // No persistent storage to clear - token only exists in React state
    // Note: httpOnly cookies are cleared by the server on logout
  }, []);

  // Create Apollo client with simple configuration
  const apolloClient = useMemo(() => {
    const httpLink = new HttpLink({
      uri: "/api/graphql",
      credentials: "include",
    });

    // Auth link to add token to requests
    const authLink = new ApolloLink((operation, forward) => {
      // Get access token from ref to access current value
      // Note: refreshToken and sessionId are handled via httpOnly cookies
      const token = authTokenRef.current;

      const headers: Record<string, string> = {};

      if (token) {
        headers.authorization = `Bearer ${token}`;
      }

      operation.setContext({ headers });

      return forward(operation);
    });

    // Connectivity check link - only check if we think we're disconnected
    const connectivityCheckLink = new ApolloLink((operation, forward) => {
      return new Observable(observer => {
        function proceedWithRequest() {
          const subscription = forward(operation).subscribe({
            next: result => {
              // Successful response means we're still connected
              setIsConnected(true);
              isConnectedRef.current = true;
              observer.next(result);
            },
            error: error => {
              observer.error(error);
            },
            complete: () => {
              observer.complete();
            },
          });

          return () => subscription.unsubscribe();
        }

        // If we're already marked as disconnected, check connectivity
        if (!isConnectedRef.current) {
          checkConnectivity()
            .then(isConnected => {
              if (!isConnected) {
                notifyIfDisconnected();
                observer.next({
                  data: null,
                  errors: [
                    {
                      message: "Server not available",
                      extensions: {
                        code: "NETWORK_ERROR",
                        connectivityError: true,
                      },
                    },
                  ],
                });
                observer.complete();
                return;
              }

              // If connected, proceed with the GraphQL request
              proceedWithRequest();
            })
            .catch(error => {
              observer.error(error);
            });
        } else {
          // If we think we're connected, proceed directly
          proceedWithRequest();
        }
      });
    });

    // Error link to catch network errors and show notifications
    const errorLink = new ErrorLink(({ error }) => {
      // Check if this is a network error
      const isNetworkError =
        error &&
        (error.message?.includes("fetch") ||
          error.message?.includes("NetworkError") ||
          error.message?.includes("Failed to fetch") ||
          error.message?.includes("Network request failed") ||
          error.message?.includes("ERR_CONNECTION_REFUSED"));

      if (isNetworkError) {
        setIsConnected(false);
        isConnectedRef.current = false;
        notifyIfDisconnected();
      }
    });

    // Simple client with connectivity check
    const client = new ApolloClient({
      link: ApolloLink.from([
        errorLink,
        connectivityCheckLink,
        authLink,
        httpLink,
      ]),
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
  }, [notifyIfDisconnected, checkConnectivity]); // Include both dependencies

  // useEffect(() => {
  //   if (process.env.NODE_ENV === "development") {
  //     connectApolloClientToVSCodeDevTools(
  //       apolloClient,
  //       "ws://localhost:7095", // VSCode DevTools extension port
  //     );
  //   }
  // }, [apolloClient]);

  // Debounced initial connectivity check on mount
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      checkConnectivity();
    }, 100); // Small delay to prevent immediate check on mount

    return () => clearTimeout(timeoutId);
  }, [checkConnectivity]);

  // Listen for online/offline events with debouncing
  useEffect(() => {
    let onlineTimeout: NodeJS.Timeout;

    const handleOnline = () => {
      // Debounce the connectivity check
      clearTimeout(onlineTimeout);
      onlineTimeout = setTimeout(() => {
        checkConnectivity();
      }, 500);
    };

    const handleOffline = () => {
      clearTimeout(onlineTimeout);
      setIsConnected(false);
      isConnectedRef.current = false;
      notifyIfDisconnected();
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
      clearTimeout(onlineTimeout);
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
      clearAuthData,
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
      clearAuthData,
    ]
  );

  // Don't render until initial connectivity check is complete
  if (!initialCheckDoneRef.current) {
    return null;
  }

  return (
    <NetworkConnectivityContext.Provider value={contextValue}>
      <ApolloProvider client={apolloClient}>{children}</ApolloProvider>
    </NetworkConnectivityContext.Provider>
  );
};
