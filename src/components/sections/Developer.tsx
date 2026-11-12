"use client";

import { ShieldCheck, FileText, Leaf, Ruler } from "lucide-react";
import { useMarket } from "@/components/providers/AppProviders";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { SplitReveal } from "@/components/motion/SplitReveal";
import { ParallaxImage } from "@/components/motion/ParallaxImage";

/**
 * Partner & credential slots are intentionally empty in the demo. Populate
 * `name` / `value` only with verified, developer-supplied information.
 */
const partners: { role: string; name: string | null }[] = [
  { role: "Design Architect", name: null },
  { role: "Landscape Architect", name: null },
  { role: "Interior Design", name: null },
  { role: "Structural Engineering", name: null },
  { role: "Lighting Design", name: null },
  { role: "Project Management", name: null },
];

export function Developer() {
  const { market } = useMarket();
  const credentials = [
    {
      icon: FileText,
      label: market.regulatory ? `${market.regulatory.authority} registration` : "Listing & MLS information",
      value: market.regulatory?.registrationNumber ?? market.mls?.listingId ?? null,
    },
    { icon: ShieldCheck, label: "Title & statutory approvals", value: null },
    { icon: Leaf, label: "Green building certification", value: null },
    { icon: Ruler, label: "Independent quality audits", value: null },
  ];

  return (
    <section id="developer" aria-labelledby="dev-title" className="relative bg-[var(--bg-2)] py-28 md:py-40">
      <div className="px-5 md:px-10">
        <SectionLabel index="09" label="Developer & Trust" />
      </div>
      <div className="mt-14 grid grid-cols-1 gap-16 px-5 md:grid-cols-12 md:px-10">
        <div className="md:col-span-6">
          <SplitReveal as="h2" id="dev-title" className="display text-[11vw] md:text-[5.4vw]">
            Built slowly. Built to be trusted.
          </SplitReveal>
          <SplitReveal as="p" className="mt-10 max-w-xl text-lg leading-relaxed text-[var(--muted)]">
            Aurelia Estates develops a small number of residences at a time, working with independent architects, landscape designers and craftspeople. We believe trust is earned through clarity — clear documentation, clear specifications and clear timelines.
          </SplitReveal>
          <SplitReveal as="p" className="mt-6 max-w-xl leading-relaxed text-[var(--muted)]">
            Every credential shown on this site is published only once it has been verified. Where information is pending, we say so.
          </SplitReveal>
        </div>
        <div className="md:col-span-5 md:col-start-8">
          <ParallaxImage src="/images/facade-1.jpg" alt="Minimal building with vertical windows against a clear sky" className="aspect-[4/5] w-full" sizes="(min-width:768px) 40vw, 100vw" reveal="up" />
        </div>
      </div>

      <div className="mt-24 grid grid-cols-1 gap-16 px-5 md:grid-cols-12 md:px-10">
        <div className="md:col-span-5">
          <h3 className="eyebrow text-[var(--gold)]">Project credentials</h3>
          <ul className="mt-6 border-t border-[var(--line)]">
            {credentials.map(({ icon: Icon, label, value }) => (
              <li key={label} className="flex items-center justify-between gap-4 border-b border-[var(--line)] py-5">
                <span className="flex items-center gap-4">
                  <Icon size={18} strokeWidth={1.25} className="text-[var(--gold)]" />
                  <span className="font-display text-xl md:text-2xl">{label}</span>
                </span>
                <span className={`eyebrow shrink-0 ${value ? "" : "text-[var(--muted)]"}`}>{value ?? "Pending verification"}</span>
              </li>
            ))}
          </ul>
          {market.regulatory && <p className="mt-5 text-xs leading-relaxed text-[var(--muted)]">{market.regulatory.note}</p>}
        </div>
        <div className="md:col-span-6 md:col-start-7">
          <h3 className="eyebrow text-[var(--gold)]">Architectural partners</h3>
          <ul className="mt-6 grid grid-cols-1 gap-px bg-[var(--line)] sm:grid-cols-2">
            {partners.map((p) => (
              <li key={p.role} className="group bg-[var(--bg-2)] p-6 transition-colors duration-700 hover:bg-[var(--bg)]">
                <p className="eyebrow text-[var(--muted)]">{p.role}</p>
                <p className="mt-3 font-display text-2xl">{p.name ?? "To be announced"}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
