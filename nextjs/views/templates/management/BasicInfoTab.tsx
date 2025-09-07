"use client";

import React, {
    useState,
    useEffect,
    ChangeEvent,
    useCallback,
    useRef,
} from "react";
import {
    Box,
    TextField,
    Card,
    Button,
    Typography,
    Alert,
    Grid,
    Stack,
} from "@mui/material";
import { Delete as DeleteIcon, Image as ImageIcon } from "@mui/icons-material";
import { useTemplateManagement } from "@/contexts/template/TemplateManagementContext";
import { useAppTheme } from "@/contexts/ThemeContext";
import { useTemplateCategoryManagement } from "@/contexts/template/TemplateCategoryManagementContext";
import useAppTranslation from "@/locale/useAppTranslation";
import { UpdateTemplateInput, FileInfo } from "@/graphql/generated/types";
import FilePickerDialog from "@/views/storage/dialogs/FilePickerDialog";
import Image from "next/image";
import logger from "@/utils/logger";

type FormDataType = {
    name: string;
    description?: string | null;
    imageFile?: FileInfo;
};

const BasicInfoTab: React.FC = () => {
    const { theme } = useAppTheme();
    const strings = useAppTranslation("templateCategoryTranslations");
    const storageStrings = useAppTranslation("storageTranslations");

    const { template, unsavedChanges, setUnsavedChanges } =
        useTemplateManagement();

    const { updateTemplate } = useTemplateCategoryManagement();

    // Create a ref to store the setUnsavedChanges function to prevent infinite re-renders
    const setUnsavedChangesRef = useRef(setUnsavedChanges);

    // Update the ref when the function changes
    useEffect(() => {
        setUnsavedChangesRef.current = setUnsavedChanges;
    }, [setUnsavedChanges]);

    const [formData, setFormData] = useState<FormDataType>({
        name: "",
        description: "",
        imageFile: undefined,
    });

    const [error, setError] = useState<string | null>(null);
    const [saving, setSaving] = useState(false);

    const [filePickerOpen, setFilePickerOpen] = useState(false);

    useEffect(() => {
        if (template) {
            logger.info("Setting form data from template", JSON.stringify(template) );
                setFormData({
                name: template.name ?? "",
                description: template.description ?? "",
                imageFile: template.imageFile,
            });
        }
    }, [template]);

    useEffect(() => {
        if (!template || !formData) {
            setUnsavedChangesRef.current(false);
            return;
        }
        const originalData: FormDataType = {
            name: template.name,
            description: template.description,
            imageFile: template.imageFile,
        };

        const currentData = formData;

        const hasChanges =
            originalData.name !== currentData.name ||
            originalData.description !== currentData.description ||
            originalData.imageFile?.path !== currentData.imageFile?.path;

        setUnsavedChangesRef.current(hasChanges);
    }, [formData, template]);

    const handleInputChange = useCallback(
        (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
            const { name, value } = e.target;
            setFormData((prev) => ({
                ...prev,
                [name]: value,
            }));
        },
        [],
    );

    const handleFileSelect = useCallback((file: FileInfo) => {
        setFormData((prev) => ({
            ...prev,
            imageFile: file,
        }));
        setFilePickerOpen(false);
    }, []);

    const handleRemoveImage = useCallback((): void => {
        setFormData((prev) => ({
            ...prev,
            imageUrl: "",
            imagePath: undefined,
        }));
    }, []);

    const handleSave = useCallback(async () => {
        if (!template?.id || !template.category?.id) {
            const msg = "Template data is incomplete for saving.";
            setError(msg);
            return;
        }
        setSaving(true);
        setError(null);

        const input: UpdateTemplateInput = {
            id: template.id,
            name: formData.name,
            description: formData.description || undefined,
            categoryId: template.category.id,
            // Note: imageFileId integration pending file ID resolution
        };

        const updatedTemplate = await updateTemplate({
            input: input,
        });

        if (updatedTemplate) {
            setError(null);
            setUnsavedChangesRef.current(false);
        }
        setSaving(false);
    }, [
        formData.description,
        formData.name,
        template?.category.id,
        template?.id,
        updateTemplate,
    ]);

    const handleCancel = useCallback(() => {
        if (template) {
            setFormData({
                name: template.name ?? "",
                description: template.description ?? "",
                imageFile: template.imageFile,
            });
        }
        setError(null);
    }, [template]);

    if(!formData.imageFile?.url){
        logger.warn("No image URL found in formData.imageFile");
        return null;
    }

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                gap: 2,
                overflowY: "hidden",
            }}
        >
            {/* Action Bar */}
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: 2,
                    borderBottom: `1px solid ${theme.palette.divider}`,
                    pb: 1,
                }}
            >
                <Typography variant="h6" component="h2">
                    {strings.tabBasicInfo}
                </Typography>

                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "start",
                        gap: 2,
                    }}
                >
                    <Button
                        variant="outlined"
                        color="secondary"
                        onClick={handleCancel}
                        disabled={saving || !unsavedChanges}
                    >
                        {strings.cancel}
                    </Button>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleSave}
                        disabled={saving || !unsavedChanges}
                    >
                        {saving ? strings.saving : strings.save}
                    </Button>
                </Box>
            </Box>

            {/* form */}
            <Box
                component="form"
                noValidate
                sx={{
                    mt: 1,
                    overflowY: "auto",
                    maxHeight: `calc(100vh - 230px)`,
                    minHeight: `calc(100vh - 230px)`,
                    px: 2,
                }}
            >
                {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {error}
                    </Alert>
                )}
                <Grid container spacing={2}>
                    <Grid size={{ xs: 12, md: 12 }}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="templateName"
                            label={strings.name}
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
                            label={strings.description}
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                        />
                    </Grid>
                    <Grid size={{ xs: 12, md: 12 }}>
                        <Box
                            sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                mb: 2,
                            }}
                        >
                            <Typography variant="h6">Cover Image</Typography>
                            <Stack direction="row" spacing={2}>
                                <Button
                                    variant="contained"
                                    startIcon={<ImageIcon />}
                                    onClick={() => setFilePickerOpen(true)}
                                    color="primary"
                                >
                                    {
                                        storageStrings.ui
                                            .filePickerDialogSelectFile
                                    }
                                </Button>
                                {formData.imageFile && (
                                    <Button
                                        variant="outlined"
                                        startIcon={<DeleteIcon />}
                                        onClick={handleRemoveImage}
                                        color="error"
                                    >
                                        {strings.delete}
                                    </Button>
                                )}
                            </Stack>
                        </Box>
                        <Card
                            sx={{
                                mt: 1,
                                mb: 2,
                                maxWidth: "100%",
                                height: "200px",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                border: "1px dashed grey",
                            }}
                        >
                            {formData.imageFile ? (
                                <Image
                                    src={formData.imageFile.url}
                                    alt={formData.imageFile.name}
                                    width={300}
                                    height={200}
                                    style={{
                                        maxHeight: "200px",
                                        maxWidth: "100%",
                                        objectFit: "contain",
                                    }}
                                />
                            ) : (
                                <ImageIcon
                                    sx={{
                                        fontSize: "4rem",
                                        color: "text.secondary",
                                    }}
                                />
                            )}
                        </Card>
                    </Grid>
                </Grid>
            </Box>

            {/* File Picker Dialog */}
            <FilePickerDialog
                open={filePickerOpen}
                onClose={() => setFilePickerOpen(false)}
                onFileSelect={handleFileSelect}
                allowedFileTypes={["image/*"]} // Only allow image files for template covers
                title={storageStrings.ui.filePickerDialogSelectFile}
            />
        </Box>
    );
};

export default BasicInfoTab;
