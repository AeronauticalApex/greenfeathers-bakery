import { getSiteSettings, isBakeryClosed } from "@/lib/settings";

// "YYYY-MM-DD" -> "Friday, July 4". Noon avoids any timezone day-shift.
function formatNiceDate(d: string): string {
  const dt = new Date(`${d}T12:00:00`);
  if (Number.isNaN(dt.getTime())) return d;
  return dt.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    timeZone: "America/New_York",
  });
}

// Site-wide open/closed bar, rendered at the very top of every public page.
export default async function StatusBanner() {
  const settings = await getSiteSettings();

  if (isBakeryClosed(settings)) {
    const message = settings.closed_message?.trim() || "We're closed right now. Check back soon!";
    return (
      <div className="bg-red-800 text-cream-50">
        <div className="mx-auto max-w-5xl px-5 py-3 text-center">
          <p className="font-serif text-lg font-semibold sm:text-xl">{message}</p>
          {settings.closed_to && (
            <p className="mt-0.5 text-sm font-medium text-cream-200/90">
              Reopening {formatNiceDate(settings.closed_to)}
            </p>
          )}
        </div>
      </div>
    );
  }

  const openMessage = settings.open_message?.trim();
  if (!openMessage) return null;

  return (
    <div className="bg-green-700 text-cream-50">
      <div className="mx-auto max-w-5xl px-5 py-1.5 text-center text-sm font-medium">
        {openMessage}
      </div>
    </div>
  );
}
