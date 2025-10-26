"use client";

import React from "react";
import { DeleteOutline } from "@mui/icons-material";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import { Box, IconButton, Tab, Tooltip, Fade, Slide } from "@mui/material";
import { FileStack, PanelLeft, PanelRight } from "lucide-react";
import { useAppTheme } from "@/client/contexts";
import { SplitPane } from "@/client/components";
import { useAppTranslation } from "@/client/locale";
import { useAppBarHeight } from "@/client/hooks/useAppBarHeight";
import TemplateCategoryManagementCategoryPane from "./CategoryPane";
import TemplateCategoryManagementTemplatePane from "./TemplatePane";
import SuspenstionTemplatesCategory from "./SuspenstionTemplatesCategory";
import { useTemplateCategoryStore } from "./hooks/useTemplateCategoryStore";

export type TemplateCategoryManagementTabType = "all" | "deleted";

// Tab order for determining slide direction
const TAB_ORDER: TemplateCategoryManagementTabType[] = ["all", "deleted"];

const This: React.FC = () => {
  const strings = useAppTranslation("templateCategoryTranslations");

  const { theme, isRtl } = useAppTheme();
  const [firstPaneVisible, setFirstPaneVisible] = React.useState<boolean>(true);
  const [secondPaneVisible, setSecondPaneVisible] =
    React.useState<boolean>(true);

  const handleFirstPaneVisibility = () => {
    setFirstPaneVisible(!firstPaneVisible);
  };

  const handleSecondPaneVisibility = () => {
    setSecondPaneVisible(!secondPaneVisible);
  };

  const { activeCategoryTab, setActiveCategoryTab, currentCategory } =
    useTemplateCategoryStore();
  const [prevTabIndex, setPrevTabIndex] = React.useState(
    TAB_ORDER.indexOf(activeCategoryTab)
  );

  const handleTabChange = async (
    _: React.SyntheticEvent,
    newValue: TemplateCategoryManagementTabType
  ) => {
    setPrevTabIndex(TAB_ORDER.indexOf(activeCategoryTab));
    setActiveCategoryTab(newValue);
  };

  // Calculate slide direction based on tab indices and RTL mode
  const slideDirection = React.useMemo(() => {
    const currentTabIndex = TAB_ORDER.indexOf(activeCategoryTab);
    const baseDirection = currentTabIndex > prevTabIndex ? "left" : "right";
    // Reverse direction in RTL mode
    return isRtl
      ? baseDirection === "left"
        ? "right"
        : "left"
      : baseDirection;
  }, [activeCategoryTab, prevTabIndex, isRtl]);

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
                    transform: "scale(1.02)",
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
                      disabled={!(currentCategory && secondPaneVisible)}
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
            <Fade in={activeCategoryTab === "all"} timeout={300}>
              <Slide
                direction={slideDirection}
                in={activeCategoryTab === "all"}
                timeout={250}
              >
                <Box sx={{ height: "100%" }}>
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
                </Box>
              </Slide>
            </Fade>
          </TabPanel>
          <TabPanel value="deleted">
            <Fade in={activeCategoryTab === "deleted"} timeout={300}>
              <Slide
                direction={slideDirection}
                in={activeCategoryTab === "deleted"}
                timeout={250}
              >
                <Box>
                  <SuspenstionTemplatesCategory />
                </Box>
              </Slide>
            </Fade>
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
