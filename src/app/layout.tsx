import type { Metadata } from "next";
import "./globals.css";
import Navigation from "@/components/Navigation";
import ClientFirebaseInit from "@/components/ClientFirebaseInit";
import LaughButton from "@/components/LaughButton";

export const metadata: Metadata = {
  title: "TGIT Sitcom Universe",
  description: "Where every Thorogood sprint feels like a season finale and every project win deserves a laugh track.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Permanent+Marker&family=Pangolin&family=Copse:wght@400;500;600;700;800;900&family=Inter:wght@400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-inter bg-[var(--background)] text-[var(--foreground)] min-h-screen flex flex-col relative">
        <ClientFirebaseInit />
        <Navigation />
        <LaughButton />
        <main className="flex-1 w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </body>
    </html>
  );
}
