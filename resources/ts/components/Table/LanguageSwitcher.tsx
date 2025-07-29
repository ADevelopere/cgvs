import type React from "react"
import { useAppTheme } from "@/hooks/useAppTheme"
import { Box, ToggleButtonGroup, ToggleButton, Tooltip } from "@mui/material"
import AppLanguage from "@/locale/AppLanguage"

const LanguageSwitcher: React.FC = () => {
  const { language, setLanguage, isDark } = useAppTheme()

  const handleLanguageChange = (_event: React.MouseEvent<HTMLElement>, newLanguage: string | null) => {
    if (newLanguage !== null) {
      setLanguage(newLanguage)
    }
  }

  return (
    <Box sx={{ display: "flex", alignItems: "center", ml: 2 }}>
      <ToggleButtonGroup
        value={language}
        exclusive
        onChange={handleLanguageChange}
        aria-label="language"
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
        {/* <ToggleButton value={AppLanguage.English} aria-label="english">
          <Tooltip title="English">
            <span>EN</span>
          </Tooltip>
        </ToggleButton> */}
        <ToggleButton value={AppLanguage.default} aria-label="arabic">
          <Tooltip title="Arabic">
            <span>AR</span>
          </Tooltip>
        </ToggleButton>
      </ToggleButtonGroup>
    </Box>
  )
}

export default LanguageSwitcher
