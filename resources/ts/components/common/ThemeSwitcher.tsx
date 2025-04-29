import React from 'react';
import { IconButton, Menu, MenuItem, Tooltip } from '@mui/material';
import {
  Brightness4 as DarkIcon,
  Brightness7 as LightIcon,
  SettingsBrightness as SystemIcon,
} from '@mui/icons-material';
import { useTheme } from '@/contexts/ThemeContext';

type Theme = 'light' | 'dark' | 'system';

const ThemeSwitcher: React.FC = () => {
  const { mode: currentTheme, setTheme } = useTheme();
  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);

  const handleClick = (event: React.MouseEvent<HTMLElement>): void => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (): void => {
    setAnchorEl(null);
  };

  const handleThemeChange = (theme: Theme): void => {
    setTheme(theme);
    handleClose();
  };

  const getThemeIcon = (): React.ReactElement => {
    switch (currentTheme) {
      case 'light':
        return <LightIcon />;
      case 'dark':
        return <DarkIcon />;
      default:
        return <SystemIcon />;
    }
  };

  return (
    <>
      <Tooltip title="Change theme">
        <IconButton color="inherit" onClick={handleClick}>
          {getThemeIcon()}
        </IconButton>
      </Tooltip>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        keepMounted
      >
        <MenuItem onClick={() => handleThemeChange('light')}>Light</MenuItem>
        <MenuItem onClick={() => handleThemeChange('dark')}>Dark</MenuItem>
        <MenuItem onClick={() => handleThemeChange('system')}>System</MenuItem>
      </Menu>
    </>
  );
};

export default ThemeSwitcher;
