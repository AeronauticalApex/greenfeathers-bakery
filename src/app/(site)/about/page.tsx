import type { Metadata } from "next";
import ChickenMark from "@/components/ChickenMark";
import TextCTA from "@/components/TextCTA";

export const metadata: Metadata = {
  title: "About",
  description:
    "The story behind Greenfeathers Farm Bakery — a sourdough microbakery in Springfield, Vermont.",
};

const GALLERY = [
  { src: "/photos/pond.webp", alt: "The garden pond with water lilies and fish on the farm" },
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

      {/* The founders */}
      <figure className="mt-8 overflow-hidden rounded-3xl shadow-soft ring-1 ring-green-900/10">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/photos/founders-bikes.webp"
          alt="The two founders of Greenfeathers Farm Bakery riding bikes together"
          className="h-full w-full object-cover"
        />
      </figure>

      <div className="mt-9 space-y-5 text-lg leading-relaxed text-ink/80">
        <p>
          Every Friday night, at sundown, Jewish people begin to observe Shabbat. This
          typically includes a family dinner and saying three prayers &mdash; said while
          lighting two candles, drinking a tiny glass of wine or grape juice, and eating a
          special braided egg bread called &ldquo;challah.&rdquo;
        </p>
        <p>
          For many years our family in rural Vermont had to travel long distances to find
          challah. Finally we started making it ourselves &mdash; and realized it could be a
          wonderful service to bake challah for others who need it.
        </p>
        <p>
          In January 2025 we began our microbakery and called it Greenfeathers Farm Bakery.
          As the bakery has grown, we&rsquo;ve added other traditional Jewish bakery items
          including Montreal-style bagels, Jewish rye bread, and chocolate and cinnamon babka.
        </p>
        <p>
          We list those items as products of &ldquo;The Vermont Challah Company&rdquo; as a
          tribute to our original inspiration for the bakery.
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
