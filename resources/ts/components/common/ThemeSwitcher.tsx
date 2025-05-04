import React, { useCallback, useEffect } from "react";
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
    Settings as SettingsIcon,
    LightMode as LightModeIcon,
    DarkMode as DarkModeIcon,
    SettingsBrightness as SystemModeIcon,
} from "@mui/icons-material";
import { useColorScheme } from "@mui/material/styles";
import { useAppTheme } from "@/contexts/ThemeContext";

type ThemeMode = "light" | "dark" | "system";

const ThemeSwitcher: React.FC = () => {
    const { mode, setMode } = useColorScheme();
    const { setThemeMode } = useAppTheme();

    useEffect(() => {
        const savedThemeMode = localStorage.getItem(
            "themeMode",
        ) as ThemeMode | null;
        if (
            savedThemeMode &&
            ["light", "dark", "system"].includes(savedThemeMode)
        ) {
            setMode(savedThemeMode);
            setThemeMode(savedThemeMode);
        }
    }, []);

    const handleThemeChange = useCallback(
        (newMode: ThemeMode) => {
            setMode(newMode);
            setThemeMode(newMode);
            localStorage.setItem("themeMode", newMode);
        },
        [setMode],
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

    return (
        <React.Fragment>
            <Tooltip title="Theme settings" enterDelay={1000}>
                <IconButton
                    type="button"
                    aria-label="theme-settings"
                    onClick={toggleMenu}
                    color="inherit"
                >
                    {mode === 'light' ? (
                        <LightModeIcon />
                    ) : mode === 'dark' ? (
                        <DarkModeIcon />
                    ) : (
                        <SystemModeIcon />
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
                        {[
                            {
                                value: "light" as ThemeMode,
                                label: "Light",
                                icon: <LightModeIcon fontSize="small" />,
                            },
                            {
                                value: "dark" as ThemeMode,
                                label: "Dark",
                                icon: <DarkModeIcon fontSize="small" />,
                            },
                            {
                                value: "system" as ThemeMode,
                                label: "System",
                                icon: <SystemModeIcon fontSize="small" />,
                            },
                        ].map((option, index, array) => (
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
                                        mode === option.value
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
