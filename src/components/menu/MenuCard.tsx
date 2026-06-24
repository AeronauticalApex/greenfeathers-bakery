import ChickenMark from "@/components/ChickenMark";
import { formatPrice } from "@/lib/format";
import type { MenuItem } from "@/lib/types";
import ThisWeekBadge from "./ThisWeekBadge";

// One uniform menu card: a medium photo on top, name/unit/price below. Items
// without a photo get a tasteful chicken-mark block so the grid stays even.
export default function MenuCard({ item, badge }: { item: MenuItem; badge?: boolean }) {
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl bg-cream-50 shadow-card ring-1 ring-green-900/10 transition-shadow duration-300 hover:shadow-soft">
      <div className="relative aspect-[4/3] w-full overflow-hidden">
        {item.photo_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={item.photo_url}
            alt={item.name}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05] motion-reduce:transition-none"
          />
        ) : (
          <NoPhoto />
        )}
        {badge && (
          <div className="absolute left-3 top-3">
            <ThisWeekBadge />
          </div>
        )}
      </div>

      <div className="flex flex-1 items-start justify-between gap-3 p-4 sm:p-5">
        <div className="min-w-0">
          <h3 className="font-serif text-lg font-semibold leading-snug text-ink sm:text-xl">
            {item.name}
            {item.unit_note && (
              <span className="ml-1.5 align-baseline text-sm font-normal italic text-crust/70">
                {item.unit_note}
              </span>
            )}
          </h3>
          {item.not_sourdough && (
            <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-crust/80">
              Made without sourdough
            </p>
          )}
        </div>
        <span className="whitespace-nowrap font-serif text-lg font-semibold text-green-800 sm:text-xl">
          {formatPrice(item.price)}
        </span>
      </div>
    </article>
  );
}

// Tasteful placeholder block for items that don't have a photo yet: a soft
// cream→sage wash, a faint wheat texture, and the chicken mark.
function NoPhoto() {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-cream-100 via-flour to-green-50">
      <div
        className="absolute inset-0 opacity-[0.5]"
        style={{ backgroundImage: "url(/wheat.svg)", backgroundSize: "150px" }}
        aria-hidden="true"
      />
      <ChickenMark className="relative h-16 w-16 text-green-800/15 sm:h-20 sm:w-20" />
    </div>
  );
}
