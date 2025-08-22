"use client";

import React, { useState, useEffect, ChangeEvent } from "react";
import {
    Box,
    TextField,
    Card,
    CardMedia,
    Button,
    Typography,
    Alert,
    Grid,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useTemplateManagement } from "@/contexts/template/TemplateManagementContext";
import { useAppTheme } from "@/contexts/ThemeContext";
import { useTemplateCategoryManagement } from "@/contexts/template/TemplateCategoryManagementContext";
import useAppTranslation from "@/locale/useAppTranslation";
import {
    UpdateTemplateInput,
    FileInfo,
} from "@/graphql/generated/types";
import { useStorageManagement } from "@/contexts/storage";
import { FileSelector } from "@/views/storage/components";
import { UPLOAD_LOCATIONS } from "@/contexts/storage/storage.location";

const BasicInfoTab: React.FC = () => {
    const { theme } = useAppTheme();
    const strings = useAppTranslation("templateCategoryTranslations");

    const { template, unsavedChanges, setUnsavedChanges } =
        useTemplateManagement();

    const { updateTemplate } = useTemplateCategoryManagement();
    const { items, loading, params, navigateTo, startUpload } =
        useStorageManagement();

    const [formData, setFormData] = useState({
        name: "",
        description: "",
        imageUrl: "",
    });

    const [error, setError] = useState<string | null>(null);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        // `UploadLocation` is a GraphQL union type (no runtime enum object),
        // so reference the upload location by its string key defined in
        // `UPLOAD_LOCATIONS`.
        const locationInfo = UPLOAD_LOCATIONS["TEMPLATE_COVER"];
        if (locationInfo) {
            navigateTo(locationInfo.path);
        }
    }, [navigateTo]);

    useEffect(() => {
        if (template) {
            setFormData({
                name: template.name ?? "",
                description: template.description ?? "",
                imageUrl: template.imageUrl ?? "",
            });
        }
    }, [template]);

    useEffect(() => {
        if (!template) {
            setUnsavedChanges(false);
            return;
        }
        const originalData = {
            name: template.name ?? "",
            description: template.description ?? "",
            image: template.imageUrl ?? "",
        };

        const currentData = {
            name: formData.name,
            description: formData.description,
            image: formData.imageUrl,
        };

        const hasChanges =
            originalData.name !== currentData.name ||
            originalData.description !== currentData.description ||
            originalData.image !== currentData.image;

        setUnsavedChanges(hasChanges);
    }, [formData, template, setUnsavedChanges]);

    const handleInputChange = (
        e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSelectFile = (file: FileInfo) => {
        if (file.url) {
            setFormData((prev) => ({
                ...prev,
                imageUrl: file.url!,
            }));
        }
    };

    const handleRemoveBackground = (): void => {
        setFormData((prev) => ({
            ...prev,
            imageUrl: "",
        }));
    };

    const handleSave = async () => {
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
            imageFileName: formData.imageUrl,
        };

        const updatedTemplate = await updateTemplate({
            input: input,
        });

        if (updatedTemplate) {
            setError(null);
            setUnsavedChanges(false);
        }
        setSaving(false);
    };

    const handleCancel = () => {
        if (template) {
            setFormData({
                name: template.name ?? "",
                description: template.description ?? "",
                imageUrl: template.imageUrl ?? "",
            });
        }
        setError(null);
    };

    const triggerUpload = () => {
        const input = document.createElement("input");
        input.type = "file";
        input.multiple = true;
        input.onchange = (event: Event) => {
            const target = event.target as HTMLInputElement | null;
            const files = target?.files;
            if (files && files.length > 0) {
                startUpload(Array.from(files), params.path);
            }
        };
        input.click();
    };

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
                        <Typography variant="h6" sx={{ mb: 2 }}>
                            Cover Image
                        </Typography>
                        {formData.imageUrl && (
                            <Card
                                sx={{
                                    mt: 1,
                                    mb: 2,
                                    position: "relative",
                                    maxWidth: "100%",
                                }}
                            >
                                <CardMedia
                                    component="img"
                                    image={formData.imageUrl}
                                    alt="Template background"
                                    sx={{
                                        maxHeight: "200px",
                                        width: "auto",
                                        maxWidth: "100%",
                                        objectFit: "contain",
                                        margin: "0 auto",
                                        display: "block",
                                    }}
                                />
                                <Button
                                    variant="contained"
                                    color="error"
                                    startIcon={<DeleteIcon />}
                                    onClick={handleRemoveBackground}
                                    sx={{
                                        position: "absolute",
                                        top: 8,
                                        right: 8,
                                    }}
                                >
                                    {strings.delete}
                                </Button>
                            </Card>
                        )}
                        <Card sx={{ p: 2 }}>
                            <FileSelector
                                items={
                                    items.filter(
                                        (item) => item.__typename === "FileInfo",
                                    ) as any
                                }
                                onSelectItem={handleSelectFile}
                                onUpload={triggerUpload}
                                selectedUrl={formData.imageUrl}
                                loading={loading}
                            />
                        </Card>
                    </Grid>
                </Grid>
            </Box>
        </Box>
    );
};

export default BasicInfoTab;