import type { Metadata } from "next";
import TrainerForm from "./trainer-form";
import "./trainer.css";

export const metadata: Metadata = {
  title: "Daftar Pet Trainer | Slivadoc Partners",
  description: "Daftarkan diri sebagai pet trainer Slivadoc. Ceritakan pengalaman, spesialisasi, area layanan, dan metode training Anda.",
};

export default function PetTrainerPage() {
  return <TrainerForm />;
}
