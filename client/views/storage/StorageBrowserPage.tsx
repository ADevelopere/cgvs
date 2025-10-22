"use client";

import { StorageApolloProvider } from "./contexts/StorageApolloContext";
import StorageBrowserView from "./StorageBrowserView";

export default function StorageBrowserPage() {
  return (
    <StorageApolloProvider>
      {/* <StorageUploadProvider> */}
      <StorageBrowserView />
      {/* </StorageUploadProvider> */}
    </StorageApolloProvider>
  );
}
