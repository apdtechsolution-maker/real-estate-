"use client";

import { useRef } from "react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";

export function Counter({ value, suffix = "", prefix = "", className = "", decimals = 0 }: { value: number; suffix?: string; prefix?: string; className?: string; decimals?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      const fmt = (n: number) => `${prefix}${n.toFixed(decimals)}${suffix}`;
      if (prefersReducedMotion()) {
        el.textContent = fmt(value);
        return;
      }
      const obj = { n: 0 };
      el.textContent = fmt(0);
      gsap.to(obj, {
        n: value,
        duration: 2.2,
        ease: "power3.out",
        onUpdate: () => {
          el.textContent = fmt(obj.n);
        },
        scrollTrigger: { trigger: el, start: "top 90%", once: true },
      });
    },
    { dependencies: [value, suffix, prefix], revertOnUpdate: true },
  );
  return (
    <span ref={ref} className={`tabular-nums ${className}`}>
      {prefix}
      {value.toFixed(decimals)}
      {suffix}
    </span>
  );
}
