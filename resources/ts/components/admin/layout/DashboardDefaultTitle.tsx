import { forwardRef } from "react";
import { Box, Typography, useTheme } from "@mui/material";
import { Link } from "react-router-dom";
import { useDashboardLayout } from "@/contexts/DashboardLayoutContext";
import { Title } from "@/contexts/adminLayout.types";

type DefaultTitleProps = {
    title: Title;
};

export const DefaultTitle = forwardRef<HTMLDivElement, DefaultTitleProps>(
    (
        {
            title: {
                logoIcon: logoIcon,
                homeUrl,
                titleText,
                titleVisible,
                titleTextVisible,
                titleLogoVisible,
                textColor,
                iconColor,
            },
        },
        ref,
    ) => {
        const theme = useTheme();
        if (!titleVisible) return null;

        const TitleContent = () => (
            <>
                {titleLogoVisible && logoIcon && (
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            color: iconColor,
                            flexShrink: 0,
                        }}
                    >
                        {logoIcon}
                    </Box>
                )}
                {titleTextVisible && titleText && (
                    <Typography
                        variant="h6"
                        component="div"
                        sx={{
                            fontWeight: "bold",
                            fontSize: {
                                xs: "1rem",
                                sm: "1.125rem",
                                md: "1.25rem",
                            },
                            lineHeight: 1.6,
                            color: textColor,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                            maxWidth: {
                                xs: "140px",
                                sm: "180px",
                                md: "240px",
                                lg: "320px",
                            },
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
                    paddingLeft: 1,
                    maxWidth: "100%",
                }}
            >
                <TitleContent />
            </Box>
        );
    },
);

DefaultTitle.displayName = "DefaultTitle";

export const DashboardTitleRenderer = forwardRef<HTMLDivElement>((_, ref) => {
    const { title, slots } = useDashboardLayout();

    if (slots.titleRenderer) {
        return <Box ref={ref}>{slots.titleRenderer}</Box>;
    }

    if (!title) {
        return null;
    }

    return <DefaultTitle title={title} ref={ref} />;
});

DashboardTitleRenderer.displayName = "DashboardTitleRenderer";
