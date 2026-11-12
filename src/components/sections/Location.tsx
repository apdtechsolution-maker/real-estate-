"use client";

import { useMemo, useRef, useState } from "react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { useMarket } from "@/components/providers/AppProviders";
import type { PointOfInterest } from "@/config/markets";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { SplitReveal } from "@/components/motion/SplitReveal";
import { ParallaxImage } from "@/components/motion/ParallaxImage";
import { Counter } from "@/components/motion/Counter";

const SITE = { x: 42, y: 44 };
const CATS = ["All", "Business", "Leisure", "Culture", "Travel", "Wellness", "Education"] as const;

function LocationMap() {
  const { market } = useMarket();
  const [cat, setCat] = useState<(typeof CATS)[number]>("All");
  const [active, setActive] = useState<string | null>(null);
  const ref = useRef<HTMLDivElement>(null);
  const pois = useMemo(
    () => market.location.pois.filter((p) => cat === "All" || p.category === cat),
    [market, cat],
  );
  const current: PointOfInterest | undefined = market.location.pois.find((p) => p.id === active);
  const available = CATS.filter((c) => c === "All" || market.location.pois.some((p) => p.category === c));

  useGSAP(
    () => {
      if (!ref.current || prefersReducedMotion()) return;
      gsap.from(".map-marker", { scale: 0, opacity: 0, duration: 0.9, ease: "back.out(2)", stagger: 0.06, scrollTrigger: { trigger: ref.current, start: "top 75%" } });
      gsap.from(".map-road", { strokeDashoffset: 1, duration: 2.4, ease: "power2.inOut", stagger: 0.08, scrollTrigger: { trigger: ref.current, start: "top 80%" } });
    },
    { scope: ref, dependencies: [market.id, cat], revertOnUpdate: true },
  );

  return (
    <div ref={ref} className="grid grid-cols-1 gap-10 lg:grid-cols-12">
      <div className="relative aspect-square w-full overflow-hidden border border-[var(--line)] bg-[var(--bg-2)] sm:aspect-[4/3] lg:col-span-8" data-cursor="hide">
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full" aria-hidden>
          <defs>
            <pattern id="grid" width="6" height="6" patternUnits="userSpaceOnUse">
              <path d="M6 0H0V6" fill="none" stroke="var(--line)" strokeWidth="0.15" />
            </pattern>
          </defs>
          <rect width="100" height="100" fill="url(#grid)" />
          <path d="M0 0 H22 C30 18 18 30 26 46 C34 62 22 76 30 100 H0 Z" fill="var(--stone)" opacity="0.45" />
          <text x="6" y="60" fontSize="2.4" fill="var(--muted)" letterSpacing="0.6" transform="rotate(-90 6 60)">
            {market.location.water.toUpperCase()}
          </text>
          {[
            "M26 46 C40 40 55 30 100 22",
            "M28 70 C45 64 60 66 100 72",
            "M42 0 C44 30 40 60 46 100",
            "M60 0 C58 40 70 70 66 100",
            "M30 26 C50 24 70 12 90 4",
          ].map((d, i) => (
            <path key={i} className="map-road" d={d} fill="none" stroke="var(--fg)" strokeOpacity="0.25" strokeWidth="0.35" pathLength={1} strokeDasharray="1" />
          ))}
          {current && (
            <line
              key={current.id}
              x1={SITE.x}
              y1={SITE.y}
              x2={current.x}
              y2={current.y}
              stroke="var(--gold)"
              strokeWidth="0.4"
              strokeDasharray="1.2 1"
              className="transition-opacity"
            />
          )}
        </svg>

        {/* Site marker */}
        <div className="absolute -translate-x-1/2 -translate-y-1/2" style={{ left: `${SITE.x}%`, top: `${SITE.y}%` }}>
          <span className="pulse-ring absolute inset-0 rounded-full bg-[var(--gold)]" />
          <span className="relative block h-4 w-4 rounded-full border-2 border-[var(--bg)] bg-[var(--gold)]" />
          <span className="absolute left-6 top-1/2 -translate-y-1/2 whitespace-nowrap bg-[var(--fg)] px-3 py-1.5 font-display text-sm text-[var(--bg)]">
            {market.project.name}
          </span>
        </div>

        {pois.map((p) => (
          <button
            key={p.id}
            type="button"
            className="map-marker group absolute -translate-x-1/2 -translate-y-1/2 p-2"
            style={{ left: `${p.x}%`, top: `${p.y}%` }}
            onMouseEnter={() => setActive(p.id)}
            onFocus={() => setActive(p.id)}
            onClick={() => setActive(p.id)}
            aria-label={`${p.name}, approximately ${p.time}`}
          >
            <span className={`block h-2.5 w-2.5 rotate-45 border border-[var(--fg)] transition-all duration-500 ${active === p.id ? "scale-150 bg-[var(--gold)]" : "bg-[var(--bg)]"}`} />
          </button>
        ))}

        <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-4">
          <div className={`bg-[var(--bg)] px-4 py-3 transition-all duration-700 ${current ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}`} aria-live="polite">
            {current && (
              <>
                <p className="eyebrow text-[var(--gold)]">{current.category}</p>
                <p className="mt-1 font-display text-xl">{current.name}</p>
                <p className="text-sm text-[var(--muted)]">≈ {current.time} by car</p>
              </>
            )}
          </div>
          <p className="hidden text-[10px] text-[var(--muted)] sm:block">Stylised map · times approximate & illustrative</p>
        </div>
      </div>

      <div className="lg:col-span-4">
        <div className="flex flex-wrap gap-2" role="group" aria-label="Filter places">
          {available.map((c) => (
            <button
              key={c}
              type="button"
              aria-pressed={cat === c}
              onClick={() => setCat(c)}
              className={`eyebrow border px-3 py-2 transition-colors duration-500 ${cat === c ? "border-[var(--fg)] bg-[var(--fg)] text-[var(--bg)]" : "border-[var(--line)] hover:border-[var(--fg)]"}`}
            >
              {c}
            </button>
          ))}
        </div>
        <ul className="mt-8 divide-y divide-[var(--line)] border-y border-[var(--line)]">
          {pois.map((p) => (
            <li key={p.id}>
              <button
                type="button"
                onMouseEnter={() => setActive(p.id)}
                onFocus={() => setActive(p.id)}
                onClick={() => setActive(p.id)}
                className="group flex w-full items-baseline justify-between gap-4 py-4 text-left"
              >
                <span className={`font-display text-2xl transition-transform duration-700 group-hover:translate-x-2 ${active === p.id ? "text-[var(--gold)]" : ""}`}>{p.name}</span>
                <span className="eyebrow shrink-0 text-[var(--muted)]">{p.time}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export function Location() {
  const { market } = useMarket();
  return (
    <section id="location" aria-labelledby="location-title" className="relative bg-[var(--bg)] py-28 md:py-40">
      <div className="px-5 md:px-10">
        <SectionLabel index="03" label="Location & Lifestyle" />
        <div className="mt-14 grid grid-cols-1 gap-10 md:grid-cols-12">
          <SplitReveal key={market.id} as="h2" id="location-title" className="display text-[11vw] md:col-span-8 md:text-[6vw]">
            {market.location.headline}
          </SplitReveal>
          <div className="md:col-span-4 md:pt-4">
            <SplitReveal key={`${market.id}-s`} as="p" className="leading-relaxed text-[var(--muted)]">
              {market.location.story}
            </SplitReveal>
            <p className="eyebrow mt-6">
              {market.project.neighbourhood} · {market.project.city}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-20 grid grid-cols-12 gap-4 px-5 md:mt-28 md:gap-6 md:px-10">
        <ParallaxImage src="/images/seaside.jpg" alt="Contemporary seaside villas with gardens and ocean view" className="col-span-12 aspect-[16/10] md:col-span-8 md:aspect-[16/9]" sizes="(min-width:768px) 66vw, 100vw" reveal="right" />
        <div className="col-span-12 flex flex-col justify-between gap-6 md:col-span-4">
          <ParallaxImage src="/images/city-sunset.jpg" alt="City rooftops at sunset" className="aspect-[4/5] w-full md:mt-24" sizes="(min-width:768px) 33vw, 100vw" speed={24} reveal="up" />
        </div>
      </div>

      <div className="mt-20 grid grid-cols-1 gap-10 px-5 sm:grid-cols-3 md:px-10">
        {market.location.stats.map((s) => (
          <div key={`${market.id}-${s.label}`} className="border-t border-[var(--line)] pt-6">
            <Counter value={s.value} suffix={s.suffix} className="display block text-6xl md:text-7xl" />
            <p className="eyebrow mt-3 text-[var(--muted)]">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="mt-24 px-5 md:mt-32 md:px-10">
        <div className="mb-10 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <SplitReveal as="h3" className="display text-5xl md:text-6xl">
            The neighbourhood, mapped.
          </SplitReveal>
          <p className="max-w-sm text-sm text-[var(--muted)]">Hover, tap or tab through the places that shape daily life around {market.project.name}.</p>
        </div>
        <LocationMap />
      </div>
    </section>
  );
}
