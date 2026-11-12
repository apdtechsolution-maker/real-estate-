"use client";

import Image from "next/image";
import { useRef } from "react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";

interface Props {
  src: string;
  alt: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
  /** Parallax travel in percent of the image height. */
  speed?: number;
  /** Clip-path reveal direction on enter. */
  reveal?: "up" | "left" | "right" | "center" | "none";
  /** Ken-burns scale settle on enter. */
  zoom?: boolean;
  cursor?: string;
  objectPosition?: string;
}

/**
 * Masked image with scroll-linked parallax, a cinematic clip-path reveal and
 * a scale settle. Uses only transforms + clip-path (GPU friendly).
 */
export function ParallaxImage({
  src,
  alt,
  className = "",
  sizes = "100vw",
  priority,
  speed = 12,
  reveal = "up",
  zoom = true,
  cursor,
  objectPosition,
}: Props) {
  const wrap = useRef<HTMLDivElement>(null);
  const inner = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!wrap.current || !inner.current || prefersReducedMotion()) return;
      const clip: Record<string, string> = {
        up: "inset(100% 0% 0% 0%)",
        left: "inset(0% 100% 0% 0%)",
        right: "inset(0% 0% 0% 100%)",
        center: "inset(18% 22% 18% 22%)",
      };
      if (reveal !== "none") {
        gsap.fromTo(
          wrap.current,
          { clipPath: clip[reveal] },
          {
            clipPath: "inset(0% 0% 0% 0%)",
            duration: 1.6,
            ease: "expo.inOut",
            scrollTrigger: { trigger: wrap.current, start: "top 90%", toggleActions: "play none none reverse" },
          },
        );
      }
      gsap.fromTo(
        inner.current,
        { yPercent: -speed / 2, scale: zoom ? 1.25 : 1.12 },
        {
          yPercent: speed / 2,
          scale: 1.12,
          ease: "none",
          scrollTrigger: { trigger: wrap.current, start: "top bottom", end: "bottom top", scrub: true },
        },
      );
    },
    { scope: wrap },
  );

  return (
    <div ref={wrap} className={`img-grade relative overflow-hidden ${className}`} data-cursor={cursor}>
      <div ref={inner} className="absolute inset-0 will-change-transform">
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          priority={priority}
          className="object-cover"
          style={objectPosition ? { objectPosition } : undefined}
        />
      </div>
    </div>
  );
}
