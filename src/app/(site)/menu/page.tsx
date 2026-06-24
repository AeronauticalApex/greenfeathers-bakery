import type { Metadata } from "next";
import Link from "next/link";
import ChickenMark from "@/components/ChickenMark";
import ScrollFadeBackground from "@/components/ScrollFadeBackground";
import MenuSection from "@/components/menu/MenuSection";
import TextCTA from "@/components/TextCTA";
import { getActiveMenu } from "@/lib/menu";
import { BUSINESS } from "@/lib/business";
import { SECTIONS } from "@/lib/types";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Full Menu",
  description:
    "Everything Greenfeathers Farm Bakery bakes: sourdough breads, cookies, scones, bagels, muffins and more. This week's items are marked; anything else can be ordered ahead.",
};

export default async function FullMenuPage() {
  const { items } = await getActiveMenu();
  const hasFootnote = items.some((i) => i.not_sourdough);
  const thisWeekCount = items.filter((i) => i.available).length;

  const groups = SECTIONS.map((section) => ({
    section,
    items: items
      .filter((i) => i.section === section)
      .sort((a, b) => a.sort_order - b.sort_order),
  })).filter((g) => g.items.length > 0);

  return (
    <>
      {/* Hero with a background photo that fades in on scroll. A warm dark scrim
          keeps the pale text legible over the photo. */}
      <section className="relative overflow-hidden">
        <ScrollFadeBackground
          src="/photos/hero-blossoms.webp"
          overlayClassName="bg-gradient-to-b from-ink/75 via-ink/40 to-ink/70"
          position="center 35%"
        />
        <div className="mx-auto max-w-2xl px-5 pb-6 pt-14 text-center sm:pt-20">
          <div className="flex justify-center">
            <ChickenMark className="h-14 w-14 text-cream-50" />
          </div>
          <h1 className="mt-4 font-serif text-4xl font-semibold text-cream-50 [text-shadow:0_1px_4px_rgba(0,0,0,0.55)] sm:text-5xl">
            Our Full Menu
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-lg font-medium leading-relaxed text-cream-50/95 [text-shadow:0_1px_4px_rgba(0,0,0,0.55)]">
            This is <em>everything</em> we bake. The items marked{" "}
            <span className="font-semibold text-cream-50 underline decoration-cream-200/60 underline-offset-2">
              Baking this week
            </span>{" "}
            are on this week&apos;s menu. Anything else may be available if you order in advance,
            just ask when you text!
          </p>
          <div className="mt-6 flex justify-center">
            <TextCTA />
          </div>
          {thisWeekCount > 0 && (
            <p className="mt-4">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-cream-50/90 px-4 py-1.5 text-sm font-medium text-ink/70 shadow-card">
                {thisWeekCount} items baking this week ·{" "}
                <Link href="/" className="font-semibold text-green-700 underline-offset-4 hover:underline">
                  see this week&apos;s menu
                </Link>
              </span>
            </p>
          )}
        </div>
      </section>

      {/* Full catalog as a clean, uniform grid per section */}
      <section className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="space-y-16 sm:space-y-20">
          {groups.map((g) => (
            <MenuSection key={g.section} section={g.section} items={g.items} showBadges />
          ))}
        </div>

        {hasFootnote && (
          <p className="mt-14 text-center font-serif text-sm italic text-crust/85">
            <span className="not-italic">*</span> items not made with sourdough
          </p>
        )}
      </section>

      {/* Closing CTA */}
      <section className="mx-auto max-w-2xl px-5 pb-6">
        <div className="rounded-3xl bg-green-700 px-6 py-10 text-center text-cream-50 shadow-soft sm:px-12">
          <h2 className="font-serif text-2xl font-semibold sm:text-3xl">Want something special?</h2>
          <p className="mx-auto mt-2 max-w-md text-cream-200/90">
            Text us at {BUSINESS.phoneDisplay} to ask about anything on the full menu for an
            upcoming week.
          </p>
          <div className="mt-6 flex justify-center">
            <TextCTA size="large" className="!bg-cream-50 !text-green-800 hover:!bg-cream-200" />
          </div>
        </div>
      </section>
    </>
  );
}
