"use client";

import { useState } from "react";
import type { FloorPlan as Plan, PlanRoom } from "@/config/residences";

const fills: Record<NonNullable<PlanRoom["kind"]>, string> = {
  living: "var(--stone)",
  bed: "color-mix(in srgb, var(--olive) 22%, transparent)",
  wet: "color-mix(in srgb, var(--gold) 22%, transparent)",
  service: "color-mix(in srgb, var(--fg) 7%, transparent)",
  outdoor: "color-mix(in srgb, var(--olive) 38%, transparent)",
  circulation: "transparent",
};

/** Schematic, interactive floor plan rendered from data (illustrative). */
export function FloorPlanView({ plan }: { plan: Plan }) {
  const [hover, setHover] = useState<string | null>(null);
  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
      <div className="relative border border-[var(--line)] bg-[var(--bg)] p-4 lg:col-span-8 md:p-8" data-cursor="hide">
        <svg viewBox="0 0 100 70" className="h-auto w-full" role="img" aria-label={`Schematic floor plan for ${plan.name}`}>
          <rect x="3" y="3" width="94" height="64" fill="none" stroke="var(--fg)" strokeWidth="0.9" />
          {plan.rooms.map((r) => (
            <g key={r.label} onMouseEnter={() => setHover(r.label)} onMouseLeave={() => setHover(null)}>
              <rect
                x={r.x}
                y={r.y}
                width={r.w}
                height={r.h}
                fill={fills[r.kind ?? "living"]}
                stroke="var(--fg)"
                strokeWidth={0.35}
                opacity={hover && hover !== r.label ? 0.35 : 1}
                style={{ transition: "opacity .5s ease" }}
              />
              {hover === r.label && <rect x={r.x} y={r.y} width={r.w} height={r.h} fill="none" stroke="var(--gold)" strokeWidth={0.8} />}
              <text x={r.x + r.w / 2} y={r.y + r.h / 2} textAnchor="middle" dominantBaseline="middle" fontSize={r.w < 18 ? 1.7 : 2.2} fill="var(--fg)" style={{ letterSpacing: "0.08em", textTransform: "uppercase" }}>
                {r.label}
              </text>
            </g>
          ))}
          {/* door swings / openings */}
          <path d="M56 38 A6 6 0 0 1 62 32" fill="none" stroke="var(--fg)" strokeWidth="0.25" />
          <line x1="56" y1="38" x2="62" y2="38" stroke="var(--bg)" strokeWidth="0.8" />
          {/* compass */}
          <g transform="translate(93 63)">
            <circle r="2.6" fill="none" stroke="var(--fg)" strokeWidth="0.2" />
            <path d="M0 -2.4 L0.8 0 L-0.8 0 Z" fill="var(--gold)" />
            <text y="-3.2" textAnchor="middle" fontSize="1.6" fill="var(--fg)">N</text>
          </g>
          {/* scale bar */}
          <g transform="translate(4 68.6)">
            <line x1="0" y1="0" x2="10" y2="0" stroke="var(--fg)" strokeWidth="0.3" />
            <text x="11" y="0.5" fontSize="1.4" fill="var(--muted)">NOT TO SCALE</text>
          </g>
        </svg>
      </div>
      <div className="lg:col-span-4">
        <dl className="grid grid-cols-2 gap-6 border-t border-[var(--line)] pt-6">
          {[
            ["Plan", plan.name],
            ["Bedrooms", String(plan.bedrooms)],
            ["Bathrooms", String(plan.bathrooms)],
            ["Interior", `${plan.areaSqft.toLocaleString("en-US")} sq ft`],
            ["Terrace", `${plan.terraceSqft.toLocaleString("en-US")} sq ft`],
            ["Total", `${(plan.areaSqft + plan.terraceSqft).toLocaleString("en-US")} sq ft`],
          ].map(([k, v]) => (
            <div key={k}>
              <dt className="eyebrow text-[var(--muted)]">{k}</dt>
              <dd className="mt-1 font-display text-2xl">{v}</dd>
            </div>
          ))}
        </dl>
        <ul className="mt-8 flex flex-wrap gap-2" aria-label="Rooms">
          {plan.rooms.map((r) => (
            <li key={r.label}>
              <button
                type="button"
                onMouseEnter={() => setHover(r.label)}
                onMouseLeave={() => setHover(null)}
                onFocus={() => setHover(r.label)}
                onBlur={() => setHover(null)}
                className={`eyebrow border px-2.5 py-1.5 transition-colors duration-300 ${hover === r.label ? "border-[var(--gold)] text-[var(--gold)]" : "border-[var(--line)]"}`}
              >
                {r.label}
              </button>
            </li>
          ))}
        </ul>
        <p className="mt-6 text-xs leading-relaxed text-[var(--muted)]">Schematic plan for illustration. Areas are indicative; final carpet / saleable areas are defined in contract documentation.</p>
      </div>
    </div>
  );
}
