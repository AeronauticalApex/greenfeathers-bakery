import ChickenMark from "@/components/ChickenMark";
import MenuDisplay from "@/components/MenuDisplay";
import HowToOrder from "@/components/HowToOrder";
import TextCTA from "@/components/TextCTA";
import ScrollFadeBackground from "@/components/ScrollFadeBackground";
import { getActiveMenu } from "@/lib/menu";
import { getSiteSettings } from "@/lib/settings";
import { BUSINESS } from "@/lib/business";

// Always render the latest menu data.
export const dynamic = "force-dynamic";

// Soft shadow that keeps pale hero text legible over the photo.
const heroTextShadow = "[text-shadow:0_1px_4px_rgba(0,0,0,0.55)]";

export default async function HomePage() {
  const [{ menu, items }, settings] = await Promise.all([getActiveMenu(), getSiteSettings()]);

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <ScrollFadeBackground
          src="/photos/focaccia.webp"
          overlayClassName="bg-gradient-to-b from-ink/80 via-ink/60 to-cream-100"
        />
        <div className="mx-auto max-w-5xl px-5 pb-4 pt-14 text-center sm:pt-20">
          <div className="animate-fade-in flex justify-center">
            <ChickenMark className="h-20 w-20 text-cream-50 sm:h-24 sm:w-24" />
          </div>
          <h1
            className={`animate-fade-up mt-5 font-serif text-4xl font-semibold leading-tight text-cream-50 sm:text-6xl ${heroTextShadow}`}
          >
            {BUSINESS.name}
          </h1>
          <p
            className={`animate-fade-up mx-auto mt-4 max-w-xl text-lg font-medium text-cream-50/95 [animation-delay:80ms] ${heroTextShadow}`}
          >
            A Small homestead and Microbakery in Springfield, Vermont!
          </p>
          <div className="animate-fade-up mt-7 flex flex-col items-center gap-3 [animation-delay:160ms]">
            <TextCTA size="large" />
            <a
              href="#menu"
              className="rounded-full bg-cream-50/95 px-6 py-3 text-base font-semibold text-green-800 shadow-soft transition-colors hover:bg-cream-50"
            >
              ↓ See this week&apos;s menu
            </a>
          </div>
        </div>
      </section>

      {/* Friday Flash Sale (admin-toggled) */}
      {settings.flash_sale_enabled && (
        <section className="mx-auto max-w-3xl px-5 pt-8">
          <div className="rounded-3xl border-2 border-crust/40 bg-crust/10 p-6 text-center shadow-card sm:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-crust">
              Don&apos;t miss it
            </p>
            <h2 className="mt-1 font-serif text-3xl font-semibold text-crust sm:text-4xl">
              {settings.flash_sale_title || "Friday Flash Sale"}
            </h2>
            {settings.flash_sale_body && (
              <p className="mx-auto mt-3 max-w-xl whitespace-pre-line text-lg leading-relaxed text-ink/80">
                {settings.flash_sale_body}
              </p>
            )}
          </div>
        </section>
      )}

      {/* This week's menu — front and center */}
      <div className="animate-fade-up py-8 [animation-delay:120ms]">
        <MenuDisplay menu={menu} items={items} />
      </div>

      {/* How ordering works */}
      <HowToOrder />

      {/* Pick-Up / Delivery (admin-toggled), near the how-to-order block */}
      {settings.pickup_delivery_enabled && (settings.pickup_delivery_title || settings.pickup_delivery_body) && (
        <section className="mx-auto max-w-3xl px-5 py-8">
          <div className="rounded-3xl border border-cream-300/70 bg-cream-50 p-6 text-center shadow-card sm:p-8">
            {settings.pickup_delivery_title && (
              <h2 className="font-serif text-2xl font-semibold text-green-800 sm:text-3xl">
                {settings.pickup_delivery_title}
              </h2>
            )}
            {settings.pickup_delivery_body && (
              <p className="mx-auto mt-3 max-w-xl whitespace-pre-line text-lg leading-relaxed text-ink/80">
                {settings.pickup_delivery_body}
              </p>
            )}
          </div>
        </section>
      )}

      {/* Closing CTA */}
      <section className="mx-auto max-w-3xl px-5 pb-6">
        <div className="rounded-3xl bg-green-700 px-6 py-10 text-center text-cream-50 shadow-soft sm:px-12">
          <h2 className="font-serif text-2xl font-semibold sm:text-3xl">Ready to order?</h2>
          <p className="mx-auto mt-2 max-w-md text-cream-200/90">
            Send us a text with what you&apos;d like before the weekly deadline. We&apos;ll
            confirm your order and pickup.
          </p>
          <div className="mt-6 flex justify-center">
            <TextCTA size="large" className="!bg-cream-50 !text-green-800 hover:!bg-cream-200" />
          </div>
        </div>
      </section>
    </>
  );
}
