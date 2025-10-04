"use client";

import React, { useEffect } from "react";
import { useAuth } from "@/client/contexts/AuthContext";
import { Box, CircularProgress, Typography } from "@mui/material";
import { useRouter } from "next/navigation";

interface ProtectedRouteProps {
    children: React.ReactNode;
    requireAdmin?: boolean;
    redirectTo?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
    children,
    requireAdmin = false,
    redirectTo = "/login",
}) => {
    const { isAuthenticated, user, isLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isLoading) {
            if (!isAuthenticated) {
                router.push(redirectTo);
                return;
            }

            // todo: Uncomment this when we have user roles
            // if (requireAdmin && user && !user.isAdmin) {
            //     router.push("/unauthorized");
            //     return;
            // }
        }
    }, [isAuthenticated, user, isLoading, requireAdmin, router, redirectTo]);

    if (isLoading) {
        return (
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
                <CircularProgress size={48} />
                <Typography>Checking authentication...</Typography>
            </Box>
        );
    }

    if (!isAuthenticated) {
        return null; // Will redirect in useEffect
    }

    // todo: Uncomment this when we have user roles
    // if (requireAdmin && user && !user.isAdmin) {
    //     return null; // Will redirect in useEffect
    // }

    return <>{children}</>;
};

export default ProtectedRoute;
