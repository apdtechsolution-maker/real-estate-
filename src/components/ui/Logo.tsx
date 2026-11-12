/** Aurelia monogram — an architectural arch enclosing an "A" crossbar. */
export function Logo({ className = "", draw = false }: { className?: string; draw?: boolean }) {
  return (
    <svg viewBox="0 0 48 48" fill="none" className={className} aria-hidden>
      <path
        className={draw ? "logo-draw" : undefined}
        d="M9 45V21C9 12.716 15.716 6 24 6C32.284 6 39 12.716 39 21V45"
        stroke="currentColor"
        strokeWidth="1.4"
        pathLength={1}
      />
      <path
        className={draw ? "logo-draw" : undefined}
        d="M16 45L24 16L32 45"
        stroke="currentColor"
        strokeWidth="1.4"
        pathLength={1}
      />
      <path className={draw ? "logo-draw" : undefined} d="M19.2 34H28.8" stroke="currentColor" strokeWidth="1.4" pathLength={1} />
      <path className={draw ? "logo-draw" : undefined} d="M4 45H44" stroke="currentColor" strokeWidth="1.4" pathLength={1} />
    </svg>
  );
}

export function Wordmark({ className = "" }: { className?: string }) {
  return (
    <span className={`font-display tracking-[0.32em] uppercase ${className}`}>
      Aurelia<span className="text-[var(--gold)]">·</span>Estates
    </span>
  );
}
