import type { Metadata } from "next";
import { notFound } from "next/navigation";
import TrainerForm from "../trainer-form";
import { getTrainerCategory, trainerCategories } from "../categories";
import "../trainer.css";

type PageProps = { params: Promise<{ category: string }> };

export function generateStaticParams() {
  return trainerCategories.map(({ slug }) => ({ category: slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const category = getTrainerCategory((await params).category);
  if (!category) return { title: "Kategori tidak ditemukan" };
  return {
    title: `Daftar Trainer ${category.name}`,
    description: `Daftarkan diri sebagai trainer ${category.name.toLowerCase()} Slivadoc. Lengkapi pengalaman, spesialisasi, area layanan, dan portofolio Anda.`,
    alternates: { canonical: `/pet-trainer/${category.slug}` },
  };
}

export default async function PetTrainerCategoryPage({ params }: PageProps) {
  const category = getTrainerCategory((await params).category);
  if (!category) notFound();
  return <TrainerForm category={category} />;
}
