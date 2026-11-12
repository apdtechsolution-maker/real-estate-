"use client";

import Image from "next/image";
import { useRef } from "react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { ScrubWords } from "@/components/motion/ScrubWords";
import { SplitReveal } from "@/components/motion/SplitReveal";
import { ParallaxImage } from "@/components/motion/ParallaxImage";
import { Counter } from "@/components/motion/Counter";

export function Vision() {
  const pinRef = useRef<HTMLDivElement>(null);

  // Pinned frame that opens from a small window to full-bleed (ERA-style).
  useGSAP(
    () => {
      const el = pinRef.current;
      if (!el || prefersReducedMotion()) return;
      const mm = gsap.matchMedia();
      mm.add({ desktop: "(min-width: 768px)", mobile: "(max-width: 767px)" }, (c) => {
        const desktop = c.conditions?.desktop;
        const tl = gsap.timeline({
          scrollTrigger: { trigger: el, start: "top top", end: desktop ? "+=160%" : "+=110%", scrub: 0.8, pin: true, anticipatePin: 1 },
        });
        tl.fromTo(
          ".vf-frame",
          { clipPath: desktop ? "inset(22% 34% 22% 34%)" : "inset(26% 14% 26% 14%)" },
          { clipPath: "inset(0% 0% 0% 0%)", ease: "power2.inOut", duration: 1 },
        )
          .fromTo(".vf-img", { scale: 1.45 }, { scale: 1, ease: "power2.inOut", duration: 1 }, 0)
          .fromTo(".vf-left", { xPercent: 0 }, { xPercent: -60, opacity: 0, ease: "power2.in", duration: 0.6 }, 0)
          .fromTo(".vf-right", { xPercent: 0 }, { xPercent: 60, opacity: 0, ease: "power2.in", duration: 0.6 }, 0)
          .fromTo(".vf-caption", { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.35 }, 0.7);
      });
      return () => mm.revert();
    },
    { scope: pinRef },
  );

  return (
    <section id="vision" aria-labelledby="vision-title" className="relative bg-[var(--bg)]">
      <div className="px-5 pb-24 pt-28 md:px-10 md:pb-36 md:pt-44">
        <SectionLabel index="02" label="The Vision" />
        <div className="mt-14 grid grid-cols-1 gap-12 md:grid-cols-12">
          <h2 id="vision-title" className="sr-only">
            The Vision
          </h2>
          <ScrubWords
            className="display text-[9vw] leading-[1.02] md:col-span-11 md:text-[5.4vw]"
            text="We believe a home should feel inevitable — as if the land, the light and the people who live there had quietly agreed on its shape long before the first stone was laid."
          />
        </div>
      </div>

      {/* Pinned expanding frame */}
      <div ref={pinRef} className="relative h-[100svh] overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-between px-5 md:px-10">
          <span className="vf-left display text-[16vw] md:text-[10vw]">Quiet</span>
          <span className="vf-right display text-[16vw] italic text-[var(--gold)] md:text-[10vw]">Luxury</span>
        </div>
        <div className="vf-frame img-grade absolute inset-0 overflow-hidden will-change-[clip-path]">
          <div className="vf-img absolute inset-0 will-change-transform">
            <Image src="/images/vision-1.jpg" alt="Contemporary residence courtyard with lawn and paths, framed by forest" fill sizes="100vw" className="object-cover" />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          <div className="vf-caption absolute bottom-8 left-5 right-5 flex flex-col justify-between gap-4 text-[#f3eee5] md:bottom-12 md:left-10 md:right-10 md:flex-row md:items-end">
            <p className="display max-w-2xl text-4xl md:text-6xl">Architecture that recedes, so life can come forward.</p>
            <p className="eyebrow text-[#f3eee5]/75">Landscape-first masterplan</p>
          </div>
        </div>
      </div>

      {/* Editorial principles with multi-speed parallax */}
      <div className="grid grid-cols-1 gap-16 px-5 py-28 md:grid-cols-12 md:gap-8 md:px-10 md:py-40">
        <div className="md:col-span-5">
          <SplitReveal as="h3" className="display text-5xl md:text-7xl">
            Three principles, one calm idea.
          </SplitReveal>
          <div className="mt-14 space-y-10">
            {[
              ["Light as material", "Every plan is oriented to capture soft morning light and temper the afternoon sun through deep reveals and loggias."],
              ["Honest materials", "Travertine, oak, bronze and lime plaster — chosen to age gracefully and feel better with every passing year."],
              ["Landscape first", "Buildings are placed around existing trees and views, giving more than half of every site back to gardens."],
            ].map(([t, d], i) => (
              <div key={t} className="grid grid-cols-[3rem_1fr] gap-4 border-t border-[var(--line)] pt-6">
                <span className="eyebrow text-[var(--gold)]">0{i + 1}</span>
                <div>
                  <SplitReveal as="h4" className="font-display text-3xl">
                    {t}
                  </SplitReveal>
                  <SplitReveal as="p" className="mt-3 max-w-md leading-relaxed text-[var(--muted)]" delay={0.1}>
                    {d}
                  </SplitReveal>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="relative md:col-span-6 md:col-start-7">
          <ParallaxImage src="/images/residence-interior.jpg" alt="Living space with travertine walls and oak" className="aspect-[4/5] w-full" sizes="(min-width:768px) 45vw, 100vw" reveal="up" />
          <ParallaxImage
            src="/images/material-detail.jpg"
            alt="Close-up of travertine and bronze detail"
            className="absolute -bottom-16 -left-6 hidden aspect-[3/4] w-[42%] border-[10px] border-[var(--bg)] md:block"
            sizes="20vw"
            speed={30}
            reveal="left"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-y-12 border-t border-[var(--line)] px-5 py-16 md:grid-cols-4 md:px-10">
        {[
          { v: 3, s: "", l: "Residence typologies" },
          { v: 60, s: "%", l: "Site given to landscape*" },
          { v: 3.4, s: " m", l: "Clear ceiling heights*", d: 1 },
          { v: 2, s: "", l: "Homes per floor*" },
        ].map((s) => (
          <div key={s.l}>
            <Counter value={s.v} suffix={s.s} decimals={s.d ?? 0} className="display block text-6xl md:text-8xl" />
            <p className="eyebrow mt-3 text-[var(--muted)]">{s.l}</p>
          </div>
        ))}
        <p className="col-span-2 text-xs text-[var(--muted)] md:col-span-4">* Design intent for this demonstration project; final specifications are subject to approvals.</p>
      </div>
    </section>
  );
}
