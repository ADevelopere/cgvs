"use client"

import type React from "react"
import { useAppTheme } from "@/hooks/useAppTheme"
import { Box, ToggleButtonGroup, ToggleButton, Tooltip } from "@mui/material"
import { LightMode, DarkMode, SettingsBrightness } from "@mui/icons-material"
import ThemeMode from "@/theme/ThemeMode"

const ThemeSwitcher: React.FC = () => {
  const { themeMode, setThemeMode, isDark } = useAppTheme()

  const handleThemeChange = (_event: React.MouseEvent<HTMLElement>, newMode: ThemeMode | null) => {
    if (newMode !== null) {
      setThemeMode(newMode)
    }
  }

  return (
    <Box sx={{ display: "flex", alignItems: "center" }}>
      <ToggleButtonGroup
        value={themeMode}
        exclusive
        onChange={handleThemeChange}
        aria-label="theme mode"
        size="small"
        sx={{
          "& .MuiToggleButtonGroup-grouped": {
            border: 1,
            borderColor: "divider",
            "&.Mui-selected": {
              backgroundColor: isDark ? "rgba(144, 202, 249, 0.2)" : "rgba(25, 118, 210, 0.1)",
            },
          },
        }}
      >
        <ToggleButton value={ThemeMode.Light} aria-label="light mode">
          <Tooltip title="Light Mode">
            <LightMode fontSize="small" />
          </Tooltip>
        </ToggleButton>
        <ToggleButton value={ThemeMode.Dark} aria-label="dark mode">
          <Tooltip title="Dark Mode">
            <DarkMode fontSize="small" />
          </Tooltip>
        </ToggleButton>
        <ToggleButton value={ThemeMode.System} aria-label="system mode">
          <Tooltip title="System Mode">
            <SettingsBrightness fontSize="small" />
          </Tooltip>
        </ToggleButton>
      </ToggleButtonGroup>
    </Box>
  )
}

export default ThemeSwitcher
