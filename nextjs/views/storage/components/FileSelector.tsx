"use client";

import React from "react";
import {
    Box,
    Button,
    Typography,
    Grid,
    Card,
    CardActionArea,
    CardMedia,
    CardContent,
} from "@mui/material";
import { FileInfo } from "@/graphql/generated/types";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

interface FileSelectorProps {
    items: FileInfo[];
    onSelectItem: (item: FileInfo) => void;
    onUpload: () => void;
    selectedUrl?: string | null;
    loading?: boolean;
}

const FileSelector: React.FC<FileSelectorProps> = ({
    items,
    onSelectItem,
    onUpload,
    selectedUrl,
    loading,
}) => {
    const files = items.filter((item): item is FileInfo & { url: string } => Boolean(item.url));

    return (
        <Box>
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 2,
                }}
            >
                <Typography variant="h6">Select a File</Typography>
                <Button
                    variant="contained"
                    startIcon={<CloudUploadIcon />}
                    onClick={onUpload}
                >
                    Upload
                </Button>
            </Box>
            <Grid container spacing={2}>
                {files.map((item) => (
                    <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={item.path}>
                        <Card
                            sx={{
                                position: "relative",
                                border:
                                    selectedUrl === item.url
                                        ? "2px solid"
                                        : "none",
                                borderColor: "primary.main",
                            }}
                        >
                            <CardActionArea onClick={() => onSelectItem(item)}>
                                <CardMedia
                                    component="img"
                                    height="140"
                                    image={item.url!}
                                    alt={item.name}
                                />
                                <CardContent>
                                    <Typography
                                        variant="body2"
                                        color="text.secondary"
                                        noWrap
                                    >
                                        {item.name}
                                    </Typography>
                                </CardContent>
                            </CardActionArea>
                            {selectedUrl === item.url && (
                                <CheckCircleIcon
                                    sx={{
                                        position: "absolute",
                                        top: 8,
                                        right: 8,
                                        color: "primary.main",
                                    }}
                                />
                            )}
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
};

export default FileSelector;
