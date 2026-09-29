import type { MetadataRoute } from "next";
import { trainerCategories } from "./pet-trainer/categories";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://partners.slivadoc.com",
      changeFrequency: "weekly",
      priority: 1,
    },
    { url: "https://partners.slivadoc.com/pet-trainer", changeFrequency: "monthly", priority: 0.7 },
    ...trainerCategories.map(({ slug }) => ({
      url: `https://partners.slivadoc.com/pet-trainer/${slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];
}
