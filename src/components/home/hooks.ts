"use client";

import { useEffect, useRef, useState } from "react";

/** Triggers loading when the element scrolls into view (with 200px margin). */
export function useLazyLoad() {
  const ref = useRef<HTMLDivElement>(null);
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldLoad(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return { ref, shouldLoad };
}

/** Human-friendly relative time for saved dates. */
export function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  if (days < 1) return "Saved today";
  if (days === 1) return "Saved yesterday";
  if (days < 30) return `Saved ${days} days ago`;
  const months = Math.floor(days / 30);
  if (months === 1) return "Saved 1 month ago";
  return `Saved ${months} months ago`;
}
