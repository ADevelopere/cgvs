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
    LightMode as LightModeIcon,
    DarkMode as DarkModeIcon,
    SettingsBrightness as SystemModeIcon,
} from "@mui/icons-material";
import { useAppTheme } from "@/contexts/ThemeContext";
import ThemeMode from "@/theme/ThemeMode";

const ThemeSwitcher: React.FC = () => {
    const { setThemeMode, themeMode, isDark } = useAppTheme();

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

    const themeOptions = [
        {
            value: ThemeMode.Light,
            label: "Light",
            icon: <LightModeIcon fontSize="small" />,
        },
        {
            value: ThemeMode.Dark,
            label: "Dark",
            icon: <DarkModeIcon fontSize="small" />,
        },
        {
            value: ThemeMode.System,
            label: "System",
            icon: <SystemModeIcon fontSize="small" />,
        },
    ];

    return (
        <React.Fragment>
            <Tooltip title="Theme settings" enterDelay={1000}>
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
                                <Stack
                                    direction="row"
                                    spacing={1.5}
                                    alignItems="center"
                                >
                                    {option.icon}
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

export default ThemeSwitcher;
