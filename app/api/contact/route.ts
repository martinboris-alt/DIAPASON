import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { name, email, phone, service, message } = await req.json();

    if (!name || !email || !message) {
      return NextResponse.json({ error: "Campos requeridos faltantes" }, { status: 400 });
    }

    // Option A: Resend (recommended for Vercel)
    // Uncomment and add RESEND_API_KEY to env when ready:
    //
    // const { Resend } = await import("resend");
    // const resend = new Resend(process.env.RESEND_API_KEY);
    // await resend.emails.send({
    //   from: "noreply@tudominio.com",
    //   to: process.env.CONTACT_EMAIL!,
    //   subject: `Nuevo contacto: ${service || "Consulta general"}`,
    //   html: `
    //     <p><strong>Nombre:</strong> ${name}</p>
    //     <p><strong>Email:</strong> ${email}</p>
    //     <p><strong>Teléfono:</strong> ${phone || "No indicado"}</p>
    //     <p><strong>Servicio:</strong> ${service || "No seleccionado"}</p>
    //     <p><strong>Mensaje:</strong> ${message}</p>
    //   `,
    // });

    // For now, log to console (works for testing)
    console.log("Contact form submission:", { name, email, phone, service, message });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Contact route error:", err);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}
