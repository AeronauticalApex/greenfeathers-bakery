import type { Metadata } from "next";
import ChickenMark from "@/components/ChickenMark";
import TextCTA from "@/components/TextCTA";

export const metadata: Metadata = {
  title: "About",
  description:
    "The story behind Greenfeathers Farm Bakery — a sourdough microbakery in Springfield, Vermont.",
};

const GALLERY = [
  { src: "/photos/rooster.webp", alt: "One of the farm's roosters" },
  { src: "/photos/fresh-eggs.webp", alt: "Fresh eggs gathered on the farm" },
  { src: "/photos/decorating-cookies.webp", alt: "Hand-decorating cookies in the bakery" },
  { src: "/photos/market-stall.webp", alt: "The Greenfeathers Farm Bakery market stall" },
];

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-16">
      <div className="flex justify-center">
        <ChickenMark className="h-16 w-16 text-ink" />
      </div>
      <h1 className="mt-5 text-center font-serif text-4xl font-semibold text-green-800 sm:text-5xl">
        Our little farm bakery
      </h1>

      {/* The bakers */}
      <figure className="mt-8 overflow-hidden rounded-3xl shadow-soft ring-1 ring-green-900/10">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/photos/the-bakers.webp"
          alt="The two bakers behind Greenfeathers Farm Bakery at their market stall"
          className="h-full w-full object-cover"
        />
      </figure>

      {/* ----------------------------------------------------------------- */}
      {/* PLACEHOLDER COPY — owner: please replace the italic paragraphs    */}
      {/* below with your own story. The notes in [brackets] are prompts.   */}
      {/* ----------------------------------------------------------------- */}
      <div className="mt-9 space-y-5 leading-relaxed text-ink/80">
        <p className="rounded-xl border border-dashed border-crust/40 bg-cream-50 px-4 py-2 text-sm text-crust">
          ✏️ <strong>Placeholder copy — replace this section with your own words.</strong>
        </p>
        <p className="italic">
          [Tell folks how Greenfeathers Farm Bakery began — who started it, when, and what
          drew you to baking on the farm here in Springfield, Vermont.]
        </p>
        <p className="italic">
          [Share your love of sourdough — your starter, the long slow ferments, why
          everything is baked fresh and posted new each week instead of sitting on a shelf.]
        </p>
        <p className="italic">
          [Add a warm note about the farm, the black hen that inspired our logo, and what
          customers can expect when they order from you.]
        </p>
      </div>

      {/* Farm & bakery gallery */}
      <div className="mt-10 grid grid-cols-2 gap-3 sm:gap-4">
        {GALLERY.map((g) => (
          <figure
            key={g.src}
            className="overflow-hidden rounded-2xl shadow-card ring-1 ring-green-900/10"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={g.src}
              alt={g.alt}
              loading="lazy"
              className="aspect-[4/3] h-full w-full object-cover"
            />
          </figure>
        ))}
      </div>

      <div className="mt-12 rounded-2xl bg-green-50 p-6 text-center">
        <p className="font-serif text-lg text-green-800">Hungry yet? This week&apos;s loaves are waiting.</p>
        <div className="mt-4 flex justify-center">
          <TextCTA />
        </div>
      </div>
    </div>
  );
}
