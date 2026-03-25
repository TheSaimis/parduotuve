import type { Metadata, Viewport } from "next";
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
  title: "Vitrina — Prekių parduotuvė",
  description:
    "Platus prekių pasirinkimas vienoje vietoje. Elektronika, drabužiai, grožio priemonės ir daugiau.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="lt" className="w-full overflow-x-clip">
      <body
        className={`${geistSans.variable} ${geistMono.variable} w-full min-w-0 antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
