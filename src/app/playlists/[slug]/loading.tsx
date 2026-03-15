"use client";

import { useState, useEffect } from "react";

export default function Loading() {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    let raf2: number;
    const raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(() => setIsAnimating(true));
    });
    return () => {
      cancelAnimationFrame(raf1);
      cancelAnimationFrame(raf2);
    };
  }, []);

  return (
    <main
      className={`fixed inset-0 z-50 bg-white overflow-y-auto p-[var(--space-page-sm)] lg:pb-0 max-w-[var(--app-max-width)] mx-auto transition-transform duration-400 ${isAnimating ? "translate-x-0" : "translate-x-full"}`}
    >
      <div className="w-full lg:grid lg:grid-cols-2 lg:gap-6 lg:items-start">
        {/* Left: hero card placeholder */}
        <div className="relative mb-6 lg:mb-0 lg:sticky lg:top-0 lg:h-[calc(100vh-2*var(--space-page-sm))]">
          <div className="h-[30rem] lg:h-full w-full rounded-lg bg-black/5 animate-pulse" />
        </div>

        {/* Right: content placeholders */}
        <div>
          <div className="mb-8 flex flex-col gap-3">
            <div className="h-4 w-1/3 rounded-full bg-black/5 animate-pulse" />
            <div className="h-4 w-1/4 rounded-full bg-black/5 animate-pulse" />
          </div>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="flex-shrink-0 w-20 h-20 rounded-xs bg-black/5 animate-pulse" />
                <div className="flex-1 flex flex-col gap-2 pt-1">
                  <div className="h-4 w-3/4 rounded-full bg-black/5 animate-pulse" />
                  <div className="h-3 w-1/2 rounded-full bg-black/5 animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
