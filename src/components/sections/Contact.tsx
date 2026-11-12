"use client";

import { MessageCircle, Phone, Mail, CalendarDays } from "lucide-react";
import { useMarket } from "@/components/providers/AppProviders";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { SplitReveal } from "@/components/motion/SplitReveal";
import { ParallaxImage } from "@/components/motion/ParallaxImage";
import { InquiryForm } from "@/components/forms/InquiryForm";
import { Magnetic } from "@/components/ui/Magnetic";

export function Contact() {
  const { market } = useMarket();
  const waText = encodeURIComponent(`Hello Aurelia Estates, I'd like to know more about ${market.project.name}.`);
  return (
    <section id="contact" aria-labelledby="contact-title" className="relative bg-[var(--bg)] py-28 md:py-40">
      <div className="px-5 md:px-10">
        <SectionLabel index="10" label="Private Consultation" />
      </div>
      <div className="mt-14 grid grid-cols-1 gap-16 px-5 md:px-10 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <SplitReveal as="h2" id="contact-title" className="display text-[13vw] md:text-[7vw] lg:text-[5.4vw]">
            Begin a private conversation.
          </SplitReveal>
          <p className="mt-8 max-w-md leading-relaxed text-[var(--muted)]">
            Visits to {market.project.name} are by appointment only. Share a few details and our private office will arrange a {market.id === "usa" ? "tour" : "viewing"} at a time that suits you — in person or by private video walkthrough.
          </p>

          <div className="mt-10 flex flex-wrap gap-3">
            {market.whatsapp ? (
              <Magnetic>
                <a
                  href={`https://wa.me/${market.whatsapp}?text=${waText}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="eyebrow inline-flex items-center gap-3 border border-[var(--fg)] px-5 py-4 transition-colors duration-500 hover:bg-[var(--fg)] hover:text-[var(--bg)]"
                >
                  <MessageCircle size={15} strokeWidth={1.5} /> WhatsApp Enquiry
                </a>
              </Magnetic>
            ) : (
              <Magnetic>
                <a
                  href="#contact-form"
                  className="eyebrow inline-flex items-center gap-3 border border-[var(--fg)] px-5 py-4 transition-colors duration-500 hover:bg-[var(--fg)] hover:text-[var(--bg)]"
                >
                  <CalendarDays size={15} strokeWidth={1.5} /> Schedule a Tour
                </a>
              </Magnetic>
            )}
            <a href={market.phone.href} className="eyebrow inline-flex items-center gap-3 border border-[var(--line)] px-5 py-4 transition-colors duration-500 hover:border-[var(--fg)]">
              <Phone size={15} strokeWidth={1.5} /> Call
            </a>
            <a href={`mailto:${market.email}`} className="eyebrow inline-flex items-center gap-3 border border-[var(--line)] px-5 py-4 transition-colors duration-500 hover:border-[var(--fg)]">
              <Mail size={15} strokeWidth={1.5} /> Email
            </a>
          </div>

          <ParallaxImage src="/images/hero-render-night.jpg" alt="Residence at night with warm interior light" className="mt-14 hidden aspect-[16/10] w-full lg:block" sizes="40vw" reveal="up" />
          <dl className="mt-8 grid grid-cols-2 gap-6 text-sm">
            <div>
              <dt className="eyebrow text-[var(--muted)]">Sales gallery</dt>
              <dd className="mt-2">{market.project.address}</dd>
            </div>
            <div>
              <dt className="eyebrow text-[var(--muted)]">Hours</dt>
              <dd className="mt-2">By appointment, 7 days</dd>
            </div>
          </dl>
        </div>
        <div id="contact-form" className="lg:col-span-6 lg:col-start-7">
          <div className="border-t border-[var(--line)] pt-10">
            <InquiryForm source="home-consultation" />
          </div>
        </div>
      </div>
    </section>
  );
}
