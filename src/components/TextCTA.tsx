import { BUSINESS, SMS_LINK } from "@/lib/business";

interface TextCTAProps {
  /** Larger, full-width treatment for hero placement. */
  size?: "default" | "large";
  className?: string;
}

// The primary call to action: tap-to-text the bakery's order line.
export default function TextCTA({ size = "default", className = "" }: TextCTAProps) {
  const large = size === "large";
  return (
    <a
      href={SMS_LINK}
      className={[
        "group inline-flex items-center justify-center gap-2.5 rounded-full bg-green-700 font-semibold text-cream-50 shadow-soft transition-all duration-300 hover:bg-green-800 hover:shadow-lg active:scale-[0.98]",
        large ? "px-8 py-4 text-lg" : "px-6 py-3 text-base",
        className,
      ].join(" ")}
    >
      <svg
        className="h-5 w-5 transition-transform duration-300 group-hover:-translate-y-0.5"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
      </svg>
      <span>
        Text your order
        <span className="ml-1.5 font-normal text-cream-200/90">{BUSINESS.phoneDisplay}</span>
      </span>
    </a>
  );
}
