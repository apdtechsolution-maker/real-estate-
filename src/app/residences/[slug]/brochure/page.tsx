import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getResidence, residences } from "@/config/residences";
import { BrochureView } from "./BrochureView";

export function generateStaticParams() {
  return residences.map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const r = getResidence(slug);
  return { title: r ? `${r.name} — Brochure` : "Brochure", robots: { index: false } };
}

export default async function BrochurePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const r = getResidence(slug);
  if (!r) notFound();
  return <BrochureView slug={r.slug} />;
}
