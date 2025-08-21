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
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DeleteIcon from "@mui/icons-material/Delete";
import { useTemplateManagement } from "@/contexts/template/TemplateManagementContext";
import { useAppTheme } from "@/contexts/ThemeContext";
import { useTemplateCategoryManagement } from "@/contexts/template/TemplateCategoryManagementContext";
import useAppTranslation from "@/locale/useAppTranslation";
import {
    Template,
    UpdateTemplateInput,
    UploadLocation,
} from "@/graphql/generated/types";
import { FileSelectorModal } from "@/views/storage/components";
import { StorageItem } from "@/contexts/storage";

const BasicInfoTab: React.FC = () => {
    const { theme } = useAppTheme();
    const strings = useAppTranslation("templateCategoryTranslations");

    const { template, unsavedChanges, setUnsavedChanges } =
        useTemplateManagement();

    const { updateTemplate } = useTemplateCategoryManagement();

    const [formData, setFormData] = useState({
        name: "",
        description: "",
        imageUrl: "",
    });

    const [error, setError] = useState<string | null>(null);
    const [saving, setSaving] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

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

    const handleSelectFile = (file: StorageItem) => {
        setFormData((prev) => ({
            ...prev,
            imageUrl: file.url,
        }));
        setIsModalOpen(false);
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
            name: formData.name,
            description: formData.description || undefined,
            categoryId: template.category.id,
            imageUrl: formData.imageUrl,
        };

        const updatedTemplate = await updateTemplate({
            id: template.id,
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

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                gap: 2,
                overflowY: "hidden",
            }}
        >
            <FileSelectorModal
                open={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSelectFile={handleSelectFile}
                location={UploadLocation.TemplateCover}
                selectedUrl={formData.imageUrl}
            />
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

                {formData.imageUrl ? (
                    <Card
                        sx={{
                            mt: 3,
                            position: "relative",
                            maxWidth: "100%",
                        }}
                    >
                        <Box
                            sx={{
                                position: "relative",
                                width: "100%",
                                maxWidth: "1200px", // Maximum width for very large screens
                                mx: "auto", // Center the box
                            }}
                        >
                            <CardMedia
                                component="img"
                                image={formData.imageUrl}
                                alt="Template background"
                                sx={{
                                    maxHeight: "400px", // Maximum height
                                    width: "auto", // Allow width to adjust based on height
                                    maxWidth: "100%", // Ensure it doesn't overflow container
                                    objectFit: "contain", // Preserve aspect ratio
                                    margin: "0 auto", // Center the image
                                    display: "block", // Remove any extra spacing
                                }}
                            />
                            <Button
                                variant="contained"
                                color="error"
                                startIcon={<DeleteIcon />}
                                onClick={handleRemoveBackground}
                                sx={{ position: "absolute", top: 8, right: 8 }}
                            >
                                {strings.delete}
                            </Button>
                        </Box>
                    </Card>
                ) : (
                    <Card sx={{ mt: 3, mb: 3 }}>
                        <Box sx={{ p: 3, textAlign: "center" }}>
                            <Button
                                variant="outlined"
                                component="label"
                                startIcon={<CloudUploadIcon />}
                                onClick={() => setIsModalOpen(true)}
                            >
                                {strings.uploadImage}
                            </Button>
                            <Typography
                                variant="caption"
                                display="block"
                                sx={{ mt: 1 }}
                            >
                                {strings.recommendedImageSize}: 1920x1080px
                            </Typography>
                        </Box>
                    </Card>
                )}
            </Box>
        </Box>
    );
};

export default BasicInfoTab;
