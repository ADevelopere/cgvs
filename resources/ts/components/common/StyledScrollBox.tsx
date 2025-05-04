import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import { useAppTheme } from "@/contexts/ThemeContext";

const StyledScrollBox = styled(Box)(() => {
    const { theme } = useAppTheme();

    return {
        marginTop: theme.spacing(1),
        overflowY: "auto",
        maxHeight: `calc(100vh - 210px)`,
        minHeight: `calc(100vh - 210px)`,
        padding: theme.spacing(2, 3),
        marginX: theme.spacing(-3),

        // Webkit scrollbar styles
        "&::-webkit-scrollbar": {
            width: "8px",
        },
        "&::-webkit-scrollbar-track": {
            background:
                theme.palette.mode === "dark"
                    ? "rgba(255, 255, 255, 0.05)"
                    : "rgba(0, 0, 0, 0.05)",
            borderRadius: "8px",
            margin: "8px 0",
        },
        "&::-webkit-scrollbar-thumb": {
            background:
                theme.palette.mode === "dark"
                    ? "rgba(255, 255, 255, 0.2)"
                    : "rgba(0, 0, 0, 0.2)",
            borderRadius: "8px",
            border: `2px solid ${
                theme.palette.mode === "dark"
                    ? "rgba(30, 30, 30, 0.9)"
                    : "rgba(255, 255, 255, 0.9)"
            }`,
            "&:hover": {
                background:
                    theme.palette.mode === "dark"
                        ? "rgba(255, 255, 255, 0.3)"
                        : "rgba(0, 0, 0, 0.3)",
            },
        },

        // Firefox scrollbar styles
        scrollbarWidth: "thin",
        scrollbarColor: `${
            theme.palette.mode === "dark"
                ? "rgba(255, 255, 255, 0.2) rgba(255, 255, 255, 0.05)"
                : "rgba(0, 0, 0, 0.2) rgba(0, 0, 0, 0.05)"
        }`,
    };
});

export default StyledScrollBox;
