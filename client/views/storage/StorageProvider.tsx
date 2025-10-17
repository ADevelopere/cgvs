import React from "react";
import { StorageManagementCoreProvider } from "@/client/contexts/storage/StorageManagementCoreContext";
import { StorageManagementUIProvider } from "@/client/contexts/storage/StorageManagementUIContext";
import { StorageUploadProvider } from "@/client/contexts/storage/StorageUploadContext";
import { UploadProgressUIProvider } from "@/client/views/storage/uploading/UploadProgressUIContext";

export default function StorageProvider({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <StorageManagementCoreProvider>
      <StorageUploadProvider>
        <UploadProgressUIProvider>
          <StorageManagementUIProvider>{children}</StorageManagementUIProvider>
        </UploadProgressUIProvider>
      </StorageUploadProvider>
    </StorageManagementCoreProvider>
  );
}
