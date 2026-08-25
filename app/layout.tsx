import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Slivadoc Partners — Grow the Pet Ecosystem",
  description: "Portal partnership untuk brand, distributor, komunitas, dan mitra industri pet care Indonesia.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
