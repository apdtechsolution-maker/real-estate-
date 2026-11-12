"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "motion/react";
import { ArrowRight, Check, Loader2 } from "lucide-react";
import { useMarket } from "@/components/providers/AppProviders";
import { COUNTRY_CODES, INTERESTS, inquirySchema, type InquiryInput, type InquiryOutput } from "@/lib/inquiry-schema";

type Interest = InquiryInput["propertyInterest"];

interface Props {
  defaultInterest?: Interest;
  source?: string;
  compact?: boolean;
}

function FieldError({ id, msg }: { id: string; msg?: string }) {
  return (
    <AnimatePresence>
      {msg && (
        <motion.p
          id={id}
          role="alert"
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          className="mt-2 text-xs text-[#b5543f]"
        >
          {msg}
        </motion.p>
      )}
    </AnimatePresence>
  );
}

export function InquiryForm({ defaultInterest = "undecided", source = "website", compact = false }: Props) {
  const { market } = useMarket();
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [serverError, setServerError] = useState("");
  const [reference, setReference] = useState("");

  const {
    register,
    handleSubmit,
    setValue,
    setError,
    reset,
    watch,
    formState: { errors },
  } = useForm<InquiryInput, unknown, InquiryOutput>({
    resolver: zodResolver(inquirySchema),
    mode: "onTouched",
    defaultValues: {
      fullName: "",
      email: "",
      countryCode: market.phone.defaultCountryCode as InquiryInput["countryCode"],
      phone: "",
      propertyInterest: defaultInterest,
      preferredContact: "phone",
      message: "",
      market: market.id,
      consent: false,
      source,
      company: "",
    },
  });

  // Keep market-dependent defaults in sync with the IN / US switch.
  useEffect(() => {
    setValue("market", market.id);
    setValue("countryCode", market.phone.defaultCountryCode as InquiryInput["countryCode"]);
  }, [market, setValue]);

  // Allow deep links like /?interest=private-villas#contact
  useEffect(() => {
    const q = new URLSearchParams(window.location.search).get("interest");
    if (q && INTERESTS.some((i) => i.value === q)) setValue("propertyInterest", q as Interest);
  }, [setValue]);

  const onSubmit = async (data: InquiryOutput) => {
    setStatus("sending");
    setServerError("");
    try {
      const res = await fetch("/api/inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = (await res.json()) as { ok: boolean; reference?: string; error?: string; fieldErrors?: Record<string, string> };
      if (!res.ok || !json.ok) {
        if (json.fieldErrors) {
          Object.entries(json.fieldErrors).forEach(([k, v]) => setError(k as keyof InquiryInput, { message: v }));
        }
        setServerError(json.error ?? "Something went wrong.");
        setStatus("error");
        return;
      }
      setReference(json.reference ?? "");
      setStatus("done");
    } catch {
      setServerError("Network error — please check your connection and try again.");
      setStatus("error");
    }
  };

  const contactPref = watch("preferredContact");

  if (status === "done") {
    return (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: [0.19, 1, 0.22, 1] }} className="py-10" role="status">
        <motion.span
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200, damping: 16 }}
          className="flex h-16 w-16 items-center justify-center rounded-full border border-[var(--gold)] text-[var(--gold)]"
        >
          <Check size={26} strokeWidth={1.25} />
        </motion.span>
        <h3 className="display mt-8 text-5xl">Thank you.</h3>
        <p className="mt-4 max-w-md leading-relaxed text-[var(--muted)]">
          Your request has been received. A member of our private office will contact you within one business day to arrange your {market.id === "usa" ? "tour" : "private viewing"}.
        </p>
        {reference && <p className="eyebrow mt-6">Reference · {reference}</p>}
        <button
          type="button"
          onClick={() => {
            reset();
            setStatus("idle");
          }}
          className="eyebrow u-link mt-10 pb-1"
        >
          Submit another request
        </button>
      </motion.div>
    );
  }

  const fieldCls = "field";
  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-7" aria-describedby={serverError ? "form-error" : undefined}>
      <input type="hidden" {...register("market")} />
      <input type="hidden" {...register("source")} />
      <div className="hidden" aria-hidden>
        <label>
          Company <input tabIndex={-1} autoComplete="off" {...register("company")} />
        </label>
      </div>

      <div className={`grid grid-cols-1 gap-7 ${compact ? "" : "md:grid-cols-2"}`}>
        <div>
          <label htmlFor="fullName" className="eyebrow text-[var(--muted)]">
            Full name *
          </label>
          <input id="fullName" autoComplete="name" className={fieldCls} placeholder="Your full name" aria-invalid={!!errors.fullName} aria-describedby="fullName-err" {...register("fullName")} />
          <FieldError id="fullName-err" msg={errors.fullName?.message} />
        </div>
        <div>
          <label htmlFor="email" className="eyebrow text-[var(--muted)]">
            Email *
          </label>
          <input id="email" type="email" autoComplete="email" className={fieldCls} placeholder="name@domain.com" aria-invalid={!!errors.email} aria-describedby="email-err" {...register("email")} />
          <FieldError id="email-err" msg={errors.email?.message} />
        </div>
      </div>

      <div>
        <label htmlFor="phone" className="eyebrow text-[var(--muted)]">
          Phone *
        </label>
        <div className="grid grid-cols-[minmax(0,9.5rem)_1fr] gap-4">
          <select aria-label="Country code" className={fieldCls} {...register("countryCode")}>
            {COUNTRY_CODES.map((c) => (
              <option key={c.code} value={c.code}>
                {c.label}
              </option>
            ))}
          </select>
          <input id="phone" type="tel" inputMode="tel" autoComplete="tel-national" className={fieldCls} placeholder={market.phone.placeholder} aria-invalid={!!errors.phone} aria-describedby="phone-err" {...register("phone")} />
        </div>
        <FieldError id="phone-err" msg={errors.phone?.message} />
      </div>

      <div className={`grid grid-cols-1 gap-7 ${compact ? "" : "md:grid-cols-2"}`}>
        <div>
          <label htmlFor="propertyInterest" className="eyebrow text-[var(--muted)]">
            Property interest *
          </label>
          <select id="propertyInterest" className={fieldCls} aria-invalid={!!errors.propertyInterest} {...register("propertyInterest")}>
            {INTERESTS.map((i) => (
              <option key={i.value} value={i.value}>
                {i.label}
              </option>
            ))}
          </select>
          <FieldError id="interest-err" msg={errors.propertyInterest?.message} />
        </div>
        <fieldset>
          <legend className="eyebrow text-[var(--muted)]">Preferred contact</legend>
          <div className="mt-3 flex flex-wrap gap-2">
            {(["phone", "email", ...(market.whatsapp ? (["whatsapp"] as const) : [])] as const).map((p) => (
              <label key={p} className={`eyebrow cursor-pointer border px-3 py-2.5 transition-colors duration-500 ${contactPref === p ? "border-[var(--fg)] bg-[var(--fg)] text-[var(--bg)]" : "border-[var(--line)] hover:border-[var(--fg)]"}`}>
                <input type="radio" value={p} className="sr-only" {...register("preferredContact")} />
                {p === "whatsapp" ? "WhatsApp" : p}
              </label>
            ))}
          </div>
        </fieldset>
      </div>

      <div>
        <label htmlFor="message" className="eyebrow text-[var(--muted)]">
          Message
        </label>
        <textarea id="message" rows={compact ? 3 : 4} className={`${fieldCls} resize-none`} placeholder="Preferred dates, residence size, questions…" aria-invalid={!!errors.message} {...register("message")} />
        <FieldError id="message-err" msg={errors.message?.message} />
      </div>

      <div>
        <label className="flex cursor-pointer items-start gap-3 text-sm leading-relaxed text-[var(--muted)]">
          <input type="checkbox" className="mt-1 h-4 w-4 shrink-0 accent-[var(--gold)]" aria-invalid={!!errors.consent} aria-describedby="consent-err" {...register("consent")} />
          <span>
            I agree to be contacted about Aurelia Estates and accept the{" "}
            <a href="/legal/privacy" className="u-link text-[var(--fg)]">
              privacy policy
            </a>
            .
          </span>
        </label>
        <FieldError id="consent-err" msg={errors.consent?.message} />
      </div>

      {serverError && (
        <p id="form-error" role="alert" className="text-sm text-[#b5543f]">
          {serverError}
        </p>
      )}

      <button
        type="submit"
        disabled={status === "sending"}
        className="group relative inline-flex w-full items-center justify-between overflow-hidden bg-[var(--fg)] px-7 py-5 text-[var(--bg)] transition-colors duration-500 disabled:opacity-70 sm:w-auto sm:min-w-[300px]"
      >
        <span className="absolute inset-0 origin-bottom scale-y-0 bg-[var(--gold)] transition-transform duration-700 [transition-timing-function:cubic-bezier(0.19,1,0.22,1)] group-hover:scale-y-100" />
        <span className="eyebrow relative group-hover:text-[#1b1a17]">{status === "sending" ? "Sending…" : market.id === "usa" ? "Schedule a Tour" : "Book Private Viewing"}</span>
        <span className="relative ml-6 group-hover:text-[#1b1a17]">
          {status === "sending" ? <Loader2 size={16} className="animate-spin" /> : <ArrowRight size={16} className="transition-transform duration-500 group-hover:translate-x-1" />}
        </span>
      </button>
    </form>
  );
}
