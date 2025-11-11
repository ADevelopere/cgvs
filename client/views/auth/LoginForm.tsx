"use client";

import type React from "react";
import { useState, useEffect, useRef } from "react";
import * as MUI from "@mui/material";
import { Email, Lock, Visibility, VisibilityOff } from "@mui/icons-material";
import { useAuth } from "@/client/contexts/AuthContext";
import isValidEmail from "@/client/utils/email";
import { useAppTranslation } from "@/client/locale";
import { useSearchParams, useRouter } from "next/navigation";

const LoginForm: React.FC = () => {
  const { authTranslations: strings } = useAppTranslation();
  const [showPassword, setShowPassword] = useState(false);

  const searchParams = useSearchParams();
  const router = useRouter();
  const { login, error, isLoading, isAuthenticated } = useAuth();
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [password, setPassword] = useState("");
  const firstRenderRef = useRef(true);

  useEffect(() => {
    if (firstRenderRef.current) {
      firstRenderRef.current = false;
      // Check for autofilled values after a short delay
      const checkAutofill = setTimeout(() => {
        const emailInput = document.getElementById("email") as HTMLInputElement;
        const passwordInput = document.getElementById("password") as HTMLInputElement;

        if (emailInput?.value && !email) {
          const newEmail = emailInput.value;
          setEmail(newEmail);
          if (!isValidEmail(newEmail)) {
            setEmailError(strings.emailValidationError);
          }
        }
        if (passwordInput?.value && !password) {
          setPassword(passwordInput.value);
        }
      }, 0);

      return () => clearTimeout(checkAutofill);
    }
  }, [email, password, strings]);

  // Redirect if user is already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      const redirectUrl = searchParams.get("redirect");
      const targetUrl = redirectUrl || "/admin/dashboard";
      router.replace(targetUrl);
    }
  }, [isAuthenticated, router, searchParams]);

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEmail = e.target.value;
    setEmail(newEmail);

    if (newEmail && !isValidEmail(newEmail)) {
      setEmailError(strings.emailValidationError);
    } else {
      setEmailError("");
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Prevent submission if there are validation errors
    if (emailError) {
      return;
    }

    const redirectUrl = searchParams.get("redirect");
    await login({ input: { email, password } }, redirectUrl);
    // Note: AuthContext.login() will handle the redirect with window.location.href
    // so we don't need to call router.push() here anymore
  };
  return (
    <MUI.Paper
      elevation={3}
      sx={{
        width: "100%",
        p: 4,
        borderRadius: 2,
      }}
    >
      <MUI.Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          mb: 3,
        }}
      >
        {/* Logo placeholder */}
        <MUI.Box
          sx={{
            width: 80,
            height: 80,
            borderRadius: "50%",
            backgroundColor: "primary.light",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            mb: 2,
          }}
        >
          <MUI.Typography variant="h4" color="white">
            {strings.siteTitle[0].toUpperCase()}
          </MUI.Typography>
        </MUI.Box>

        <MUI.Typography variant="h4" component="h1" fontWeight="bold" color="primary.main">
          {strings.signin}
        </MUI.Typography>

        <MUI.Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 1 }}>
          {strings.signinDescription}
        </MUI.Typography>
      </MUI.Box>

      {error && (
        <MUI.Alert
          severity="error"
          sx={{
            mb: 3,
            borderRadius: 1,
            "& .MuiAlert-message": { fontWeight: 500 },
          }}
        >
          {error}
        </MUI.Alert>
      )}

      <MUI.Box component="form" onSubmit={handleSubmit} noValidate method="POST">
        <MUI.TextField
          margin="normal"
          required
          fullWidth
          id="email"
          label={strings.emailLabel}
          name="email"
          autoComplete="email"
          autoFocus
          value={email}
          onChange={handleEmailChange}
          error={Boolean(emailError)}
          helperText={emailError}
          disabled={isLoading}
          variant="outlined"
          slotProps={{
            input: {
              startAdornment: (
                <MUI.InputAdornment position="start">
                  <Email sx={{ fontSize: 20 }} />
                </MUI.InputAdornment>
              ),
            },
          }}
          sx={{ mb: 2 }}
        />

        <MUI.TextField
          margin="normal"
          required
          fullWidth
          name="password"
          label={strings.password}
          type={showPassword ? "text" : "password"}
          id="password"
          autoComplete="current-password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          disabled={isLoading}
          variant="outlined"
          slotProps={{
            input: {
              startAdornment: (
                <MUI.InputAdornment position="start">
                  <Lock sx={{ fontSize: 20 }} />
                </MUI.InputAdornment>
              ),
              endAdornment: (
                <MUI.InputAdornment position="end">
                  <MUI.IconButton
                    aria-label="toggle password visibility"
                    onClick={() => setShowPassword(!showPassword)}
                    onMouseDown={e => e.preventDefault()}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </MUI.IconButton>
                </MUI.InputAdornment>
              ),
            },
          }}
          sx={{ mb: 1 }}
        />

        <MUI.Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            mb: 2,
          }}
        >
          <MUI.Link href="#" variant="body2" underline="hover">
            {strings.forgotPassword}
          </MUI.Link>
        </MUI.Box>

        <MUI.Button
          type="submit"
          fullWidth
          variant="contained"
          size="large"
          sx={{
            mt: 2,
            mb: 3,
            py: 1.5,
            fontWeight: "bold",
            borderRadius: 1.5,
          }}
          disabled={isLoading || !email || !password}
        >
          {isLoading ? <MUI.CircularProgress size={24} color="inherit" /> : strings.signin}
        </MUI.Button>

        <MUI.Divider sx={{ my: 2 }}>
          <MUI.Typography variant="body2" color="text.secondary">
            {strings.orText}
          </MUI.Typography>
        </MUI.Divider>

        <MUI.Box
          sx={{
            textAlign: "center",
            mt: 2,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: 1,
          }}
        >
          <MUI.Typography variant="body2" color="text.secondary">
            {strings.dontHaveAccountQuestion}
          </MUI.Typography>
          <MUI.Link href="#" variant="body2" underline="hover" fontWeight="bold">
            {strings.createAccount}
          </MUI.Link>
        </MUI.Box>
      </MUI.Box>
    </MUI.Paper>
  );
};

export default LoginForm;
