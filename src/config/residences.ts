/**
 * Market-agnostic residence content. Pricing, units and availability live in
 * the market configuration (src/config/markets.ts) so the same architecture
 * can be marketed in India or the USA without duplication.
 */

export type ResidenceSlug = "signature-residences" | "sky-penthouses" | "private-villas";

export interface PlanRoom {
  label: string;
  x: number;
  y: number;
  w: number;
  h: number;
  kind?: "living" | "bed" | "wet" | "service" | "outdoor" | "circulation";
}

export interface FloorPlan {
  id: string;
  name: string;
  bedrooms: number;
  bathrooms: number;
  areaSqft: number;
  terraceSqft: number;
  rooms: PlanRoom[];
}

export interface Residence {
  slug: ResidenceSlug;
  index: string;
  name: string;
  shortName: string;
  propertyType: string;
  tagline: string;
  description: string;
  bedrooms: string;
  bathrooms: string;
  areaSqft: { min: number; max: number };
  heroImage: string;
  cardImage: string;
  gallery: { src: string; alt: string; caption: string }[];
  highlights: string[];
  specifications: { group: string; items: { label: string; value: string }[] }[];
  floorPlans: FloorPlan[];
}

const planA: PlanRoom[] = [
  { label: "Living & Dining", x: 4, y: 4, w: 52, h: 34, kind: "living" },
  { label: "Kitchen", x: 56, y: 4, w: 20, h: 18, kind: "service" },
  { label: "Pantry", x: 76, y: 4, w: 20, h: 18, kind: "service" },
  { label: "Foyer", x: 56, y: 22, w: 20, h: 16, kind: "circulation" },
  { label: "Powder", x: 76, y: 22, w: 20, h: 16, kind: "wet" },
  { label: "Primary Suite", x: 4, y: 38, w: 34, h: 28, kind: "bed" },
  { label: "Bath", x: 38, y: 38, w: 18, h: 14, kind: "wet" },
  { label: "Dressing", x: 38, y: 52, w: 18, h: 14, kind: "service" },
  { label: "Bedroom 2", x: 56, y: 38, w: 22, h: 28, kind: "bed" },
  { label: "Bedroom 3", x: 78, y: 38, w: 18, h: 28, kind: "bed" },
];

const planB: PlanRoom[] = [
  { label: "Grand Salon", x: 4, y: 4, w: 46, h: 30, kind: "living" },
  { label: "Dining", x: 50, y: 4, w: 24, h: 30, kind: "living" },
  { label: "Show Kitchen", x: 74, y: 4, w: 22, h: 18, kind: "service" },
  { label: "Staff", x: 74, y: 22, w: 22, h: 12, kind: "service" },
  { label: "Wraparound Terrace", x: 4, y: 34, w: 92, h: 6, kind: "outdoor" },
  { label: "Primary Suite", x: 4, y: 40, w: 30, h: 26, kind: "bed" },
  { label: "Spa Bath", x: 34, y: 40, w: 16, h: 26, kind: "wet" },
  { label: "Library", x: 50, y: 40, w: 16, h: 26, kind: "living" },
  { label: "Suite 2", x: 66, y: 40, w: 30, h: 26, kind: "bed" },
];

const planC: PlanRoom[] = [
  { label: "Courtyard Pool", x: 30, y: 4, w: 40, h: 22, kind: "outdoor" },
  { label: "Living Pavilion", x: 4, y: 4, w: 26, h: 34, kind: "living" },
  { label: "Kitchen & Dining", x: 70, y: 4, w: 26, h: 34, kind: "living" },
  { label: "Gallery", x: 30, y: 26, w: 40, h: 12, kind: "circulation" },
  { label: "Primary Pavilion", x: 4, y: 38, w: 32, h: 28, kind: "bed" },
  { label: "Bath", x: 36, y: 38, w: 14, h: 14, kind: "wet" },
  { label: "Wellness", x: 36, y: 52, w: 14, h: 14, kind: "wet" },
  { label: "Suite 2", x: 50, y: 38, w: 23, h: 28, kind: "bed" },
  { label: "Suite 3", x: 73, y: 38, w: 23, h: 28, kind: "bed" },
];

export const residences: Residence[] = [
  {
    slug: "signature-residences",
    index: "01",
    name: "Signature Residences",
    shortName: "Signature",
    propertyType: "Apartment Residence",
    tagline: "Light-filled homes framed in travertine and oak.",
    description:
      "Generous floor-through residences with dual-aspect living, deep shaded loggias and a calm palette of honed stone, fluted oak and bronze. Every plan is drawn around natural light and cross-ventilation.",
    bedrooms: "3 – 4",
    bathrooms: "3.5 – 4.5",
    areaSqft: { min: 3200, max: 4600 },
    heroImage: "/images/residence-interior.jpg",
    cardImage: "/images/residence-interior.jpg",
    gallery: [
      { src: "/images/residence-interior.jpg", alt: "Open living and dining with travertine walls", caption: "Living & dining" },
      { src: "/images/int-fireplace.jpg", alt: "Living room with minimalist fireplace", caption: "The hearth" },
      { src: "/images/bed-2.jpg", alt: "Bright bedroom with view", caption: "Primary suite" },
      { src: "/images/int-dining.jpg", alt: "Minimal dining area with white furniture", caption: "Dining" },
      { src: "/images/int-light.jpg", alt: "Minimal interior washed in daylight", caption: "Morning light" },
      { src: "/images/terrace.jpg", alt: "Spacious timber terrace", caption: "Loggia" },
    ],
    highlights: ["Dual-aspect living", "Private lift lobby", "Deep shaded loggias", "Smart climate & lighting"],
    specifications: [
      {
        group: "Interiors",
        items: [
          { label: "Flooring", value: "Honed travertine & engineered oak" },
          { label: "Ceiling height", value: "3.4 m clear (living)" },
          { label: "Kitchen", value: "Bespoke fluted oak with stone island" },
          { label: "Glazing", value: "Floor-to-ceiling, thermally broken bronze frames" },
        ],
      },
      {
        group: "Building",
        items: [
          { label: "Residences per floor", value: "2" },
          { label: "Parking", value: "2 – 3 assigned bays with EV charging" },
          { label: "Security", value: "24/7 concierge & access control" },
          { label: "Accessibility", value: "Step-free routes & lift access" },
        ],
      },
    ],
    floorPlans: [
      { id: "S-3A", name: "Type 3A", bedrooms: 3, bathrooms: 3.5, areaSqft: 3200, terraceSqft: 380, rooms: planA },
      { id: "S-4B", name: "Type 4B", bedrooms: 4, bathrooms: 4.5, areaSqft: 4600, terraceSqft: 520, rooms: planB },
    ],
  },
  {
    slug: "sky-penthouses",
    index: "02",
    name: "Sky Penthouses",
    shortName: "Penthouse",
    propertyType: "Duplex Penthouse",
    tagline: "Double-height living above the horizon line.",
    description:
      "Crowning the tower, each penthouse unfolds over two levels with a double-height salon, a private rooftop terrace and plunge pool, and uninterrupted views across the water and skyline.",
    bedrooms: "4 – 5",
    bathrooms: "5.5 – 6.5",
    areaSqft: { min: 7200, max: 9800 },
    heroImage: "/images/penthouse.jpg",
    cardImage: "/images/penthouse.jpg",
    gallery: [
      { src: "/images/penthouse.jpg", alt: "Double-height penthouse salon at golden hour", caption: "Double-height salon" },
      { src: "/images/twilight-apt.jpg", alt: "Apartment with panoramic twilight city view", caption: "Twilight panorama" },
      { src: "/images/pool-rooftop.jpg", alt: "Rooftop infinity pool with skyline", caption: "Rooftop plunge pool" },
      { src: "/images/bed-city.jpg", alt: "Bedroom with city view", caption: "Sky suite" },
      { src: "/images/terrace-fire.jpg", alt: "Terrace with fireplace and city view", caption: "Fire terrace" },
      { src: "/images/int-black.jpg", alt: "Minimal interior with piano corner", caption: "Music room" },
    ],
    highlights: ["Private rooftop & plunge pool", "Double-height salon", "Private elevator", "Staff quarters"],
    specifications: [
      {
        group: "Interiors",
        items: [
          { label: "Flooring", value: "Book-matched marble & wide-plank oak" },
          { label: "Ceiling height", value: "6.8 m double-height salon" },
          { label: "Kitchen", value: "Show kitchen + concealed service kitchen" },
          { label: "Wellness", value: "Steam room & private gym provision" },
        ],
      },
      {
        group: "Building",
        items: [
          { label: "Residences per floor", value: "1 (full-floor duplex)" },
          { label: "Parking", value: "4 assigned bays with EV charging" },
          { label: "Access", value: "Private elevator & lobby" },
          { label: "Outdoor", value: "Rooftop terrace with plunge pool" },
        ],
      },
    ],
    floorPlans: [
      { id: "P-L1", name: "Lower Level", bedrooms: 3, bathrooms: 3.5, areaSqft: 4800, terraceSqft: 900, rooms: planB },
      { id: "P-L2", name: "Upper Level", bedrooms: 2, bathrooms: 3, areaSqft: 4000, terraceSqft: 1600, rooms: planA },
    ],
  },
  {
    slug: "private-villas",
    index: "03",
    name: "Private Villas",
    shortName: "Villa",
    propertyType: "Detached Villa",
    tagline: "Courtyard pavilions set within olive gardens.",
    description:
      "A limited collection of single-level and two-level villas arranged around private courtyards, lap pools and mature olive gardens — the intimacy of a country house, minutes from the city.",
    bedrooms: "5 – 6",
    bathrooms: "6.5 – 7.5",
    areaSqft: { min: 9500, max: 14000 },
    heroImage: "/images/villa.jpg",
    cardImage: "/images/villa.jpg",
    gallery: [
      { src: "/images/villa.jpg", alt: "Limestone villa pavilion with lap pool", caption: "Courtyard pavilion" },
      { src: "/images/hero-render-day.jpg", alt: "Travertine villa with infinity pool", caption: "Pool terrace" },
      { src: "/images/landscape-1.jpg", alt: "Modern house with lawn and stone paths", caption: "Gardens" },
      { src: "/images/spa.jpg", alt: "Wooden sauna with stone heater", caption: "Private sauna" },
      { src: "/images/bed-1.jpg", alt: "Modern bedroom with soft light", caption: "Guest pavilion" },
      { src: "/images/int-chair.jpg", alt: "Beige lounge chair in calm interior", caption: "Reading room" },
    ],
    highlights: ["Private courtyard & lap pool", "Mature olive gardens", "Wellness pavilion", "Garage for 4"],
    specifications: [
      {
        group: "Interiors",
        items: [
          { label: "Flooring", value: "Tumbled limestone & oak" },
          { label: "Ceiling height", value: "4.2 m pavilions" },
          { label: "Kitchen", value: "Chef's kitchen with scullery" },
          { label: "Wellness", value: "Sauna, steam & treatment room" },
        ],
      },
      {
        group: "Grounds",
        items: [
          { label: "Plot", value: "Generous private plot (varies per villa)" },
          { label: "Pool", value: "Heated stone lap pool" },
          { label: "Parking", value: "Enclosed garage for 4 with EV charging" },
          { label: "Landscape", value: "Mediterranean & native planting" },
        ],
      },
    ],
    floorPlans: [
      { id: "V-G", name: "Ground Pavilions", bedrooms: 3, bathrooms: 4.5, areaSqft: 7200, terraceSqft: 2400, rooms: planC },
      { id: "V-U", name: "Upper Suites", bedrooms: 3, bathrooms: 3, areaSqft: 4300, terraceSqft: 800, rooms: planA },
    ],
  },
];

export function getResidence(slug: string) {
  return residences.find((r) => r.slug === slug);
}
