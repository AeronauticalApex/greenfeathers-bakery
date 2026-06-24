import type { Metadata, Viewport } from "next";
import "./globals.css";
import { BUSINESS } from "@/lib/business";

// Base URL for absolute metadata URLs (OG/Twitter images). Set
// NEXT_PUBLIC_SITE_URL to your production domain; falls back to the Vercel
// deployment URL, then localhost in dev.
const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${BUSINESS.name} · Fresh sourdough, baked weekly in Springfield VT`,
    template: `%s · ${BUSINESS.name}`,
  },
  description:
    "A farm microbakery in Springfield, Vermont. See this week's menu and text your order: fresh sourdough breads, English muffins, scones, cookies and more.",
  openGraph: {
    title: BUSINESS.name,
    description: "Fresh sourdough, baked weekly on the farm in Springfield, Vermont.",
    type: "website",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: `${BUSINESS.name}: fresh sourdough, baked weekly`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: BUSINESS.name,
    description: "Fresh sourdough, baked weekly on the farm in Springfield, Vermont.",
    images: ["/og.png"],
  },
};

export const viewport: Viewport = {
  themeColor: "#2f4a3a",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-grain min-h-screen antialiased">{children}</body>
    </html>
  );
}
