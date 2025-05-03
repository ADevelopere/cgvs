import React, { useState, useEffect, ChangeEvent, useRef } from "react";
import { flushSync } from 'react-dom';
import {
    Box,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Card,
    CardMedia,
    Button,
    Typography,
    SelectChangeEvent,
    Paper,
    Alert,
    Snackbar,
    AlertColor,
    useTheme,
    Theme,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DeleteIcon from "@mui/icons-material/Delete";
import { useTemplateManagement } from "@/contexts/template/TemplateManagementContext";
import axios from "@/utils/axios";
import { createRoot } from "react-dom/client";
import { ThemeProvider as MuiThemeProvider } from "@mui/material/styles";

const BasicInfoTab: React.FC = () => {
    const theme = useTheme();
    const containerRef = useRef<HTMLDivElement>(null);
    const { template, setUnsavedChanges } = useTemplateManagement();
    const [snackbar, setSnackbar] = useState<{
        open: boolean;
        message: string;
        severity: AlertColor;
    }>({
        open: false,
        message: "",
        severity: "success",
    });

    const [formData, setFormData] = useState({
        name: "",
        description: "",
        status: "draft",
    });

    const [preview, setPreview] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [saving, setSaving] = useState(false);
    const [hasChanges, setHasChanges] = useState(false);
    const [maxWidth, setMaxWidth] = useState<number | null>(null);
    const [leftOffset, setLeftOffset] = useState<number | null>(null);

    useEffect(() => {
        if (template) {
            setFormData({
                name: template.name || "",
                description: template.description || "",
                status: "draft", // You might want to map this from template if you have a status field
            });
        }
    }, [template]);

    useEffect(() => {
        if (template?.background_url) {
            setPreview(template.background_url);
        }
    }, [template]);

    // Check for changes whenever form data or preview changes
    useEffect(() => {
        const originalData = {
            name: template?.name || "",
            description: template?.description || "",
            status: template?.status || "draft",
            background: template?.background_url || null,
        };

        const currentData = {
            name: formData.name,
            description: formData.description,
            status: formData.status,
            background: preview,
        };

        const hasChanges =
            originalData.name !== currentData.name ||
            originalData.description !== currentData.description ||
            originalData.status !== currentData.status ||
            originalData.background !== currentData.background;

        setHasChanges(hasChanges);
        setUnsavedChanges(hasChanges);
    }, [formData, preview, template]);

    const handleInputChange = (
        e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleRemoveBackground = (): void => {
        setPreview(null);
    };

    const handleStatusChange = (e: SelectChangeEvent<string>): void => {
        setFormData((prev) => ({
            ...prev,
            status: e.target.value,
        }));
    };

    const handleSnackbarClose = () => {
        setSnackbar((prev) => ({ ...prev, open: false }));
    };

    const handleSave = async () => {
        try {
            setSaving(true);
            setError(null);

            // Create form data
            const formDataToSend = new FormData();
            formDataToSend.append("name", formData.name);
            formDataToSend.append("description", formData.description);
            formDataToSend.append("status", formData.status);

            // If there's a file input change and preview is set, get the file
            const fileInput = document.querySelector(
                'input[type="file"]',
            ) as HTMLInputElement;
            if (fileInput && fileInput.files && fileInput.files[0]) {
                formDataToSend.append("background", fileInput.files[0]);
            }

            // Determine if this is a create or update operation
            const url = template
                ? `/admin/templates/${template.id}`
                : "/admin/templates";
            const method = "post";

            // Add _method field for Laravel to handle PUT requests
            if (template) {
                formDataToSend.append("_method", "PUT");
            }

            const response = await axios({
                method: method,
                url: url,
                data: formDataToSend,
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            setUnsavedChanges(false);
            setSnackbar({
                open: true,
                message: "Template saved successfully",
                severity: "success",
            });
        } catch (err: any) {
            const errorMessage =
                err.response?.data?.message ||
                "An error occurred while saving the template";
            setError(errorMessage);
            setSnackbar({
                open: true,
                message: errorMessage,
                severity: "error",
            });
            console.error("Save error:", err);
        } finally {
            setSaving(false);
        }
    };

    const handleCancel = () => {
        setFormData({
            name: template?.name || "",
            description: template?.description || "",
            status: "draft",
        });
        setPreview(template?.background_url || null);
        setError(null);
    };

    useEffect(() => {
        const calculateDimensions = () => {
            if (containerRef.current) {
                const rect = containerRef.current.getBoundingClientRect();
                setMaxWidth(rect.width);
                setLeftOffset(rect.left);
            }
        };

        calculateDimensions();
        window.addEventListener("resize", calculateDimensions);

        return () => {
            window.removeEventListener("resize", calculateDimensions);
        };
    }, []);

    return (
        <Box
            ref={containerRef}
        >
            {/* form */}
            <Box component="form" noValidate sx={{ mt: 1, paddingBottom: 20 }}>
                {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {error}
                    </Alert>
                )}

                <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="templateName"
                    label="Template Name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    autoFocus
                />

                <TextField
                    margin="normal"
                    fullWidth
                    multiline
                    rows={4}
                    id="templateDescription"
                    label="Description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                />

                <FormControl fullWidth margin="normal">
                    <InputLabel id="status-label">Status</InputLabel>
                    <Select
                        labelId="status-label"
                        id="status"
                        value={formData.status}
                        label="Status"
                        onChange={handleStatusChange}
                    >
                        <MenuItem value="draft">Draft</MenuItem>
                        <MenuItem value="active">Active</MenuItem>
                        <MenuItem value="archived">Archived</MenuItem>
                    </Select>
                </FormControl>

                {preview ? (
                    <Card sx={{ mt: 3, position: "relative" }}>
                        <CardMedia
                            component="img"
                            height="200"
                            image={preview}
                            alt="Template background"
                            sx={{ objectFit: "contain" }}
                        />
                        <Button
                            variant="contained"
                            color="error"
                            startIcon={<DeleteIcon />}
                            onClick={handleRemoveBackground}
                            sx={{ position: "absolute", top: 8, right: 8 }}
                        >
                            Remove
                        </Button>
                    </Card>
                ) : (
                    <Card sx={{ mt: 3, mb: 3 }}>
                        <Box sx={{ p: 3, textAlign: "center" }}>
                            <Button
                                variant="outlined"
                                component="label"
                                startIcon={<CloudUploadIcon />}
                            >
                                Upload Background
                                <input
                                    type="file"
                                    hidden
                                    accept="image/*"
                                    onChange={handleFileChange}
                                />
                            </Button>
                            <Typography
                                variant="caption"
                                display="block"
                                sx={{ mt: 1 }}
                            >
                                Recommended size: 1920x1080px
                            </Typography>
                        </Box>
                    </Card>
                )}
            </Box>

            {/* Snackbar for notifications */}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={handleSnackbarClose}
                anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            >
                <Alert
                    onClose={handleSnackbarClose}
                    severity={snackbar.severity}
                    sx={{ width: "100%" }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>

            {/* Bottom Action Bar */}
            <InjectBottomBar
                onSave={handleSave}
                onCancel={handleCancel}
                saving={saving}
                theme={theme}
                maxWidth={maxWidth || undefined}
                leftOffset={leftOffset || undefined}
            />
        </Box>
    );
};

type BottomActionBarProps = {
    onSave: () => void;
    onCancel: () => void;
    saving: boolean;
    theme: Theme;
    maxWidth?: string | number;
    leftOffset?: number;
};

const BottomActionBar: React.FC<BottomActionBarProps> = ({
    onSave,
    onCancel,
    saving,
    theme,
    maxWidth,
}: BottomActionBarProps) => {
    return (
        <MuiThemeProvider theme={theme}>
            <Box
                sx={{
                    maxWidth: "100%",
                    display: "flex",
                }}
            >
                <Paper
                    sx={{
                        p: 2,
                        display: "flex",
                        justifyContent: "end",
                        alignItems: "center",
                        gap: 2,
                        width: maxWidth,
                    }}
                >
                    <Button
                        variant="outlined"
                        color="secondary"
                        onClick={onCancel}
                        disabled={saving}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={onSave}
                        disabled={saving}
                    >
                        {saving ? "Saving..." : "Save"}
                    </Button>
                </Paper>
            </Box>
        </MuiThemeProvider>
    );
};

const InjectBottomBar: React.FC<BottomActionBarProps> = ({
    onSave,
    onCancel,
    saving,
    theme,
    maxWidth,
    leftOffset,
}: BottomActionBarProps) => {
    // Create stable references for container and root
    const containerRef = useRef<HTMLDivElement | null>(null);
    const rootRef = useRef<ReturnType<typeof createRoot> | null>(null);

    // Create container and root only once on mount
    useEffect(() => {
        const container = document.createElement("div");
        container.id = "bottom-action-bar-container";
        document.body.appendChild(container);
        containerRef.current = container;
        rootRef.current = createRoot(container);

        return () => {
            if (rootRef.current && containerRef.current) {
                try {
                    flushSync(() => {
                        rootRef.current?.unmount();
                    });
                    document.body.removeChild(containerRef.current);
                } catch (e) {
                    console.error('Error during cleanup:', e);
                }
                rootRef.current = null;
                containerRef.current = null;
            }
        };
    }, []);

    // Handle updates to the component
    useEffect(() => {
        if (containerRef.current && rootRef.current) {
            // Update container styles
            Object.assign(containerRef.current.style, {
                position: "fixed",
                bottom: "0",
                left: leftOffset !== undefined ? `${leftOffset}px` : "0",
                width: "100%",
                zIndex: "999999",
            });

            // Render component using the stable root
            rootRef.current.render(
                <BottomActionBar
                    onSave={onSave}
                    onCancel={onCancel}
                    saving={saving}
                    theme={theme}
                    maxWidth={maxWidth}
                    leftOffset={leftOffset}
                />
            );
        }
    }, [onSave, onCancel, saving, theme, maxWidth, leftOffset]);

    return null;
};

export default BasicInfoTab;
