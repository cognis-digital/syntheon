import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "Syntheon — build your app, own every line",
  description:
    "The open-source, local-AI full-stack web app builder. Menu-driven. Auth, waitlist, email, CRM, payments, and integrations — generated for you and debugged until zero errors.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>{children}</body>
    </html>
  );
}
