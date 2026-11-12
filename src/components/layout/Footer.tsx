"use client";

import { useRef } from "react";
import { ArrowUp } from "lucide-react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/gsap";
import { useMarket } from "@/components/providers/AppProviders";
import { useSmoothScroll } from "@/components/providers/SmoothScroll";
import { site } from "@/config/site";
import { TLink } from "@/components/ui/TLink";
import { Logo } from "@/components/ui/Logo";

export function Footer() {
  const { market } = useMarket();
  const { scrollTo } = useSmoothScroll();
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (!ref.current || prefersReducedMotion()) return;
      gsap.from(".ft-word span", {
        yPercent: 100,
        duration: 1.4,
        ease: "expo.out",
        stagger: 0.05,
        scrollTrigger: { trigger: ".ft-word", start: "top 95%", toggleActions: "play none none reverse" },
      });
    },
    { scope: ref },
  );

  return (
    <footer ref={ref} className="relative overflow-hidden bg-[#12110f] pt-24 text-[#ede6d9]" aria-label="Site footer">
      <div className="grid grid-cols-2 gap-12 px-5 md:grid-cols-12 md:px-10">
        <div className="col-span-2 md:col-span-4">
          <Logo className="h-10 w-10 text-[#cdb27e]" />
          <p className="mt-6 max-w-xs font-display text-2xl leading-snug">Architectural residences for a considered life.</p>
          <p className="eyebrow mt-6 text-[#9a9181]">Markets · {market.cities.join(" · ")}</p>
        </div>
        <nav aria-label="Footer" className="md:col-span-2 md:col-start-6">
          <p className="eyebrow text-[#9a9181]">Explore</p>
          <ul className="mt-5 space-y-2.5">
            {site.nav.map((n) => (
              <li key={n.href}>
                <TLink href={n.href} className="u-link">
                  {n.label}
                </TLink>
              </li>
            ))}
          </ul>
        </nav>
        <div className="md:col-span-2">
          <p className="eyebrow text-[#9a9181]">Follow</p>
          <ul className="mt-5 space-y-2.5">
            {site.social.map((s) => (
              <li key={s.label}>
                <a href={s.href} target="_blank" rel="noopener noreferrer" className="u-link">
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div className="col-span-2 md:col-span-3">
          <p className="eyebrow text-[#9a9181]">Private office</p>
          <ul className="mt-5 space-y-2.5 text-sm">
            <li>
              <a href={market.phone.href} className="u-link">
                {market.phone.display}
              </a>
            </li>
            <li>
              <a href={`mailto:${market.email}`} className="u-link break-all">
                {market.email}
              </a>
            </li>
            <li className="text-[#9a9181]">{market.project.address}</li>
          </ul>
        </div>
      </div>

      <div className="mt-20 grid grid-cols-1 gap-6 border-t border-white/10 px-5 py-8 text-xs leading-relaxed text-[#9a9181] md:grid-cols-12 md:px-10">
        <div className="space-y-2 md:col-span-8">
          <p>{site.disclaimer}</p>
          {market.compliance.map((c) => (
            <p key={c}>{c}</p>
          ))}
          {market.regulatory?.registrationNumber && (
            <p>
              {market.regulatory.authority} Reg. No. {market.regulatory.registrationNumber}
              {market.regulatory.website && (
                <>
                  {" "}·{" "}
                  <a className="u-link" href={market.regulatory.website} target="_blank" rel="noopener noreferrer">
                    {market.regulatory.website.replace(/^https?:\/\//, "")}
                  </a>
                </>
              )}
            </p>
          )}
          {market.mls?.listingId && (
            <p>
              MLS# {market.mls.listingId}
              {market.mls.provider ? ` · ${market.mls.provider}` : ""}
            </p>
          )}
        </div>
        <div className="flex items-start justify-between gap-6 md:col-span-4 md:justify-end">
          <ul className="flex flex-wrap gap-5">
            {site.legal.map((l) => (
              <li key={l.href}>
                <TLink href={l.href} className="u-link">
                  {l.label}
                </TLink>
              </li>
            ))}
          </ul>
          <button type="button" onClick={() => scrollTo(0)} aria-label="Back to top" className="flex h-10 w-10 shrink-0 items-center justify-center border border-white/20 transition-colors hover:border-[#cdb27e] hover:text-[#cdb27e]">
            <ArrowUp size={14} />
          </button>
        </div>
      </div>

      <div className="ft-word flex select-none justify-between overflow-hidden px-3 font-display text-[21vw] font-light leading-[0.78] tracking-[-0.03em] text-[#ede6d9]/[0.07]" aria-hidden>
        {"AURELIA".split("").map((c, i) => (
          <span key={i} className="inline-block">
            {c}
          </span>
        ))}
      </div>
      <p className="px-5 pb-6 text-[10px] text-[#9a9181] md:px-10">© {new Date().getFullYear()} Aurelia Estates. Demonstration website.</p>
    </footer>
  );
}
