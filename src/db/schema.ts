import { pgTable, serial, text, timestamp, varchar } from "drizzle-orm/pg-core";

/** Private consultation / viewing requests captured by the lead form. */
export const inquiries = pgTable("inquiries", {
  id: serial("id").primaryKey(),
  fullName: varchar("full_name", { length: 120 }).notNull(),
  email: varchar("email", { length: 200 }).notNull(),
  countryCode: varchar("country_code", { length: 8 }).notNull(),
  phone: varchar("phone", { length: 32 }).notNull(),
  market: varchar("market", { length: 16 }).notNull(),
  propertyInterest: varchar("property_interest", { length: 80 }).notNull(),
  preferredContact: varchar("preferred_contact", { length: 24 }).notNull().default("phone"),
  message: text("message"),
  source: varchar("source", { length: 120 }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export type Inquiry = typeof inquiries.$inferSelect;
export type NewInquiry = typeof inquiries.$inferInsert;
