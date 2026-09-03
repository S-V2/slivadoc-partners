import type { Metadata } from "next";
import "./globals.css";
import GoogleAnalytics from "./google-analytics";
import { seoKeywords } from "./seo-keywords.mjs";

const siteUrl = "https://partners.slivadoc.com";
const title = "Slivadoc Partners: Aplikasi POS Petshop & Klinik Hewan Gratis";
const description =
  "Slivadoc adalah aplikasi POS dan manajemen bisnis hewan gratis untuk petshop, petclinic, grooming, dokter hewan, stok, booking, dan transaksi.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: title,
    template: "%s | Slivadoc Partners",
  },
  description,
  applicationName: "Slivadoc Partners",
  authors: [{ name: "Slivadoc", url: "https://slivadoc.com" }],
  creator: "Slivadoc",
  publisher: "PT Sliva Technology Indonesia",
  category: "Pet care business software",
  keywords: seoKeywords,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: siteUrl,
    siteName: "Slivadoc Partners",
    title,
    description,
  },
  twitter: {
    card: "summary",
    title,
    description,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
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
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": "https://slivadoc.com/#organization",
        name: "Slivadoc",
        legalName: "PT Sliva Technology Indonesia",
        url: "https://slivadoc.com",
        logo: `${siteUrl}/brand/slivadoc-logo.png`,
        sameAs: [siteUrl],
      },
      {
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        url: siteUrl,
        name: "Slivadoc Partners",
        alternateName: ["Partner Slivadoc", "Slivadoc untuk Bisnis Pet Care"],
        description,
        inLanguage: "id-ID",
        publisher: { "@id": "https://slivadoc.com/#organization" },
      },
      {
        "@type": "SoftwareApplication",
        "@id": `${siteUrl}/#software`,
        name: "Slivadoc Partners",
        alternateName: "Aplikasi Bisnis Pet Care Slivadoc",
        url: siteUrl,
        applicationCategory: "BusinessApplication",
        applicationSubCategory: "Pet Care Management Software",
        operatingSystem: "Web",
        description,
        inLanguage: "id-ID",
        brand: { "@id": "https://slivadoc.com/#organization" },
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "IDR",
          availability: "https://schema.org/InStock",
          url: `${siteUrl}/#daftar`,
        },
        featureList: [
          "POS dan kasir petshop",
          "POS klinik hewan",
          "Manajemen stok dan inventory",
          "Booking layanan grooming dan pet care",
          "Manajemen pelanggan dan transaksi",
          "Operasional bisnis multi-cabang",
        ],
      },
    ],
  };

  return (
    <html lang="id" suppressHydrationWarning>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        {children}
        <GoogleAnalytics />
      </body>
    </html>
  );
}
