import { Box } from "@mui/material";
import ThemeSwitcher from "@/components/common/ThemeSwitcher";
import UserMenu from "@/components/common/UserMenu";

export default function DashboardEndActions() {
    return (
        <Box
            sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "end",
                gap: 1,
                paddingInlineEnd: 2,
            }}
        >
            {/* <LanguageSwitcher /> */}
            <ThemeSwitcher />
            <UserMenu />
        </Box>
    );
}
