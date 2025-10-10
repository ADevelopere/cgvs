import ProtectedRoute from "@/client/components/ProtectedRoute";
import StorageProvider from "@/client/views/storage/StorageProvider";

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
