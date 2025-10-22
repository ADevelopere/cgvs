import { StorageBrowserView } from "@/client/views/storage/StorageBrowserView";
import { StorageApolloProvider } from "@/client/views/storage/contexts/StorageApolloContext";

export default function StoragePage() {
  return (
    <StorageApolloProvider>
      <StorageBrowserView />
    </StorageApolloProvider>
  );
}
