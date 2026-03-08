import { AuthProvider } from "@/lib/authContext";
import { SavesProvider } from "@/lib/savesContext";
import Sidebar from "@/components/Sidebar";
import BottomNav from "@/components/BottomNav";
import AppShell from "@/components/AppShell";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Here*",
  description: "For the spots you love & the places you'll go.",
  openGraph: {
    images: [{ url: "/og.jpg" }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/og.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <AuthProvider>
          <SavesProvider>
            <AppShell
              nav={
                <>
                  <Sidebar />
                  <BottomNav />
                </>
              }
            >
              {children}
            </AppShell>
          </SavesProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
