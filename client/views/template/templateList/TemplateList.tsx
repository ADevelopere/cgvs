"use client";

import React from "react";
import { Paper } from "@mui/material";
import { ResponsiveSplitPaneViewController } from "@/client/components";
import { useAppTranslation } from "@/client/locale";
import CategoryTreePane from "./CategoryTreePane";
import TemplateListContent from "./TemplateListContent";

const TemplateList: React.FC = () => {
  const strings = useAppTranslation("templateCategoryTranslations");

  return (
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
      secondPane={({ togglePane, isPaneVisible }) => (
        <TemplateListContent
          style={{
            paddingInlineStart: 2,
            paddingInlineEnd: 2,
            paddingTop: 2,
            paddingBottom: 4,
          }}
          onToggleFirstPane={togglePane}
          // used to hide or show toggle button in the second pane
          isDrawerMode={false}
          isFirstPaneVisible={isPaneVisible}
        />
      )}
      breakpointWidth={600} // switch to drawer mode below 300px
      drawerWidth={300}
      toggleButtonInDrawerMode="hidden"
      toggleButtonInSplitMode="hidden"
      storageKey="templateListSplitPane"
      firstPaneProps={{
        minRatio: 0.2,
      }}
      secondPaneProps={{
        minRatio: 0.3,
      }}
    />
  );
};

export default TemplateList;
