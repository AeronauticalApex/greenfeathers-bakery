import { BUSINESS } from "@/lib/business";

const STEPS = [
  {
    n: 1,
    title: "See this week's menu",
    body: "Browse what's coming out of the oven this week, right here on this page.",
  },
  {
    n: 2,
    title: "Text your order",
    body: `Send your order by text to ${BUSINESS.phoneDisplay} before the weekly deadline.`,
  },
  {
    n: 3,
    title: "Pay & pick up",
    body: "Pay by Venmo when you order, or cash on delivery. We'll confirm your pickup.",
  },
];

export default function HowToOrder() {
  return (
    <section className="mx-auto max-w-5xl px-5 py-14">
      <div className="mb-9 text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-crust">Simple as can be</p>
        <h2 className="mt-2 font-serif text-3xl font-semibold text-green-800">How ordering works</h2>
      </div>
      <ol className="grid gap-5 sm:grid-cols-3">
        {STEPS.map((step) => (
          <li
            key={step.n}
            className="relative rounded-2xl border border-cream-300/70 bg-cream-50 p-6 shadow-card"
          >
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-green-700 font-serif text-lg font-bold text-cream-50">
              {step.n}
            </span>
            <h3 className="mt-4 font-serif text-xl font-semibold text-ink">{step.title}</h3>
            <p className="mt-1.5 text-sm leading-relaxed text-ink/75">{step.body}</p>
          </li>
        ))}
      </ol>
      <p className="mx-auto mt-7 max-w-xl rounded-xl bg-green-50 px-5 py-3 text-center text-sm text-green-800">
        💚 <strong>Payment:</strong> Venmo when you order, or cash on delivery. No online checkout,
        just a friendly text.
      </p>
    </section>
  );
}
