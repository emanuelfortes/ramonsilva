import type { Metadata } from "next";
import SurrealHub from "@/components/surreal/SurrealHub";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
  openGraph: {
    title: "Ramon Silva Barbeiro",
    description:
      "Vaga aberta na barbearia, curso de barbeiro iniciante e o curso prático de um dia. Tudo em um lugar só.",
    url: "/",
    images: [{ url: "/og/hub.jpg", width: 1200, height: 630, alt: "Ramon Silva Barbearia" }],
  },
};

export default function HubPage() {
  return <SurrealHub />;
}
