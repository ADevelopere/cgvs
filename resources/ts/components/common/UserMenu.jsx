import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Avatar,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Tooltip,
} from '@mui/material';
import {
  AccountCircle as ProfileIcon,
  Settings as PreferencesIcon,
  Logout as LogoutIcon,
} from '@mui/icons-material';
import { logout } from '../../store/authSlice';
import axios from '../../utils/axios';

const UserMenu = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    handleClose(); // Close the menu first
    try {
      await axios.post('/api/logout');
      // First clear the auth state
      dispatch(logout());
      // Then redirect to login page
      navigate('/login', { replace: true });
    } catch (error) {
      console.error('Logout failed:', error);
      // If we get here, something went wrong with the API call
      // But we should still log out the user locally
      dispatch(logout());
      navigate('/login', { replace: true });
    }
  };

  return (
    <>
      <Tooltip title="Account settings">
        <IconButton onClick={handleClick} color="inherit">
          <Avatar sx={{ width: 32, height: 32 }}>
            {user?.name?.[0] || 'U'}
          </Avatar>
        </IconButton>
      </Tooltip>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        keepMounted
      >
        <MenuItem onClick={() => { handleClose(); navigate('/admin/profile'); }}>
          <ListItemIcon>
            <ProfileIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Profile</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => { handleClose(); navigate('/admin/preferences'); }}>
          <ListItemIcon>
            <PreferencesIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Preferences</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <LogoutIcon fontSize="small" color="error" />
          </ListItemIcon>
          <ListItemText slotProps={{ primary: { color: 'error' } }}>
            Logout
          </ListItemText>
        </MenuItem>
      </Menu>
    </>
  );
};

export default UserMenu;
