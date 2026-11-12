"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { animate, motion, useMotionValue, useSpring, useTransform } from "motion/react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { SplitReveal } from "@/components/motion/SplitReveal";

const collage = [
  { src: "/images/twilight-apt.jpg", alt: "Apartment with twilight panorama", cls: "col-span-6 md:col-span-4 aspect-[3/4]", speed: -10 },
  { src: "/images/pool-mountain.jpg", alt: "Infinity pool overlooking mountains", cls: "col-span-6 md:col-span-5 md:col-start-6 aspect-[4/5] mt-24 md:mt-40", speed: -28 },
  { src: "/images/bed-city.jpg", alt: "Bedroom with city view", cls: "col-span-7 md:col-span-3 md:col-start-10 aspect-[3/4] -mt-10 md:mt-0", speed: -45 },
];

const journal = [
  { src: "/images/int-fireplace.jpg", title: "Evenings by the hearth", tag: "Interiors" },
  { src: "/images/pool-city.jpg", title: "Sunrise laps", tag: "Wellness" },
  { src: "/images/terrace.jpg", title: "Long lunches outdoors", tag: "Terraces" },
  { src: "/images/int-black.jpg", title: "The music room", tag: "Culture" },
  { src: "/images/landscape-3.jpg", title: "Garden walks", tag: "Landscape" },
  { src: "/images/int-chair.jpg", title: "A quiet corner", tag: "Calm" },
];

function DragGallery() {
  const wrap = useRef<HTMLDivElement>(null);
  const strip = useRef<HTMLDivElement>(null);
  const [limit, setLimit] = useState(0);
  const x = useMotionValue(0);
  const smooth = useSpring(x, { stiffness: 120, damping: 24, mass: 0.6 });
  const progress = useTransform(smooth, (v) => (limit ? Math.min(1, Math.max(0, -v / limit)) : 0));

  useEffect(() => {
    const measure = () => {
      if (wrap.current && strip.current) setLimit(Math.max(0, strip.current.scrollWidth - wrap.current.offsetWidth));
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  const nudge = (dir: number) => {
    const next = Math.min(0, Math.max(-limit, x.get() - dir * 420));
    animate(x, next, { type: "spring", stiffness: 140, damping: 26 });
  };

  return (
    <div>
      <div ref={wrap} className="overflow-hidden" data-cursor="Drag">
        <motion.div
          ref={strip}
          drag="x"
          dragConstraints={{ left: -limit, right: 0 }}
          dragElastic={0.08}
          dragTransition={{ power: 0.35, timeConstant: 260 }}
          style={{ x }}
          className="flex w-max gap-4 pl-5 pr-5 md:gap-6 md:pl-10 md:pr-10"
          tabIndex={0}
          role="region"
          aria-label="Lifestyle journal gallery. Use left and right arrow keys to move."
          onKeyDown={(e) => {
            if (e.key === "ArrowRight") nudge(1);
            if (e.key === "ArrowLeft") nudge(-1);
          }}
        >
          {journal.map((j, i) => (
            <figure key={j.title} className="group w-[72vw] shrink-0 select-none sm:w-[44vw] md:w-[28vw]">
              <div className="img-grade relative aspect-[4/5] overflow-hidden">
                <Image src={j.src} alt={j.title} fill draggable={false} sizes="(min-width:768px) 28vw, 72vw" className="pointer-events-none object-cover transition-transform duration-[1600ms] [transition-timing-function:cubic-bezier(0.19,1,0.22,1)] group-hover:scale-[1.06]" />
              </div>
              <figcaption className="mt-4 flex items-baseline justify-between">
                <span className="font-display text-2xl">{j.title}</span>
                <span className="eyebrow text-[var(--muted)]">
                  {String(i + 1).padStart(2, "0")} · {j.tag}
                </span>
              </figcaption>
            </figure>
          ))}
        </motion.div>
      </div>
      <div className="mt-10 flex items-center gap-6 px-5 md:px-10">
        <div className="relative h-px flex-1 bg-[var(--line)]">
          <motion.div className="absolute inset-y-0 left-0 w-full origin-left bg-[var(--gold)]" style={{ scaleX: progress }} />
        </div>
        <div className="flex gap-2">
          <button type="button" onClick={() => nudge(-1)} aria-label="Previous" className="h-11 w-11 border border-[var(--line)] transition-colors hover:border-[var(--fg)]">←</button>
          <button type="button" onClick={() => nudge(1)} aria-label="Next" className="h-11 w-11 border border-[var(--line)] transition-colors hover:border-[var(--fg)]">→</button>
        </div>
      </div>
    </div>
  );
}

export function Lifestyle() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (!root.current || prefersReducedMotion()) return;
      gsap.fromTo(".ls-a", { xPercent: 0 }, { xPercent: -25, ease: "none", scrollTrigger: { trigger: ".ls-type", start: "top bottom", end: "bottom top", scrub: true } });
      gsap.fromTo(".ls-b", { xPercent: -25 }, { xPercent: 0, ease: "none", scrollTrigger: { trigger: ".ls-type", start: "top bottom", end: "bottom top", scrub: true } });
      gsap.utils.toArray<HTMLElement>(".ls-par").forEach((el) => {
        const speed = Number(el.dataset.speed ?? -20);
        gsap.fromTo(el, { yPercent: 0 }, { yPercent: speed, ease: "none", scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true } });
        gsap.from(el.querySelector(".ls-clip"), { clipPath: "inset(100% 0% 0% 0%)", duration: 1.6, ease: "expo.inOut", scrollTrigger: { trigger: el, start: "top 90%", toggleActions: "play none none reverse" } });
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} id="lifestyle" aria-labelledby="ls-title" className="relative overflow-hidden bg-[var(--bg)] py-28 md:py-40">
      <div className="px-5 md:px-10">
        <SectionLabel index="08" label="The Lifestyle" />
      </div>
      <h2 id="ls-title" className="ls-type mt-12 whitespace-nowrap" aria-label="Unhurried days, luminous evenings">
        <span className="ls-a display block text-[20vw] md:text-[13vw]" aria-hidden>
          Unhurried days ·
        </span>
        <span className="ls-b display block text-[20vw] italic text-[var(--gold)] md:text-[13vw]" aria-hidden>
          luminous evenings ·
        </span>
      </h2>

      <div className="mt-16 grid grid-cols-12 gap-4 px-5 md:mt-24 md:gap-6 md:px-10">
        {collage.map((c) => (
          <div key={c.src} className={`ls-par ${c.cls}`} data-speed={c.speed}>
            <div className="ls-clip img-grade relative h-full w-full overflow-hidden">
              <Image src={c.src} alt={c.alt} fill sizes="(min-width:768px) 33vw, 50vw" className="object-cover" />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-20 grid grid-cols-1 gap-10 px-5 md:mt-10 md:grid-cols-12 md:px-10">
        <div className="md:col-span-6 md:col-start-2">
          <SplitReveal as="p" className="display text-4xl leading-[1.08] md:text-6xl">
            Mornings begin with light across stone. Afternoons drift between garden and pool. Evenings belong to the terrace.
          </SplitReveal>
        </div>
        <div className="md:col-span-3 md:col-start-9 md:pt-4">
          <SplitReveal as="p" className="leading-relaxed text-[var(--muted)]">
            A dedicated residents&apos; team handles the details — from arrival and housekeeping to private dining and travel — so that time at home feels entirely your own.
          </SplitReveal>
        </div>
      </div>

      <div className="mt-28 md:mt-36">
        <div className="mb-10 flex items-end justify-between px-5 md:px-10">
          <SplitReveal as="h3" className="display text-5xl md:text-6xl">
            Lifestyle journal
          </SplitReveal>
          <span className="eyebrow hidden text-[var(--muted)] md:block">Drag to explore</span>
        </div>
        <DragGallery />
      </div>
    </section>
  );
}
