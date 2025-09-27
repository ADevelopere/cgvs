import { Box, IconButton, IconButtonProps } from "@mui/material";
import { Menu as MenuIcon, Close as CloseIcon } from "@mui/icons-material";
import { forwardRef } from "react";
import { useDashboardLayout } from "@/contexts/DashboardLayoutContext";

export type ToggleSideBarButtonProps = Omit<IconButtonProps, "onClick">;

export const ToggleSideBarButton = forwardRef<
    HTMLButtonElement,
    ToggleSideBarButtonProps
>((props, ref) => {
    const { sidebarState, toggleSidebar } = useDashboardLayout();

    return (
        <Box
            sx={{
                width: { xs: 48, sm: 72 },
                display: "flex",
                justifyContent: "center",
                borderRight: "1px",
                borderColor: "divider",
                borderStyle: "solid",
            }}
        >
            <IconButton
                {...props}
                onClick={toggleSidebar}
                ref={ref}
                edge="start"
                color="inherit"
                aria-label="toggle sidebar"
                sx={{
                    transition: "transform 0.3s ease-in-out",
                    transform:
                        sidebarState === "expanded"
                            ? "rotate(180deg)"
                            : "rotate(0deg)",
                    ...props.sx,
                }}
            >
                {sidebarState === "expanded" ? <CloseIcon /> : <MenuIcon />}
            </IconButton>
        </Box>
    );
});

ToggleSideBarButton.displayName = "ToggleSideBarButton";