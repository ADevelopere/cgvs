"use client";

import LoginForm from "@/client/views/auth/LoginForm";
import { Container } from "@mui/material";
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
            <LoginForm />
        </Container>
    );
    
};

export default Login;
