import Link from "next/link";
import ChickenMark from "./ChickenMark";

const NAV = [
  { href: "/", label: "This Week" },
  { href: "/menu", label: "Full Menu" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Find Us" },
];

export default function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-green-800 bg-green-700 text-cream-100">
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-2 px-5 py-3 sm:flex-row sm:justify-between sm:gap-4">
        <Link href="/" className="group flex items-center gap-2.5">
          <ChickenMark className="h-9 w-9 text-cream-100 [--mark-bg:#2f4a3a] transition-transform duration-300 group-hover:-rotate-6" />
          <span className="flex flex-col leading-none">
            <span className="font-serif text-lg font-semibold text-cream-50">Greenfeathers</span>
            <span className="text-[0.7rem] uppercase tracking-[0.22em] text-cream-200/80">Farm Bakery</span>
          </span>
        </Link>

        <nav className="flex flex-wrap items-center justify-center gap-1 text-sm font-medium">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-full px-3 py-1.5 text-cream-100 transition-colors hover:bg-green-800 hover:text-cream-50"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
