import React, { useCallback } from "react";
import {
    IconButton,
    Popover,
    Tooltip,
    Box,
    Stack,
    Typography,
    Paper,
} from "@mui/material";
import {
    Translate as TranslateIcon,
} from "@mui/icons-material";
import { useAppTheme } from "@/client/contexts/ThemeContext";
import AppLanguage from "@/client/locale/AppLanguage";
import { useAppTranslation } from "@/client/locale";

const LanguageSwitcher: React.FC = () => {
    const strings = useAppTranslation("languageTranslations");
    const { language, setLanguage } = useAppTheme();

    const handleLanguageChange = useCallback(
        (newLanguage: AppLanguage) => {
            setLanguage(newLanguage);
        },
        [setLanguage],
    );

    const [isMenuOpen, setIsMenuOpen] = React.useState(false);
    const [menuAnchorEl, setMenuAnchorEl] = React.useState<HTMLElement | null>(
        null,
    );

    const toggleMenu = React.useCallback(
        (event: React.MouseEvent<HTMLElement>) => {
            setMenuAnchorEl(isMenuOpen ? null : event.currentTarget);
            setIsMenuOpen((previousIsMenuOpen) => !previousIsMenuOpen);
        },
        [isMenuOpen],
    );

    const languageOptions = [
        {
            value: AppLanguage.default,
            label: strings.ar,
            shortLabel: strings.arShort,
        },
    ];

    return (
        <React.Fragment>
            <Tooltip title="Language settings" enterDelay={1000}>
                <IconButton
                    type="button"
                    aria-label="language-settings"
                    onClick={toggleMenu}
                    color="inherit"
                >
                    <TranslateIcon />
                </IconButton>
            </Tooltip>
            <Popover
                open={isMenuOpen}
                anchorEl={menuAnchorEl}
                onClose={() => {
                    setIsMenuOpen(false);
                    setMenuAnchorEl(null);
                }}
                anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "left",
                }}
                disableAutoFocus
            >
                <Box>
                    <Stack>
                        {languageOptions.map((option, index, array) => (
                            <Paper
                                key={option.value}
                                onClick={() => handleLanguageChange(option.value)}
                                elevation={0}
                                square
                                sx={{
                                    p: 1.5,
                                    cursor: "pointer",
                                    transition: "all 0.2s ease-in-out",
                                    bgcolor:
                                        language === option.value
                                            ? "action.selected"
                                            : "background.paper",
                                    borderBottom:
                                        index !== array.length - 1
                                            ? "1px solid"
                                            : "none",
                                    borderColor: "divider",
                                    "&:hover": {
                                        bgcolor: "action.hover",
                                    },
                                }}
                            >
                                <Stack
                                    direction="row"
                                    spacing={1.5}
                                    alignItems="center"
                                >
                                    <Typography sx={{ 
                                        minWidth: "32px", 
                                        fontSize: "0.875rem" 
                                    }}>
                                        {option.shortLabel}
                                    </Typography>
                                    <Typography>{option.label}</Typography>
                                </Stack>
                            </Paper>
                        ))}
                    </Stack>
                </Box>
            </Popover>
        </React.Fragment>
    );
};

export default LanguageSwitcher;
