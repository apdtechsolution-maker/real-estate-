import { z } from "zod";

export const COUNTRY_CODES = [
  { code: "+91", label: "India (+91)" },
  { code: "+1", label: "USA / Canada (+1)" },
  { code: "+44", label: "United Kingdom (+44)" },
  { code: "+971", label: "UAE (+971)" },
  { code: "+65", label: "Singapore (+65)" },
  { code: "+61", label: "Australia (+61)" },
] as const;

export const INTERESTS = [
  { value: "signature-residences", label: "Signature Residences" },
  { value: "sky-penthouses", label: "Sky Penthouses" },
  { value: "private-villas", label: "Private Villas" },
  { value: "undecided", label: "Not sure yet" },
] as const;

type Code = (typeof COUNTRY_CODES)[number]["code"];
const codes = COUNTRY_CODES.map((c) => c.code) as [Code, ...Code[]];
type Interest = (typeof INTERESTS)[number]["value"];
const interests = INTERESTS.map((i) => i.value) as [Interest, ...Interest[]];

export function isValidPhone(countryCode: string, phone: string) {
  const digits = phone.replace(/\D/g, "");
  if (countryCode === "+91") return /^[6-9]\d{9}$/.test(digits);
  if (countryCode === "+1") return /^[2-9]\d{2}[2-9]\d{6}$/.test(digits.length === 11 && digits.startsWith("1") ? digits.slice(1) : digits);
  return digits.length >= 6 && digits.length <= 14;
}

export const inquirySchema = z
  .object({
    fullName: z.string().trim().min(2, "Please enter your full name").max(120, "Name is too long"),
    email: z.string().trim().email("Please enter a valid email address").max(200),
    countryCode: z.enum(codes),
    phone: z.string().trim().min(6, "Please enter your phone number").max(20, "Phone number is too long"),
    propertyInterest: z.enum(interests, { message: "Please choose a residence" }),
    preferredContact: z.enum(["phone", "email", "whatsapp"]),
    message: z.string().trim().max(1500, "Please keep your message under 1500 characters").optional(),
    market: z.enum(["india", "usa"]),
    consent: z.boolean().refine((v) => v === true, { message: "Please agree so we can contact you" }),
    source: z.string().max(120).optional(),
    company: z.string().max(0).optional(), // honeypot
  })
  .superRefine((d, ctx) => {
    if (!isValidPhone(d.countryCode, d.phone)) {
      ctx.addIssue({
        code: "custom",
        path: ["phone"],
        message:
          d.countryCode === "+91"
            ? "Enter a valid 10-digit Indian mobile number"
            : d.countryCode === "+1"
              ? "Enter a valid 10-digit US number, e.g. (305) 555-0142"
              : "Enter a valid phone number",
      });
    }
  });

export type InquiryInput = z.input<typeof inquirySchema>;
export type InquiryOutput = z.output<typeof inquirySchema>;
