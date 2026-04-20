"use client";

import { useState } from "react";
import emailjs from "@emailjs/browser";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { ANIM } from "@/lib/animation";

const services = [
  "Afinación de piano",
  "Reparación y regulación",
  "Mantenimiento preventivo",
  "Consultoría / Valuación",
  "Otro",
];

export default function Contact() {
  const [form, setForm] = useState({
    name: "", email: "", phone: "", service: "", message: "",
  });
  const [status, setStatus] = useState<"idle" | "sending" | "ok" | "error">("idle");

  const sectionRef = useScrollReveal<HTMLElement>({
    selector: ".contact-anim",
    stagger: ANIM.CONTACT_STAGGER,
    threshold: 0.15,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");

    const serviceId  = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
    const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID;
    const publicKey  = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;

    if (!serviceId || !templateId || !publicKey) {
      console.error("EmailJS: faltan variables de entorno. Ver .env.local.example");
      setStatus("error");
      return;
    }

    try {
      await emailjs.send(
        serviceId,
        templateId,
        {
          from_name: form.name,
          from_email: form.email,
          phone:      form.phone || "No indicado",
          service:    form.service || "No seleccionado",
          message:    form.message,
        },
        { publicKey }
      );
      setStatus("ok");
      setForm({ name: "", email: "", phone: "", service: "", message: "" });
    } catch (err) {
      console.error("EmailJS error:", err);
      setStatus("error");
    }
  };

  const inputClass =
    "w-full bg-transparent border-b border-white-warm/20 px-0 py-3 text-white-warm placeholder-white-warm/40 text-sm focus:outline-none focus:border-gold transition-colors duration-300 font-light tracking-wide";

  return (
    <section id="contacto" ref={sectionRef} className="py-20 sm:py-28 px-6 bg-piano-black">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
          {/* Left info */}
          <div>
            <div
              className="contact-anim"
              style={{ opacity: 0, transform: "translateY(30px)", transition: "opacity 0.7s ease, transform 0.7s ease" }}
            >
              <p className="text-xs tracking-[0.4em] uppercase text-gold mb-4 font-light">Hablemos</p>
              <h2 className="font-display text-4xl md:text-5xl font-semibold text-white-warm leading-tight mb-6">
                Solicita tu<br />
                <em className="italic text-gold">servicio hoy</em>
              </h2>
              <div className="w-12 h-px bg-gold/60 mb-8" />
            </div>

            <div
              className="contact-anim flex flex-col gap-6"
              style={{ opacity: 0, transform: "translateY(30px)", transition: "opacity 0.7s ease, transform 0.7s ease" }}
            >
              <p className="text-white-soft/70 font-light leading-relaxed text-sm">
                Cuéntame sobre tu piano y lo que necesitas. Me pondré en contacto contigo
                a la brevedad para coordinar una visita.
              </p>

              <div className="flex flex-col gap-5 mt-4">
                <ContactInfo icon={<PhoneIcon />} label="Teléfono / WhatsApp" value="+56 9 8670 2647" href="https://wa.me/56986702647" />
                <ContactInfo icon={<MailIcon />} label="Correo electrónico" value="diego@ejemplo.com" href="mailto:diego@ejemplo.com" />
                <ContactInfo icon={<InstagramIcon />} label="Instagram" value="@diegojuica" href="https://www.instagram.com/diegojuica/" />
                <ContactInfo icon={<MapIcon />} label="Área de servicio" value="Chile" />
              </div>

              <a
                href="https://wa.me/56986702647?text=Hola%20Diego%2C%20me%20interesa%20un%20servicio%20de%20afinaci%C3%B3n."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 mt-4 px-6 py-3 bg-[#25D366]/10 border border-[#25D366]/30 text-[#25D366] text-xs tracking-widest uppercase hover:bg-[#25D366]/20 transition-all duration-300 w-fit"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                Escribir por WhatsApp
              </a>
            </div>
          </div>

          {/* Form */}
          <div
            className="contact-anim"
            style={{ opacity: 0, transform: "translateY(30px)", transition: "opacity 0.7s ease, transform 0.7s ease" }}
          >
            {status === "ok" ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-16 border border-gold/20">
                <div className="text-gold text-4xl mb-4">✓</div>
                <h3 className="font-display text-2xl text-white-warm mb-3">Mensaje recibido</h3>
                <p className="text-white-soft/70 text-sm font-light">Me pondré en contacto contigo pronto.</p>
                <button
                  onClick={() => setStatus("idle")}
                  className="mt-6 text-xs tracking-widest uppercase text-gold/60 hover:text-gold transition-colors"
                >
                  Enviar otro mensaje →
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-8" noValidate>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                  <div>
                    <label htmlFor="contact-name" className="text-[10px] tracking-widest uppercase text-white-warm/50 block mb-2">
                      Nombre *
                    </label>
                    <input
                      id="contact-name"
                      name="name"
                      required
                      value={form.name}
                      onChange={handleChange}
                      placeholder="Tu nombre"
                      className={inputClass}
                      aria-required="true"
                    />
                  </div>
                  <div>
                    <label htmlFor="contact-email" className="text-[10px] tracking-widest uppercase text-white-warm/50 block mb-2">
                      Correo *
                    </label>
                    <input
                      id="contact-email"
                      name="email"
                      type="email"
                      required
                      value={form.email}
                      onChange={handleChange}
                      placeholder="tu@email.com"
                      className={inputClass}
                      aria-required="true"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                  <div>
                    <label htmlFor="contact-phone" className="text-[10px] tracking-widest uppercase text-white-warm/50 block mb-2">
                      Teléfono
                    </label>
                    <input
                      id="contact-phone"
                      name="phone"
                      type="tel"
                      value={form.phone}
                      onChange={handleChange}
                      placeholder="+56 9 XXXX XXXX"
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label htmlFor="contact-service" className="text-[10px] tracking-widest uppercase text-white-warm/50 block mb-2">
                      Servicio
                    </label>
                    <select
                      id="contact-service"
                      name="service"
                      value={form.service}
                      onChange={handleChange}
                      className={`${inputClass} appearance-none`}
                      style={{ background: "var(--color-piano-black)" }}
                    >
                      <option value="" style={{ background: "var(--color-piano-black)" }}>
                        Seleccionar...
                      </option>
                      {services.map((s) => (
                        <option key={s} value={s} style={{ background: "var(--color-piano-black)" }}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="contact-message" className="text-[10px] tracking-widest uppercase text-white-warm/50 block mb-2">
                    Mensaje *
                  </label>
                  <textarea
                    id="contact-message"
                    name="message"
                    required
                    rows={4}
                    value={form.message}
                    onChange={handleChange}
                    placeholder="Cuéntame sobre tu piano y qué necesitas..."
                    className={`${inputClass} resize-none`}
                    aria-required="true"
                  />
                </div>

                {status === "error" && (
                  <p role="alert" className="text-red-500/80 text-xs tracking-wide">
                    Hubo un error al enviar. Por favor intenta de nuevo o escríbeme por WhatsApp.
                  </p>
                )}

                <button
                  type="submit"
                  disabled={status === "sending"}
                  className="px-8 py-4 bg-gold text-piano-black text-xs tracking-widest uppercase font-medium hover:bg-gold-light transition-all duration-300 disabled:opacity-50 hover:shadow-[0_0_30px_rgba(201,168,76,0.3)] w-fit"
                >
                  {status === "sending" ? "Enviando..." : "Enviar mensaje"}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function ContactInfo({
  icon, label, value, href,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  href?: string;
}) {
  const content = (
    <div className="flex items-start gap-4 group">
      <div className="text-gold/50 group-hover:text-gold transition-colors mt-0.5">{icon}</div>
      <div>
        <p className="text-[10px] tracking-widest uppercase text-white-warm/50 mb-1">{label}</p>
        <p className="text-white-soft/80 text-sm font-light">{value}</p>
      </div>
    </div>
  );
  if (href)
    return <a href={href} target="_blank" rel="noopener noreferrer" className="block">{content}</a>;
  return content;
}

function PhoneIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" className="w-5 h-5">
      <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.88 9.5a19.79 19.79 0 01-3.07-8.67A2 2 0 012.79 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 7.69a16 16 0 006.4 6.4l1.06-1.06a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" className="w-5 h-5">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
      <polyline points="22,6 12,13 2,6" />
    </svg>
  );
}

function MapIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" className="w-5 h-5">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" className="w-5 h-5">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}
