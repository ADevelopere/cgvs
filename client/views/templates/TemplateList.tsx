"use client";

import {
  Box,
  Paper,
  styled,
  useMediaQuery,
  useTheme,
  Drawer,
} from "@mui/material";
import React, { useState } from "react";
import { useDashboardLayout } from "@/client/views/dashboard/layout/DashboardLayoutContext";
import { useAppTranslation } from "@/client/locale";
import TemplateListContent from "./TemplateListContent";
import SplitPane from "@/client/components/splitPane/SplitPane";
import ToggleSideBarButton from "./ToggleSideBarButton";
import CategoryTreePane from "./CategoryTreePane";

const Main = styled("main")(({ theme }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
}));

const TemplateList: React.FC = () => {
  const { sidebarState: dashboardsidebarState } = useDashboardLayout();
  const [open, setOpen] = useState(true);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.down("lg"));
  const strings = useAppTranslation("templateCategoryTranslations");

  const isFloating = React.useMemo(() => {
    return (isMobile || isTablet) && dashboardsidebarState === "expanded";
  }, [dashboardsidebarState, isMobile, isTablet]);

  const toggleSidebar = () => {
    setOpen((prev) => !prev);
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "row", height: "100%" }}>
      <ToggleSideBarButton
        open={open}
        toggleSidebar={toggleSidebar}
        dashboardsidebarState={dashboardsidebarState}
        zIndex={theme.zIndex.drawer + 1}
        isMobile={isMobile}
        title={open ? strings.hideCategoriesPane : strings.showCategoriesPane}
      />

      {!isFloating && (
        <SplitPane
          orientation="vertical"
          firstPane={{
            visible: open,
            minRatio: 0.2,
          }}
          secondPane={{
            visible: true,
            minRatio: 0.5,
          }}
          resizerProps={{
            style: {
              cursor: "col-resize",
            },
          }}
          storageKey="templateListSplitPane"
        >
          <Paper
            sx={{
              height: "100%",
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
            }}
          >
            <CategoryTreePane isMobile={false} />
          </Paper>
          <TemplateListContent
            style={{
              paddingInlineStart: open ? 2 : 8,
              paddingInlineEnd: 2,
              paddingTop: 2,
              paddingBottom: 4,
            }}
          />
        </SplitPane>
      )}

      {isFloating && (
        <>
          <Drawer
            anchor="left"
            open={open}
            onClose={toggleSidebar}
            variant="temporary"
            sx={{
              width: 300,
              flexShrink: 0,
              "& .MuiDrawer-paper": {
                width: 300,
                boxSizing: "border-box",
              },
            }}
          >
            <Paper
              sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                overflow: "hidden",
              }}
            >
              <CategoryTreePane isMobile={true} />
            </Paper>
          </Drawer>
          <Main>
            <TemplateListContent
              style={{
                paddingInlineStart: 2,
              }}
            />
          </Main>
        </>
      )}
    </Box>
  );
};

export default TemplateList;
