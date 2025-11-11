import React from "react";
import * as MUI from "@mui/material";
import { SplitPane } from "@/client/components/splitPane/SplitPane";
import { FontList } from "./FontList";
import { FontDetail } from "./FontDetail";

type FontManagementViewProps = {
  selectedFamilyId: number | null;
  selectFamily: (familyId: number) => void;
  onCreateClick: () => void;
};

export const FontManagementView: React.FC<FontManagementViewProps> = ({
  selectedFamilyId,
  selectFamily,
  onCreateClick,
}) => {
  return (
    <MUI.Box
      sx={{
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <SplitPane
        orientation="vertical"
        firstPane={{
          visible: true,
          minRatio: 0.2,
          preferredRatio: 0.3,
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
        style={{
          flex: 1,
          minHeight: "calc(100vh - 64px)",
        }}
        storageKey="fontManagementSplitPane"
      >
        {/* Left sidebar - Font list */}
        <MUI.Paper
          sx={{
            height: "100%",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          }}
          elevation={0}
        >
          <FontList selectedFamilyId={selectedFamilyId} selectFamily={selectFamily} onCreateClick={onCreateClick} />
        </MUI.Paper>

        {/* Right content - Font detail */}
        <MUI.Box
          sx={{
            height: "100%",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          }}
        >
          <FontDetail selectedFamilyId={selectedFamilyId} />
        </MUI.Box>
      </SplitPane>
    </MUI.Box>
  );
};

export default FontManagementView;
