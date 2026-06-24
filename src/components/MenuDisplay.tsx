import MenuSection from "./menu/MenuSection";
import { SECTIONS, type MenuItem, type WeeklyMenu } from "@/lib/types";

interface MenuDisplayProps {
  menu: WeeklyMenu | null;
  items: MenuItem[];
}

// THIS WEEK's menu as a full-width, editorial bento layout: photo items become
// feature cards of varying sizes, text items become elegant dotted-leader panels,
// and each section alternates its rhythm. Driven entirely by the menu/items props.
export default function MenuDisplay({ menu, items }: MenuDisplayProps) {
  const available = items.filter((i) => i.available);
  const hasFootnote = available.some((i) => i.not_sourdough);

  const groups = SECTIONS.map((section) => ({
    section,
    items: available
      .filter((i) => i.section === section)
      .sort((a, b) => a.sort_order - b.sort_order),
  })).filter((g) => g.items.length > 0);

  return (
    <section id="menu" className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
      {/* Styled week banner */}
      <div className="mb-12 text-center sm:mb-16">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-green-700/70">
          This week
        </p>
        <h2 className="mt-1.5 font-serif text-4xl font-semibold text-green-800 sm:text-6xl">
          {menu?.week_label ?? "Menu coming soon"}
        </h2>
        {menu?.order_deadline && (
          <p className="mx-auto mt-4 inline-flex items-center gap-2 rounded-full bg-green-700 px-5 py-2 text-sm font-medium text-cream-50 shadow-soft">
            <span aria-hidden="true">⏰</span>
            {menu.order_deadline}
          </p>
        )}
      </div>

      {groups.length === 0 ? (
        <p className="py-10 text-center font-serif text-lg italic text-ink/55">
          This week&apos;s menu is being prepared. Check back soon!
        </p>
      ) : (
        <div className="space-y-16 sm:space-y-20">
          {groups.map((g) => (
            <MenuSection key={g.section} section={g.section} items={g.items} />
          ))}
        </div>
      )}

      {hasFootnote && (
        <p className="mt-14 text-center font-serif text-sm italic text-crust/85">
          Items marked <span className="not-italic">*</span> are made without sourdough. Everything
          else is sourdough.
        </p>
      )}
    </section>
  );
}
