import { forwardRef } from "react";
import { Box, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import { useDashboardLayout } from "@/contexts/DashboardLayoutContext";

export const DefaultTitle = forwardRef<HTMLDivElement>((_, ref) => {
    const { title } = useDashboardLayout();

    const {
        icon: logo,
        homeUrl,
        titleText,
        titleVisible,
        titleTextVisible,
        titleLogoVisible,
        textColor,
        iconColor,
    } = title;

    if (!titleVisible) return null;

    const TitleContent = () => (
        <>
            {titleLogoVisible && logo && (
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        color: iconColor,
                    }}
                >
                    {logo}
                </Box>
            )}
            {titleTextVisible && titleText && (
                <Typography
                    variant="h6"
                    component="div"
                    sx={{
                        fontWeight: "bold",
                        fontSize: "1.25rem",
                        lineHeight: 1.6,
                        color: textColor,
                    }}
                >
                    {titleText}
                </Typography>
            )}
        </>
    );

    if (homeUrl) {
        return (
            <Box ref={ref}>
                <Link
                    to={homeUrl}
                    style={{
                        textDecoration: "none",
                        color: "inherit",
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                    }}
                >
                    <TitleContent />
                </Link>
            </Box>
        );
    }

    return (
        <Box
            ref={ref}
            sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
            }}
        >
            <TitleContent />
        </Box>
    );
});

DefaultTitle.displayName = "DefaultTitle";

export const DashboardTitleRenderer = forwardRef<HTMLDivElement>((_, ref) => {
    const { slots } = useDashboardLayout();

    if (slots.titleRenderer) {
        return <Box ref={ref}>{slots.titleRenderer}</Box>;
    }

    return <DefaultTitle ref={ref} />;
});

DashboardTitleRenderer.displayName = "DashboardTitleRenderer";
