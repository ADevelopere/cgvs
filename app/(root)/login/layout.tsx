import ClientProviders from "@/client/components/ClientProviders";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <ClientProviders>{children}</ClientProviders>;
}
