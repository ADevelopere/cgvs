import { Box } from "@mui/material";
import ConnectivityStatus from "@/client/components/common/ConnectivityStatus";
import ThemeSwitcher from "@/client/components/common/ThemeSwitcher";
import UserMenu from "@/client/components/common/UserMenu";

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
