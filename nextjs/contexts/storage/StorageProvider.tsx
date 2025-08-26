import { StorageGraphQLProvider } from "./StorageGraphQLContext";
import { StorageManagementProvider } from "./StorageManagementContext";

import { ReactNode } from "react";
export default function StorageProvider({
    children,
}: Readonly<{ children: ReactNode }>) {
    return (
        <StorageGraphQLProvider>
            <StorageManagementProvider>{children}</StorageManagementProvider>
        </StorageGraphQLProvider>
    );
}
