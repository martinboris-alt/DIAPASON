import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import StudioClient from "./StudioClient";

export const metadata: Metadata = {
  title: "Compositor Studio · Diapasón",
  description: "Crea tu propia composición musical mezclando el estilo de los grandes compositores clásicos. Selecciona artistas, ajusta parámetros y genera música original.",
  alternates: { canonical: "https://diapason.vercel.app/studio" },
};

export default function StudioPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-piano-black pt-20">
        <StudioClient />
      </main>
      <Footer />
    </>
  );
}
