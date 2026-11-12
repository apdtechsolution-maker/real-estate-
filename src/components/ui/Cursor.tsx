"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { gsap } from "@/lib/gsap";

const CURSOR_QUERY = "(pointer: fine) and (prefers-reduced-motion: no-preference)";

function subscribeCursor(callback: () => void) {
  const mq = window.matchMedia(CURSOR_QUERY);
  mq.addEventListener("change", callback);
  return () => mq.removeEventListener("change", callback);
}

function getCursorSnapshot() {
  return window.matchMedia(CURSOR_QUERY).matches;
}

function getServerCursorSnapshot() {
  return false;
}

/**
 * Desktop-only custom pointer. Elements can opt in with:
 *  data-cursor="View" | "Drag" | "Explore"  → expanded ring with label
 *  data-cursor="hide"                       → hides the pointer (e.g. form fields)
 * Interactive elements (a, button) get a subtle magnetised ring automatically.
 */
export function Cursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const [label, setLabel] = useState("");
  const enabled = useSyncExternalStore(subscribeCursor, getCursorSnapshot, getServerCursorSnapshot);

  useEffect(() => {
    if (!enabled || !dot.current || !ring.current) return;
    document.documentElement.classList.add("has-cursor");
    const d = dot.current;
    const r = ring.current;
    gsap.set([d, r], { x: -100, y: -100 });
    const dx = gsap.quickTo(d, "x", { duration: 0.15, ease: "power3" });
    const dy = gsap.quickTo(d, "y", { duration: 0.15, ease: "power3" });
    const rx = gsap.quickTo(r, "x", { duration: 0.55, ease: "power3" });
    const ry = gsap.quickTo(r, "y", { duration: 0.55, ease: "power3" });

    const move = (e: PointerEvent) => {
      dx(e.clientX);
      dy(e.clientY);
      rx(e.clientX);
      ry(e.clientY);
    };
    const over = (e: PointerEvent) => {
      const t = e.target as HTMLElement | null;
      const c = t?.closest<HTMLElement>("[data-cursor]");
      if (c) {
        const v = c.dataset.cursor ?? "";
        if (v === "hide") {
          gsap.to([d, r], { opacity: 0, duration: 0.2 });
          return;
        }
        gsap.to([d, r], { opacity: 1, duration: 0.2 });
        setLabel(v);
        gsap.to(r, { scale: 1, width: 96, height: 96, duration: 0.5, ease: "expo.out" });
        gsap.to(d, { scale: 0, duration: 0.3 });
        return;
      }
      gsap.to([d, r], { opacity: 1, duration: 0.2 });
      setLabel("");
      const interactive = t?.closest("a, button, [role='button'], label, select");
      gsap.to(r, { width: interactive ? 56 : 34, height: interactive ? 56 : 34, duration: 0.5, ease: "expo.out" });
      gsap.to(d, { scale: interactive ? 0.4 : 1, duration: 0.3 });
    };
    const down = () => gsap.to(r, { scale: 0.85, duration: 0.2 });
    const up = () => gsap.to(r, { scale: 1, duration: 0.4, ease: "elastic.out(1,0.5)" });
    const leave = () => gsap.to([d, r], { opacity: 0, duration: 0.3 });
    const enter = () => gsap.to([d, r], { opacity: 1, duration: 0.3 });

    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerover", over, { passive: true });
    window.addEventListener("pointerdown", down);
    window.addEventListener("pointerup", up);
    document.addEventListener("mouseleave", leave);
    document.addEventListener("mouseenter", enter);
    return () => {
      document.documentElement.classList.remove("has-cursor");
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerover", over);
      window.removeEventListener("pointerdown", down);
      window.removeEventListener("pointerup", up);
      document.removeEventListener("mouseleave", leave);
      document.removeEventListener("mouseenter", enter);
    };
  }, [enabled]);

  if (!enabled) return null;
  return (
    <>
      <div
        ref={ring}
        aria-hidden
        className="cursor-ring pointer-events-none fixed left-0 top-0 z-[100] flex h-[34px] w-[34px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-[var(--gold)] mix-blend-difference"
        style={{ opacity: 0 }}
      >
        <span className="font-sans text-[10px] tracking-[0.25em] uppercase text-[#f3eee5]">{label}</span>
      </div>
      <div
        ref={dot}
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[100] h-[6px] w-[6px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--gold)]"
        style={{ opacity: 0 }}
      />
    </>
  );
}
