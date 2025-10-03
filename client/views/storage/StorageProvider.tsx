import React from "react";
import { StorageManagementCoreProvider } from "@/client/contexts/storage/StorageManagementCoreContext";
import { StorageManagementUIProvider } from "@/client/contexts/storage/StorageManagementUIContext";
import { StorageGraphQLProvider } from "@/client/contexts/storage/StorageGraphQLContext";
import { StorageUploadProvider } from "@/client/contexts/storage/StorageUploadContext";
import { UploadProgressUIProvider } from "@/client/views/storage/uploading/UploadProgressUIContext";

export default function StorageProvider({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <StorageGraphQLProvider>
            <StorageManagementCoreProvider>
                <StorageUploadProvider>
                    <UploadProgressUIProvider>
                        <StorageManagementUIProvider>
                            {children}
                        </StorageManagementUIProvider>
                    </UploadProgressUIProvider>
                </StorageUploadProvider>
            </StorageManagementCoreProvider>
        </StorageGraphQLProvider>
    );
}
