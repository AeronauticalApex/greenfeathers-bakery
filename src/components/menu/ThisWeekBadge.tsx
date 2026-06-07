// Small "Baking this week" badge used on the Full Menu to mark this week's items.
export default function ThisWeekBadge({ className = "" }: { className?: string }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full bg-green-700 px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wide text-cream-50 ${className}`}
    >
      <span aria-hidden="true">●</span> Baking this week
    </span>
  );
}
