"use client";

import React, { useEffect, useState } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Box,
} from "@mui/material";
import { useAppTranslation } from "@/client/locale";
import { TemplateCategory } from "@/client/graphql/generated/gql/graphql";

interface Props {
    open: boolean;
    categoryToEdit: TemplateCategory | null;
    onClose: () => void;
    onSave: (data: {
        name: string;
        description?: string;
        parentId?: number | null;
    }) => void;
}

const CategoryEditDialog: React.FC<Props> = ({
    open,
    categoryToEdit,
    onClose,
    onSave,
}) => {
    const strings = useAppTranslation("templateCategoryTranslations");
    const [name, setName] = useState(categoryToEdit?.name ?? "");
    const [description, setDescription] = useState(categoryToEdit?.description ?? "");
    const [parentId, setParentId] = useState<number | null>(
        categoryToEdit?.parentCategory?.id ?? null,
    );
    const [error, setError] = useState("");

    useEffect(() => {
        if (categoryToEdit?.name) {
            setName(categoryToEdit.name);
            setDescription(categoryToEdit.description ?? "");
            setParentId(categoryToEdit.parentCategory?.id ?? null);
        }
    }, [categoryToEdit]);

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
            parentId: categoryToEdit?.specialType ? undefined : parentId,
        });
        handleClose();
    };

    const handleClose = () => {
        setError("");
        onClose();
    };

    // todo: use server search,
    // const availableParentCategories = categories.filter(
    //     (c) =>
    //         c.id !== categoryToEdit?.id &&
    //         // Prevent circular references by excluding children
    //         !categoryToEdit?.subCategories?.some((child) => child.id === c.id),
    // );

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


                    {/* todo: */}
                    {/* {!categoryToEdit?.specialType && (
                        <Autocomplete
                            value={
                                availableParentCategories.find(
                                    (c) => c.id === parentId,
                                ) || undefined
                            }
                            onChange={(_, newValue) =>
                                setParentId(newValue?.id ?? null)
                            }
                            options={availableParentCategories}
                            getOptionLabel={(option) => {
                                if (!option.name) {
                                    throw new Error(
                                        "Category name is required",
                                    );
                                }
                                return option.name;
                            }}
                            noOptionsText={strings.noCategories}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label={strings.parentCategory}
                                    placeholder={strings.selectCategory}
                                />
                            )}
                        />
                    )} */}
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
