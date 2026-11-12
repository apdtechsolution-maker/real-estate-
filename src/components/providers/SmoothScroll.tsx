"use client";

import Lenis from "lenis";
import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";

interface ScrollApi {
  lenis: Lenis | null;
  scrollTo: (target: string | number | HTMLElement, opts?: { immediate?: boolean; offset?: number }) => void;
  stop: () => void;
  start: () => void;
}

const ScrollCtx = createContext<ScrollApi>({
  lenis: null,
  scrollTo: () => {},
  stop: () => {},
  start: () => {},
});

export function SmoothScroll({ children }: { children: ReactNode }) {
  const [lenis, setLenis] = useState<Lenis | null>(null);
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;
    const l = new Lenis({
      lerp: 0.085,
      smoothWheel: true,
      wheelMultiplier: 0.95,
      touchMultiplier: 1.1,
    });
    lenisRef.current = l;
    l.on("scroll", ScrollTrigger.update);
    const raf = (time: number) => l.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);
    setLenis(l);
    return () => {
      gsap.ticker.remove(raf);
      l.destroy();
      lenisRef.current = null;
      setLenis(null);
    };
  }, []);

  const scrollTo = useCallback<ScrollApi["scrollTo"]>((target, opts) => {
    const l = lenisRef.current;
    const el = typeof target === "string" ? document.querySelector<HTMLElement>(target) : target;
    if (el == null) return;
    if (l) {
      l.scrollTo(el as HTMLElement | number, {
        immediate: opts?.immediate,
        offset: opts?.offset ?? 0,
        duration: 1.6,
        easing: (t: number) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t)),
      });
    } else if (typeof el === "number") {
      window.scrollTo({ top: el, behavior: opts?.immediate ? "auto" : "smooth" });
    } else {
      el.scrollIntoView({ behavior: opts?.immediate ? "auto" : "smooth" });
    }
  }, []);

  const stop = useCallback(() => {
    lenisRef.current?.stop();
    document.documentElement.classList.add("scroll-locked");
  }, []);
  const start = useCallback(() => {
    lenisRef.current?.start();
    document.documentElement.classList.remove("scroll-locked");
  }, []);

  return <ScrollCtx.Provider value={{ lenis, scrollTo, stop, start }}>{children}</ScrollCtx.Provider>;
}

export const useSmoothScroll = () => useContext(ScrollCtx);
