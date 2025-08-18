"use client";

import React, { useState, useRef } from "react";
import Typography, { TypographyProps } from "@mui/material/Typography";
import TextField, { TextFieldProps } from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import InputAdornment from "@mui/material/InputAdornment";
import { styled } from "@mui/material/styles";

type EditableTypographyProps = {
    typography: TypographyProps;
    textField: TextFieldProps;
    onSave: (value: string) => void | string | Promise<void | string>;
    doubleClickToEdit?: boolean;
    startEditing?: boolean;
    value: string;
    isValid?: (value: string) => string | undefined | null; // Add this prop
    onCancel?: () => void;
};

const HoverTypography = styled(Typography)(({ theme }) => ({
    "&:hover": {
        cursor: "text",
        background: theme.palette.action.hover,
    },
}));

const EditableTypography: React.FC<EditableTypographyProps> = ({
    typography,
    textField,
    onSave,
    doubleClickToEdit = true,
    startEditing = false,
    value,
    isValid,
    onCancel,
}) => {
    const [isEditing, setIsEditing] = useState(startEditing);
    const [inputValue, setInputValue] = useState(value);
    const [error, setError] = useState<string | undefined | null>();
    const inputRef = useRef<HTMLInputElement>(null);
    const touchTimeout = useRef<NodeJS.Timeout | null>(null);

    React.useEffect(() => {
        setIsEditing(startEditing);
    }, [startEditing]);

    React.useEffect(() => {
        setInputValue(value);
    }, [value]);

    const handleClick = () => {
        if (!doubleClickToEdit) {
            setIsEditing(true);
        }
    };

    const handleDoubleClick = () => {
        if (doubleClickToEdit) {
            setIsEditing(true);
        }
    };

    const handleTouchStart = () => {
        touchTimeout.current = setTimeout(() => {
            setIsEditing(true);
        }, 500);
    };

    const handleTouchEnd = () => {
        if (touchTimeout.current) {
            clearTimeout(touchTimeout.current);
        }
    };

    const handleSave = async () => {
        if (isValid) {
            const validationError = isValid(inputValue);
            if (validationError) {
                setError(validationError);
                return;
            }
        }
        const saveResult = await onSave(inputValue);
        if (typeof saveResult === "string" && saveResult) {
            setError(saveResult);
            return;
        }
        setError(undefined);
        setIsEditing(false);
    };

    const handleCancel = () => {
        setInputValue(value);
        setIsEditing(false);
        onCancel?.();
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            handleSave().then((r) => r);
        } else if (e.key === "Escape") {
            handleCancel();
        }
    };

    if (isEditing) {
        return (
            <TextField
                {...textField}
                value={inputValue}
                onChange={(e) => {
                    setInputValue(e.target.value);
                    if (isValid) {
                        setError(isValid(e.target.value));
                    }
                }}
                error={!!error}
                helperText={error}
                onKeyDown={handleKeyDown}
                autoFocus
                inputRef={inputRef}
                slotProps={{
                    input: {
                        ...textField.slotProps?.input,
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton
                                    onClick={handleSave}
                                    color="success"
                                    size="small"
                                >
                                    <CheckIcon />
                                </IconButton>
                                <IconButton
                                    onClick={handleCancel}
                                    color="error"
                                    size="small"
                                >
                                    <CloseIcon />
                                </IconButton>
                            </InputAdornment>
                        ),
                    },
                }}
            />
        );
    }

    return (
        <HoverTypography
            {...typography}
            onClick={handleClick}
            onDoubleClick={handleDoubleClick}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
        >
            {value}
        </HoverTypography>
    );
};

export default EditableTypography;
