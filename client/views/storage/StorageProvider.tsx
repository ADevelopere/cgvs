import React from "react";
import { UploadProgressUIProvider } from "@/client/views/storage/uploading/UploadProgressUIContext";
import { useStorageInitialization } from "./hooks/useStorageInitialization";

export default function StorageProvider({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Initialize storage data on mount
  useStorageInitialization();

  return <UploadProgressUIProvider>{children}</UploadProgressUIProvider>;
}
