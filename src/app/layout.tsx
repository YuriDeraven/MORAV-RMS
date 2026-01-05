import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MORAV RMS - Hospitality Management System",
  description: "Comprehensive hospitality management system for hotels, restaurants, and hospitality businesses",
  keywords: ["MORAV RMS", "Hospitality", "Hotel Management", "Restaurant POS", "Inventory", "Payroll"],
  authors: [{ name: "MORAV Hospitality Team" }],
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "MORAV RMS - Hospitality Management System",
    description: "Complete hospitality management solution",
    url: "https://morav-rms.com",
    siteName: "MORAV RMS",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "MORAV RMS - Hospitality Management System",
    description: "Complete hospitality management solution",
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
        {children}
        <Toaster />
      </body>
    </html>
  );
}
