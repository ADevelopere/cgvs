"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"
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
} from "@mui/material"
import { Email, Lock } from "@mui/icons-material"
import { useAuth } from "@/contexts/AuthContext"
import isValidEmail from "@/utils/email"

type LoginFormProps = {}

const LoginForm: React.FC<LoginFormProps> = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { login, isAuthenticated, error, clearError, isLoading } = useAuth()
  const [email, setEmail] = useState("")
  const [emailError, setEmailError] = useState("")
  const [password, setPassword] = useState("")

  useEffect(() => {
    if (isAuthenticated) {
      const from = location.state?.from?.pathname || "/admin/dashboard"
      navigate(from, { replace: true })
    }
  }, [isAuthenticated, navigate, location])

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEmail = e.target.value
    setEmail(newEmail)

    if (newEmail && !isValidEmail(newEmail)) {
      setEmailError("Please enter a valid email address")
    } else {
      setEmailError("")
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    // Prevent submission if there are validation errors
    if (emailError) {
      return
    }

    clearError()
    const success = await login({ email, password })
    if (success) {
      navigate("/admin/dashboard")
    }
  }

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
            A
          </Typography>
        </Box>

        <Typography variant="h4" component="h1" fontWeight="bold" color="primary.main">
          Sign In
        </Typography>

        <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 1 }}>
          Enter your credentials to access your account
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

      <Box component="form" onSubmit={handleSubmit} noValidate>
        <TextField
          margin="normal"
          required
          fullWidth
          id="email"
          label="Email Address"
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
          label="Password"
          type="password"
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
            },
          }}
          sx={{ mb: 1 }}
        />

        <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
          <Link href="#" variant="body2" underline="hover">
            Forgot password?
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
              <CircularProgress size={24} color="inherit" sx={{ mr: 1 }} />
              Signing in...
            </Box>
          ) : (
            "Sign In"
          )}
        </Button>

        <Divider sx={{ my: 2 }}>
          <Typography variant="body2" color="text.secondary">
            OR
          </Typography>
        </Divider>

        <Box sx={{ textAlign: "center", mt: 2 }}>
          <Typography variant="body2" color="text.secondary">
            Don't have an account?{" "}
            <Link href="#" variant="body2" underline="hover" fontWeight="bold">
              Sign Up
            </Link>
          </Typography>
        </Box>
      </Box>
    </Paper>
  )
}

export default LoginForm
