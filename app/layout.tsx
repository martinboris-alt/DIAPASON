import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import { ThemeProvider } from "@/components/ThemeProvider";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  style: ["normal", "italic"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

export const metadata: Metadata = {
  title: "Diapasón — Afinación de Pianos",
  description:
    "Servicio profesional de afinación, mantenimiento y restauración de pianos. Calidad y precisión al servicio de su instrumento.",
  keywords: "afinación de pianos, piano, afinador, mantenimiento piano, restauración piano",
  openGraph: {
    title: "Diapasón — Afinación de Pianos",
    description: "Servicio profesional de afinación, mantenimiento y restauración de pianos.",
    type: "website",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#0A0A0A",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${playfair.variable} ${inter.variable} h-full`} suppressHydrationWarning>
      <body className="min-h-full bg-piano-black text-white-warm antialiased">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
