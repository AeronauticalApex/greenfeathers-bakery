import Link from "next/link";
import ChickenMark from "./ChickenMark";
import { BUSINESS, SMS_LINK } from "@/lib/business";

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-cream-300/70 bg-green-700 text-cream-100">
      <div className="mx-auto grid max-w-5xl gap-8 px-5 py-12 sm:grid-cols-3">
        <div className="space-y-3">
          <div className="flex items-center gap-2.5">
            <ChickenMark className="h-9 w-9 text-cream-100 [--mark-bg:#2f4a3a]" />
            <span className="font-serif text-lg font-semibold">{BUSINESS.name}</span>
          </div>
          <p className="text-sm text-cream-200/90">
            A farm microbakery in Springfield, Vermont. Fresh sourdough, baked weekly.
          </p>
        </div>

        <div className="space-y-2 text-sm">
          <h3 className="font-semibold uppercase tracking-wide text-cream-200/80">Visit</h3>
          <p className="text-cream-100">{BUSINESS.address}</p>
          <Link href="/contact" className="inline-block text-cream-200 underline-offset-4 hover:underline">
            Directions &amp; map
          </Link>
        </div>

        <div className="space-y-2 text-sm">
          <h3 className="font-semibold uppercase tracking-wide text-cream-200/80">Order &amp; follow</h3>
          <a href={SMS_LINK} className="block text-cream-100 underline-offset-4 hover:underline">
            Text {BUSINESS.phoneDisplay}
          </a>
          <a
            href={BUSINESS.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="block text-cream-200 underline-offset-4 hover:underline"
          >
            @{BUSINESS.instagramHandle}
          </a>
        </div>
      </div>
      <div className="flex flex-col items-center justify-center gap-1.5 border-t border-cream-100/15 py-4 text-center text-xs text-cream-200/70">
        <div className="flex items-center gap-2">
          <span>© {BUSINESS.name}. Baked with love on the farm.</span>
          <span aria-hidden="true" className="text-cream-200/30">·</span>
          <Link
            href="/admin"
            className="text-cream-200/45 underline-offset-2 transition-colors hover:text-cream-200/80 hover:underline"
          >
            Staff login
          </Link>
        </div>
        <p className="text-cream-200/45">
          Website by{" "}
          <Link
            href="/quote"
            className="underline-offset-2 transition-colors hover:text-cream-200/80 hover:underline"
          >
            Aeronautical Apex Technologies
          </Link>
        </p>
      </div>
    </footer>
  );
}
