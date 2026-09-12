import AosInit from "@/components/AosInit";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Curso from "@/components/Curso";
import Cronograma from "@/components/Cronograma";
import Videos from "@/components/Videos";
import Professor from "@/components/Professor";
import Faq from "@/components/Faq";
import Cta from "@/components/Cta";
import Footer from "@/components/Footer";
import WhatsFloat from "@/components/WhatsFloat";

export default function Home() {
  return (
    <main>
      <AosInit />
      <Header />
      <Hero />
      <Curso />
      <Cronograma />
      <Videos />
      <Professor />
      <Faq />
      <Cta />
      <Footer />
      <WhatsFloat />
    </main>
  );
}
