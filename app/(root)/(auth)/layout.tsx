import ProtectedRoute from "@/client/components/ProtectedRoute";
import { ApolloRepositoryProvider } from "@/client/graphql/apollo";
import StorageProvider from "@/client/views/storage/StorageProvider";

export default function RootLayout({
 children,
}: Readonly<{
 children: React.ReactNode;
}>) {
 return (
  <ProtectedRoute>
   <ApolloRepositoryProvider>
    <StorageProvider>{children}</StorageProvider>
   </ApolloRepositoryProvider>
  </ProtectedRoute>
 );
}
