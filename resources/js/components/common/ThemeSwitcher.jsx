import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { IconButton, Menu, MenuItem, Tooltip } from '@mui/material';
import {
  Brightness4 as DarkIcon,
  Brightness7 as LightIcon,
  SettingsBrightness as SystemIcon,
} from '@mui/icons-material';
import { selectTheme, setTheme } from '../../store/themeSlice';

const ThemeSwitcher = () => {
  const dispatch = useDispatch();
  const currentTheme = useSelector(selectTheme);
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleThemeChange = (theme) => {
    dispatch(setTheme(theme));
    handleClose();
  };

  const getThemeIcon = () => {
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
