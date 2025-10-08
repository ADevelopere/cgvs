"use client";

import React, { useCallback } from "react";
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
import { useAuth } from "@/client/contexts/AuthContext";
import { useAppTranslation } from "@/client/locale";
import { useRouter } from "next/navigation";

const UserMenu: React.FC = () => {
    const strings = useAppTranslation("headerTranslations");
    const { user, logout } = useAuth();
    const router = useRouter();
    const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = useCallback(() => {
        setAnchorEl(null);
    }, []);

    const handleLogout = useCallback(async () => {
        handleClose(); // Close the menu first
        logout();
        router.push("/login");
    }, [handleClose, logout, router]);

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
                        router.push("/admin/profile");
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
                        router.push("/admin/preferences");
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
