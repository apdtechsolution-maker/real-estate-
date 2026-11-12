"use client";

import { useRef } from "react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";

/** "02 ——— The Vision" label with an animated hairline draw. */
export function SectionLabel({ index, label, className = "", light = false }: { index: string; label: string; className?: string; light?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  useGSAP(
    () => {
      if (!ref.current || prefersReducedMotion()) return;
      const tl = gsap.timeline({ scrollTrigger: { trigger: ref.current, start: "top 90%", toggleActions: "play none none reverse" } });
      tl.from(ref.current.querySelector(".sl-line"), { scaleX: 0, transformOrigin: "left center", duration: 1.4, ease: "expo.inOut" }).from(
        ref.current.querySelectorAll(".sl-txt"),
        { yPercent: 110, duration: 1, ease: "expo.out", stagger: 0.08 },
        0.3,
      );
    },
    { scope: ref },
  );
  return (
    <div ref={ref} className={`flex items-center gap-4 ${light ? "text-[#ede6d9]" : ""} ${className}`}>
      <span className="overflow-hidden">
        <span className="sl-txt eyebrow block text-[var(--gold)]">{index}</span>
      </span>
      <span className="sl-line block h-px w-14 bg-current opacity-40 md:w-24" />
      <span className="overflow-hidden">
        <span className="sl-txt eyebrow block">{label}</span>
      </span>
    </div>
  );
}
