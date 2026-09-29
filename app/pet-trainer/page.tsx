import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { trainerCategories } from "./categories";
import "./trainer.css";

export const metadata: Metadata = {
  title: "Pilih Jenis Pet Trainer",
  description: "Pilih jenis pet yang Anda latih untuk membuka formulir pendaftaran trainer Slivadoc yang sesuai.",
  alternates: { canonical: "/pet-trainer" },
};

export default function PetTrainerCategoriesPage() {
  return <main className="trainer-page">
    <header className="trainer-header"><Link href="/" className="trainer-brand"><Image src="/brand/slivadoc-logo.png" alt="" width={38} height={38} /><span>sliva<b>doc</b><small>partners</small></span></Link><nav><Link href="/">Partnership</Link></nav></header>
    <section className="trainer-category-hero"><span className="trainer-eyebrow"><i /> Pendaftaran pet trainer Slivadoc</span>
      <h1>Pilih bidang pet <em>yang Anda latih.</em></h1>
      <p>Setiap jenis pet memiliki halaman pendaftaran tersendiri. Pilih satu kategori untuk mengisi profil, pengalaman, layanan, dan portofolio Anda.</p>
    </section>
    <section className="trainer-category-section" aria-label="Kategori pet trainer">
      <div className="trainer-category-grid">{trainerCategories.map((category) => <Link className="trainer-category-card" href={`/pet-trainer/${category.slug}`} key={category.slug}>
        <span className="trainer-category-icon" aria-hidden="true">{category.icon}</span>
        <strong>Trainer {category.name}</strong><small>{category.focus}</small><span className="trainer-category-arrow">Buka formulir <span aria-hidden="true">↗</span></span>
      </Link>)}</div>
      <p>Menangani lebih dari satu jenis pet? Isi satu formulir untuk setiap kategori yang relevan agar tim kami dapat meninjau keahlian Anda secara terpisah.</p>
    </section>
    <footer className="trainer-footer"><Link href="/">← Slivadoc Partners</Link><span>© {new Date().getFullYear()} PT Sliva Technology Indonesia</span><a href="mailto:support@slivadoc.com">Butuh bantuan?</a></footer>
  </main>;
}
