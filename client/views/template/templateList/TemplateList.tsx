"use client";

import React from "react";
import { Box, Paper } from "@mui/material";
import { ResponsiveSplitPaneViewController } from "@/client/components";
import { useAppTranslation } from "@/client/locale";
import CategoryTreePane from "./CategoryTreePane";
import TemplateListContent from "./TemplateListContent";

const TemplateList: React.FC = () => {
  const strings = useAppTranslation("templateCategoryTranslations");

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        height: "100%",
        position: "relative",
      }}
    >
      <ResponsiveSplitPaneViewController
        hidablePane="first"
        hidablePaneTooltip={strings.showCategoriesPane}
        firstPane={
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
        }
        secondPane={
          <TemplateListContent
            style={{
              paddingInlineStart: 2,
              paddingInlineEnd: 2,
              paddingTop: 2,
              paddingBottom: 4,
            }}
          />
        }
        breakpointWidth={600}
        drawerWidth={300}
        toggleButtonInDrawerMode="floating"
        toggleButtonInSplitMode="floating"
        storageKey="templateListSplitPane"
      />
    </Box>
  );
};

export default TemplateList;
