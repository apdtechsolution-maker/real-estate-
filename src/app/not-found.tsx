import Link from "next/link";

export default function NotFound() {
  return (
    <main id="main" className="flex min-h-screen flex-col items-center justify-center px-5 text-center">
      <p className="eyebrow text-[var(--gold)]">404</p>
      <h1 className="display mt-6 text-6xl md:text-8xl">This room is not on the plan.</h1>
      <Link href="/" className="eyebrow u-link mt-10 pb-1">
        Return home
      </Link>
    </main>
  );
}
