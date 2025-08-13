import ClientProviders from "@/components/ClientProviders";

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return <ClientProviders>{children}</ClientProviders>;
}
