import React, { useState, useEffect, ChangeEvent } from "react";
import {
    Box,
    TextField,
    Card,
    CardMedia,
    Button,
    Typography,
    Alert,
    Snackbar,
    AlertColor,
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
    UpdateTemplateWithImageInput,
} from "@/graphql/generated/types";
import { se } from "date-fns/locale";

const BasicInfoTab: React.FC = () => {
    const { theme } = useAppTheme();
    const strings = useAppTranslation("templateCategoryTranslations");

    const { template, unsavedChanges, setUnsavedChanges } =
        useTemplateManagement();

    console.log("BasicInfoTab template", template);

    const { updateTemplate, updateTemplateWithImage } =
        useTemplateCategoryManagement();

    const [formData, setFormData] = useState({
        name: "",
        description: "",
    });

    const [preview, setPreview] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [saving, setSaving] = useState(false);
    const [selectedImageFile, setSelectedImageFile] = useState<File | null>(
        null,
    );

    useEffect(() => {
        if (template) {
            setFormData({
                name: template.name || "",
                description: template.description || "",
            });
            // Reset file states when the template context changes
            setSelectedImageFile(null);
        }
    }, [template]);

    useEffect(() => {
        if (template?.image_url) {
            setPreview(template.image_url);
        } else {
            setPreview(null); // Ensure preview is cleared if no image_url
        }
    }, [template]);

    // Check for changes whenever form data, preview or selected file changes
    useEffect(() => {
        if (!template) {
            setUnsavedChanges(false);
            return;
        }
        const originalData = {
            name: template.name || "",
            description: template.description || "",
            image: template.image_url || null,
        };

        const currentData = {
            name: formData.name,
            description: formData.description,
            image: preview, // Preview reflects the current visual state
        };

        // An image change occurs if a new file is staged,
        // or if an existing image is marked for removal (preview becomes null when it wasn't).
        const imageChanged =
            selectedImageFile !== null || // New file selected
            (originalData.image !== null && currentData.image === null); // Existing image removed

        const hasChanges =
            originalData.name !== currentData.name ||
            originalData.description !== currentData.description ||
            imageChanged;

        setUnsavedChanges(hasChanges);
    }, [formData, preview, template, selectedImageFile, setUnsavedChanges]);

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
            setSelectedImageFile(file);
            setPreview(URL.createObjectURL(file));
        } else {
            // This case might not be typical if a file is selected,
            // but good for completeness if the input is cleared.
            setSelectedImageFile(null);
            setPreview(template?.image_url || null); // Revert to original or clear
        }
    };

    const handleRemoveBackground = (): void => {
        setSelectedImageFile(null); // Clear any selected file
        setPreview(null); // Set preview to null to indicate removal
    };

    const handleSave = async () => {
        if (!template || !template.id || !template.category?.id) {
            const msg = "Template data is incomplete for saving.";
            setError(msg);
            return;
        }
        setSaving(true);
        setError(null);

        const imageChanged =
            selectedImageFile !== null || // A new file is selected
            (preview === null && template.image_url !== null); // An existing image is being removed

        let updatedTemplate: Template | null = null;
        if (imageChanged) {
            const input: UpdateTemplateWithImageInput = {
                name: formData.name,
                description: formData.description || undefined, // Use undefined if backend treats empty string and null differently
                categoryId: template.category.id,
                // order: template.order, // Include if order is managed
                image: selectedImageFile || null, // Send the file or null if removing
            };
            updatedTemplate = await updateTemplateWithImage({
                id: template.id,
                input: input,
            });
        } else {
            const input: UpdateTemplateInput = {
                name: formData.name,
                description: formData.description || undefined,
                categoryId: template.category.id,
                // order: template.order, // Include if order is managed
            };
            updatedTemplate = await updateTemplate({
                id: template.id,
                input: input,
            });
        }

        if (updatedTemplate) {
            setError(null);
            setUnsavedChanges(false);
            setSelectedImageFile(null); // Clear the staged file after successful save
        }
        setSaving(false);
    };

    const handleCancel = () => {
        setFormData({
            name: template?.name || "",
            description: template?.description || "",
        });
        setPreview(template?.image_url || null);
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
                            {strings.delete}
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
                                {strings.uploadImage}
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
