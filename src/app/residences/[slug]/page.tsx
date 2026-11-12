import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ResidenceDetail } from "@/components/residence/ResidenceDetail";
import { getResidence, residences } from "@/config/residences";

export function generateStaticParams() {
  return residences.map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const r = getResidence(slug);
  if (!r) return {};
  return {
    title: r.name,
    description: `${r.name} — ${r.tagline} ${r.bedrooms} bedrooms, ${r.areaSqft.min.toLocaleString("en-US")}–${r.areaSqft.max.toLocaleString("en-US")} sq ft. Illustrative demo listing.`,
    openGraph: { title: `${r.name} · Aurelia Estates`, description: r.tagline, images: [{ url: r.heroImage }] },
  };
}

export default async function ResidencePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const r = getResidence(slug);
  if (!r) notFound();
  return (
    <>
      <Header />
      <main id="main">
        <ResidenceDetail slug={r.slug} />
      </main>
      <Footer />
    </>
  );
}
