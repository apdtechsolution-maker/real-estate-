"use client";

import Image from "next/image";
import { Download, ArrowLeft } from "lucide-react";
import { getResidence, type ResidenceSlug } from "@/config/residences";
import { useMarket } from "@/components/providers/AppProviders";
import { formatArea, formatPrice, site } from "@/config/site";
import { Logo } from "@/components/ui/Logo";
import { FloorPlanView } from "@/components/residence/FloorPlan";

export function BrochureView({ slug }: { slug: ResidenceSlug }) {
  const r = getResidence(slug)!;
  const { market } = useMarket();
  const mr = market.residences.find((m) => m.slug === slug)!;

  return (
    <div className="min-h-screen bg-[#e9e3d8] py-10 print:bg-white print:py-0">
      <div className="no-print mx-auto mb-8 flex max-w-[900px] items-center justify-between px-5">
        <a href={`/residences/${slug}`} className="eyebrow inline-flex items-center gap-2 text-[#1b1a17]">
          <ArrowLeft size={14} /> Back to residence
        </a>
        <button type="button" onClick={() => window.print()} className="eyebrow inline-flex items-center gap-3 bg-[#1b1a17] px-5 py-3 text-[#f3eee5]">
          <Download size={14} /> Download PDF
        </button>
      </div>

      <article className="mx-auto max-w-[900px] bg-[#f6f2ea] text-[#1b1a17] shadow-xl print:max-w-none print:shadow-none">
        <section className="relative flex aspect-[1/1.3] flex-col justify-between overflow-hidden p-10 text-[#f3eee5] [break-after:page]">
          <Image src={r.heroImage} alt={r.name} fill priority sizes="900px" className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/70" />
          <div className="relative flex items-center gap-3">
            <Logo className="h-9 w-9 text-[#e3cfa6]" />
            <span className="font-display tracking-[0.4em] uppercase">Aurelia Estates</span>
          </div>
          <div className="relative">
            <p className="eyebrow text-[#e3cfa6]">
              {market.project.name} · {market.project.city}
            </p>
            <h1 className="display mt-4 text-7xl">{r.name}</h1>
            <p className="mt-4 max-w-md font-display text-2xl italic">{r.tagline}</p>
          </div>
        </section>

        <section className="p-10 [break-after:page]">
          <p className="display text-3xl leading-snug">{r.description}</p>
          <dl className="mt-10 grid grid-cols-3 gap-6 border-t border-black/15 pt-6">
            {[
              ["Type", r.propertyType],
              ["Bedrooms", r.bedrooms],
              ["Bathrooms", r.bathrooms],
              ["Interior", `${formatArea(r.areaSqft.min, market)} – ${r.areaSqft.max.toLocaleString("en-US")}`],
              [mr.priceFrom ? "From (illustrative)" : "Pricing", formatPrice(mr.priceFrom, market)],
              ["Address", market.project.address],
            ].map(([k, v]) => (
              <div key={k}>
                <dt className="eyebrow text-black/50">{k}</dt>
                <dd className="mt-1">{v}</dd>
              </div>
            ))}
          </dl>
          <div className="mt-10 grid grid-cols-3 gap-3">
            {r.gallery.slice(0, 6).map((g) => (
              <div key={g.src} className="relative aspect-[4/5] overflow-hidden">
                <Image src={g.src} alt={g.alt} fill sizes="300px" className="object-cover" />
              </div>
            ))}
          </div>
        </section>

        <section className="p-10 [break-after:page]">
          <h2 className="display text-5xl">Floor plans</h2>
          <div className="mt-8 space-y-12">
            {r.floorPlans.map((p) => (
              <div key={p.id}>
                <p className="eyebrow mb-4">{p.name}</p>
                <FloorPlanView plan={p} />
              </div>
            ))}
          </div>
        </section>

        <section className="p-10">
          <h2 className="display text-5xl">Specifications</h2>
          <div className="mt-8 grid grid-cols-2 gap-10">
            {r.specifications.map((g) => (
              <div key={g.group}>
                <p className="eyebrow mb-4 text-[#9c7f4f]">{g.group}</p>
                <dl className="space-y-3">
                  {g.items.map((it) => (
                    <div key={it.label} className="border-b border-black/10 pb-3">
                      <dt className="eyebrow text-black/50">{it.label}</dt>
                      <dd className="mt-1">{it.value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            ))}
          </div>
          <div className="mt-14 border-t border-black/15 pt-6 text-xs leading-relaxed text-black/60">
            <p>
              Private office: {market.phone.display} · {market.email}
            </p>
            <p className="mt-2">{site.disclaimer}</p>
            {market.compliance.map((c) => (
              <p key={c} className="mt-1">
                {c}
              </p>
            ))}
          </div>
        </section>
      </article>
    </div>
  );
}
