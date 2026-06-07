import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

// The warm sage background comes from the global `bg-grain` body class, so the
// admin feels like the rest of the bakery site. The friendly header lives inside
// the editor / login screens themselves.
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <div className="min-h-screen">{children}</div>;
}
