import React from "react";
import { Box, Container, Paper, Theme } from "@mui/material";

interface GuestLayoutProps {
    children: React.ReactNode;
}

const GuestLayout: React.FC<GuestLayoutProps> = ({ children }) => {
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
            {children}
        </Container>
    );
};

export default GuestLayout;
