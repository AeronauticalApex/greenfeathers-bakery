import ChickenMark from "@/components/ChickenMark";
import MenuDisplay from "@/components/MenuDisplay";
import HowToOrder from "@/components/HowToOrder";
import TextCTA from "@/components/TextCTA";
import ScrollFadeBackground from "@/components/ScrollFadeBackground";
import { getActiveMenu } from "@/lib/menu";
import { BUSINESS } from "@/lib/business";

// Always render the latest menu data.
export const dynamic = "force-dynamic";

export default async function HomePage() {
  const { menu, items } = await getActiveMenu();

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <ScrollFadeBackground
          src="/photos/focaccia.webp"
          overlayClassName="bg-gradient-to-b from-cream-100/88 via-cream-100/82 to-cream-100"
        />
        <div className="mx-auto max-w-5xl px-5 pb-4 pt-14 text-center sm:pt-20">
          <div className="animate-fade-in flex justify-center">
            <ChickenMark className="h-20 w-20 text-ink sm:h-24 sm:w-24" />
          </div>
          <h1 className="animate-fade-up mt-5 font-serif text-4xl font-semibold leading-tight text-green-800 sm:text-6xl">
            {BUSINESS.name}
          </h1>
          <p className="animate-fade-up mx-auto mt-4 max-w-xl text-lg text-ink/75 [animation-delay:80ms]">
            A farm microbakery in Springfield, Vermont. Fresh sourdough and farmhouse
            favorites, baked fresh and posted new each week.
          </p>
          <div className="animate-fade-up mt-7 flex flex-col items-center gap-3 [animation-delay:160ms]">
            <TextCTA size="large" />
            <a href="#menu" className="text-sm font-medium text-green-700 underline-offset-4 hover:underline">
              ↓ See this week&apos;s menu
            </a>
          </div>
        </div>
      </section>

      {/* This week's menu — front and center */}
      <div className="animate-fade-up py-8 [animation-delay:120ms]">
        <MenuDisplay menu={menu} items={items} />
      </div>

      {/* How ordering works */}
      <HowToOrder />

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
