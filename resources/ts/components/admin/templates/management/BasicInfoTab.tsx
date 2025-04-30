import React, { useState, useEffect, ChangeEvent } from "react";
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
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DeleteIcon from "@mui/icons-material/Delete";
import { useTemplateManagement } from "@/contexts/template/TemplateManagementContext";

const BasicInfoTab: React.FC = () => {
    const {template} = useTemplateManagement();
    
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        status: "draft",
    });

    const [preview, setPreview] = useState<string | null>(null);

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

    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
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
        setFormData(prev => ({
            ...prev,
            status: e.target.value
        }));
    };

    return (
        <Box component="form" noValidate sx={{ mt: 1 }}>
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
    );
};

export default BasicInfoTab;
