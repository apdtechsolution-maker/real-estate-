"use client";

import { usePathname, useRouter } from "next/navigation";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { markets, type MarketConfig, type MarketId } from "@/config/markets";
import { DEFAULT_MARKET } from "@/config/site";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { SmoothScroll, useSmoothScroll } from "./SmoothScroll";
import { Cursor } from "@/components/ui/Cursor";
import { Logo } from "@/components/ui/Logo";

/* ───────────────────────── Theme (Day / Night) ───────────────────────── */
type Theme = "day" | "night";
const ThemeCtx = createContext<{ theme: Theme; toggle: () => void }>({ theme: "day", toggle: () => {} });
export const useTheme = () => useContext(ThemeCtx);

const themeListeners = new Set<() => void>();

function subscribeTheme(cb: () => void) {
  themeListeners.add(cb);
  return () => {
    themeListeners.delete(cb);
  };
}

function getThemeSnapshot(): Theme {
  return typeof document !== "undefined" && document.documentElement.dataset.theme === "night" ? "night" : "day";
}

function getServerThemeSnapshot(): Theme {
  return "day";
}

function ThemeProvider({ children }: { children: ReactNode }) {
  const theme = useSyncExternalStore(subscribeTheme, getThemeSnapshot, getServerThemeSnapshot);

  const toggle = useCallback(() => {
    const current = getThemeSnapshot();
    const next: Theme = current === "day" ? "night" : "day";
    const root = document.documentElement;
    root.classList.add("theme-transition");
    root.dataset.theme = next;
    try {
      localStorage.setItem("aurelia-theme", next);
    } catch {}
    themeListeners.forEach((cb) => cb());
    window.setTimeout(() => root.classList.remove("theme-transition"), 1400);
  }, []);

  return <ThemeCtx.Provider value={{ theme, toggle }}>{children}</ThemeCtx.Provider>;
}

/* ───────────────────────────── Market ───────────────────────────── */
const MarketCtx = createContext<{ market: MarketConfig; setMarket: (id: MarketId) => void }>({
  market: markets[DEFAULT_MARKET],
  setMarket: () => {},
});
export const useMarket = () => useContext(MarketCtx);

const marketListeners = new Set<() => void>();
let cachedMarket: MarketId | null = null;

function subscribeMarket(cb: () => void) {
  marketListeners.add(cb);
  const onStorage = (e: StorageEvent) => {
    if (e.key === "aurelia-market" && (e.newValue === "india" || e.newValue === "usa")) {
      cachedMarket = e.newValue;
      cb();
    }
  };
  window.addEventListener("storage", onStorage);
  return () => {
    marketListeners.delete(cb);
    window.removeEventListener("storage", onStorage);
  };
}

function getMarketSnapshot(): MarketId {
  if (cachedMarket !== null) return cachedMarket;
  try {
    const saved = localStorage.getItem("aurelia-market");
    if (saved === "india" || saved === "usa") {
      cachedMarket = saved;
      return cachedMarket;
    }
  } catch {}
  cachedMarket = DEFAULT_MARKET;
  return cachedMarket;
}

function getServerMarketSnapshot(): MarketId {
  return DEFAULT_MARKET;
}

function MarketProvider({ children }: { children: ReactNode }) {
  const id = useSyncExternalStore(subscribeMarket, getMarketSnapshot, getServerMarketSnapshot);

  const setMarket = useCallback((next: MarketId) => {
    cachedMarket = next;
    try {
      localStorage.setItem("aurelia-market", next);
    } catch {}
    marketListeners.forEach((cb) => cb());
    requestAnimationFrame(() => ScrollTrigger.refresh());
  }, []);

  const value = useMemo(() => ({ market: markets[id], setMarket }), [id, setMarket]);
  return <MarketCtx.Provider value={value}>{children}</MarketCtx.Provider>;
}

/* ─────────────────────────── Intro state ─────────────────────────── */
const IntroCtx = createContext<{ done: boolean; finish: () => void }>({ done: true, finish: () => {} });
export const useIntro = () => useContext(IntroCtx);

function IntroProvider({ children }: { children: ReactNode }) {
  const [done, setDone] = useState(false);
  const finish = useCallback(() => setDone(true), []);
  return <IntroCtx.Provider value={{ done, finish }}>{children}</IntroCtx.Provider>;
}

/* ─────────────────────────── Page transitions ─────────────────────────── */
const TransitionCtx = createContext<{ navigate: (href: string) => void }>({ navigate: () => {} });
export const usePageTransition = () => useContext(TransitionCtx);

function TransitionProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { scrollTo } = useSmoothScroll();
  const curtain = useRef<HTMLDivElement>(null);
  const pendingHash = useRef<string | null>(null);
  const busy = useRef(false);
  const first = useRef(true);

  const navigate = useCallback(
    (href: string) => {
      const url = new URL(href, window.location.origin);
      const samePage = url.pathname === window.location.pathname;
      if (samePage) {
        if (url.hash) scrollTo(url.hash, { offset: 0 });
        else scrollTo(0);
        return;
      }
      if (busy.current) return;
      busy.current = true;
      pendingHash.current = url.hash || null;
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const el = curtain.current;
      if (!el || reduce) {
        router.push(url.pathname + url.search);
        return;
      }
      gsap
        .timeline({ onComplete: () => router.push(url.pathname + url.search) })
        .set(el, { visibility: "visible" })
        .fromTo(el, { clipPath: "inset(100% 0% 0% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 0.9, ease: "expo.inOut" })
        .fromTo(el.querySelector(".curtain-logo"), { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6, ease: "expo.out" }, "-=0.35");
    },
    [router, scrollTo],
  );

  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    const el = curtain.current;
    window.scrollTo(0, 0);
    scrollTo(0, { immediate: true });
    const t = window.setTimeout(() => {
      ScrollTrigger.refresh();
      if (el && busy.current) {
        gsap
          .timeline({
            onComplete: () => {
              gsap.set(el, { visibility: "hidden" });
              busy.current = false;
            },
          })
          .to(el.querySelector(".curtain-logo"), { opacity: 0, y: -20, duration: 0.4, ease: "power2.in" })
          .to(el, { clipPath: "inset(0% 0% 100% 0%)", duration: 1, ease: "expo.inOut" }, "-=0.1");
      } else {
        busy.current = false;
      }
      if (pendingHash.current) {
        const h = pendingHash.current;
        pendingHash.current = null;
        window.setTimeout(() => scrollTo(h), 700);
      }
    }, 120);
    return () => window.clearTimeout(t);
  }, [pathname, scrollTo]);

  return (
    <TransitionCtx.Provider value={{ navigate }}>
      {children}
      <div
        ref={curtain}
        aria-hidden
        className="pointer-events-none fixed inset-0 z-[90] flex items-center justify-center bg-[#151411] text-[#EDE6D9]"
        style={{ visibility: "hidden", clipPath: "inset(100% 0% 0% 0%)" }}
      >
        <div className="curtain-logo flex flex-col items-center gap-4">
          <Logo className="h-12 w-12 text-[var(--gold)]" />
          <span className="font-sans text-[10px] tracking-[0.5em] uppercase">Aurelia Estates</span>
        </div>
      </div>
    </TransitionCtx.Provider>
  );
}

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <MarketProvider>
        <IntroProvider>
          <SmoothScroll>
            <TransitionProvider>
              {children}
              <Cursor />
            </TransitionProvider>
          </SmoothScroll>
        </IntroProvider>
      </MarketProvider>
    </ThemeProvider>
  );
}
