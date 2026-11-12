"use client";

import { useRef, type ElementType } from "react";
import { gsap, SplitText, useGSAP, prefersReducedMotion } from "@/lib/gsap";

/** Scroll-scrubbed word-by-word illumination for long editorial statements. */
export function ScrubWords({ text, className = "", as: Tag = "p" }: { text: string; className?: string; as?: ElementType }) {
  const ref = useRef<HTMLElement>(null);
  useGSAP(
    () => {
      if (!ref.current || prefersReducedMotion()) return;
      SplitText.create(ref.current, {
        type: "words",
        autoSplit: true,
        onSplit(self) {
          return gsap.fromTo(
            self.words,
            { opacity: 0.12 },
            {
              opacity: 1,
              ease: "none",
              stagger: 0.1,
              scrollTrigger: { trigger: ref.current, start: "top 80%", end: "bottom 45%", scrub: 0.6 },
            },
          );
        },
      });
    },
    { scope: ref, dependencies: [text], revertOnUpdate: true },
  );
  return (
    <Tag ref={ref} className={className}>
      {text}
    </Tag>
  );
}
