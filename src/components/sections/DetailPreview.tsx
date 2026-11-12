"use client";

import Image from "next/image";
import { useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { residences } from "@/config/residences";
import { useMarket } from "@/components/providers/AppProviders";
import { formatPrice } from "@/config/site";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { SplitReveal } from "@/components/motion/SplitReveal";
import { FloorPlanView } from "@/components/residence/FloorPlan";
import { TLink } from "@/components/ui/TLink";

export function DetailPreview() {
  const { market } = useMarket();
  const [i, setI] = useState(0);
  const r = residences[i];
  return (
    <section id="details" aria-labelledby="dp-title" className="bg-[var(--bg-2)] px-5 py-28 md:px-10 md:py-40">
      <SectionLabel index="06" label="Inside the Residences" />
      <div className="mt-12 grid grid-cols-1 gap-10 md:grid-cols-12">
        <SplitReveal as="h2" id="dp-title" className="display text-[11vw] md:col-span-7 md:text-[5.4vw]">
          Galleries, plans &amp; live availability.
        </SplitReveal>
        <p className="leading-relaxed text-[var(--muted)] md:col-span-4 md:col-start-9 md:pt-4">
          Each collection has its own dossier — photography, interactive floor plans, full specifications, available units, a downloadable brochure and private viewing requests.
        </p>
      </div>

      <div className="mt-16 grid grid-cols-1 gap-12 lg:grid-cols-12">
        <ul className="lg:col-span-4" role="tablist" aria-label="Preview a residence">
          {residences.map((res, idx) => {
            const mr = market.residences.find((m) => m.slug === res.slug);
            return (
              <li key={res.slug} className="border-t border-[var(--line)] last:border-b">
                <div className="flex items-center gap-5 py-5">
                  <button type="button" role="tab" aria-selected={i === idx} onClick={() => setI(idx)} onMouseEnter={() => setI(idx)} className="group flex flex-1 items-center gap-5 text-left">
                    <span className="img-grade relative h-16 w-14 shrink-0 overflow-hidden">
                      <Image src={res.cardImage} alt="" fill sizes="56px" className={`object-cover transition-transform duration-1000 ${i === idx ? "scale-100" : "scale-125 grayscale"}`} />
                    </span>
                    <span>
                      <span className={`block font-display text-2xl transition-colors duration-500 ${i === idx ? "text-[var(--fg)]" : "text-[var(--muted)]"}`}>{res.name}</span>
                      <span className="eyebrow text-[var(--muted)]">{formatPrice(mr?.priceFrom ?? null, market)}</span>
                    </span>
                  </button>
                  <TLink href={`/residences/${res.slug}`} aria-label={`Open ${res.name}`} className="flex h-11 w-11 items-center justify-center border border-[var(--line)] transition-colors duration-500 hover:border-[var(--fg)] hover:bg-[var(--fg)] hover:text-[var(--bg)]">
                    <ArrowUpRight size={16} />
                  </TLink>
                </div>
              </li>
            );
          })}
        </ul>
        <div className="lg:col-span-8">
          <FloorPlanView key={r.slug} plan={r.floorPlans[0]} />
        </div>
      </div>
    </section>
  );
}
