import ProtectedRoute from "@/components/ProtectedRoute";
import StorageProvider from "@/contexts/storage/StorageProvider";

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <ProtectedRoute>
            <StorageProvider>{children}</StorageProvider>
        </ProtectedRoute>
    );
}
