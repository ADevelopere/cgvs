"use client";

import React from "react";
import { Box, Skeleton, Stack, Paper } from "@mui/material";

interface LoadingSkeletonsProps {
    count?: number;
    variant?: "list" | "grid" | "toolbar" | "stats";
}

const LoadingSkeletons: React.FC<LoadingSkeletonsProps> = ({
    count = 6,
    variant = "list",
}) => {
    if (variant === "toolbar") {
        return (
            <Box sx={{ p: 2 }}>
                <Stack direction="row" spacing={2} alignItems="center">
                    <Skeleton variant="rectangular" width={300} height={40} />
                    <Skeleton variant="rectangular" width={120} height={40} />
                    <Skeleton variant="rectangular" width={120} height={40} />
                    <Skeleton variant="rectangular" width={140} height={40} />
                </Stack>
            </Box>
        );
    }

    if (variant === "stats") {
        return (
            <Paper sx={{ p: 2, m: 2 }}>
                <Stack direction="row" spacing={3}>
                    <Box sx={{ flex: 1 }}>
                        <Skeleton variant="text" width={150} height={24} />
                        <Skeleton variant="text" width={100} height={32} />
                        <Skeleton variant="text" width={200} height={20} />
                    </Box>
                    <Box sx={{ flex: 1 }}>
                        <Skeleton variant="text" width={120} height={24} />
                        <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                            <Skeleton
                                variant="rectangular"
                                width={80}
                                height={24}
                            />
                            <Skeleton
                                variant="rectangular"
                                width={70}
                                height={24}
                            />
                        </Stack>
                    </Box>
                    <Box sx={{ flex: 1 }}>
                        <Skeleton variant="text" width={100} height={24} />
                        <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                            <Skeleton
                                variant="rectangular"
                                width={60}
                                height={24}
                            />
                            <Skeleton
                                variant="rectangular"
                                width={50}
                                height={24}
                            />
                        </Stack>
                    </Box>
                </Stack>
            </Paper>
        );
    }

    if (variant === "grid") {
        return (
            <Box sx={{ p: 2 }}>
                <Stack direction="row" flexWrap="wrap" spacing={2}>
                    {Array.from({ length: count }).map((_, idx) => {
                        const uniqueKey = `grid-skeleton-${Math.random().toString(36).slice(2, 11)}-${Date.now()}-${idx}`;

                        return (
                            <Box
                                key={uniqueKey}
                                sx={{ width: 200, height: 240 }}
                            >
                                <Skeleton
                                    variant="rectangular"
                                    width="100%"
                                    height={160}
                                />
                                <Skeleton
                                    variant="text"
                                    width="80%"
                                    height={24}
                                    sx={{ mt: 1 }}
                                />
                                <Skeleton
                                    variant="text"
                                    width="60%"
                                    height={20}
                                />
                            </Box>
                        );
                    })}
                </Stack>
            </Box>
        );
    }

    // Default list variant
    return (
        <Box sx={{ p: 2 }}>
            <Stack spacing={1}>
                {Array.from({ length: count }).map((_, idx) => {
                    const uniqueKey = `list-skeleton-${Math.random().toString(36).slice(2, 11)}-${Date.now()}-${idx}`;
                    return (
                        <Box
                            key={uniqueKey}
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 2,
                                p: 1,
                            }}
                        >
                            <Skeleton
                                variant="circular"
                                width={24}
                                height={24}
                            />
                            <Skeleton
                                variant="circular"
                                width={40}
                                height={40}
                            />
                            <Box sx={{ flex: 1 }}>
                                <Skeleton
                                    variant="text"
                                    width="70%"
                                    height={20}
                                />
                                <Skeleton
                                    variant="text"
                                    width="50%"
                                    height={16}
                                />
                            </Box>
                            <Skeleton
                                variant="rectangular"
                                width={60}
                                height={24}
                            />
                            <Skeleton
                                variant="circular"
                                width={32}
                                height={32}
                            />
                        </Box>
                    );
                })}
            </Stack>
        </Box>
    );
};

export default LoadingSkeletons;
