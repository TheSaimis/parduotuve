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
  title: "TechShop — Kompiuterių dalys ir aksesuarai",
  description:
    "Kokybiškos kompiuterių dalys, komponentai ir aksesuarai. Procesoriai, vaizdo plokštės, RAM, SSD ir daugiau.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="lt" className="w-full">
      <body className={`${geistSans.variable} ${geistMono.variable} w-full antialiased`}>
        {children}
      </body>
    </html>
  );
}
