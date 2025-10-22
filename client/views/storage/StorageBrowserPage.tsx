"use client";

import { StorageApolloProvider } from "./contexts/StorageApolloContext";
import { StorageStateProvider } from "./contexts/StorageStateContext";
import { StorageOperationsProvider } from "./contexts/StorageOperationsContext";
import StorageBrowserView from "./StorageBrowserView";

export default function StorageBrowserPage() {
  return (
    <StorageApolloProvider>
      <StorageStateProvider>
        <StorageOperationsProvider>
          {/* <StorageUploadProvider> */}
          <StorageBrowserView />
          {/* </StorageUploadProvider> */}
        </StorageOperationsProvider>
      </StorageStateProvider>
    </StorageApolloProvider>
  );
}
