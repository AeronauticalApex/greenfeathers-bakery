import ChickenMark from "@/components/ChickenMark";
import type { MenuItem, Section } from "@/lib/types";
import MenuCard from "./MenuCard";
import Reveal from "./Reveal";

function SectionHeader({ title }: { title: string }) {
  return (
    <div className="mb-7 text-center">
      <h2 className="font-serif text-3xl font-semibold tracking-wide text-green-800 sm:text-4xl">
        {title}
      </h2>
      <div className="mt-3 flex items-center justify-center gap-3" aria-hidden="true">
        <span className="h-px w-12 bg-gradient-to-l from-green-800/30 to-transparent" />
        <ChickenMark className="h-4 w-4 text-green-800/45" />
        <span className="h-px w-12 bg-gradient-to-r from-green-800/30 to-transparent" />
      </div>
    </div>
  );
}

// A section: header, then a uniform grid of medium cards (≈3 across on desktop,
// 2 on tablet, 1–2 on mobile). Fades into frame on scroll.
export default function MenuSection({
  section,
  items,
  showBadges = false,
}: {
  section: Section;
  items: MenuItem[];
  showBadges?: boolean;
}) {
  // A full desktop row is 3 cards. Sections with fewer (1–2 items) center their
  // cards instead of clinging to the left; larger sections use the normal grid.
  const centered = items.length < 3;

  return (
    <Reveal>
      <SectionHeader title={section} />
      {centered ? (
        <div className="flex flex-wrap justify-center gap-5 lg:gap-6">
          {items.map((item) => (
            // Widths mirror the grid columns exactly, so centered cards match.
            <div
              key={item.id}
              className="w-full min-[440px]:w-[calc(50%-0.625rem)] lg:w-[calc(33.333%-1rem)]"
            >
              <MenuCard item={item} badge={showBadges && item.available} />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 min-[440px]:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          {items.map((item) => (
            <MenuCard key={item.id} item={item} badge={showBadges && item.available} />
          ))}
        </div>
      )}
    </Reveal>
  );
}
