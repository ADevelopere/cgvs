import React from "react";
import { StorageManagementCoreProvider } from "@/contexts/storage/StorageManagementCoreContext";
import { StorageManagementUIProvider } from "@/contexts/storage/StorageManagementUIContext";
import { StorageGraphQLProvider } from "@/contexts/storage/StorageGraphQLContext";

export default function StorageProvider({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <StorageGraphQLProvider>
            <StorageManagementCoreProvider>
                <StorageManagementUIProvider>
                    {children}
                </StorageManagementUIProvider>
            </StorageManagementCoreProvider>
        </StorageGraphQLProvider>
    );
}
