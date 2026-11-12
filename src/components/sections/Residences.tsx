"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { ArrowUpRight, Bath, BedDouble, Maximize, Building2 } from "lucide-react";
import { gsap, useGSAP, prefersReducedMotion, ScrollTrigger } from "@/lib/gsap";
import { residences } from "@/config/residences";
import { useMarket } from "@/components/providers/AppProviders";
import { useSmoothScroll } from "@/components/providers/SmoothScroll";
import { formatArea, formatPrice } from "@/config/site";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { TLink } from "@/components/ui/TLink";
import { Magnetic } from "@/components/ui/Magnetic";

export function Residences() {
  const { market } = useMarket();
  const { scrollTo } = useSmoothScroll();
  const root = useRef<HTMLElement>(null);
  const stRef = useRef<ScrollTrigger | null>(null);
  const [active, setActive] = useState(0);
  const activeRef = useRef(0);

  useGSAP(
    () => {
      if (!root.current || prefersReducedMotion()) return;
      const mm = gsap.matchMedia();
      mm.add("(min-width: 1024px)", () => {
        stRef.current = ScrollTrigger.create({
          trigger: root.current,
          start: "top top",
          end: "+=220%",
          pin: true,
          anticipatePin: 1,
          onUpdate: (self) => {
            const i = Math.min(residences.length - 1, Math.floor(self.progress * residences.length * 0.999));
            if (i !== activeRef.current) {
              activeRef.current = i;
              setActive(i);
            }
            gsap.set(".res-progress", { scaleY: self.progress });
          },
        });
        return () => {
          stRef.current = null;
        };
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  // Animate details on change
  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      gsap.fromTo(".res-detail", { yPercent: 100, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 1.1, ease: "expo.out", stagger: 0.05 });
    },
    { scope: root, dependencies: [active, market.id] },
  );

  const select = (i: number) => {
    const st = stRef.current;
    if (st) {
      const y = st.start + ((i + 0.5) / residences.length) * (st.end - st.start);
      scrollTo(y);
    } else {
      activeRef.current = i;
      setActive(i);
    }
  };

  const r = residences[active];
  const mr = market.residences.find((x) => x.slug === r.slug);

  return (
    <section ref={root} id="residences" aria-labelledby="res-title" className="relative h-[100svh] min-h-[680px] overflow-hidden bg-[#12110f] text-[#ede6d9]">
      {residences.map((res, i) => (
        <div
          key={res.slug}
          className="img-grade absolute inset-0 transition-[clip-path] duration-[1400ms] [transition-timing-function:cubic-bezier(0.76,0,0.24,1)]"
          style={{ clipPath: active === i ? "inset(0% 0% 0% 0%)" : i > active ? "inset(0% 0% 0% 100%)" : "inset(0% 100% 0% 0%)", zIndex: active === i ? 2 : 1 }}
          aria-hidden={active !== i}
        >
          <Image src={res.heroImage} alt={res.name} fill loading="eager" sizes="100vw" className={`object-cover transition-transform duration-[2200ms] [transition-timing-function:cubic-bezier(0.19,1,0.22,1)] ${active === i ? "scale-100" : "scale-[1.18]"}`} />
        </div>
      ))}
      <div className="pointer-events-none absolute inset-0 z-[3] bg-gradient-to-r from-black/75 via-black/35 to-black/10" />
      <div className="pointer-events-none absolute inset-0 z-[3] bg-gradient-to-t from-black/70 via-transparent to-black/30" />

      <div className="relative z-[4] flex h-full flex-col justify-between px-5 pb-8 pt-24 md:px-10 md:pb-12 md:pt-28">
        <div className="flex items-center justify-between">
          <SectionLabel index="05" label="Residences Collection" light />
          <span className="eyebrow hidden text-white/60 md:block">Pricing & availability illustrative</span>
        </div>

        <div className="grid grid-cols-1 items-end gap-10 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <h2 id="res-title" className="sr-only">
              Residences Collection
            </h2>
            <ul role="tablist" aria-label="Residence collections" className="space-y-1">
              {residences.map((res, i) => (
                <li key={res.slug}>
                  <button
                    type="button"
                    role="tab"
                    aria-selected={active === i}
                    onClick={() => select(i)}
                    className="group flex items-baseline gap-4 text-left md:gap-6"
                  >
                    <span className={`eyebrow transition-colors duration-700 ${active === i ? "text-[#cdb27e]" : "text-white/40"}`}>{res.index}</span>
                    <span
                      className={`display text-[11vw] leading-[1] transition-[opacity,transform,color] duration-1000 [transition-timing-function:cubic-bezier(0.19,1,0.22,1)] sm:text-[8vw] lg:text-[5.6vw] ${
                        active === i ? "translate-x-0 opacity-100" : "opacity-30 group-hover:opacity-70 lg:-translate-x-2"
                      }`}
                    >
                      {res.name}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-5">
            <div className="overflow-hidden">
              <p className="res-detail font-display text-2xl italic text-[#e3cfa6] md:text-3xl">{r.tagline}</p>
            </div>
            <dl className="mt-8 grid grid-cols-2 gap-x-6 gap-y-5 border-t border-white/20 pt-6 text-sm">
              {[
                { icon: Building2, k: "Type", v: r.propertyType },
                { icon: BedDouble, k: "Bedrooms", v: r.bedrooms },
                { icon: Bath, k: "Bathrooms", v: r.bathrooms },
                { icon: Maximize, k: "Area", v: `${formatArea(r.areaSqft.min, market)} – ${new Intl.NumberFormat(market.currency.locale).format(r.areaSqft.max)}` },
              ].map(({ icon: Icon, k, v }) => (
                <div key={k} className="overflow-hidden">
                  <div className="res-detail">
                    <dt className="eyebrow flex items-center gap-2 text-white/55">
                      <Icon size={12} strokeWidth={1.5} /> {k}
                    </dt>
                    <dd className="mt-1.5 text-base">{v}</dd>
                  </div>
                </div>
              ))}
            </dl>
            <div className="mt-8 flex flex-wrap items-center justify-between gap-6 border-t border-white/20 pt-6">
              <div className="overflow-hidden">
                <div className="res-detail">
                  <p className="eyebrow text-white/55">{mr?.priceFrom ? "From (illustrative)" : "Pricing"}</p>
                  <p className="mt-1 font-display text-3xl">{formatPrice(mr?.priceFrom ?? null, market)}</p>
                </div>
              </div>
              <Magnetic>
                <TLink
                  href={`/residences/${r.slug}`}
                  data-cursor="Explore"
                  className="group inline-flex items-center gap-3 bg-[#ede6d9] px-6 py-4 text-[#1b1a17] transition-colors duration-500 hover:bg-[#cdb27e]"
                >
                  <span className="eyebrow">Explore Residence</span>
                  <ArrowUpRight size={16} className="transition-transform duration-500 group-hover:rotate-45" />
                </TLink>
              </Magnetic>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute right-4 top-1/2 z-[4] hidden h-40 w-px -translate-y-1/2 bg-white/20 lg:block md:right-10">
        <div className="res-progress h-full w-full origin-top scale-y-0 bg-[#cdb27e]" />
      </div>
    </section>
  );
}
