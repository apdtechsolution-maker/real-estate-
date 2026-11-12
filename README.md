# Aurelia Estates — Luxury Residential Experience

Next.js (App Router) · TypeScript · Tailwind v4 · GSAP + ScrollTrigger + SplitText · Lenis · Motion · Drizzle/PostgreSQL · React Hook Form + Zod

## Local development

```bash
cp .env.example .env        # set DATABASE_URL
npm install
npx drizzle-kit push        # creates the `inquiries` table
npm run dev
```

## Market configuration (India / USA)

- `src/config/markets.ts` — currency, phone formats, CTAs, WhatsApp, RERA / MLS fields, compliance copy, map POIs, unit inventory & pricing per market.
- `src/config/residences.ts` — market-agnostic residence content (galleries, floor plans, specifications).
- Default market: `NEXT_PUBLIC_MARKET=india|usa` (`src/config/site.ts`). Visitors can also switch IN / US in the header.
- Regulatory fields (`registrationNumber`, `listingId`) are `null` by design and render only when real, verified values are supplied.

**All prices, units, distances and project names are illustrative demo content.**

## Leads

`POST /api/inquiry` validates with the shared Zod schema (`src/lib/inquiry-schema.ts`), rate-limits, uses a honeypot field, stores the lead in PostgreSQL and optionally forwards it to `LEAD_WEBHOOK_URL` (Bearer `LEAD_WEBHOOK_SECRET`).

## Structure

- `src/components/providers` — Lenis smooth scroll, Day/Night theme, market, intro state, curtain page transitions
- `src/components/motion` — SplitReveal, ParallaxImage, ScrubWords, Counter
- `src/components/sections` — the home page sections (01–11)
- `src/components/residence` — detail experience, floor plans, lightbox
- `/residences/[slug]` property detail · `/residences/[slug]/brochure` printable brochure (Save as PDF)

## Accessibility & motion

When `prefers-reduced-motion` is set, smooth scrolling, the custom cursor, parallax and split-text animations are turned off. Navigation, forms, tabs, the lightbox and galleries all work with a keyboard.

## Imagery

The hero and collection renders are AI-generated originals. The remaining photos are Pexels images stored in `public/images`. Night mode shows a separate night render in the hero; other photos get a stylised "evening grade" and are not presented as real night photography.

## Deploy (Vercel)

Import the repo, set `DATABASE_URL` (e.g. Neon / Vercel Postgres), `NEXT_PUBLIC_SITE_URL` and `NEXT_PUBLIC_MARKET`, run `npx drizzle-kit push` once against that database, then deploy.
