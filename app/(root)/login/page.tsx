"use client";

import LoginForm from "@/client/views/auth/LoginForm";
import { Container } from "@mui/material";
import { Suspense } from "react";
import type React from "react";

const Login: React.FC = () => {
  return (
    <Container
      maxWidth="sm"
      sx={{
        py: 8,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 3,
        height: "100vh",
      }}
    >
      <Suspense fallback={<div>Loading...</div>}>
        <LoginForm />
      </Suspense>
    </Container>
  );
};

export default Login;
