import React, { useCallback, useMemo } from "react";
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
    LightMode as LightModeIcon,
    DarkMode as DarkModeIcon,
    SettingsBrightness as SystemModeIcon,
} from "@mui/icons-material";
import { useAppTheme } from "@/contexts/ThemeContext";
import ThemeMode from "@/theme/ThemeMode";
import useAppTranslation from "@/locale/useAppTranslation";

const ThemeSwitcher: React.FC = () => {
    const { setThemeMode, themeMode, isDark } = useAppTheme();
    const strings = useAppTranslation("headerTranslations");

    const handleThemeChange = useCallback(
        (newMode: ThemeMode) => {
            setThemeMode(newMode);
        },
        [setThemeMode],
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

    const themeOptions = useMemo(() => {
        return [
            {
                value: ThemeMode.Light,
                label: strings.themeLight,
                icon: <LightModeIcon fontSize="small" />,
            },
            {
                value: ThemeMode.Dark,
                label: strings.themeDark,
                icon: <DarkModeIcon fontSize="small" />,
            },
            {
                value: ThemeMode.System,
                label: strings.themeSystem,
                icon: <SystemModeIcon fontSize="small" />,
            },
        ];
    }, [strings]);

    return (
        <React.Fragment>
            <Tooltip title={strings.themeSettings} enterDelay={1000}>
                <IconButton
                    type="button"
                    aria-label="theme-settings"
                    onClick={toggleMenu}
                    color="inherit"
                >
                    {themeMode === ThemeMode.System ? (
                        <SystemModeIcon />
                    ) : !isDark ? (
                        <LightModeIcon />
                    ) : (
                        <DarkModeIcon />
                    )}
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
                        {themeOptions.map((option, index, array) => (
                            <Paper
                                key={option.value}
                                onClick={() => handleThemeChange(option.value)}
                                elevation={0}
                                square
                                sx={{
                                    p: 1.5,
                                    cursor: "pointer",
                                    transition: "all 0.2s ease-in-out",
                                    bgcolor:
                                        themeMode === option.value
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
                                <Box
                                    sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 1,
                                    }}
                                >
                                    {option.icon}
                                    <Typography>{option.label}</Typography>
                                </Box>
                            </Paper>
                        ))}
                    </Stack>
                </Box>
            </Popover>
        </React.Fragment>
    );
};

export default ThemeSwitcher;
