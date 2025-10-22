"use client";

import { StorageApolloProvider } from "./contexts/StorageApolloContext";
import { StorageStateProvider } from "./contexts/StorageStateContext";
import StorageBrowserView from "./StorageBrowserView";

export default function StorageBrowserPage() {
  return (
    <StorageApolloProvider>
      <StorageStateProvider>
        {/* <StorageUploadProvider> */}
        <StorageBrowserView />
        {/* </StorageUploadProvider> */}
      </StorageStateProvider>
    </StorageApolloProvider>
  );
}
