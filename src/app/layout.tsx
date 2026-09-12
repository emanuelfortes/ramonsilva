import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

// Título: script parecido com o lettering "Ramon Silva" da logo
const greatVibes = localFont({
  src: "../fonts/great-vibes-latin-400-normal.woff2",
  variable: "--font-script",
  weight: "400",
  display: "swap",
});

// Parágrafos
const poppins = localFont({
  src: [
    { path: "../fonts/poppins-latin-300-normal.woff2", weight: "300" },
    { path: "../fonts/poppins-latin-400-normal.woff2", weight: "400" },
    { path: "../fonts/poppins-latin-500-normal.woff2", weight: "500" },
    { path: "../fonts/poppins-latin-600-normal.woff2", weight: "600" },
    { path: "../fonts/poppins-latin-700-normal.woff2", weight: "700" },
  ],
  variable: "--font-poppins",
  display: "swap",
});

// Rótulos em caixa alta, parecido com o "BARBEIRO" da logo
const josefin = localFont({
  src: [
    { path: "../fonts/josefin-sans-latin-300-normal.woff2", weight: "300" },
    { path: "../fonts/josefin-sans-latin-400-normal.woff2", weight: "400" },
    { path: "../fonts/josefin-sans-latin-600-normal.woff2", weight: "600" },
  ],
  variable: "--font-label",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Curso de Barbeiro Iniciante | Ramon Silva Barbeiro",
  description:
    "Curso presencial de barbeiro iniciante com Ramon Silva: 16 aulas, teoria e prática em modelos reais, certificado de conclusão e suporte técnico após o curso.",
  openGraph: {
    title: "Curso de Barbeiro Iniciante | Ramon Silva Barbeiro",
    description:
      "16 aulas presenciais, 2 por semana, teoria e prática com modelos reais. Certificado + suporte técnico.",
    images: ["/img/ramon-2.jpg"],
    locale: "pt_BR",
    type: "website",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="pt-BR"
      className={`${greatVibes.variable} ${poppins.variable} ${josefin.variable} h-full scroll-smooth antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
