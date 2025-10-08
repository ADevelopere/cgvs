"use client";

import type React from "react";
import { useState, useEffect, useRef } from "react";
import {
    Box,
    Button,
    TextField,
    Typography,
    Alert,
    CircularProgress,
    Paper,
    InputAdornment,
    Link,
    Divider,
    IconButton,
} from "@mui/material";
import { Email, Lock, Visibility, VisibilityOff } from "@mui/icons-material";
import { useAuth } from "@/client/contexts/AuthContext";
import isValidEmail from "@/utils/email";
import { useAppTranslation } from "@/client/locale";
import { AuthTranslations } from "@/client/locale/components";
import { useRouter } from "next/navigation";

const LoginForm: React.FC = () => {
    const strings: AuthTranslations = useAppTranslation("authTranslations");
    const [showPassword, setShowPassword] = useState(false);

    const router = useRouter();
    const { login, isAuthenticated, error, isLoading } = useAuth();
    const [email, setEmail] = useState("");
    const [emailError, setEmailError] = useState("");
    const [password, setPassword] = useState("");
    const firstRenderRef = useRef(true);

    useEffect(() => {
        if (firstRenderRef.current) {
            firstRenderRef.current = false;
            // Check for autofilled values after a short delay
            const checkAutofill = setTimeout(() => {
                const emailInput = document.getElementById(
                    "email",
                ) as HTMLInputElement;
                const passwordInput = document.getElementById(
                    "password",
                ) as HTMLInputElement;

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

    useEffect(() => {
        if (isAuthenticated) {
            // Next.js doesn't have location.state, so always go to dashboard
            router.replace("/admin/dashboard");
        }
    }, [isAuthenticated, router]);

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

        const success = await login({ input: { email, password } });
        if (success) {
            router.push("/admin/dashboard");
        }
    };

    return (
        <Paper
            elevation={3}
            sx={{
                width: "100%",
                p: 4,
                borderRadius: 2,
            }}
        >
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    mb: 3,
                }}
            >
                {/* Logo placeholder */}
                <Box
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
                    <Typography variant="h4" color="white">
                        {strings.siteTitle[0].toUpperCase()}
                    </Typography>
                </Box>

                <Typography
                    variant="h4"
                    component="h1"
                    fontWeight="bold"
                    color="primary.main"
                >
                    {strings.signin}
                </Typography>

                <Typography
                    variant="body2"
                    color="text.secondary"
                    align="center"
                    sx={{ mt: 1 }}
                >
                    {strings.signinDescription}
                </Typography>
            </Box>

            {error && (
                <Alert
                    severity="error"
                    sx={{
                        mb: 3,
                        borderRadius: 1,
                        "& .MuiAlert-message": { fontWeight: 500 },
                    }}
                >
                    {error}
                </Alert>
            )}

            <Box
                component="form"
                onSubmit={handleSubmit}
                noValidate
                method="POST"
            >
                <TextField
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
                                <InputAdornment position="start">
                                    <Email sx={{ fontSize: 20 }} />
                                </InputAdornment>
                            ),
                        },
                    }}
                    sx={{ mb: 2 }}
                />

                <TextField
                    margin="normal"
                    required
                    fullWidth
                    name="password"
                    label={strings.password}
                    type={showPassword ? "text" : "password"}
                    id="password"
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isLoading}
                    variant="outlined"
                    slotProps={{
                        input: {
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Lock sx={{ fontSize: 20 }} />
                                </InputAdornment>
                            ),
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        aria-label="toggle password visibility"
                                        onClick={() =>
                                            setShowPassword(!showPassword)
                                        }
                                        onMouseDown={(e) => e.preventDefault()}
                                        edge="end"
                                    >
                                        {showPassword ? (
                                            <VisibilityOff />
                                        ) : (
                                            <Visibility />
                                        )}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        },
                    }}
                    sx={{ mb: 1 }}
                />

                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "flex-end",
                        mb: 2,
                    }}
                >
                    <Link href="#" variant="body2" underline="hover">
                        {strings.forgotPassword}
                    </Link>
                </Box>

                <Button
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
                    {isLoading ? (
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                            <CircularProgress
                                size={24}
                                color="inherit"
                                sx={{ mr: 1 }}
                            />
                            {strings.checking}
                        </Box>
                    ) : (
                        strings.signin
                    )}
                </Button>

                <Divider sx={{ my: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                        {strings.orText}
                    </Typography>
                </Divider>

                <Box
                    sx={{
                        textAlign: "center",
                        mt: 2,
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        gap: 1,
                    }}
                >
                    <Typography variant="body2" color="text.secondary">
                        {strings.dontHaveAccountQuestion}
                    </Typography>
                    <Link
                        href="#"
                        variant="body2"
                        underline="hover"
                        fontWeight="bold"
                    >
                        {strings.createAccount}
                    </Link>
                </Box>
            </Box>
        </Paper>
    );
};

export default LoginForm;
