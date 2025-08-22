"use client";

import React, { useState } from "react";
import {
    Container,
    Typography,
    Button,
    Box,
    Paper,
    Stack,
    Alert,
    Divider,
} from "@mui/material";
import {
    FilePresent as FileIcon,
} from "@mui/icons-material";
import { 
    FileSelector, 
    FileSelectorDialog,
} from "@/views/storage/components";
import { StorageGraphQLProvider } from "@/contexts/storage";
import * as Graphql from "@/graphql/generated/types";

const FileSelectorDemoPage: React.FC = () => {
    // Dialog demo state
    const [dialogOpen, setDialogOpen] = useState(false);
    const [dialogMultiple, setDialogMultiple] = useState(false);
    const [dialogSelection, setDialogSelection] = useState<string[]>([]);

    // Inline selector demo state
    const [inlineSelection, setInlineSelection] = useState<string[]>([]);
    const [inlineLocation, setInlineLocation] = useState<Graphql.UploadLocation>("TEMPLATE_COVER");

    const handleDialogSelect = (files: string[]) => {
        setDialogSelection(files);
        console.log("Dialog selected files:", files);
    };

    const handleInlineChange = (files: string[]) => {
        setInlineSelection(files);
        console.log("Inline selected files:", files);
    };

    return (
        <StorageGraphQLProvider>
            <Container maxWidth="lg" sx={{ py: 4 }}>
                <Typography variant="h4" gutterBottom>
                    File Selector Demo
                </Typography>
                <Typography variant="body1" color="text.secondary" paragraph>
                    This page demonstrates the FileSelector component functionality.
                </Typography>

                <Stack spacing={4}>
                    {/* Dialog Examples */}
                    <Paper sx={{ p: 3 }}>
                        <Typography variant="h5" gutterBottom>
                            Dialog Mode
                        </Typography>
                        <Typography variant="body2" color="text.secondary" paragraph>
                            Use FileSelectorDialog for modal file selection.
                        </Typography>

                        <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
                            <Button
                                variant="contained"
                                onClick={() => {
                                    setDialogMultiple(false);
                                    setDialogOpen(true);
                                }}
                            >
                                Single File Selection
                            </Button>
                            <Button
                                variant="contained"
                                onClick={() => {
                                    setDialogMultiple(true);
                                    setDialogOpen(true);
                                }}
                            >
                                Multiple File Selection
                            </Button>
                        </Stack>

                        {dialogSelection.length > 0 && (
                            <Alert severity="success" sx={{ mb: 2 }}>
                                <Typography variant="subtitle2" gutterBottom>
                                    Dialog Selection Result:
                                </Typography>
                                {dialogSelection.map((file, index) => (
                                    <Typography key={index} variant="body2">
                                        • {file}
                                    </Typography>
                                ))}
                            </Alert>
                        )}
                    </Paper>

                    <Divider />

                    {/* Inline Examples */}
                    <Paper sx={{ p: 3 }}>
                        <Typography variant="h5" gutterBottom>
                            Inline Mode
                        </Typography>
                        <Typography variant="body2" color="text.secondary" paragraph>
                            Use FileSelector directly in your forms or pages.
                        </Typography>

                        <Box sx={{ mb: 3 }}>
                            <FileSelector
                                location={inlineLocation}
                                value={inlineSelection}
                                onChange={handleInlineChange}
                                multiple={true}
                                allowUpload={true}
                                maxSelection={5}
                            />
                        </Box>

                        {inlineSelection.length > 0 && (
                            <Alert severity="info">
                                <Typography variant="subtitle2" gutterBottom>
                                    Current Selection ({inlineSelection.length} files):
                                </Typography>
                                {inlineSelection.map((file, index) => (
                                    <Typography key={index} variant="body2">
                                        • {file}
                                    </Typography>
                                ))}
                            </Alert>
                        )}
                    </Paper>

                    {/* API Information */}
                    <Paper sx={{ p: 3, backgroundColor: "grey.50" }}>
                        <Typography variant="h6" gutterBottom>
                            API Usage
                        </Typography>
                        <Typography variant="body2" paragraph>
                            <strong>FileSelectorDialog:</strong> Use for modal file selection with confirm/cancel actions.
                        </Typography>
                        <Typography variant="body2" paragraph>
                            <strong>FileSelector:</strong> Use for inline file selection in forms.
                        </Typography>
                        <Typography variant="body2" paragraph>
                            <strong>Key Features:</strong>
                        </Typography>
                        <ul>
                            <li>Location-based file filtering</li>
                            <li>Upload functionality during selection</li>
                            <li>Single/multiple selection modes</li>
                            <li>Grid/list view modes</li>
                            <li>File type validation</li>
                            <li>Selection limits</li>
                        </ul>
                    </Paper>
                </Stack>

                {/* Dialog Component */}
                <FileSelectorDialog
                    open={dialogOpen}
                    onClose={() => setDialogOpen(false)}
                    onSelect={handleDialogSelect}
                    location="TEMPLATE_COVER"
                    multiple={dialogMultiple}
                    allowUpload={true}
                    maxSelection={dialogMultiple ? 3 : 1}
                    requireSelection={true}
                />
            </Container>
        </StorageGraphQLProvider>
    );
};

export default FileSelectorDemoPage;
