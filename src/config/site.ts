import { markets, type MarketConfig, type MarketId } from "./markets";

/**
 * Default demo market. Change here or set NEXT_PUBLIC_MARKET=usa in .env
 */
export const DEFAULT_MARKET: MarketId =
  process.env.NEXT_PUBLIC_MARKET === "usa" ? "usa" : "india";

export const site = {
  name: "Aurelia Estates",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://aurelia-estates.example",
  description:
    "Aurelia Estates — architectural residences, sky penthouses and private villas for India and the United States. A design demonstration with illustrative content.",
  nav: [
    { label: "Vision", href: "/#vision" },
    { label: "Location", href: "/#location" },
    { label: "Architecture", href: "/#architecture" },
    { label: "Residences", href: "/#residences" },
    { label: "Amenities", href: "/#amenities" },
    { label: "Lifestyle", href: "/#lifestyle" },
    { label: "Developer", href: "/#developer" },
  ],
  social: [
    { label: "Instagram", href: "https://instagram.com" },
    { label: "LinkedIn", href: "https://linkedin.com" },
    { label: "YouTube", href: "https://youtube.com" },
  ],
  legal: [
    { label: "Privacy", href: "/legal/privacy" },
    { label: "Terms", href: "/legal/terms" },
    { label: "Accessibility", href: "/legal/accessibility" },
  ],
  disclaimer:
    "Design demonstration. All imagery, renders, prices, units, distances and specifications are illustrative only and do not constitute an offer, listing or regulatory disclosure.",
};

export function getMarket(id: MarketId): MarketConfig {
  return markets[id];
}

export function formatPrice(value: number | null, market: MarketConfig, compact = true): string {
  if (value == null) return "Price on request";
  const { code, locale, symbol } = market.currency;
  if (compact && code === "INR") {
    if (value >= 1e7) return `${symbol} ${(value / 1e7).toFixed(value % 1e7 === 0 ? 0 : 2).replace(/\.?0+$/, "")} Cr`;
    if (value >= 1e5) return `${symbol} ${(value / 1e5).toFixed(1).replace(/\.0$/, "")} L`;
  }
  if (compact && code === "USD" && value >= 1e6) {
    return `${symbol}${(value / 1e6).toFixed(2).replace(/\.?0+$/, "")}M`;
  }
  return new Intl.NumberFormat(locale, { style: "currency", currency: code, maximumFractionDigits: 0 }).format(value);
}

export function formatArea(value: number, market: MarketConfig) {
  return `${new Intl.NumberFormat(market.currency.locale).format(value)} ${market.areaUnit}`;
}
