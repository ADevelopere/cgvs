"use client";

import { Box, Paper, styled, useMediaQuery, useTheme } from "@mui/material";
import React, { useState } from "react";
import { useDashboardLayout } from "@/client/contexts/DashboardLayoutContext";
import { useAppTranslation } from "@/client/locale";
import TemplateListContent from "./TemplateListContent";
import SplitPane from "@/client/components/splitPane/SplitPane";
import { TemplatesPageProvider } from "./TemplatesContext";
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
  const strings = useAppTranslation("templateCategoryTranslations");

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

      {!isMobile && (
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
            <CategoryTreePane />
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

      {isMobile && (
        <Main>
          <TemplateListContent
            style={{
              paddingInlineStart: 2,
            }}
          />
        </Main>
      )}
    </Box>
  );
};

const TemplateListPage: React.FC = () => {
  return (
    <TemplatesPageProvider>
      <TemplateList />
    </TemplatesPageProvider>
  );
};

export default TemplateListPage;
