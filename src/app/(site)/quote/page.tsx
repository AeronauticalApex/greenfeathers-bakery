import type { Metadata } from "next";
import Link from "next/link";

const QUOTE_EMAIL = "titus@AeronauticalApex.com";
const QUOTE_MAILTO = `mailto:${QUOTE_EMAIL}?subject=${encodeURIComponent(
  "Website quote request",
)}`;

export const metadata: Metadata = {
  title: "Website Quotes",
  description:
    "Aeronautical Apex Technologies designs and builds fast, modern websites for small businesses. Get in touch for a quote.",
};

export default function QuotePage() {
  return (
    <div className="mx-auto max-w-2xl px-5 py-16">
      <header className="text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-crust">
          Aeronautical Apex Technologies
        </p>
        <h1 className="mt-2 font-serif text-4xl font-semibold text-green-800">
          Need a website?
        </h1>
      </header>

      <div className="mt-10 rounded-2xl border border-cream-300/70 bg-cream-50 p-7 text-center shadow-card sm:p-10">
        <p className="text-lg leading-relaxed text-ink/80">
          Aeronautical Apex Technologies designs and builds fast, modern websites
          for small businesses. If you have an idea or a shop that needs a home
          online, I would be glad to put together a quote for you. No pressure,
          just an honest conversation about what you need.
        </p>

        <div className="mt-7 flex justify-center">
          <a
            href={QUOTE_MAILTO}
            className="inline-flex items-center justify-center gap-2.5 rounded-full bg-green-700 px-8 py-4 text-lg font-semibold text-cream-50 shadow-soft transition-all duration-300 hover:bg-green-800 hover:shadow-lg active:scale-[0.98]"
          >
            Email for a quote
          </a>
        </div>

        <p className="mt-5 text-ink/70">
          Or reach me directly at{" "}
          <a
            href={QUOTE_MAILTO}
            className="font-semibold text-green-700 underline-offset-4 hover:underline"
          >
            {QUOTE_EMAIL}
          </a>
        </p>
      </div>

      <div className="mt-8 text-center">
        <Link
          href="/"
          className="text-sm text-ink/60 underline-offset-4 transition-colors hover:text-green-700 hover:underline"
        >
          Back to the bakery
        </Link>
      </div>
    </div>
  );
}
