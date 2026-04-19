import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Preguntas frecuentes sobre afinación de pianos · Diapasón",
  description:
    "Respuestas a las preguntas más frecuentes sobre afinación, reparación y mantenimiento de pianos. Servicio profesional en Chile.",
  keywords: "preguntas afinación piano, FAQ piano, dudas piano, servicio piano Chile",
};

const faqs = [
  {
    q: "¿Con qué frecuencia debo afinar mi piano?",
    a: "Los principales fabricantes recomiendan afinar el piano al menos dos veces al año. En Chile, lo ideal es una afinación al inicio del otoño (marzo-abril) y otra al inicio de la primavera (septiembre-octubre), ya que son los momentos en que el clima cambia más rápido. Pianos nuevos pueden requerir hasta cuatro afinaciones anuales durante los primeros dos años.",
  },
  {
    q: "¿Cuánto cuesta afinar un piano en Chile?",
    a: "El rango habitual está entre $50.000 y $90.000 CLP para una afinación estándar. El precio depende de la zona, el tipo de piano (vertical o cola) y su estado. Si el piano lleva mucho tiempo sin afinarse, puede requerir un pitch raise con costo adicional.",
  },
  {
    q: "¿Cuánto tarda una afinación?",
    a: "Una afinación profesional completa toma entre 1,5 y 2,5 horas. Este tiempo incluye la evaluación inicial del instrumento, la afinación nota por nota, ajustes menores del mecanismo y una revisión general del estado del piano.",
  },
  {
    q: "¿Qué pasa si nunca afino mi piano?",
    a: "Un piano sin afinar no se rompe inmediatamente, pero las consecuencias son reales: pierde tono progresivamente, desarrolla problemas estructurales internos y puede necesitar reparaciones costosas. Un piano que lleva muchos años sin afinar requiere un pitch raise gradual que puede tomar dos o más visitas.",
  },
  {
    q: "¿Se puede mover un piano sin desafinarlo?",
    a: "No. Todo movimiento de un piano, incluso dentro de la misma casa, altera levemente su afinación debido a las vibraciones y cambios de posición. Tras un traslado, hay que esperar entre 2 y 3 semanas para que el piano se estabilice en su nuevo ambiente antes de afinarlo.",
  },
  {
    q: "¿Los pianos digitales se afinan?",
    a: "No. Los pianos digitales generan sonido electrónicamente y no tienen cuerdas que se desafinen. Sin embargo, algunos modelos híbridos (como el Yamaha AvantGrand o el Kawai Novus) tienen componentes mecánicos que pueden requerir mantenimiento.",
  },
  {
    q: "¿Cuál es la humedad ideal para un piano?",
    a: "Entre 40% y 60% de humedad relativa. En Chile, donde el clima varía mucho por zona, es recomendable usar un higrómetro para monitorear y, si es necesario, un humidificador o deshumidificador. Para climas extremos existen sistemas Dampp-Chaser que se instalan dentro del piano.",
  },
  {
    q: "¿Qué es un pitch raise y cuándo se necesita?",
    a: "El pitch raise es una subida gradual de tono que se aplica a pianos muy desafinados, con un pitch que ha caído considerablemente del estándar A=440 Hz. No puede hacerse de una sola vez porque el cambio brusco de tensión podría romper cuerdas. Se realiza en varias visitas con algunas semanas de diferencia.",
  },
  {
    q: "¿Qué marcas de piano son más recomendables?",
    a: "Para uso doméstico en Chile, las marcas que mejor se comportan son Yamaha (series U1/U3), Kawai, Bechstein, Blüthner y Steinway. En pianos de segunda mano, los Yamaha y Kawai japoneses de los años 70-90 suelen ofrecer excelente relación calidad-precio.",
  },
  {
    q: "¿Puede un piano afinarse a sí mismo?",
    a: "No. Aunque los pianos modernos tienen marcos de hierro muy estables, las cuerdas pierden tensión progresivamente por uso, cambios climáticos y el asentamiento natural del instrumento. Siempre requiere intervención profesional.",
  },
  {
    q: "¿Diego Juica cubre todo Chile?",
    a: "El área principal de servicio es la zona central de Chile. Para traslados a regiones se coordinan visitas con anticipación, generalmente asociadas a varios servicios en la zona. Contacta por WhatsApp al +56 9 8670 2647 para consultar disponibilidad en tu ciudad.",
  },
  {
    q: "¿Puedo afinar yo mismo mi piano?",
    a: "Técnicamente es posible, pero no es recomendable. Una afinación requiere años de formación, oído entrenado y herramientas especializadas. Un aficionado puede dañar permanentemente el clavijero, romper cuerdas o crear tensiones peligrosas en el marco de hierro. El coste de una afinación profesional es mínimo comparado con el valor del instrumento.",
  },
];

export default function FAQPage() {
  // JSON-LD FAQPage schema → aparecen como respuestas directas en Google
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(f => ({
      "@type": "Question",
      "name": f.q,
      "acceptedAnswer": { "@type": "Answer", "text": f.a },
    })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Navbar />
      <main className="min-h-screen bg-piano-black pt-24">

        {/* Header */}
        <div className="max-w-4xl mx-auto px-6 py-12 border-b border-white-warm/5">
          <p className="text-xs tracking-[0.4em] uppercase text-gold mb-4 font-light">
            Dudas resueltas
          </p>
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-semibold text-white-warm mb-6 leading-tight">
            Preguntas
            <br />
            <em className="italic text-gold">frecuentes</em>
          </h1>
          <p className="text-white-soft/60 text-base font-light max-w-xl leading-relaxed">
            Respuestas a las dudas más comunes sobre afinación, cuidado y mantenimiento
            de pianos. Si tu pregunta no está aquí, escríbeme por WhatsApp.
          </p>
        </div>

        {/* FAQ list */}
        <div className="max-w-4xl mx-auto px-6 py-12 space-y-px bg-white-warm/5">
          {faqs.map((f, i) => (
            <details
              key={i}
              className="bg-piano-black group"
            >
              <summary className="cursor-pointer p-6 sm:p-8 flex items-start gap-4 hover:bg-piano-black-soft transition-colors touch-manipulation list-none">
                <span className="font-display text-2xl text-gold/60 shrink-0 w-10">{String(i + 1).padStart(2, "0")}</span>
                <span className="font-display text-base sm:text-lg font-semibold text-white-warm flex-1 leading-snug">
                  {f.q}
                </span>
                <span className="text-gold/60 text-xl shrink-0 group-open:rotate-45 transition-transform">+</span>
              </summary>
              <div className="px-6 sm:px-8 pb-6 sm:pb-8 pl-20">
                <p className="text-white-soft/70 text-sm sm:text-base font-light leading-relaxed">
                  {f.a}
                </p>
              </div>
            </details>
          ))}
        </div>

        {/* CTA */}
        <div className="max-w-4xl mx-auto px-6 py-16 border-t border-white-warm/5 text-center">
          <p className="font-display text-xl italic text-white-warm/60 mb-2">
            ¿Tienes otra pregunta?
          </p>
          <p className="text-white-warm/40 text-sm font-light mb-6">
            Escríbeme por WhatsApp y te respondo directamente.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="https://wa.me/56986702647?text=Hola%20Diego%2C%20tengo%20una%20consulta%20sobre%20mi%20piano."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-[#25D366]/10 border border-[#25D366]/30 text-[#25D366] text-xs tracking-widest uppercase hover:bg-[#25D366]/20 transition-all duration-300"
            >
              Escribir por WhatsApp
            </a>
            <Link
              href="/#contacto"
              className="inline-block px-8 py-4 bg-gold text-piano-black text-xs tracking-widest uppercase font-medium hover:bg-gold-light transition-all duration-300"
            >
              Solicitar servicio
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
