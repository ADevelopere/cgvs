import { Box } from "@mui/material";
import ConnectivityStatus from "@/components/common/ConnectivityStatus";
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
            <ConnectivityStatus />
            {/* <LanguageSwitcher /> */}
            <ThemeSwitcher />
            <UserMenu />
        </Box>
    );
}
