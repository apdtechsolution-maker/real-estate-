"use client";

import Image from "next/image";
import { useMemo, useRef, useState } from "react";
import { ArrowUpRight, Download, CalendarDays, Plus } from "lucide-react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { getResidence, residences, type ResidenceSlug } from "@/config/residences";
import { useMarket } from "@/components/providers/AppProviders";
import { useSmoothScroll } from "@/components/providers/SmoothScroll";
import { formatArea, formatPrice } from "@/config/site";
import { SplitReveal } from "@/components/motion/SplitReveal";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { TLink } from "@/components/ui/TLink";
import { Magnetic } from "@/components/ui/Magnetic";
import { InquiryForm } from "@/components/forms/InquiryForm";
import { FloorPlanView } from "./FloorPlan";
import { Lightbox } from "./Lightbox";

export function ResidenceDetail({ slug }: { slug: ResidenceSlug }) {
  const r = getResidence(slug)!;
  const { market } = useMarket();
  const { scrollTo } = useSmoothScroll();
  const mr = market.residences.find((x) => x.slug === slug)!;
  const root = useRef<HTMLDivElement>(null);
  const [lightbox, setLightbox] = useState<number | null>(null);
  const [plan, setPlan] = useState(0);
  const [bedFilter, setBedFilter] = useState<number | "all">("all");
  const [openSpec, setOpenSpec] = useState(0);
  const nextRes = residences[(residences.findIndex((x) => x.slug === slug) + 1) % residences.length];

  const beds = useMemo(() => Array.from(new Set(mr.units.map((u) => u.bedrooms))).sort(), [mr]);
  const units = mr.units.filter((u) => bedFilter === "all" || u.bedrooms === bedFilter);

  useGSAP(
    () => {
      if (!root.current || prefersReducedMotion()) return;
      gsap.fromTo(".rd-hero-img", { scale: 1.3 }, { scale: 1, duration: 2.6, ease: "expo.out", delay: 0.2 });
      gsap.to(".rd-hero-img", { yPercent: 20, ease: "none", scrollTrigger: { trigger: ".rd-hero", start: "top top", end: "bottom top", scrub: true } });
      gsap.from(".rd-fade", { opacity: 0, y: 30, duration: 1.2, stagger: 0.08, delay: 0.7, ease: "expo.out" });
      gsap.utils.toArray<HTMLElement>(".rd-gal").forEach((el, i) => {
        gsap.from(el, {
          clipPath: "inset(100% 0% 0% 0%)",
          duration: 1.5,
          ease: "expo.inOut",
          delay: (i % 3) * 0.08,
          scrollTrigger: { trigger: el, start: "top 92%", toggleActions: "play none none reverse" },
        });
      });
    },
    { scope: root, dependencies: [slug] },
  );

  const enquire = () => scrollTo("#viewing", { offset: -40 });

  return (
    <div ref={root}>
      {/* Hero */}
      <section className="rd-hero relative h-[92svh] min-h-[600px] overflow-hidden bg-[#12110f] text-[#ede6d9]">
        <div className="rd-hero-img img-grade absolute inset-0 will-change-transform">
          <Image src={r.heroImage} alt={r.name} fill priority sizes="100vw" className="object-cover" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-black/40" />
        <div className="relative z-10 flex h-full flex-col justify-end px-5 pb-10 md:px-10 md:pb-14">
          <TLink href="/#residences" className="rd-fade eyebrow u-link mb-8 w-max pb-1 text-white/75">
            ← All residences
          </TLink>
          <p className="rd-fade eyebrow text-[#e3cfa6]">
            {r.index} · {r.propertyType} · {market.project.name}
          </p>
          <SplitReveal as="h1" mode="chars" play delay={0.3} className="display mt-4 text-[15vw] md:text-[9vw]">
            {r.name}
          </SplitReveal>
          <div className="mt-8 grid grid-cols-2 gap-6 border-t border-white/20 pt-6 md:grid-cols-5">
            {[
              ["Bedrooms", r.bedrooms],
              ["Bathrooms", r.bathrooms],
              ["Interior", `${formatArea(r.areaSqft.min, market)}+`],
              ["Type", r.propertyType],
              [mr.priceFrom ? "From (illustrative)" : "Pricing", formatPrice(mr.priceFrom, market)],
            ].map(([k, v]) => (
              <div key={k} className="rd-fade">
                <p className="eyebrow text-white/55">{k}</p>
                <p className="mt-1.5 font-display text-xl md:text-2xl">{v}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Intro + actions */}
      <section className="grid grid-cols-1 gap-12 px-5 py-24 md:grid-cols-12 md:px-10 md:py-32">
        <div className="md:col-span-7">
          <SplitReveal as="p" className="display text-4xl leading-[1.08] md:text-6xl">
            {r.description}
          </SplitReveal>
        </div>
        <div className="md:col-span-4 md:col-start-9">
          <ul className="border-t border-[var(--line)]">
            {r.highlights.map((h) => (
              <li key={h} className="flex items-center gap-4 border-b border-[var(--line)] py-4">
                <span className="h-1.5 w-1.5 rotate-45 bg-[var(--gold)]" />
                <span>{h}</span>
              </li>
            ))}
          </ul>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row md:flex-col lg:flex-row">
            <Magnetic>
              <button type="button" onClick={enquire} className="eyebrow inline-flex w-full items-center justify-center gap-3 bg-[var(--fg)] px-6 py-4 text-[var(--bg)] transition-colors duration-500 hover:bg-[var(--gold)] hover:text-[#1b1a17]">
                <CalendarDays size={15} strokeWidth={1.5} /> Schedule a Private Viewing
              </button>
            </Magnetic>
            <a
              href={`/residences/${slug}/brochure`}
              target="_blank"
              rel="noopener"
              className="eyebrow inline-flex items-center justify-center gap-3 border border-[var(--fg)] px-6 py-4 transition-colors duration-500 hover:bg-[var(--fg)] hover:text-[var(--bg)]"
            >
              <Download size={15} strokeWidth={1.5} /> Brochure
            </a>
          </div>
        </div>
      </section>

      {/* Gallery */}
      <section aria-labelledby="gal-title" className="px-5 pb-24 md:px-10 md:pb-32">
        <div className="mb-10 flex items-end justify-between">
          <SectionLabel index="A" label="Gallery" />
          <h2 id="gal-title" className="sr-only">
            Gallery
          </h2>
          <span className="eyebrow text-[var(--muted)]">{r.gallery.length} images · tap to enlarge</span>
        </div>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-12 md:gap-5">
          {r.gallery.map((g, i) => {
            const layout = ["col-span-2 md:col-span-8 aspect-[16/10]", "md:col-span-4 aspect-[3/4] md:aspect-auto", "md:col-span-4 aspect-[3/4]", "md:col-span-4 aspect-[3/4]", "col-span-2 md:col-span-4 aspect-[16/10] md:aspect-[3/4]", "col-span-2 md:col-span-12 aspect-[16/7]"][i % 6];
            return (
              <button key={g.src + i} type="button" onClick={() => setLightbox(i)} data-cursor="View" className={`rd-gal img-grade group relative overflow-hidden ${layout}`} aria-label={`Open image: ${g.caption}`}>
                <Image src={g.src} alt={g.alt} fill sizes="(min-width:768px) 50vw, 100vw" className="object-cover transition-transform duration-[1600ms] [transition-timing-function:cubic-bezier(0.19,1,0.22,1)] group-hover:scale-105" />
                <span className="absolute bottom-3 left-3 bg-[var(--bg)] px-2.5 py-1.5 eyebrow opacity-0 transition-opacity duration-500 group-hover:opacity-100 group-focus-visible:opacity-100">{g.caption}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Floor plans */}
      <section aria-labelledby="fp-title" className="bg-[var(--bg-2)] px-5 py-24 md:px-10 md:py-32">
        <div className="mb-10 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <SectionLabel index="B" label="Floor plans" />
            <SplitReveal as="h2" id="fp-title" className="display mt-8 text-5xl md:text-7xl">
              Plans drawn around light.
            </SplitReveal>
          </div>
          <div role="tablist" aria-label="Floor plans" className="flex gap-2">
            {r.floorPlans.map((p, i) => (
              <button key={p.id} role="tab" aria-selected={plan === i} type="button" onClick={() => setPlan(i)} className={`eyebrow border px-4 py-3 transition-colors duration-500 ${plan === i ? "border-[var(--fg)] bg-[var(--fg)] text-[var(--bg)]" : "border-[var(--line)] hover:border-[var(--fg)]"}`}>
                {p.name}
              </button>
            ))}
          </div>
        </div>
        <FloorPlanView key={r.floorPlans[plan].id} plan={r.floorPlans[plan]} />
      </section>

      {/* Specifications */}
      <section aria-labelledby="spec-title" className="grid grid-cols-1 gap-12 px-5 py-24 md:grid-cols-12 md:px-10 md:py-32">
        <div className="md:col-span-4">
          <SectionLabel index="C" label="Specifications" />
          <SplitReveal as="h2" id="spec-title" className="display mt-8 text-5xl md:text-6xl">
            Every surface, considered.
          </SplitReveal>
        </div>
        <div className="md:col-span-7 md:col-start-6">
          {r.specifications.map((g, gi) => (
            <div key={g.group} className="border-t border-[var(--line)] last:border-b">
              <button type="button" aria-expanded={openSpec === gi} onClick={() => setOpenSpec(openSpec === gi ? -1 : gi)} className="flex w-full items-center justify-between py-6 text-left">
                <span className="font-display text-3xl">{g.group}</span>
                <Plus size={18} strokeWidth={1.25} className={`transition-transform duration-700 ${openSpec === gi ? "rotate-45" : ""}`} />
              </button>
              <div className={`grid transition-[grid-template-rows] duration-700 [transition-timing-function:cubic-bezier(0.19,1,0.22,1)] ${openSpec === gi ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
                <dl className="overflow-hidden">
                  <div className="grid grid-cols-1 gap-x-10 gap-y-5 pb-8 sm:grid-cols-2">
                    {g.items.map((it) => (
                      <div key={it.label}>
                        <dt className="eyebrow text-[var(--muted)]">{it.label}</dt>
                        <dd className="mt-1.5">{it.value}</dd>
                      </div>
                    ))}
                  </div>
                </dl>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Units */}
      <section aria-labelledby="units-title" className="px-5 pb-24 md:px-10 md:pb-32">
        <div className="mb-8 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <SectionLabel index="D" label="Available units" />
            <SplitReveal as="h2" id="units-title" className="display mt-8 text-5xl md:text-6xl">
              Current availability.
            </SplitReveal>
          </div>
          <div role="group" aria-label="Filter by bedrooms" className="flex flex-wrap gap-2">
            {(["all", ...beds] as const).map((b) => (
              <button key={String(b)} type="button" aria-pressed={bedFilter === b} onClick={() => setBedFilter(b)} className={`eyebrow border px-4 py-3 transition-colors duration-500 ${bedFilter === b ? "border-[var(--fg)] bg-[var(--fg)] text-[var(--bg)]" : "border-[var(--line)] hover:border-[var(--fg)]"}`}>
                {b === "all" ? "All" : `${b} Bed`}
              </button>
            ))}
          </div>
        </div>
        <div className="overflow-x-auto" data-lenis-prevent-wheel>
          <table className="w-full min-w-[720px] text-left">
            <caption className="sr-only">Available units for {r.name}</caption>
            <thead>
              <tr className="eyebrow border-b border-[var(--fg)] text-[var(--muted)]">
                {["Unit", "Level", "Plan", "Beds", "Area", "View", "Status", "Price", ""].map((h) => (
                  <th key={h} scope="col" className="py-4 pr-4 font-normal">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {units.map((u) => (
                <tr key={u.id} className="group border-b border-[var(--line)] transition-colors duration-500 hover:bg-[var(--bg-2)]">
                  <td className="py-5 pr-4 font-display text-xl">{u.id}</td>
                  <td className="py-5 pr-4">{u.level}</td>
                  <td className="py-5 pr-4">{u.planId}</td>
                  <td className="py-5 pr-4">{u.bedrooms}</td>
                  <td className="py-5 pr-4">{formatArea(u.areaSqft, market)}</td>
                  <td className="py-5 pr-4">{u.view}</td>
                  <td className="py-5 pr-4">
                    <span className={`eyebrow inline-flex items-center gap-2 ${u.status === "Available" ? "text-[var(--olive)]" : u.status === "Reserved" ? "text-[var(--muted)]" : ""}`}>
                      <span className={`h-1.5 w-1.5 rounded-full ${u.status === "Available" ? "bg-[var(--olive)]" : u.status === "Reserved" ? "bg-[var(--muted)]" : "bg-[var(--gold)]"}`} />
                      {u.status}
                    </span>
                  </td>
                  <td className="py-5 pr-4 font-display text-lg">{u.status === "Reserved" ? "—" : formatPrice(u.price, market)}</td>
                  <td className="py-5 text-right">
                    {u.status !== "Reserved" && (
                      <button type="button" onClick={enquire} className="eyebrow u-link pb-1">
                        Enquire
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-5 text-xs text-[var(--muted)]">Illustrative demo inventory. Prices exclude taxes and statutory charges and are subject to change.</p>
      </section>

      {/* Viewing */}
      <section id="viewing" aria-labelledby="viewing-title" className="grid grid-cols-1 gap-14 bg-[var(--bg-2)] px-5 py-24 md:px-10 md:py-32 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <SectionLabel index="E" label="Private viewing" />
          <SplitReveal as="h2" id="viewing-title" className="display mt-8 text-5xl md:text-7xl">
            See {r.shortName === "Villa" ? "the villas" : `the ${r.shortName.toLowerCase()}s`} in person.
          </SplitReveal>
          <p className="mt-8 max-w-md leading-relaxed text-[var(--muted)]">
            Our private office arranges unhurried, one-to-one {market.id === "usa" ? "tours" : "viewings"} of the show residence and sales gallery, or a live video walkthrough if you are abroad.
          </p>
        </div>
        <div className="lg:col-span-6 lg:col-start-7">
          <InquiryForm key={`${slug}-${market.id}`} defaultInterest={slug} source={`residence:${slug}`} />
        </div>
      </section>

      {/* Next */}
      <TLink href={`/residences/${nextRes.slug}`} data-cursor="Next" className="group relative block h-[70svh] overflow-hidden bg-[#12110f] text-[#ede6d9]">
        <Image src={nextRes.heroImage} alt={nextRes.name} fill sizes="100vw" className="object-cover opacity-60 transition-[transform,opacity] duration-[1800ms] [transition-timing-function:cubic-bezier(0.19,1,0.22,1)] group-hover:scale-105 group-hover:opacity-80" />
        <div className="relative z-10 flex h-full flex-col items-center justify-center text-center">
          <span className="eyebrow">Next residence</span>
          <span className="display mt-6 text-[13vw] md:text-[8vw]">{nextRes.name}</span>
          <ArrowUpRight className="mt-6 transition-transform duration-700 group-hover:rotate-45" />
        </div>
      </TLink>

      <Lightbox images={r.gallery} index={lightbox} onClose={() => setLightbox(null)} onIndex={setLightbox} />
    </div>
  );
}
