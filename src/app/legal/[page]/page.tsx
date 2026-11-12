import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { site } from "@/config/site";

const pages: Record<string, { title: string; body: string[] }> = {
  privacy: {
    title: "Privacy Policy",
    body: [
      "This is a demonstration website. When you submit an enquiry, we store the details you provide (name, email, phone, property interest and message) solely to respond to your request.",
      "We do not sell personal information. Enquiry data may be shared with the developer's sales team or CRM provider strictly to arrange viewings and respond to questions.",
      "You may request access to, correction of, or deletion of your data at any time by contacting the private office.",
      "Replace this template with a jurisdiction-specific policy (e.g. India's DPDP Act 2023, CCPA/CPRA in California) before launch.",
    ],
  },
  terms: {
    title: "Terms of Use",
    body: [
      site.disclaimer,
      "Nothing on this website constitutes an offer, invitation to offer, advertisement for sale, or a regulatory disclosure. Imagery includes artist's impressions and licensed stock photography.",
      "Prices, availability, areas and specifications are illustrative and subject to change without notice. Purchasers should rely only on executed contract documentation.",
    ],
  },
  accessibility: {
    title: "Accessibility",
    body: [
      "We aim to conform to WCAG 2.2 Level AA. The site supports keyboard navigation, visible focus states, semantic landmarks and reduced-motion preferences.",
      "If you enable 'reduce motion' in your operating system, smooth scrolling, parallax and cinematic transitions are disabled automatically.",
      "If you encounter a barrier or need materials in an accessible format, please contact the private office and we will assist.",
    ],
  },
};

export function generateStaticParams() {
  return Object.keys(pages).map((page) => ({ page }));
}

export async function generateMetadata({ params }: { params: Promise<{ page: string }> }): Promise<Metadata> {
  const { page } = await params;
  return { title: pages[page]?.title ?? "Legal" };
}

export default async function LegalPage({ params }: { params: Promise<{ page: string }> }) {
  const { page } = await params;
  const p = pages[page];
  if (!p) notFound();
  return (
    <>
      <Header />
      <main id="main" className="px-5 pb-32 pt-40 md:px-10">
        <p className="eyebrow text-[var(--gold)]">Legal</p>
        <h1 className="display mt-6 text-6xl md:text-8xl">{p.title}</h1>
        <div className="mt-14 max-w-2xl space-y-6 text-lg leading-relaxed text-[var(--muted)]">
          {p.body.map((b) => (
            <p key={b}>{b}</p>
          ))}
        </div>
      </main>
      <Footer />
    </>
  );
}
