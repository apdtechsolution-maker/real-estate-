"use client";

import Image from "next/image";
import { useRef } from "react";
import { ArrowDownRight } from "lucide-react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { useIntro, useMarket } from "@/components/providers/AppProviders";
import { SplitReveal } from "@/components/motion/SplitReveal";
import { TLink } from "@/components/ui/TLink";
import { Magnetic } from "@/components/ui/Magnetic";

export function Hero() {
  const { done } = useIntro();
  const { market } = useMarket();
  const root = useRef<HTMLElement>(null);

  // Opening sequence (runs as the preloader curtain lifts)
  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      if (!done) {
        gsap.set(".hero-media", { scale: 1.35, clipPath: "inset(14% 26% 14% 26%)" });
        gsap.set(".hero-fade", { opacity: 0, y: 24 });
        gsap.set(".hero-scroll", { opacity: 0 });
        gsap.set(".hero-inset", { clipPath: "inset(100% 0% 0% 0%)" });
        return;
      }
      gsap
        .timeline()
        .to(".hero-media", { clipPath: "inset(0% 0% 0% 0%)", duration: 1.8, ease: "expo.inOut" }, 0)
        .to(".hero-media", { scale: 1, duration: 3.2, ease: "expo.out" }, 0.2)
        .to(".hero-inset", { clipPath: "inset(0% 0% 0% 0%)", duration: 1.6, ease: "expo.inOut" }, 1.3)
        .to(".hero-fade", { opacity: 1, y: 0, duration: 1.4, ease: "expo.out", stagger: 0.1 }, 1.4)
        .to(".hero-scroll", { opacity: 1, duration: 1.2 }, 2.2);
    },
    { scope: root, dependencies: [done] },
  );

  // Scroll-out choreography: layered depth parallax + darkening
  useGSAP(
    () => {
      if (!root.current || prefersReducedMotion()) return;
      const st = { trigger: root.current, start: "top top", end: "bottom top", scrub: true };
      gsap.to(".hero-parallax", { yPercent: 28, ease: "none", scrollTrigger: st });
      gsap.to(".hero-content", { yPercent: -45, opacity: 0, ease: "none", scrollTrigger: { ...st, end: "70% top" } });
      gsap.to(".hero-inset-wrap", { yPercent: -90, ease: "none", scrollTrigger: st });
      gsap.to(".hero-shade", { opacity: 0.75, ease: "none", scrollTrigger: st });
    },
    { scope: root },
  );

  return (
    <section ref={root} id="top" aria-label="Introduction" className="relative h-[100svh] min-h-[620px] overflow-hidden bg-[#151411] text-[#f3eee5]">
      <div className="hero-parallax absolute inset-0 will-change-transform">
        <div className="hero-media absolute inset-0 will-change-transform">
          <Image
            src="/images/hero-render-day.jpg"
            alt="Travertine residence with a reflecting infinity pool in morning light"
            fill
            priority
            sizes="100vw"
            className="hero-day object-cover transition-opacity duration-[1400ms]"
          />
          <Image
            src="/images/hero-render-night.jpg"
            alt="The same residence design rendered at night, glowing with warm interior light"
            fill
            loading="eager"
            sizes="100vw"
            className="hero-night object-cover opacity-0 transition-opacity duration-[1400ms]"
          />
        </div>
      </div>
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/45 via-black/10 to-black/65" />
      <div className="hero-shade pointer-events-none absolute inset-0 bg-[#0d0c0a] opacity-0" />

      {/* Floating inset frame — foreground depth layer */}
      <div className="hero-inset-wrap absolute right-[6%] top-[22%] hidden w-[15vw] max-w-[230px] lg:block">
        <div className="hero-inset relative aspect-[3/4] overflow-hidden">
          <Image src="/images/material-detail.jpg" alt="Travertine and bronze material detail" fill sizes="15vw" className="object-cover" />
        </div>
        <p className="hero-fade eyebrow mt-3 text-[#f3eee5]/75">Travertine · Bronze · Oak</p>
      </div>

      <div className="hero-content relative z-10 flex h-full flex-col justify-end px-5 pb-10 md:px-10 md:pb-12">
        <p className="hero-fade eyebrow mb-6 text-[#f3eee5]/80">
          {market.project.name} — {market.project.neighbourhood}, {market.project.city}
        </p>
        <h1 className="display text-[17vw] leading-[0.86] sm:text-[14vw] lg:text-[11.5vw]">
          <SplitReveal as="span" mode="chars" play={done} delay={1.1} className="block">
            Where light
          </SplitReveal>
          <SplitReveal as="span" mode="chars" play={done} delay={1.35} className="block pl-[8vw] italic text-[#e3cfa6]">
            becomes form
          </SplitReveal>
        </h1>

        <div className="mt-10 grid grid-cols-1 items-end gap-8 md:grid-cols-12">
          <p className="hero-fade max-w-md text-[15px] leading-relaxed text-[#f3eee5]/85 md:col-span-5">
            Signature residences, sky penthouses and private villas — composed in stone, light and landscape for a few
            discerning families.
          </p>
          <div className="hero-scroll hidden flex-col items-center gap-3 md:col-span-2 md:flex">
            <span className="eyebrow text-[#f3eee5]/70">Scroll</span>
            <span className="relative block h-14 w-px overflow-hidden bg-white/20">
              <span className="scroll-line absolute inset-0 bg-[#e3cfa6]" />
            </span>
          </div>
          <div className="hero-fade flex md:col-span-5 md:justify-end">
            <Magnetic>
              <TLink href="/#residences" data-cursor="Explore" className="group inline-flex items-center gap-4 border-b border-white/40 pb-2">
                <span className="eyebrow">Discover the residences</span>
                <ArrowDownRight size={16} className="transition-transform duration-700 group-hover:rotate-[-45deg]" />
              </TLink>
            </Magnetic>
          </div>
        </div>
      </div>
      <p className="hero-fade absolute bottom-3 left-1/2 hidden -translate-x-1/2 text-[10px] tracking-wider text-white/50 md:block">
        Architectural render — illustrative
      </p>
    </section>
  );
}
