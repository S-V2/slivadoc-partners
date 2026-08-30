import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Slivadoc Partners — Tumbuh Bersama Ekosistem Pet Care",
  description: "Daftar menjadi partner Slivadoc untuk menjangkau pet owner, merapikan operasional, dan bertumbuh bersama ekosistem pet care Indonesia.",
  icons: {
    icon: "/brand/slivadoc-favicon.png",
    shortcut: "/brand/slivadoc-favicon.png",
    apple: "/brand/slivadoc-favicon.png",
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
