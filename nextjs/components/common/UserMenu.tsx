import React from "react";
import { useNavigate } from "react-router-dom";
import {
    Avatar,
    IconButton,
    Menu,
    MenuItem,
    ListItemIcon,
    ListItemText,
    Tooltip,
} from "@mui/material";
import {
    AccountCircle as ProfileIcon,
    Settings as PreferencesIcon,
    Logout as LogoutIcon,
} from "@mui/icons-material";
import { useAuth } from "@/contexts/AuthContext";
import useAppTranslation from "@/locale/useAppTranslation";

const UserMenu: React.FC = () => {
    const strings = useAppTranslation("headerTranslations");
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = async () => {
        handleClose(); // Close the menu first
        logout();
        navigate("/login", { replace: true });
    };

    return (
        <>
            <Tooltip title={strings.accountSettings}>
                <IconButton onClick={handleClick} color="inherit">
                    <Avatar sx={{ width: 32, height: 32 }}>
                        {user?.name?.[0] || "U"}
                    </Avatar>
                </IconButton>
            </Tooltip>
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
                keepMounted
            >
                <MenuItem
                    onClick={() => {
                        handleClose();
                        navigate("/admin/profile");
                    }}
                >
                    <ListItemIcon>
                        <ProfileIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>{strings.profile}</ListItemText>
                </MenuItem>
                <MenuItem
                    onClick={() => {
                        handleClose();
                        navigate("/admin/preferences");
                    }}
                >
                    <ListItemIcon>
                        <PreferencesIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>{strings.preferences}</ListItemText>
                </MenuItem>
                <MenuItem onClick={handleLogout}>
                    <ListItemIcon>
                        <LogoutIcon fontSize="small" color="error" />
                    </ListItemIcon>
                    <ListItemText slotProps={{ primary: { color: "error" } }}>
                        {strings.logout}
                    </ListItemText>
                </MenuItem>
            </Menu>
        </>
    );
};

export default UserMenu;
