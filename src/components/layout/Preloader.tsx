"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import { useIntro } from "@/components/providers/AppProviders";
import { useSmoothScroll } from "@/components/providers/SmoothScroll";
import { Logo } from "@/components/ui/Logo";

const PRELOAD = ["/images/hero-render-day.jpg", "/images/hero-render-night.jpg"];

/**
 * Branded intro: monogram stroke-draw → counter tied to real asset/font
 * loading → wordmark rise → curtain lift that hands over to the hero timeline.
 */
export function Preloader() {
  const { finish, done } = useIntro();
  const { stop, start } = useSmoothScroll();
  const root = useRef<HTMLDivElement>(null);
  const count = useRef<HTMLSpanElement>(null);
  const [gone, setGone] = useState(false);

  useEffect(() => {
    if (done) {
      return;
    }
    const el = root.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      finish();
      return;
    }
    let seen = false;
    try {
      seen = sessionStorage.getItem("aurelia-intro") === "1";
      sessionStorage.setItem("aurelia-intro", "1");
    } catch {}
    stop();
    window.scrollTo(0, 0);

    const progress = { v: 0 };
    let loaded = 0;
    const total = PRELOAD.length + 1;
    const target = { v: 0 };
    const bump = () => {
      loaded += 1;
      target.v = Math.round((loaded / total) * 100);
    };
    PRELOAD.forEach((src) => {
      const img = new window.Image();
      img.onload = bump;
      img.onerror = bump;
      img.src = src;
    });
    document.fonts?.ready.then(bump).catch(bump);

    const ctx = gsap.context(() => {
      const speed = seen ? 0.45 : 1;
      const tl = gsap.timeline({ paused: true });
      tl.to(".logo-draw", { strokeDashoffset: 0, duration: 1.6 * speed, ease: "power2.inOut", stagger: 0.18 * speed })
        .from(".pl-word span", { yPercent: 110, duration: 1.1 * speed, ease: "expo.out", stagger: 0.04 }, 0.5 * speed)
        .from(".pl-meta", { opacity: 0, y: 10, duration: 0.8 * speed }, 0.8 * speed);
      tl.play();

      // Counter eases toward real load progress, with a minimum cinematic duration.
      const minDuration = seen ? 0.9 : 2.4;
      const startTime = performance.now();
      const tick = () => {
        const elapsed = (performance.now() - startTime) / 1000;
        const timeCap = Math.min(100, (elapsed / minDuration) * 100);
        const goal = Math.min(target.v, timeCap);
        progress.v += (goal - progress.v) * 0.12;
        if (count.current) count.current.textContent = String(Math.round(progress.v)).padStart(3, "0");
        if (progress.v > 99.4 && target.v >= 100) {
          gsap.ticker.remove(tick);
          if (count.current) count.current.textContent = "100";
          exit();
        }
      };
      gsap.ticker.add(tick);

      const exit = () => {
        gsap
          .timeline({
            onComplete: () => {
              setGone(true);
            },
          })
          .to(".pl-inner", { yPercent: -30, opacity: 0, duration: 0.9, ease: "power3.in" }, 0.15)
          .to(el, { clipPath: "inset(0% 0% 100% 0%)", duration: 1.3, ease: "expo.inOut" }, 0.55)
          .add(() => {
            start();
            finish();
          }, 0.95);
      };
      // Safety net: never block the site for more than 7s.
      gsap.delayedCall(7, () => {
        target.v = 100;
      });
    }, el);

    return () => {
      ctx.revert();
      start();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (done || gone) return null;

  return (
    <div
      ref={root}
      className="fixed inset-0 z-[95] flex items-center justify-center bg-[#151411] text-[#ede6d9]"
      style={{ clipPath: "inset(0% 0% 0% 0%)" }}
      role="status"
      aria-label="Loading Aurelia Estates"
    >
      <div className="pl-inner flex flex-col items-center">
        <Logo draw className="h-20 w-20 text-[#cdb27e] md:h-24 md:w-24" />
        <div className="pl-word mt-8 flex overflow-hidden font-display text-2xl font-light tracking-[0.5em] md:text-3xl">
          {"AURELIA".split("").map((c, i) => (
            <span key={i} className="inline-block">
              {c}
            </span>
          ))}
        </div>
        <p className="pl-meta mt-3 eyebrow text-[#9a9181]">Estates · Residences · Villas</p>
      </div>
      <div className="pl-meta absolute bottom-8 left-6 right-6 flex items-end justify-between md:bottom-10 md:left-10 md:right-10">
        <span className="eyebrow text-[#9a9181]">Where light becomes architecture</span>
        <span className="font-display text-5xl font-light tabular-nums md:text-7xl">
          <span ref={count}>000</span>
        </span>
      </div>
    </div>
  );
}
