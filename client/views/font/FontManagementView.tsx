import React from "react";
import * as MUI from "@mui/material";
import { SplitPane } from "@/client/components/splitPane/SplitPane";
import { FontList } from "./FontList";
import { FontDetail } from "./FontDetail";
import {
  Font,
  FontCreateInput,
  FontsQueryVariables,
  FontUpdateInput,
} from "@/client/graphql/generated/gql/graphql";

type FontManagementViewProps = {
  selectedFont: Font | null;
  queryParams: FontsQueryVariables;
  isCreating: boolean;
  isEditing: boolean;

  setQueryParams: (params: FontsQueryVariables) => void;
  selectFont: (font: Font) => void;
  startCreating: () => void;
  cancelCreating: () => void;
  startEditing: () => void;
  cancelEditing: () => void;
  createFont: (input: FontCreateInput) => Promise<boolean>;
  updateFont: (input: FontUpdateInput) => Promise<boolean>;
};

export const FontManagementView: React.FC<FontManagementViewProps> = ({
  selectedFont,
  queryParams,
  isCreating,
  isEditing,

  setQueryParams,
  selectFont,
  startCreating,
  cancelCreating,
  startEditing,
  cancelEditing,
  createFont,
  updateFont,
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
          <FontList
            selectedFont={selectedFont}
            queryParams={queryParams}
            setQueryParams={setQueryParams}
            startCreating={startCreating}
            selectFont={selectFont}
          />
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
          <FontDetail
            selectedFont={selectedFont}
            isCreating={isCreating}
            isEditing={isEditing}
            cancelCreating={cancelCreating}
            startEditing={startEditing}
            cancelEditing={cancelEditing}
            createFont={createFont}
            updateFont={updateFont}
          />
        </MUI.Box>
      </SplitPane>
    </MUI.Box>
  );
};

export default FontManagementView;
