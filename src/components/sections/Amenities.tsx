"use client";

import Image from "next/image";
import { useRef } from "react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { SectionLabel } from "@/components/ui/SectionLabel";

const amenities = [
  { title: "Infinity Pool", tag: "Rooftop · 40 m", img: "/images/pool-rooftop.jpg", text: "A rooftop edge pool suspended above the skyline, with cabanas and a sunset bar." },
  { title: "Wellness Spa", tag: "Sauna · Steam · Treatment", img: "/images/spa.jpg", text: "Timber-lined sauna, steam and treatment suites designed around stillness." },
  { title: "Olive Gardens", tag: "Landscape", img: "/images/landscape-2.jpg", text: "Mature olive groves, native grasses and stone paths stitched through the site." },
  { title: "Residents' Lounge", tag: "Library · Salon", img: "/images/lounge.jpg", text: "A private salon and library for gatherings, quiet work and evening receptions." },
  { title: "Fitness Studio", tag: "Strength · Pilates", img: "/images/gym.jpg", text: "A light-filled studio with personal training, pilates reformers and yoga deck." },
  { title: "Private Terraces", tag: "Every residence", img: "/images/terrace-fire.jpg", text: "Deep outdoor rooms with fire features — living extended into open air." },
  { title: "Valet & Parking", tag: "EV ready", img: "/images/villa-cars.jpg", text: "Concierge valet, secure basement parking and EV charging for every bay." },
];

export function Amenities() {
  const root = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!root.current || !track.current || prefersReducedMotion()) return;
      const mm = gsap.matchMedia();
      mm.add("(min-width: 768px)", () => {
        const t = track.current!;
        const dist = () => t.scrollWidth - window.innerWidth;
        const tween = gsap.to(t, {
          x: () => -dist(),
          ease: "none",
          scrollTrigger: {
            trigger: root.current,
            start: "top top",
            end: () => `+=${dist()}`,
            scrub: 1,
            pin: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => gsap.set(".am-progress", { scaleX: self.progress }),
          },
        });
        gsap.utils.toArray<HTMLElement>(".am-img").forEach((img) => {
          gsap.fromTo(
            img,
            { xPercent: -12 },
            { xPercent: 12, ease: "none", scrollTrigger: { trigger: img.parentElement, containerAnimation: tween, start: "left right", end: "right left", scrub: true } },
          );
        });
        gsap.utils.toArray<HTMLElement>(".am-title").forEach((el) => {
          gsap.from(el, { yPercent: 110, duration: 1.2, ease: "expo.out", scrollTrigger: { trigger: el, containerAnimation: tween, start: "left 85%", toggleActions: "play none none reverse" } });
        });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} id="amenities" aria-labelledby="am-title" className="relative overflow-hidden bg-[var(--bg)] md:h-[100svh]">
      <div
        ref={track}
        className="no-scrollbar flex h-full snap-x snap-mandatory items-stretch gap-4 overflow-x-auto px-5 py-24 will-change-transform md:snap-none md:gap-8 md:overflow-visible md:px-10 md:py-0"
        data-cursor="Drag"
      >
        <div className="flex w-[85vw] shrink-0 snap-start flex-col justify-center md:w-[42vw] md:pr-10">
          <SectionLabel index="07" label="Amenities" />
          <h2 id="am-title" className="display mt-10 text-[13vw] md:text-[6.4vw]">
            Seven ways <br />
            <em className="text-[var(--gold)]">to slow down.</em>
          </h2>
          <p className="mt-8 max-w-sm leading-relaxed text-[var(--muted)]">
            Shared spaces conceived like a private members&apos; club — calm, generous and entirely for residents.
          </p>
          <p className="eyebrow mt-10 hidden text-[var(--muted)] md:block">Scroll to explore →</p>
          <p className="eyebrow mt-8 text-[var(--muted)] md:hidden">Swipe to explore →</p>
        </div>

        {amenities.map((a, i) => (
          <article key={a.title} className="group flex w-[80vw] shrink-0 snap-start flex-col justify-center md:w-[34vw] md:even:pt-24 md:odd:pb-24">
            <div className="img-grade relative aspect-[4/5] w-full overflow-hidden md:aspect-[3/4] md:max-h-[62vh]">
              <div className="am-img absolute inset-[-2%_-14%] will-change-transform">
                <Image src={a.img} alt={a.title} fill sizes="(min-width:768px) 34vw, 80vw" className="object-cover transition-transform duration-[1600ms] [transition-timing-function:cubic-bezier(0.19,1,0.22,1)] group-hover:scale-105" />
              </div>
              <span className="absolute left-4 top-4 bg-[var(--bg)] px-2.5 py-1.5 eyebrow">{String(i + 1).padStart(2, "0")}</span>
            </div>
            <div className="mt-5 flex items-baseline justify-between gap-4">
              <div className="overflow-hidden">
                <h3 className="am-title font-display text-3xl md:text-4xl">{a.title}</h3>
              </div>
              <span className="eyebrow shrink-0 text-[var(--muted)]">{a.tag}</span>
            </div>
            <p className="mt-2 max-w-sm text-sm leading-relaxed text-[var(--muted)]">{a.text}</p>
          </article>
        ))}
        <div className="w-[5vw] shrink-0 md:w-[8vw]" aria-hidden />
      </div>
      <div className="absolute bottom-8 left-10 right-10 hidden h-px bg-[var(--line)] md:block">
        <div className="am-progress h-full origin-left scale-x-0 bg-[var(--gold)]" />
      </div>
    </section>
  );
}
