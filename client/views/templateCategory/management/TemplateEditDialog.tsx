"use client";

import React, { useEffect, useState } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Autocomplete,
    Box,
} from "@mui/material";
import { useAppTranslation } from "@/client/locale";
import {
    Template,
    TemplateCategory,
} from "@/client/graphql/generated/gql/graphql";

interface Props {
    open: boolean;
    template: Template | null;
    categories: TemplateCategory[];
    onClose: () => void;
    onSave: (template: Template) => void;
}

const TemplateEditDialog: React.FC<Props> = ({
    open,
    template,
    categories,
    onClose,
    onSave,
}) => {
    const strings = useAppTranslation("templateCategoryTranslations");
    const [name, setName] = useState(template?.name ?? "");
    const [description, setDescription] = useState(template?.description ?? "");
    const [categoryId, setCategoryId] = useState<number | null | undefined>(
        template?.category?.id ?? null,
    );
    const [error, setError] = useState("");

    useEffect(() => {
        if (template) {
            setName(template.name);
            setDescription(template.description ?? "");
            setCategoryId(template.category?.id);
        }
    }, [template]);

    const handleSave = () => {
        if (name.length < 3) {
            setError(strings.nameTooShort);
            return;
        }
        if (name.length > 255) {
            setError(strings.nameTooLong);
            return;
        }

        if (!template) return;

        onSave({
            ...template,
            name,
            description: description || undefined,
            category:
                categories.find((c) => c.id === categoryId) ||
                template.category,
        });
        handleClose();
    };

    const handleClose = () => {
        setError("");
        onClose();
    };

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
            <DialogTitle>{strings.edit}</DialogTitle>
            <DialogContent>
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 2,
                        pt: 1,
                    }}
                >
                    <TextField
                        autoFocus
                        label={strings.name}
                        fullWidth
                        value={name}
                        onChange={(e) => {
                            setName(e.target.value);
                            setError("");
                        }}
                        error={!!error}
                        helperText={error}
                        required
                    />
                    <TextField
                        label={strings.description}
                        fullWidth
                        multiline
                        rows={3}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                    <Autocomplete
                        value={
                            categories.find((c) => c.id === categoryId) || null
                        }
                        onChange={(_, newValue) =>
                            setCategoryId(newValue?.id ?? null)
                        }
                        options={categories}
                        getOptionLabel={(option) => option.name}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label={strings.parentCategory}
                                placeholder={strings.selectCategory}
                            />
                        )}
                    />
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>{strings.cancel}</Button>
                <Button onClick={handleSave} variant="contained">
                    {strings.save}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default TemplateEditDialog;
