import React from "react";
import { StorageManagementCoreProvider } from "@/contexts/storage/StorageManagementCoreContext";
import { StorageManagementUIProvider } from "@/contexts/storage/StorageManagementUIContext";
import { StorageGraphQLProvider } from "@/contexts/storage/StorageGraphQLContext";
import { StorageUploadProvider } from "@/contexts/storage/StorageUploadContext";
import { UploadProgressUIProvider } from "@/views/storage/uploading/UploadProgressUIContext";

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
