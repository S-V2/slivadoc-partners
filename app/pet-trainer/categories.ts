export const trainerCategories = [
  { slug: "anjing", value: "anjing", name: "Anjing", icon: "🐕", focus: "Obedience, sosialisasi, perilaku, dan aktivitas anjing." },
  { slug: "kucing", value: "kucing", name: "Kucing", icon: "🐈", focus: "Adaptasi, enrichment, kebiasaan, dan perilaku kucing." },
  { slug: "burung", value: "burung", name: "Burung", icon: "🦜", focus: "Interaksi, stimulasi, dan latihan burung peliharaan." },
  { slug: "kelinci", value: "kelinci", name: "Kelinci", icon: "🐇", focus: "Pembiasaan, handling, dan enrichment kelinci." },
  { slug: "reptil", value: "reptil", name: "Reptil", icon: "🦎", focus: "Handling, adaptasi, dan edukasi perilaku reptil." },
  { slug: "hewan-kecil", value: "hewan_kecil", name: "Hewan kecil", icon: "🐹", focus: "Hamster, marmut, dan hewan kecil lainnya." },
  { slug: "kuda", value: "kuda", name: "Kuda", icon: "🐎", focus: "Handling, komunikasi, dan latihan kuda." },
  { slug: "lainnya", value: "lainnya", name: "Jenis pet lainnya", icon: "🐾", focus: "Untuk pet yang belum tercantum di kategori di atas." },
] as const;

export type TrainerCategory = (typeof trainerCategories)[number];

export function getTrainerCategory(slug: string): TrainerCategory | undefined {
  return trainerCategories.find((category) => category.slug === slug);
}
