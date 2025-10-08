import React from "react";
import { Box, Button, ButtonGroup, Typography } from "@mui/material";
import { useAppTranslation } from "@/client/locale";

enum Gender {
    MALE,
    FEMALE,
    OTHER,
}

/**
 * Props for the GenderSelector component.
 *
 * @typedef {Object} GenderSelectorProps
 * @property {Gender} gender - The selected gender.
 * @property {(gender: Gender) => void} setGender - Function to update the selected gender.
 * @property {boolean} error - Indicates if there's an error.
 * @property {React.Dispatch<React.SetStateAction<boolean>>} setError - Function to update the error state.
 */
export type GenderSelectorProps = {
    gender: Gender;
    setGender: (gender: Gender) => void;
    error: boolean;
    setError: React.Dispatch<React.SetStateAction<boolean>>;
};

/**
 * GenderSelector Component
 *
 * Allows users to select their gender.
 *
 * @param {GenderSelectorProps} props - The props for the component.
 * @returns {JSX.Element} The rendered GenderSelector component.
 */
const GenderSelector: React.FC<GenderSelectorProps> = ({
    gender,
    setGender,
    error,
    setError,
}) => {
    const strings = useAppTranslation("genderTranslations");
    return (
        <Box
            sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: 1,
                width: "100%",
                flexWrap: "wrap",
                minWidth: 0,
            }}
        >
            {/* title */}
            <Typography
                color={error ? "error" : "default"}
                sx={{
                    overflow: "show",
                    textOverflow: "ellipsis",
                    display: "-webkit-box",
                    WebkitLineClamp: 1,
                    WebkitBoxOrient: "vertical",
                }}
                variant={"subtitle1"}
            >
                {strings.title}
            </Typography>
            {/* buttons */}
            <ButtonGroup
                color={error ? "error" : "primary"}
                disableElevation
                variant="outlined"
                aria-label="gender selection button group"
                sx={{
                    width: "70%",
                }}
            >
                {/* male button */}
                <Button
                    onClick={() => {
                        setGender(Gender.MALE);
                        setError(false);
                    }}
                    variant={gender === Gender.MALE ? "contained" : "outlined"}
                    sx={{ width: "50%", minWidth: 0 }}
                >
                    {strings.male}
                </Button>
                {/* female button */}
                <Button
                    onClick={() => {
                        setGender(Gender.FEMALE);
                        setError(false);
                    }}
                    variant={
                        gender === Gender.FEMALE ? "contained" : "outlined"
                    }
                    sx={{ width: "50%", minWidth: 0 }}
                >
                    {strings.female}
                </Button>
            </ButtonGroup>
        </Box>
    );
};

export default GenderSelector;
