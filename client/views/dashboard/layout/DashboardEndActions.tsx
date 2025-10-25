import { Box } from "@mui/material";
import {
  UserMenu,
  LanguageSwitcher,
  ThemeSwitcher,
  ConnectivityStatus,
} from "@/client/components";

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
      <LanguageSwitcher />
      <ThemeSwitcher />
      <UserMenu />
    </Box>
  );
}
