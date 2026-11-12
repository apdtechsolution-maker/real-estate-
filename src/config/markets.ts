import type { ResidenceSlug } from "./residences";

/**
 * ─────────────────────────────────────────────────────────────────────────
 *  MARKET CONFIGURATION
 * ─────────────────────────────────────────────────────────────────────────
 *  Switch the default demo market with NEXT_PUBLIC_MARKET=india | usa
 *  (see src/config/site.ts). Visitors can also toggle IN / US in the header.
 *
 *  IMPORTANT: All prices, units, distances and project names below are
 *  ILLUSTRATIVE DEMO CONTENT. Regulatory fields (RERA / MLS) are left `null`
 *  on purpose and only render when real, verified values are supplied.
 * ─────────────────────────────────────────────────────────────────────────
 */

export type MarketId = "india" | "usa";

export type UnitStatus = "Available" | "Reserved" | "Price on request";

export interface Unit {
  id: string;
  level: string;
  planId: string;
  bedrooms: number;
  areaSqft: number;
  view: string;
  status: UnitStatus;
  price: number | null;
}

export interface MarketResidence {
  slug: ResidenceSlug;
  priceFrom: number | null;
  units: Unit[];
}

export interface PointOfInterest {
  id: string;
  name: string;
  category: "Business" | "Leisure" | "Culture" | "Travel" | "Wellness" | "Education";
  time: string;
  x: number;
  y: number;
}

export interface MarketConfig {
  id: MarketId;
  label: string;
  shortLabel: string;
  project: {
    name: string;
    neighbourhood: string;
    city: string;
    country: string;
    address: string;
  };
  cities: string[];
  currency: { code: "INR" | "USD"; locale: string; symbol: string };
  areaUnit: "sq ft";
  phone: {
    defaultCountryCode: string;
    placeholder: string;
    display: string;
    href: string;
  };
  email: string;
  whatsapp: string | null;
  primaryCta: string;
  secondaryCta: string;
  regulatory: {
    authority: string;
    registrationNumber: string | null;
    website: string | null;
    note: string;
  } | null;
  mls: { listingId: string | null; provider: string | null } | null;
  compliance: string[];
  location: {
    headline: string;
    story: string;
    stats: { value: number; suffix: string; label: string }[];
    water: string;
    pois: PointOfInterest[];
  };
  residences: MarketResidence[];
}

const mk = (
  prefix: string,
  rows: [string, string, number, number, string, UnitStatus, number | null][],
): Unit[] =>
  rows.map(([level, planId, bedrooms, areaSqft, view, status, price], i) => ({
    id: `${prefix}-${String(i + 1).padStart(2, "0")}`,
    level,
    planId,
    bedrooms,
    areaSqft,
    view,
    status,
    price,
  }));

export const markets: Record<MarketId, MarketConfig> = {
  india: {
    id: "india",
    label: "India",
    shortLabel: "IN",
    project: {
      name: "Aurelia Sea Face",
      neighbourhood: "Worli Sea Face",
      city: "Mumbai",
      country: "India",
      address: "Demo address · Worli Sea Face, Mumbai 400030",
    },
    cities: ["Mumbai", "Delhi NCR", "Bengaluru", "Hyderabad", "Pune"],
    currency: { code: "INR", locale: "en-IN", symbol: "₹" },
    areaUnit: "sq ft",
    phone: {
      defaultCountryCode: "+91",
      placeholder: "98765 43210",
      display: "+91 00000 00000 (demo)",
      href: "tel:+910000000000",
    },
    email: "privateoffice@aurelia-estates.example",
    whatsapp: "910000000000",
    primaryCta: "Book Private Viewing",
    secondaryCta: "WhatsApp Enquiry",
    regulatory: {
      authority: "MahaRERA",
      registrationNumber: null,
      website: "https://maharera.maharashtra.gov.in",
      note: "RERA registration details will be displayed here once supplied by the developer. This is a design demonstration and not an offer for sale.",
    },
    mls: null,
    compliance: [
      "Prices are indicative, exclusive of stamp duty, registration, GST and other statutory charges.",
      "Carpet area as defined under RERA will be disclosed in the agreement for sale.",
    ],
    location: {
      headline: "Where the Arabian Sea meets the city's finest address.",
      story:
        "Set along the sweep of the sea face, the residences sit between the calm of the promenade and the energy of Mumbai's business districts — sunsets to the west, the skyline to the east.",
      stats: [
        { value: 12, suffix: " min", label: "to BKC (approx.)" },
        { value: 180, suffix: "°", label: "sea-facing arc" },
        { value: 60, suffix: "%", label: "of site as open landscape" },
      ],
      water: "Arabian Sea",
      pois: [
        { id: "sealink", name: "Bandra–Worli Sea Link", category: "Travel", time: "4 min", x: 30, y: 26 },
        { id: "bkc", name: "Bandra Kurla Complex", category: "Business", time: "12 min", x: 62, y: 18 },
        { id: "racecourse", name: "Mahalaxmi Racecourse", category: "Leisure", time: "8 min", x: 58, y: 66 },
        { id: "ncpa", name: "NCPA, Nariman Point", category: "Culture", time: "22 min", x: 46, y: 90 },
        { id: "airport", name: "CSMI Airport", category: "Travel", time: "30 min", x: 84, y: 8 },
        { id: "promenade", name: "Sea Face Promenade", category: "Wellness", time: "2 min", x: 36, y: 50 },
        { id: "school", name: "International schools", category: "Education", time: "10 min", x: 72, y: 44 },
      ],
    },
    residences: [
      {
        slug: "signature-residences",
        priceFrom: 125000000,
        units: mk("SR", [
          ["Level 18", "S-3A", 3, 3200, "Sea", "Available", 125000000],
          ["Level 21", "S-3A", 3, 3200, "Sea & city", "Reserved", null],
          ["Level 24", "S-4B", 4, 4600, "Sea", "Available", 182000000],
          ["Level 27", "S-4B", 4, 4600, "Panoramic", "Price on request", null],
          ["Level 30", "S-3A", 3, 3250, "Sea", "Available", 134000000],
        ]),
      },
      {
        slug: "sky-penthouses",
        priceFrom: null,
        units: mk("PH", [
          ["Levels 44–45", "P-L1", 5, 9800, "360° panoramic", "Price on request", null],
          ["Levels 42–43", "P-L1", 4, 7200, "Sea & skyline", "Price on request", null],
        ]),
      },
      {
        slug: "private-villas",
        priceFrom: 280000000,
        units: mk("VL", [
          ["Villa 1", "V-G", 5, 9500, "Olive garden", "Available", 280000000],
          ["Villa 2", "V-G", 5, 10200, "Courtyard", "Reserved", null],
          ["Villa 3", "V-G", 6, 14000, "Garden & sea glimpse", "Price on request", null],
        ]),
      },
    ],
  },
  usa: {
    id: "usa",
    label: "United States",
    shortLabel: "US",
    project: {
      name: "Aurelia Bayfront",
      neighbourhood: "Coconut Grove",
      city: "Miami",
      country: "USA",
      address: "Demo address · Coconut Grove, Miami, FL 33133",
    },
    cities: ["Miami", "Los Angeles", "New York", "Austin", "San Francisco"],
    currency: { code: "USD", locale: "en-US", symbol: "$" },
    areaUnit: "sq ft",
    phone: {
      defaultCountryCode: "+1",
      placeholder: "(305) 555-0142",
      display: "+1 (000) 000-0000 (demo)",
      href: "tel:+10000000000",
    },
    email: "privateoffice@aurelia-estates.example",
    whatsapp: null,
    primaryCta: "Schedule a Tour",
    secondaryCta: "Request Pricing",
    regulatory: null,
    mls: { listingId: null, provider: null },
    compliance: [
      "Equal Housing Opportunity. We are committed to the letter and spirit of U.S. fair housing law.",
      "We aim to conform to WCAG 2.2 AA. Contact us for accessible formats of any material.",
      "Prices, availability and specifications are illustrative and subject to change without notice.",
    ],
    location: {
      headline: "Bayfront calm, minutes from the pulse of Miami.",
      story:
        "Moments from the bay and its marinas, beneath a canopy of banyan and palm, the residences balance a slower, village rhythm with quick access to Brickell, the Design District and the airport.",
      stats: [
        { value: 10, suffix: " min", label: "to Brickell (approx.)" },
        { value: 270, suffix: "°", label: "bay & skyline views" },
        { value: 55, suffix: "%", label: "of site as open landscape" },
      ],
      water: "Biscayne Bay",
      pois: [
        { id: "marina", name: "Dinner Key Marina", category: "Leisure", time: "3 min", x: 40, y: 52 },
        { id: "brickell", name: "Brickell", category: "Business", time: "10 min", x: 60, y: 20 },
        { id: "gables", name: "Coral Gables", category: "Culture", time: "12 min", x: 82, y: 58 },
        { id: "keybiscayne", name: "Key Biscayne", category: "Wellness", time: "18 min", x: 18, y: 72 },
        { id: "mia", name: "Miami International Airport", category: "Travel", time: "20 min", x: 86, y: 10 },
        { id: "design", name: "Design District", category: "Culture", time: "22 min", x: 66, y: 4 },
        { id: "schools", name: "Private schools", category: "Education", time: "8 min", x: 72, y: 40 },
      ],
    },
    residences: [
      {
        slug: "signature-residences",
        priceFrom: 4200000,
        units: mk("SR", [
          ["Floor 8", "S-3A", 3, 3200, "Bay", "Available", 4200000],
          ["Floor 10", "S-3A", 3, 3200, "Bay & garden", "Reserved", null],
          ["Floor 12", "S-4B", 4, 4600, "Bay", "Available", 6150000],
          ["Floor 14", "S-4B", 4, 4600, "Panoramic", "Price on request", null],
          ["Floor 16", "S-3A", 3, 3250, "Skyline", "Available", 4550000],
        ]),
      },
      {
        slug: "sky-penthouses",
        priceFrom: null,
        units: mk("PH", [
          ["Floors 21–22", "P-L1", 5, 9800, "360° bay & skyline", "Price on request", null],
          ["Floors 19–20", "P-L1", 4, 7200, "Bay", "Price on request", null],
        ]),
      },
      {
        slug: "private-villas",
        priceFrom: 9800000,
        units: mk("VL", [
          ["Villa A", "V-G", 5, 9500, "Garden", "Available", 9800000],
          ["Villa B", "V-G", 5, 10200, "Courtyard", "Reserved", null],
          ["Villa C", "V-G", 6, 14000, "Waterfront glimpse", "Price on request", null],
        ]),
      },
    ],
  },
};
