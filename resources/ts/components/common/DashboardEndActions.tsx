import { Box } from "@mui/material";
import ThemeSwitcher from "./ThemeSwitcher";
import UserMenu from "./UserMenu";

export default function DashboardEndActions() {
    return (
        <Box
            sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "end",
                gap: 1,
            }}
        >
            {/* <LanguageSwitcher /> */}
            <ThemeSwitcher />
            <UserMenu />
        </Box>
    );
}
