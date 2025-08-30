"use client";

import React from "react";
import {
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Box,
    Typography,
    Chip,
    SelectChangeEvent,
} from "@mui/material";
import {
    Image as ImageIcon,
    Folder as FolderIcon,
} from "@mui/icons-material";
import { getUploadLocationOptions, getLocationInfo } from "@/contexts/storage/storage.location";
import * as Graphql from "@/graphql/generated/types";
import useAppTranslation from "@/locale/useAppTranslation";

interface LocationSelectorProps {
    value?: Graphql.UploadLocation;
    onChange: (location: Graphql.UploadLocation) => void;
    disabled?: boolean;
    label?: string;
    fullWidth?: boolean;
}

const LocationSelector: React.FC<LocationSelectorProps> = ({
    value,
    onChange,
    disabled = false,
    label,
    fullWidth = true,
}) => {
    const locations = getUploadLocationOptions();
    const translations = useAppTranslation("storageTranslations");

    const getLocationIcon = (iconName?: string) => {
        if (iconName === "Image") {
            return <ImageIcon sx={{ fontSize: 20, mr: 1 }} />;
        }
        return <FolderIcon sx={{ fontSize: 20, mr: 1 }} />;
    };

    const handleChange = (event: SelectChangeEvent<string>) => {
        const selectedValue = event.target.value as Graphql.UploadLocation;
        onChange(selectedValue);
    };

    const renderSelectedValue = (selected: string) => {
        if (!selected) return "";
        
        const locationInfo = getLocationInfo(selected as Graphql.UploadLocation);
        return (
            <Box sx={{ display: "flex", alignItems: "center" }}>
                {getLocationIcon(locationInfo.icon)}
                <Typography variant="inherit">
                    {locationInfo.label}
                </Typography>
            </Box>
        );
    };

    const renderContentTypeChips = (contentTypes: string[]) => {
        const maxShow = 2;
        const visibleTypes = contentTypes.slice(0, maxShow);
        const remaining = contentTypes.length - maxShow;

        return (
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5, mt: 0.5 }}>
                {visibleTypes.map((type) => (
                    <Chip
                        key={type}
                        label={type}
                        size="small"
                        variant="outlined"
                        sx={{ fontSize: "0.7rem", height: 20 }}
                    />
                ))}
                {remaining > 0 && (
                    <Chip
                        label={`+${remaining}`}
                        size="small"
                        variant="outlined"
                        color="primary"
                        sx={{ fontSize: "0.7rem", height: 20 }}
                    />
                )}
            </Box>
        );
    };

    return (
        <FormControl fullWidth={fullWidth} disabled={disabled}>
            <InputLabel id="location-selector-label">
                {label || translations.selectLocation}
            </InputLabel>
            <Select
                labelId="location-selector-label"
                value={value || ""}
                label={label || translations.selectLocation}
                onChange={handleChange}
                renderValue={renderSelectedValue}
                MenuProps={{
                    PaperProps: {
                        sx: { maxHeight: 300 }
                    }
                }}
            >
                {locations.map((location) => (
                    <MenuItem 
                        key={location.key} 
                        value={location.key}
                        sx={{ py: 1.5 }}
                    >
                        <Box sx={{ width: "100%" }}>
                            <Box sx={{ display: "flex", alignItems: "center", mb: 0.5 }}>
                                {getLocationIcon(location.icon)}
                                <Typography variant="body2" fontWeight={500}>
                                    {location.label}
                                </Typography>
                            </Box>
                            <Typography 
                                variant="caption" 
                                color="text.secondary"
                                display="block"
                                sx={{ mb: 0.5 }}
                            >
                                {location.description}
                            </Typography>
                            {renderContentTypeChips(location.allowedContentTypes)}
                        </Box>
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    );
};

export default LocationSelector;
