"use client";

import { useRef, type ElementType, type ReactNode } from "react";
import { gsap, SplitText, useGSAP, prefersReducedMotion } from "@/lib/gsap";

type Mode = "lines" | "chars" | "words";

interface Props {
  as?: ElementType;
  children: ReactNode;
  className?: string;
  mode?: Mode;
  /** Direction lines travel in from. */
  from?: "below" | "above" | "left";
  delay?: number;
  stagger?: number;
  duration?: number;
  /** When provided, plays when this flips to true instead of on scroll. */
  play?: boolean;
  start?: string;
  /** Reverse on scroll-up for matching exit animation. */
  reverse?: boolean;
  id?: string;
}

/**
 * Masked editorial text reveal powered by GSAP SplitText.
 * Re-splits automatically on font load / resize (autoSplit).
 */
export function SplitReveal({
  as: Tag = "div",
  children,
  className = "",
  mode = "lines",
  from = "below",
  delay = 0,
  stagger,
  duration = 1.35,
  play,
  start = "top 88%",
  reverse = true,
  id,
}: Props) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      if (prefersReducedMotion()) {
        gsap.set(el, { autoAlpha: 1 });
        return;
      }
      if (play === false) {
        gsap.set(el, { autoAlpha: 0 });
        return;
      }
      gsap.set(el, { autoAlpha: 1 });
      SplitText.create(el, {
        type: mode === "chars" ? "lines,chars" : mode === "words" ? "lines,words" : "lines",
        mask: "lines",
        autoSplit: true,
        linesClass: "split-line",
        onSplit(self) {
          const targets = mode === "chars" ? self.chars : mode === "words" ? self.words : self.lines;
          const vars: gsap.TweenVars =
            from === "left"
              ? { xPercent: -105, opacity: 0 }
              : { yPercent: from === "above" ? -115 : 115, rotate: from === "above" ? -2 : 2.5 };
          return gsap.from(targets, {
            ...vars,
            duration,
            delay,
            ease: "expo.out",
            stagger: stagger ?? (mode === "chars" ? 0.028 : mode === "words" ? 0.045 : 0.1),
            transformOrigin: "0% 50%",
            scrollTrigger:
              play === undefined
                ? { trigger: el, start, toggleActions: reverse ? "play none none reverse" : "play none none none" }
                : undefined,
          });
        },
      });
    },
    { dependencies: [play, mode], scope: ref, revertOnUpdate: true },
  );

  return (
    <Tag ref={ref} id={id} className={`split-target ${className}`}>
      {children}
    </Tag>
  );
}
