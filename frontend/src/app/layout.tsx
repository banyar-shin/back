import React from "react";

import type { Metadata } from "next";
import { Inter } from "next/font/google";

import { ToastProvider } from "@/components/ui/toast";
import { Toaster } from "@/components/ui/toaster";

import { ClerkProvider } from '@clerk/nextjs'

import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "GYST AI",
  description: "KEEPING YOU ACCOUNTABLE",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <ToastProvider>
          <body className={`${inter.className} min-h-screen`}>
            {children}
            <Toaster />
          </body>
        </ToastProvider>
      </html>
    </ClerkProvider>
  );
}
