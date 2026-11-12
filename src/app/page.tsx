import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Preloader } from "@/components/layout/Preloader";
import { Hero } from "@/components/sections/Hero";
import { Vision } from "@/components/sections/Vision";
import { Location } from "@/components/sections/Location";
import { Architecture } from "@/components/sections/Architecture";
import { Residences } from "@/components/sections/Residences";
import { DetailPreview } from "@/components/sections/DetailPreview";
import { Amenities } from "@/components/sections/Amenities";
import { Lifestyle } from "@/components/sections/Lifestyle";
import { Developer } from "@/components/sections/Developer";
import { Contact } from "@/components/sections/Contact";

export default function Home() {
  return (
    <>
      <Preloader />
      <Header />
      <main id="main">
        <Hero />
        <Vision />
        <Location />
        <Architecture />
        <Residences />
        <DetailPreview />
        <Amenities />
        <Lifestyle />
        <Developer />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
