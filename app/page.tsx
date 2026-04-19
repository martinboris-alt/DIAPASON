import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import PianoAnatomy from "@/components/PianoAnatomy";
import Gallery from "@/components/Gallery";
import PartituraBanner from "@/components/PartituraBanner";
import About from "@/components/About";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Services />
        <PianoAnatomy />
        <Gallery />
        <PartituraBanner />
        <About />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
