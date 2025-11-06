"use client";

import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { ApolloClient, InMemoryCache, HttpLink, ApolloLink, Observable } from "@apollo/client";
import { ApolloProvider } from "@apollo/client/react";
import { ErrorLink } from "@apollo/client/link/error";
import { useNotifications } from "@toolpad/core/useNotifications";
import { ConnectivityTranslations } from "@/client/locale/components/Connectivity";
import { useAppTranslation } from "@/client/locale";
import { isNetworkError } from "@/client/utils/errorUtils";
import { Box, CircularProgress, Button, Typography } from "@mui/material";
import { ErrorOutline as ErrorIcon } from "@mui/icons-material";
// import { connectApolloClientToVSCodeDevTools } from "@apollo/client-devtools-vscode";
import { PersistedQueryLink } from "@apollo/client/link/persisted-queries";
import { sha256 } from "crypto-hash"; // Or your preferred SHA256 implementation
import logger from "@/client/lib/logger";

// Loading UI shown during initial connectivity check
const InitializingUI: React.FC<{
  error?: boolean;
  onRetry?: () => void;
  strings?: ConnectivityTranslations;
}> = ({ error, onRetry, strings }) => (
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
    {error && strings ? (
      <>
        <ErrorIcon color="error" sx={{ fontSize: 48 }} />
        <Typography color="error">{strings.serverConnectionLost}</Typography>
        <Button onClick={onRetry} variant="contained">
          {strings.retry}
        </Button>
      </>
    ) : (
      <CircularProgress size={48} />
    )}
  </Box>
);

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

const NetworkConnectivityContext = createContext<NetworkConnectivityContextType | undefined>(undefined);

export const useNetworkConnectivity = (): NetworkConnectivityContextType => {
  const context = useContext(NetworkConnectivityContext);
  if (!context) {
    throw new Error("useNetworkConnectivity must be used within a NetworkConnectivityProvider");
  }
  return context;
};

// Convenience functions for global access to auth token management
export const useAuthToken = () => {
  const { authToken, updateAuthToken, clearAuthData } = useNetworkConnectivity();
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

// Reconnection delay configuration
// Returns delay in milliseconds for a given attempt number
// Attempt 0: 2000ms, Attempt 1: 5000ms, Attempt 2+: increases by 5000ms until 30000ms max
const getReconnectionDelay = (attempt: number): number | null => {
  if (attempt === 0) return 2000; // First retry: 2 seconds
  if (attempt === 1) return 5000; // Second retry: 5 seconds

  // Subsequent retries: 10s, 15s, 20s, 25s, 30s
  const delay = 5000 + (attempt - 1) * 5000;
  if (delay > 30000) return null; // Stop after 30 seconds
  return delay;
};

export const AppApolloProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const notifications = useNotifications();
  const { connectivityTranslations: strings } = useAppTranslation();

  const [isConnected, setIsConnected] = useState(false); // Start conservative, wait for actual check
  const [isChecking, setIsChecking] = useState(false);
  const [lastChecked, setLastChecked] = useState<Date | null>(null);
  const [authToken, setAuthToken] = useState<string | null>(null); // Always start with no token
  const [initialCheckDone, setInitialCheckDone] = useState(false); // Track initial check completion

  // Use refs to track status to avoid dependency issues
  const isConnectedRef = useRef(false); // Start conservative, wait for actual check
  const isCheckingRef = useRef(false);
  const authTokenRef = useRef<string | null>(null); // Always start with no token
  const initialCheckDoneRef = useRef(false);
  const lastCheckTimeRef = useRef(0); // Track last check time to prevent spam
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const reconnectAttemptRef = useRef(0); // Track reconnection attempts

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
      const timeoutId = setTimeout(() => controller.abort(), CONNECTIVITY_CHECK_TIMEOUT);

      const response = await fetch(CONNECTIVITY_CHECK_URL, {
        method: "HEAD", // Use HEAD for faster response (no body)
        credentials: "include",
        headers: {
          "X-Requested-With": "XMLHttpRequest",
          "apollo-require-preflight": "true",
        },
        signal: controller.signal,
      }).catch(() => {
        // Catch fetch errors silently - don't log expected connection failures
        return { ok: false, status: 0 };
      });

      clearTimeout(timeoutId);
      const connected = response.ok;

      // Log connection state change if it differs from current state
      if (connected !== isConnectedRef.current) {
        if (connected) {
          // Reset reconnection attempts on successful connection
          reconnectAttemptRef.current = 0;
        }
      }

      // Update both state and ref
      setIsConnected(connected);
      isConnectedRef.current = connected;
      setLastChecked(new Date());

      return connected;
    } catch {
      setIsConnected(false);
      isConnectedRef.current = false;
      setLastChecked(new Date());

      return false;
    } finally {
      isCheckingRef.current = false;
      setIsChecking(false);
      initialCheckDoneRef.current = true;
      setInitialCheckDone(true);
      logger.debug("[Connectivity] Initial check completed");
    }
  }, []); // No dependencies needed

  const setConnected = useCallback((connected: boolean) => {
    setIsConnected(connected);
    isConnectedRef.current = connected;
  }, []);

  const notifyIfDisconnected = useCallback(() => {
    if (!isConnectedRef.current) {
      notifications.show(`${strings.serverConnectionLost}. ${strings.checkNetworkConnection}.`, {
        severity: "error",
        autoHideDuration: 5000, // Auto-hide after 5 seconds for less spam
        actionText: strings.retry,
        onAction: () => {
          // Reset reconnection attempts on manual retry
          reconnectAttemptRef.current = 0;
          checkConnectivity().then(connected => {
            if (connected) {
              notifications.show(strings.connectionRestored, {
                severity: "success",
                autoHideDuration: 3000,
              });
            }
          });
        },
      });
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

    // Auth link to add token and CSRF prevention headers to requests
    const authLink = new ApolloLink((operation, forward) => {
      // Get access token from ref to access current value
      // Note: refreshToken and sessionId are handled via httpOnly cookies
      const token = authTokenRef.current;

      const headers: Record<string, string> = {
        // CSRF prevention headers - required by Apollo Server CSRF protection
        "apollo-require-preflight": "true",
        "x-apollo-operation-name": operation.operationName || "",
      };

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
              // Successful response means we're connected
              // Only update if we haven't confirmed connectivity yet
              if (!isConnectedRef.current) {
                setIsConnected(true);
                isConnectedRef.current = true;
              }
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
      // Check if this is a network error using utility function
      if (isNetworkError(error)) {
        const wasConnected = isConnectedRef.current;

        logger.warn(`[Error Link] Network error detected. wasConnected=${wasConnected}`);

        setIsConnected(false);
        isConnectedRef.current = false;

        if (wasConnected) {
          logger.info("[Error Link] Connection lost (was previously connected)");
        }

        notifyIfDisconnected();
      }
    });

    const persistedQueryLink = new PersistedQueryLink({ sha256 });

    // Simple client with connectivity check
    const client = new ApolloClient({
      link: ApolloLink.from([errorLink, connectivityCheckLink, authLink, persistedQueryLink, httpLink]),
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
    }, 5000); // Small delay to prevent immediate check on mount

    return () => clearTimeout(timeoutId);
  }, [checkConnectivity]);

  // Automatic reconnection with progressive delays
  useEffect(() => {
    logger.debug(`[Reconnect Effect] Running. isConnected=${isConnected}, initialCheckDone=${initialCheckDone}`);

    // Only attempt reconnection if we're disconnected and initial check is done
    if (isConnected || !initialCheckDone) {
      // Clear any pending reconnection timeout if we're connected
      if (reconnectTimeoutRef.current) {
        logger.debug("[Reconnect Effect] Clearing timeout (connected or not initialized)");
        clearTimeout(reconnectTimeoutRef.current);
        reconnectTimeoutRef.current = null;
      }
      return;
    }

    logger.info("[Reconnect Effect] Starting auto-reconnect sequence");

    // Recursive function to schedule reconnection attempts
    const scheduleReconnect = () => {
      // Get the delay for the current attempt
      const delay = getReconnectionDelay(reconnectAttemptRef.current);

      logger.debug(`[Reconnect] Scheduling attempt #${reconnectAttemptRef.current}, delay=${delay}ms`);

      if (delay === null) {
        logger.warn("[Reconnect] Max reconnection attempts reached, stopping");
        return;
      }

      // Schedule the reconnection attempt
      reconnectTimeoutRef.current = setTimeout(() => {
        logger.info(`[Reconnect] Executing attempt #${reconnectAttemptRef.current}`);
        checkConnectivity().then(connected => {
          logger.debug(`[Reconnect] Attempt result: connected=${connected}`);
          if (!connected) {
            // Increment attempt counter for next retry
            reconnectAttemptRef.current += 1;
            // Schedule the next attempt immediately
            scheduleReconnect();
          } else {
            // Reset attempt counter on successful reconnection
            logger.info("[Reconnect] Successfully reconnected!");
            reconnectAttemptRef.current = 0;
          }
        });
      }, delay);
    };

    scheduleReconnect();

    // Cleanup function
    return () => {
      logger.debug("[Reconnect Effect] Cleanup running");
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
        reconnectTimeoutRef.current = null;
      }
    };
  }, [isConnected, initialCheckDone, checkConnectivity]);

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

  // Block rendering until BOTH check is done AND server is connected
  if (!initialCheckDoneRef.current || !isConnectedRef.current) {
    // Only show error if we've actually checked and confirmed server is down
    const hasError = initialCheckDoneRef.current && !isConnectedRef.current;

    const handleManualRetry = () => {
      // Reset reconnection attempts on manual retry
      reconnectAttemptRef.current = 0;
      checkConnectivity();
    };

    return <InitializingUI error={hasError} onRetry={handleManualRetry} strings={hasError ? strings : undefined} />;
  }

  return (
    <NetworkConnectivityContext.Provider value={contextValue}>
      <ApolloProvider client={apolloClient}>{children}</ApolloProvider>
    </NetworkConnectivityContext.Provider>
  );
};
