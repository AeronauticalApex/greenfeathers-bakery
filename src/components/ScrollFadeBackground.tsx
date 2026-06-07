"use client";

import { useEffect, useRef, useState } from "react";

interface ScrollFadeBackgroundProps {
  /** Optional background image. When absent, only the soft wash renders. */
  src?: string;
  /** Tailwind overlay classes controlling the text-protection wash on top. */
  overlayClassName?: string;
  /** Object position for the image, e.g. "center", "top". */
  position?: string;
}

// A subtle, text-protected background image slot for heroes and sections.
// The image fades + eases into frame as the section scrolls into view, beneath
// a gradient wash that keeps overlaid text high-contrast. Pass `src` to fill it;
// leave it empty and the slot is wired and ready for the client's real photos.
export default function ScrollFadeBackground({
  src,
  overlayClassName = "bg-gradient-to-b from-cream-100/85 via-cream-100/55 to-cream-100/90",
  position = "center",
}: ScrollFadeBackgroundProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          io.disconnect();
        }
      },
      { threshold: 0.12 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      {src && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt=""
          className={`h-full w-full object-cover transition-all duration-[1400ms] ease-out ${
            visible ? "scale-100 opacity-100" : "scale-105 opacity-0"
          }`}
          style={{ objectPosition: position }}
        />
      )}
      <div className={`absolute inset-0 ${overlayClassName}`} />
    </div>
  );
}
