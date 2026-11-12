"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { gsap, useGSAP } from "@/lib/gsap";
import { useIntro, useMarket, useTheme } from "@/components/providers/AppProviders";
import { useSmoothScroll } from "@/components/providers/SmoothScroll";
import { site } from "@/config/site";
import { Logo } from "@/components/ui/Logo";
import { TLink } from "@/components/ui/TLink";
import { Magnetic } from "@/components/ui/Magnetic";

const menuImages = [
  "/images/hero-render-day.jpg",
  "/images/landscape-2.jpg",
  "/images/facade-3.jpg",
  "/images/penthouse.jpg",
  "/images/pool-mountain.jpg",
  "/images/terrace-fire.jpg",
  "/images/villa.jpg",
];

export function ThemeSwitch({ compact = false }: { compact?: boolean }) {
  const { theme, toggle } = useTheme();
  const night = theme === "night";
  return (
    <button
      type="button"
      onClick={toggle}
      role="switch"
      aria-checked={night}
      aria-label={`Switch to ${night ? "day" : "night"} atmosphere`}
      title="Day / Night atmosphere — photography receives an evening grade at night"
      className="group flex items-center gap-2.5"
    >
      <span className="relative flex h-6 w-11 items-center rounded-full border border-current/40 px-0.5">
        <span
          className={`flex h-[18px] w-[18px] items-center justify-center rounded-full bg-[var(--gold)] text-[#1b1a17] transition-transform duration-700 [transition-timing-function:cubic-bezier(0.65,0,0.35,1)] ${night ? "translate-x-[20px]" : "translate-x-0"}`}
        >
          {night ? <Moon size={10} strokeWidth={2} /> : <Sun size={10} strokeWidth={2} />}
        </span>
      </span>
      {!compact && <span className="eyebrow hidden lg:inline">{night ? "Night" : "Day"}</span>}
    </button>
  );
}

export function MarketSwitch() {
  const { market, setMarket } = useMarket();
  return (
    <div role="group" aria-label="Select market" className="flex items-center gap-1 eyebrow">
      {(["india", "usa"] as const).map((id) => (
        <button
          key={id}
          type="button"
          onClick={() => setMarket(id)}
          aria-pressed={market.id === id}
          className={`relative px-1.5 py-1 transition-opacity duration-500 ${market.id === id ? "opacity-100" : "opacity-45 hover:opacity-80"}`}
        >
          {id === "india" ? "IN" : "US"}
          {market.id === id && <span className="absolute inset-x-1.5 bottom-0 h-px bg-[var(--gold)]" />}
        </button>
      ))}
    </div>
  );
}

export function Header() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const { done } = useIntro();
  const { lenis, stop, start } = useSmoothScroll();
  const { market } = useMarket();
  const header = useRef<HTMLElement>(null);
  const menu = useRef<HTMLDivElement>(null);
  const [scrolled, setScrolled] = useState(!isHome);
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);
  const [hover, setHover] = useState(0);
  const menuTl = useRef<gsap.core.Timeline | null>(null);

  // Scroll state (solid background after hero, hide on scroll-down)
  useEffect(() => {
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(!isHome || y > window.innerHeight * 0.8);
      setHidden(y > window.innerHeight && y > last + 2);
      if (y < last - 2) setHidden(false);
      last = y;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [isHome, lenis]);

  // Nav entrance after the intro
  useGSAP(
    () => {
      if (!header.current) return;
      const ready = !isHome || done;
      if (!ready) {
        gsap.set(".nav-in", { yPercent: -120, opacity: 0 });
        return;
      }
      gsap.to(".nav-in", { yPercent: 0, opacity: 1, duration: 1.4, ease: "expo.out", stagger: 0.07, delay: isHome ? 0.9 : 0.2 });
    },
    { scope: header, dependencies: [done, isHome] },
  );

  // Menu timeline
  useGSAP(
    () => {
      if (!menu.current) return;
      menuTl.current = gsap
        .timeline({ paused: true })
        .set(menu.current, { visibility: "visible" })
        .fromTo(menu.current, { clipPath: "inset(0% 0% 100% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 1, ease: "expo.inOut" })
        .from(".menu-link", { yPercent: 120, duration: 1.1, ease: "expo.out", stagger: 0.05 }, 0.45)
        .from(".menu-fade", { opacity: 0, y: 16, duration: 0.8, stagger: 0.05 }, 0.7)
        .from(".menu-img", { clipPath: "inset(100% 0% 0% 0%)", duration: 1.2, ease: "expo.inOut" }, 0.4);
    },
    { scope: menu },
  );

  useEffect(() => {
    const tl = menuTl.current;
    if (!tl) return;
    if (open) {
      stop();
      tl.timeScale(1).play();
      window.setTimeout(() => menu.current?.querySelector<HTMLElement>(".menu-link")?.focus(), 500);
    } else {
      tl.timeScale(1.6).reverse();
      start();
    }
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, stop, start]);

  const solid = scrolled && !open;

  return (
    <>
      <header
        ref={header}
        className={`fixed inset-x-0 top-0 z-[80] transition-[transform,background-color,color,backdrop-filter] duration-700 [transition-timing-function:cubic-bezier(0.19,1,0.22,1)] ${
          hidden && !open ? "-translate-y-full" : "translate-y-0"
        } ${solid ? "bg-[var(--bg)]/80 text-[var(--fg)] backdrop-blur-md" : open ? "text-[#ede6d9]" : "text-[#f3eee5]"}`}
      >
        <div className="mx-auto flex h-[72px] items-center justify-between px-5 md:h-[84px] md:px-10">
          <div className="nav-in">
            <TLink href="/" aria-label="Aurelia Estates — home" className="flex items-center gap-3" onNavigate={() => setOpen(false)}>
              <Logo className={`h-8 w-8 text-[var(--gold)] transition-transform duration-1000 ${scrolled ? "rotate-0 scale-90" : ""}`} />
              <span className="whitespace-nowrap font-display text-[15px] tracking-[0.42em] uppercase">
                Aurelia
                <span
                  className={`inline-block overflow-hidden align-bottom transition-[max-width,opacity] duration-1000 [transition-timing-function:cubic-bezier(0.19,1,0.22,1)] ${
                    scrolled ? "max-w-0 opacity-0" : "max-w-[140px] opacity-100"
                  } hidden sm:inline-block`}
                >
                  &nbsp;Estates
                </span>
              </span>
            </TLink>
          </div>

          <nav aria-label="Primary" className="hidden items-center gap-8 2xl:flex">
            {site.nav.slice(0, 5).map((n) => (
              <div key={n.href} className="nav-in">
                <TLink href={n.href} className="eyebrow u-link pb-1">
                  {n.label}
                </TLink>
              </div>
            ))}
          </nav>

          <div className="flex items-center gap-4 md:gap-6">
            <div className="nav-in hidden md:block">
              <MarketSwitch />
            </div>
            <div className="nav-in">
              <ThemeSwitch />
            </div>
            <div className="nav-in hidden md:block">
              <Magnetic>
                <TLink
                  href="/#contact"
                  className="eyebrow inline-flex items-center whitespace-nowrap border border-current/40 px-5 py-3 transition-colors duration-500 hover:border-[var(--gold)] hover:bg-[var(--gold)] hover:text-[#1b1a17]"
                >
                  {market.primaryCta}
                </TLink>
              </Magnetic>
            </div>
            <div className="nav-in">
              <button
                type="button"
                onClick={() => setOpen((o) => !o)}
                aria-expanded={open}
                aria-controls="site-menu"
                aria-label={open ? "Close menu" : "Open menu"}
                className="group flex h-10 w-10 flex-col items-end justify-center gap-[7px]"
              >
                <span className={`block h-px bg-current transition-all duration-700 ${open ? "w-7 translate-y-[4px] rotate-45" : "w-7"}`} />
                <span className={`block h-px bg-current transition-all duration-700 ${open ? "w-7 -translate-y-[4px] -rotate-45" : "w-4 group-hover:w-7"}`} />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div
        id="site-menu"
        ref={menu}
        role="dialog"
        aria-modal="true"
        aria-label="Site menu"
        aria-hidden={!open}
        className="fixed inset-0 z-[70] overflow-y-auto bg-[#151411] text-[#ede6d9]"
        style={{ visibility: "hidden", clipPath: "inset(0% 0% 100% 0%)" }}
        data-lenis-prevent
      >
        <div className="mx-auto grid min-h-full grid-cols-1 gap-10 px-5 pb-10 pt-28 md:px-10 lg:grid-cols-12">
          <nav aria-label="Menu" className="lg:col-span-7">
            <ul className="space-y-1">
              {site.nav.map((n, i) => (
                <li key={n.href} className="overflow-hidden" onMouseEnter={() => setHover(i)}>
                  <TLink
                    href={n.href}
                    tabIndex={open ? 0 : -1}
                    onNavigate={() => setOpen(false)}
                    className="menu-link group flex items-baseline gap-5 py-1"
                  >
                    <span className="eyebrow w-8 text-[#9a9181]">0{i + 1}</span>
                    <span className="font-display text-[13vw] leading-[0.95] font-light transition-[color,transform] duration-700 group-hover:translate-x-4 group-hover:text-[#cdb27e] sm:text-6xl lg:text-7xl">
                      {n.label}
                    </span>
                  </TLink>
                </li>
              ))}
            </ul>
          </nav>
          <div className="flex flex-col justify-between gap-10 lg:col-span-5">
            <div className="menu-img relative hidden aspect-[4/5] w-full overflow-hidden lg:block">
              {menuImages.map((src, i) => (
                <Image
                  key={src}
                  src={src}
                  alt=""
                  fill
                  sizes="40vw"
                  className={`object-cover transition-[opacity,transform] duration-[1200ms] [transition-timing-function:cubic-bezier(0.19,1,0.22,1)] ${
                    hover === i ? "scale-100 opacity-100" : "scale-110 opacity-0"
                  }`}
                />
              ))}
            </div>
            <div className="grid grid-cols-2 gap-6 text-sm">
              <div className="menu-fade">
                <p className="eyebrow mb-3 text-[#9a9181]">Market</p>
                <MarketSwitch />
              </div>
              <div className="menu-fade">
                <p className="eyebrow mb-3 text-[#9a9181]">Private office</p>
                <a href={market.phone.href} className="u-link block" tabIndex={open ? 0 : -1}>
                  {market.phone.display}
                </a>
                <a href={`mailto:${market.email}`} className="u-link mt-1 block break-all" tabIndex={open ? 0 : -1}>
                  {market.email}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
