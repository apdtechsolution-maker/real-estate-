"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { gsap, useGSAP, prefersReducedMotion, ScrollTrigger } from "@/lib/gsap";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { SplitReveal } from "@/components/motion/SplitReveal";
import { ParallaxImage } from "@/components/motion/ParallaxImage";

const materials = [
  { name: "Travertine", origin: "Honed, vein-cut stone", img: "/images/material-detail.jpg", text: "Warm, porous and quietly luminous — used for facades, floors and the long horizontal planes that define the silhouette." },
  { name: "Fluted Oak", origin: "FSC-certified European oak", img: "/images/residence-interior.jpg", text: "Rhythmic fluting brings softness and acoustic warmth to joinery, wardrobes and kitchens." },
  { name: "Bronze", origin: "Brushed architectural bronze", img: "/images/facade-3.jpg", text: "Slim window frames and handles in bronze that will develop a soft patina over time." },
  { name: "Lime Plaster", origin: "Hand-applied mineral finish", img: "/images/int-light.jpg", text: "Breathable, matte walls that catch the light in subtle gradients throughout the day." },
];

export function Architecture() {
  const root = useRef<HTMLElement>(null);
  const [mat, setMat] = useState(0);

  useGSAP(
    () => {
      if (!root.current || prefersReducedMotion()) return;
      // Directional oversized type, scrubbed + velocity-skewed
      gsap.fromTo(".arch-l1", { xPercent: 8 }, { xPercent: -18, ease: "none", scrollTrigger: { trigger: ".arch-type", start: "top bottom", end: "bottom top", scrub: true } });
      gsap.fromTo(".arch-l2", { xPercent: -22 }, { xPercent: 6, ease: "none", scrollTrigger: { trigger: ".arch-type", start: "top bottom", end: "bottom top", scrub: true } });
      const skew = gsap.quickTo(".arch-type", "skewX", { duration: 0.6, ease: "power3" });
      ScrollTrigger.create({
        trigger: ".arch-type",
        start: "top bottom",
        end: "bottom top",
        onUpdate: (self) => skew(gsap.utils.clamp(-6, 6, self.getVelocity() / -400)),
        onLeave: () => skew(0),
        onLeaveBack: () => skew(0),
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} id="architecture" aria-labelledby="arch-title" className="relative overflow-hidden bg-[var(--bg-2)] py-28 md:py-40">
      <div className="px-5 md:px-10">
        <SectionLabel index="04" label="Architecture" />
      </div>

      <h2 id="arch-title" className="arch-type mt-14 select-none whitespace-nowrap will-change-transform" aria-label="Stone, light and bronze">
        <span className="arch-l1 display block text-[22vw] md:text-[15vw]" aria-hidden>
          Stone, light &amp;
        </span>
        <span className="arch-l2 display block pl-[20vw] text-[22vw] italic text-[var(--gold)] md:text-[15vw]" aria-hidden>
          bronze — in balance
        </span>
      </h2>

      <div className="mt-16 px-5 md:mt-24 md:px-10">
        <ParallaxImage src="/images/hero-render-day.jpg" alt="Cantilevered travertine volumes above an infinity pool" className="aspect-[4/5] w-full sm:aspect-[16/8]" reveal="center" cursor="View" />
        <div className="mt-6 flex flex-col justify-between gap-2 text-sm text-[var(--muted)] md:flex-row">
          <span>Cantilevered pavilions · south-west elevation</span>
          <span>Render — illustrative</span>
        </div>
      </div>

      <div className="mt-28 grid grid-cols-1 gap-16 px-5 md:grid-cols-12 md:px-10">
        <div className="md:col-span-5">
          <SplitReveal as="h3" className="display text-5xl md:text-7xl">
            A palette chosen to age beautifully.
          </SplitReveal>
          <SplitReveal as="p" className="mt-8 max-w-md leading-relaxed text-[var(--muted)]">
            Long horizontal planes, deep shadow lines and a restrained palette of four materials. Nothing is applied — every surface is the material itself.
          </SplitReveal>
          <ul className="mt-12 border-t border-[var(--line)]" role="tablist" aria-label="Materials">
            {materials.map((m, i) => (
              <li key={m.name} className="border-b border-[var(--line)]">
                <button
                  type="button"
                  role="tab"
                  aria-selected={mat === i}
                  onMouseEnter={() => setMat(i)}
                  onFocus={() => setMat(i)}
                  onClick={() => setMat(i)}
                  className="group grid w-full grid-cols-[2.5rem_1fr_auto] items-baseline gap-4 py-6 text-left"
                >
                  <span className="eyebrow text-[var(--gold)]">0{i + 1}</span>
                  <span>
                    <span className={`block font-display text-3xl transition-all duration-700 md:text-4xl ${mat === i ? "translate-x-3 italic" : "opacity-60"}`}>{m.name}</span>
                    <span className={`grid transition-[grid-template-rows,opacity] duration-700 ${mat === i ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}>
                      <span className="overflow-hidden">
                        <span className="block max-w-sm pt-3 text-sm leading-relaxed text-[var(--muted)]">{m.text}</span>
                      </span>
                    </span>
                  </span>
                  <span className="eyebrow hidden text-[var(--muted)] sm:block">{m.origin}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
        <div className="md:col-span-6 md:col-start-7">
          <div className="img-grade relative aspect-[4/5] w-full overflow-hidden md:sticky md:top-28">
            {materials.map((m, i) => (
              <div
                key={m.name}
                className="absolute inset-0 transition-[clip-path] duration-[1300ms] [transition-timing-function:cubic-bezier(0.76,0,0.24,1)]"
                style={{ clipPath: mat === i ? "inset(0% 0% 0% 0%)" : i > mat ? "inset(100% 0% 0% 0%)" : "inset(0% 0% 100% 0%)", zIndex: mat === i ? 2 : 1 }}
              >
                <Image src={m.img} alt={`${m.name} material study`} fill sizes="(min-width:768px) 45vw, 100vw" className={`object-cover transition-transform duration-[1800ms] ${mat === i ? "scale-100" : "scale-125"}`} />
              </div>
            ))}
            <span className="absolute bottom-5 left-5 z-10 bg-[var(--bg)] px-3 py-2 eyebrow">{materials[mat].name}</span>
          </div>
        </div>
      </div>

      <div className="mt-28 grid grid-cols-12 gap-4 px-5 md:gap-6 md:px-10">
        <ParallaxImage src="/images/facade-2.jpg" alt="Concrete facade detail against blue sky" className="col-span-7 aspect-[3/4] md:col-span-4" sizes="33vw" reveal="up" speed={18} />
        <ParallaxImage src="/images/vision-2.jpg" alt="Facade of contemporary villa with lawn and trees" className="col-span-12 order-first aspect-[16/10] md:order-none md:col-span-8 md:mt-32" sizes="(min-width:768px) 66vw, 100vw" reveal="left" />
      </div>
    </section>
  );
}
