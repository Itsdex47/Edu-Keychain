import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { PlatformNavigation } from "@/components/navigation/platform-nav";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Edu-Keychain - Blockchain Credential Management Platform",
  description: "Secure, blockchain-based credential management platform enabling educational institutions to issue, verify, and manage academic records on-chain.",
  keywords: ["Edu-Keychain", "Blockchain", "Credentials", "Education", "Verification", "Academic Records", "Next.js", "TypeScript"],
  authors: [{ name: "Edu-Keychain Team" }],
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "Edu-Keychain - Blockchain Credential Management",
    description: "Secure, blockchain-based credential management platform for educational institutions",
    url: "https://edu-keychain.com",
    siteName: "Edu-Keychain",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Edu-Keychain - Blockchain Credential Management",
    description: "Secure, blockchain-based credential management platform for educational institutions",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <PlatformNavigation />
        {children}
        <Toaster />
      </body>
    </html>
  );
}
