"use client";
import React from "react";
import Box from "@mui/material/Box";
import StorageDirectoryTree from "./browser/StorageDirectoryTree";
import StorageMainView from "./browser/StorageMainView";
import StorageSearch from "./browser/StorageSearch";
import { SplitPane } from "@/client/components";
import UploadProgress from "./uploading/UploadProgress";

const StorageBrowserView: React.FC = () => {
  return (
    <>
      <Box
        sx={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <StorageSearch />
        <SplitPane
          orientation="vertical"
          firstPane={{
            visible: true,
            minRatio: 0.1,
          }}
          secondPane={{
            visible: true,
            minRatio: 0.7,
          }}
          resizerProps={{
            style: {
              cursor: "col-resize",
            },
          }}
          style={{
            flex: 1,
            minHeight: `calc(100vh -256px)`,
          }}
          storageKey={"storage-browser-split-pane"}
        >
          <StorageDirectoryTree />
          <StorageMainView />
        </SplitPane>
      </Box>

      {/* Upload Progress UI - positioned as floating overlay */}
      <UploadProgress />
    </>
  );
};

export default StorageBrowserView;
