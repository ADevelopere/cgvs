"use client";

import * as Graphql from "@/client/graphql/generated/gql/graphql";
import * as Document from "@/client/graphql/sharedDocuments";

import { AuthTranslations } from "@/client/locale/components/Auth";
import { useAppTranslation } from "@/client/locale";
import { useAuthToken } from "./AppApolloProvider";
import { ErrorOutline as ErrorIcon } from "@mui/icons-material";
import { Box, Button, CircularProgress, Typography } from "@mui/material";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useMutation } from "@apollo/client/react";
import logger from "@/client/lib/logger";

// A simple UI for the initial loading state
const LoadingUI: React.FC<{
  onRetry: () => void;
  error?: string | null;
  strings: AuthTranslations;
}> = ({ onRetry, error, strings }) => (
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
          {strings.tryAgain}
        </Button>
      </>
    ) : (
      <>
        <CircularProgress size={48} />
      </>
    )}
  </Box>
);

// The shape of the authentication context
export type AuthContextType = {
  user: Graphql.User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (
    credentials: Graphql.MutationLoginArgs,
    redirectUrl?: string | null
  ) => Promise<boolean>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const strings: AuthTranslations = useAppTranslation("authTranslations");
  const { updateAuthToken, clearAuthData } = useAuthToken();
  const [loginMutation] = useMutation(Document.loginMutationDocument);
  const [logoutMutation] = useMutation(Document.logoutMutationDocument);
  const [refreshTokenMutation] = useMutation(
    Document.refreshTokenMutationDocument
  );

  const [user, setUser] = useState<Graphql.User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const isFirstRenderRef = useRef(true);

  const checkAuth = useCallback(async () => {
    logger.info(
      "[AuthContext] Starting auth check - attempting to restore session"
    );

    try {
      logger.info("[AuthContext] Calling refreshToken mutation");
      const { data } = await refreshTokenMutation();

      logger.info("[AuthContext] RefreshToken mutation response:", {
        hasData: !!data,
        hasToken: !!data?.refreshToken?.token,
        hasUser: !!data?.refreshToken?.user,
      });

      if (data?.refreshToken?.token && data.refreshToken.user) {
        logger.info("[AuthContext] Session restored successfully", {
          userId: data.refreshToken.user.id,
          userEmail: data.refreshToken.user.email,
        });
        updateAuthToken(data.refreshToken.token);
        setUser(data.refreshToken.user);
        setIsAuthenticated(true);
      } else {
        logger.warn(
          "[AuthContext] Session restoration failed - no token or user in response"
        );
        setIsAuthenticated(false);
        setUser(null);
        clearAuthData();
      }
    } catch (error) {
      logger.error("[AuthContext] RefreshToken mutation failed:", {
        error: error instanceof Error ? error.message : String(error),
        errorDetails: error,
      });
      setIsAuthenticated(false);
      setUser(null);
      clearAuthData();
    }
  }, [refreshTokenMutation, updateAuthToken, clearAuthData]);

  const logout = useCallback(async () => {
    try {
      await logoutMutation();
    } finally {
      clearAuthData();
      // Perform a hard redirect to ensure all state is cleared.
      window.location.href = "/login";
    }
  }, [logoutMutation, clearAuthData]);

  const login = useCallback(
    async (
      credentials: Graphql.MutationLoginArgs,
      redirectUrl: string | null = null
    ): Promise<boolean> => {
      setError(null);
      try {
        const { data } = await loginMutation({
          variables: { input: credentials.input },
        });

        if (data?.login?.token && data.login.user) {
          updateAuthToken(data.login.token);

          // Access token is stored in React context state only (memory)
          // Refresh token and session ID are set via httpOnly cookies
          // by the server automatically. They are NOT in the response body
          // for security reasons (prevents XSS attacks).

          // Perform a hard redirect to break any race conditions and ensure a clean state.
          window.location.href = redirectUrl || "/admin/dashboard";
          return true;
        } else {
          setError(strings.signinFailed);
          return false;
        }
      } catch {
        // Log error for debugging without using console
        setError(strings.invalidLoginResponse);
        return false;
      }
    },
    [
      loginMutation,
      strings.invalidLoginResponse,
      strings.signinFailed,
      updateAuthToken,
    ]
  );

  useEffect(() => {
    const performInitialCheck = async () => {
      setIsLoading(true);
      await checkAuth();
      setIsLoading(false);
      isFirstRenderRef.current = false;
    };

    performInitialCheck();
  }, [checkAuth]);

  const contextValue = useMemo(
    () => ({ user, isAuthenticated, isLoading, error, login, logout }),
    [user, isAuthenticated, isLoading, error, login, logout]
  );

  if (isFirstRenderRef.current) {
    return <LoadingUI onRetry={checkAuth} error={error} strings={strings} />;
  }

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
