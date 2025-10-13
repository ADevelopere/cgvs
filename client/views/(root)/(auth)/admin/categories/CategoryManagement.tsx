"use client";

import React from "react";
import { Box, IconButton, Tab, Tooltip } from "@mui/material";
import { useAppBarHeight } from "@/client/hooks/useAppBarHeight";
import { useAppTranslation } from "@/client/locale";
import { useAppTheme } from "@/client/contexts/ThemeContext";
import SplitPane from "@/client/components/splitPane/SplitPane";
import { FileStack, PanelLeft, PanelRight } from "lucide-react";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import { DeleteOutline } from "@mui/icons-material";
import { useTemplateCategoryManagement } from "./4-categories.context";
import TemplateCategoryManagementCategoryPane from "./CategoryPane";
import TemplateCategoryManagementTemplatePane from "./TemplatePane";
import SuspenstionTemplatesCategory from "./SuspenstionTemplatesCategory";


export type TemplateCategoryManagementTabType = "all" | "deleted";

const This: React.FC = () => {
  const strings = useAppTranslation("templateCategoryTranslations");

  const { theme } = useAppTheme();
  const [firstPaneVisible, setFirstPaneVisible] = React.useState<boolean>(true);
  const [secondPaneVisible, setSecondPaneVisible] = React.useState<boolean>(true);

  const handleFirstPaneVisibility = () => {
    setFirstPaneVisible(!firstPaneVisible);
  };

  const handleSecondPaneVisibility = () => {
    setSecondPaneVisible(!secondPaneVisible);
  };

  const {
    activeCategoryTab,
    setActiveCategoryTab,
    currentCategoryId
  } = useTemplateCategoryManagement();


  const handleTabChange = async (
    _: React.SyntheticEvent,
    newValue: TemplateCategoryManagementTabType,
  ) => {
    setActiveCategoryTab(newValue);
  };

  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
        }}
      >
          <TabContext value={activeCategoryTab}>
            {/* controllers */}
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                borderBottom: "1px solid",
                borderColor: theme.palette.divider,
                mb: 2,
              }}
            >
              <TabList
                onChange={handleTabChange}
                scrollButtons="auto"
                allowScrollButtonsMobile
                sx={{
                  "& .MuiTabs-scrollButtons": {
                    color: "text.secondary",
                  },
                  "& .MuiTab-root": {
                    minHeight: { xs: 48, sm: 56 },
                    fontSize: {
                      xs: "1rem",
                      sm: "1.25rem",
                    },
                    px: { xs: 1, sm: 2 },
                    "&.Mui-selected": {
                      color: "primary.main",
                      fontWeight: 600,
                    },
                    "&:hover": {
                      backgroundColor: "action.hover",
                    },
                    transition: "all 0.2s ease-in-out",
                  },
                }}
              >
                <Tab
                  label={strings.templateCategoriesManagement}
                  value="all"
                  icon={<FileStack />}
                  iconPosition="start"
                />
                <Tab
                  icon={<DeleteOutline />}
                  iconPosition="start"
                  label={strings.theDeleted}
                  value="deleted"
                />
              </TabList>

              <Box sx={{ flex: 1 }} />
              {activeCategoryTab === "all" && (
                <Box>
                  {/* first pane visibility button*/}
                  <Tooltip title={strings.toggleCategoriesPane}>
                    <span>
                      <IconButton
                        onClick={handleFirstPaneVisibility}
                        disabled={!(currentCategoryId && secondPaneVisible)}
                      >
                        <PanelRight />
                      </IconButton>
                    </span>
                  </Tooltip>
                  {/* second pane visibility button */}
                  <Tooltip title={strings.toggleTemplatesPane}>
                    <span>
                      <IconButton
                        onClick={handleSecondPaneVisibility}
                        disabled={!firstPaneVisible}
                      >
                        <PanelLeft />
                      </IconButton>
                    </span>
                  </Tooltip>
                </Box>
              )}
            </Box>

            <TabPanel
              value="all"
              sx={{
                flex: 1,
                p: 0,
              }}
            >
              <SplitPane
                orientation="vertical"
                firstPane={{
                  visible: firstPaneVisible,
                  minRatio: 0.3,
                }}
                secondPane={{
                  visible: secondPaneVisible,
                  minRatio: 0.3,
                }}
                resizerProps={{
                  style: {
                    cursor: "col-resize",
                  },
                }}
                style={{
                  flex: 1,
                  minHeight: `calc(100vh - 220px)`,
                }}
                storageKey="templateCategoryManagementSplitPane"
              >
                <TemplateCategoryManagementCategoryPane />
                <TemplateCategoryManagementTemplatePane />
              </SplitPane>
            </TabPanel>
            <TabPanel value="deleted">
              <SuspenstionTemplatesCategory />
            </TabPanel>
          </TabContext>
      </Box>
    </>
  );
};

const TemplateCategoryManagement: React.FC = () => {
  const appBarHeight = useAppBarHeight();

  // ...existing code...

  return (
    <Box
      sx={{
        top: `${appBarHeight}px`,
        height: `calc(100vh - ${appBarHeight}px - 48px)`,
        display: "flex",
        flexDirection: "column",
        p: 3,
      }}
    >
      <This />
    </Box>
  );
};

export default TemplateCategoryManagement;
