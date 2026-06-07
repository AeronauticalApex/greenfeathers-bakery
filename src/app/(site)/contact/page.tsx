import type { Metadata } from "next";
import TextCTA from "@/components/TextCTA";
import { BUSINESS, MAP_EMBED_SRC, TEL_LINK } from "@/lib/business";

export const metadata: Metadata = {
  title: "Find Us",
  description: `Visit Greenfeathers Farm Bakery at ${BUSINESS.address}. Text your order to ${BUSINESS.phoneDisplay}.`,
};

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-16">
      <header className="text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-crust">Come say hello</p>
        <h1 className="mt-2 font-serif text-4xl font-semibold text-green-800">Find us</h1>
      </header>

      <div className="mt-10 grid gap-6 sm:grid-cols-2">
        <div className="rounded-2xl border border-cream-300/70 bg-cream-50 p-6 shadow-card">
          <h2 className="font-serif text-xl font-semibold text-ink">The farm</h2>
          <address className="mt-2 not-italic leading-relaxed text-ink/80">
            {BUSINESS.address}
          </address>
        </div>

        <div className="rounded-2xl border border-cream-300/70 bg-cream-50 p-6 shadow-card">
          <h2 className="font-serif text-xl font-semibold text-ink">Orders by text</h2>
          <p className="mt-2 text-ink/80">
            Text your order to{" "}
            <a href={TEL_LINK} className="font-semibold text-green-700 underline-offset-4 hover:underline">
              {BUSINESS.phoneDisplay}
            </a>{" "}
            before the weekly deadline.
          </p>
          <div className="mt-4">
            <TextCTA />
          </div>
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-cream-300/70 bg-cream-50 p-6 text-center shadow-card">
        <h2 className="font-serif text-xl font-semibold text-ink">Follow along</h2>
        <p className="mt-2 text-ink/80">See weekly menus and fresh bakes on Instagram.</p>
        <a
          href={BUSINESS.instagramUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-flex items-center gap-2 rounded-full border border-green-700 px-5 py-2.5 font-semibold text-green-700 transition-colors hover:bg-green-700 hover:text-cream-50"
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M12 2.2c3.2 0 3.6 0 4.9.1 1.2.1 1.8.3 2.2.4.6.2 1 .5 1.4.9.4.4.7.8.9 1.4.2.4.4 1 .4 2.2.1 1.3.1 1.7.1 4.9s0 3.6-.1 4.9c-.1 1.2-.3 1.8-.4 2.2-.2.6-.5 1-.9 1.4-.4.4-.8.7-1.4.9-.4.2-1 .4-2.2.4-1.3.1-1.7.1-4.9.1s-3.6 0-4.9-.1c-1.2-.1-1.8-.3-2.2-.4-.6-.2-1-.5-1.4-.9-.4-.4-.7-.8-.9-1.4-.2-.4-.4-1-.4-2.2C2.2 15.6 2.2 15.2 2.2 12s0-3.6.1-4.9c.1-1.2.3-1.8.4-2.2.2-.6.5-1 .9-1.4.4-.4.8-.7 1.4-.9.4-.2 1-.4 2.2-.4C8.4 2.2 8.8 2.2 12 2.2zm0 1.8c-3.1 0-3.5 0-4.7.1-.9 0-1.4.2-1.7.3-.4.2-.7.4-1 .7-.3.3-.5.6-.7 1-.1.3-.3.8-.3 1.7-.1 1.2-.1 1.6-.1 4.7s0 3.5.1 4.7c0 .9.2 1.4.3 1.7.2.4.4.7.7 1 .3.3.6.5 1 .7.3.1.8.3 1.7.3 1.2.1 1.6.1 4.7.1s3.5 0 4.7-.1c.9 0 1.4-.2 1.7-.3.4-.2.7-.4 1-.7.3-.3.5-.6.7-1 .1-.3.3-.8.3-1.7.1-1.2.1-1.6.1-4.7s0-3.5-.1-4.7c0-.9-.2-1.4-.3-1.7-.2-.4-.4-.7-.7-1-.3-.3-.6-.5-1-.7-.3-.1-.8-.3-1.7-.3-1.2-.1-1.6-.1-4.7-.1zm0 3.1a4.9 4.9 0 1 1 0 9.8 4.9 4.9 0 0 1 0-9.8zm0 8.1a3.2 3.2 0 1 0 0-6.4 3.2 3.2 0 0 0 0 6.4zm6.3-8.3a1.1 1.1 0 1 1-2.3 0 1.1 1.1 0 0 1 2.3 0z" />
          </svg>
          @{BUSINESS.instagramHandle}
        </a>
      </div>

      {/* Google Map embed (no API key required) */}
      <div className="mt-6 overflow-hidden rounded-2xl border border-cream-300/70 shadow-card">
        <iframe
          title={`Map to ${BUSINESS.name}`}
          src={MAP_EMBED_SRC}
          width="100%"
          height="360"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="block w-full"
        />
      </div>
    </div>
  );
}
