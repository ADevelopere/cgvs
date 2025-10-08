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
import { TemplateCategory } from "@/client/graphql/generated/gql/graphql";

interface Props {
    open: boolean;
    category: TemplateCategory | null;
    categories: TemplateCategory[];
    onClose: () => void;
    onSave: (data: {
        name: string;
        description?: string;
        parentId?: number | null;
    }) => void;
}

const CategoryEditDialog: React.FC<Props> = ({
    open,
    category,
    categories,
    onClose,
    onSave,
}) => {
    const strings = useAppTranslation("templateCategoryTranslations");
    const [name, setName] = useState(category?.name ?? "");
    const [description, setDescription] = useState(category?.description ?? "");
    const [parentId, setParentId] = useState<number | null>(
        category?.parentCategory?.id ?? null,
    );
    const [error, setError] = useState("");

    useEffect(() => {
        if (category) {
            setName(category.name);
            setDescription(category.description ?? "");
            setParentId(category.parentCategory?.id ?? null);
        }
    }, [category]);

    const handleSave = () => {
        if (name.length < 3) {
            setError(strings.nameTooShort);
            return;
        }
        if (name.length > 255) {
            setError(strings.nameTooLong);
            return;
        }

        onSave({
            name,
            description: description || undefined,
            parentId: category?.specialType ? undefined : parentId,
        });
        handleClose();
    };

    const handleClose = () => {
        setError("");
        onClose();
    };

    const availableParentCategories = categories.filter(
        (c) =>
            c.id !== category?.id &&
            // Prevent circular references by excluding children
            !category?.subCategories?.some((child) => child.id === c.id),
    );

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

                    {!category?.specialType && (
                        <Autocomplete
                            value={
                                availableParentCategories.find(
                                    (c) => c.id === parentId,
                                ) || null
                            }
                            onChange={(_, newValue) =>
                                setParentId(newValue?.id ?? null)
                            }
                            options={availableParentCategories}
                            getOptionLabel={(option) => option.name}
                            noOptionsText={strings.noCategories}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label={strings.parentCategory}
                                    placeholder={strings.selectCategory}
                                />
                            )}
                        />
                    )}
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

export default CategoryEditDialog;
