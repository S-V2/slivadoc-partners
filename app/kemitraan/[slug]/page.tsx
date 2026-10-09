import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import PartnershipForm from "../partnership-form";
import { PartnerSiteHeader, PartnerSiteFooter, PartnerSupportWidget } from "../../partner-site-chrome";
import { findPartnershipCategory, partnershipCategories, partnershipCategoryPath } from "../../partnership-categories";
import "../category-page.css";

type Props = { params: Promise<{ slug: string }> };
const site = "https://partners.slivadoc.com";

export function generateStaticParams() {
  return partnershipCategories.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const category = findPartnershipCategory((await params).slug);
  if (!category) return { title: "Kategori kemitraan tidak ditemukan" };
  const path = partnershipCategoryPath(category.slug);
  const description = `Daftar kemitraan ${category.label} Slivadoc. ${category.description}. Lengkapi profil untuk ditinjau tim Operations.`;
  return {
    title: `Pendaftaran Kemitraan ${category.label}`,
    description,
    alternates: { canonical: path },
    openGraph: { type: "website", siteName: "Slivadoc Partners", url: `${site}${path}`, title: `Kemitraan ${category.label} | Slivadoc`, description, images: [{ url: "/brand/slivadoc-ecosystem-hero.webp", width: 1536, height: 1024, alt: "Ekosistem Slivadoc Partners" }] },
    twitter: { card: "summary_large_image", title: `Kemitraan ${category.label} | Slivadoc`, description, images: ["/brand/slivadoc-ecosystem-hero.webp"] },
  };
}

export default async function PartnershipCategoryPage({ params }: Props) {
  const category = findPartnershipCategory((await params).slug);
  if (!category) notFound();
  const path = partnershipCategoryPath(category.slug);
  const related = partnershipCategories.filter((item) => item.slug !== category.slug).slice(0, 3);
  const breadcrumbs = {
    "@context": "https://schema.org", "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Slivadoc Partners", item: site },
      { "@type": "ListItem", position: 2, name: `Kemitraan ${category.label}`, item: `${site}${path}` },
    ],
  };

  return <main className="partner-category-page" id="top">
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs).replace(/</g, "\\u003c") }} />
    <PartnerSiteHeader registration />
    <section className="partner-category-hero"><div className="partner-category-hero-copy"><span className="partner-category-kicker">Kemitraan Slivadoc · {category.label}</span><h1>Daftar mitra <em>{category.label}</em> Slivadoc</h1><p>{category.intro}</p><div className="partner-category-actions"><a href="#daftar">Mulai pendaftaran <span aria-hidden="true">↗</span></a><Link href="/#kategori-partner">Lihat kategori lainnya</Link></div></div><div className="partner-category-hero-mark" aria-hidden="true"><span>✦</span><strong>{category.label}</strong><small>{category.description}</small></div></section>
    <section className="partner-category-information" aria-labelledby="kategori-manfaat"><div><span className="partner-category-kicker">Dibuat untuk bidang Anda</span><h2 id="kategori-manfaat">Yang bisa Anda siapkan bersama Slivadoc</h2><p>{category.intro}</p></div><ul>{category.benefits.map((benefit) => <li key={benefit}><span aria-hidden="true">✓</span>{benefit}</li>)}</ul></section>
    <section className="partner-category-preparation"><div><span className="partner-category-kicker">Sebelum mengisi formulir</span><h2>Siapkan informasi yang relevan</h2><p>{category.preparation} Data pendaftaran dipakai untuk verifikasi, komunikasi, dan onboarding. Profil Anda tidak otomatis ditampilkan ke publik.</p>{category.value === "pet_academy_trainer" && <p>Anda trainer individu? Gunakan <Link href="/pet-trainer">formulir khusus Pet Trainer</Link> untuk mencantumkan spesialisasi dan pengalaman Anda.</p>}</div><div><b>01</b><span>Isi data bisnis dan penanggung jawab</span><b>02</b><span>Tim Operations meninjau pengajuan</span><b>03</b><span>Onboarding setelah disetujui</span></div></section>
    <PartnershipForm category={category} />
    <section className="partner-category-related"><h2>Jelajahi kategori kemitraan lain</h2><div>{related.map((item) => <Link href={partnershipCategoryPath(item.slug)} key={item.slug}><b>{item.label}</b><span>{item.description} →</span></Link>)}</div><Link className="partner-category-all" href="/#kategori-partner">Lihat seluruh {partnershipCategories.length} kategori →</Link></section>
    <PartnerSiteFooter />
    <PartnerSupportWidget />
  </main>;
}
