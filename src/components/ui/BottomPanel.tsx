"use client";

import { useEffect, useState, type ReactNode } from "react";
import { Close } from "./icons/Close";
import { FullLogo } from "./Logo";

interface BottomPanelProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  /** Optional secondary line below title */
  subtitle?: string;
  /** Optional footer area (e.g. a save/confirm button) */
  footer?: ReactNode;
  /** When set to "full-page", renders a full-screen overlay on desktop */
  desktopVariant?: "full-page";
  children: ReactNode;
}

export function BottomPanel({
  isOpen,
  onClose,
  title,
  subtitle,
  footer,
  desktopVariant,
  children,
}: BottomPanelProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      setIsAnimating(false);
      let raf2: number;
      const raf1 = requestAnimationFrame(() => {
        raf2 = requestAnimationFrame(() => setIsAnimating(true));
      });
      return () => {
        cancelAnimationFrame(raf1);
        cancelAnimationFrame(raf2);
      };
    } else {
      setIsAnimating(false);
      const t = setTimeout(() => setIsVisible(false), 300);
      return () => clearTimeout(t);
    }
  }, [isOpen]);

  useEffect(() => {
    function handleEscape(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isVisible) return null;

  return (
    <>
      {/* Desktop: full-page overlay */}
      {desktopVariant === "full-page" && (
        <div className={`fixed inset-0 z-[60] bg-black hidden lg:flex flex-col transition-opacity duration-300 ${isAnimating ? "opacity-100" : "opacity-0"}`}>
          {/* Top bar */}
          <div className="flex items-center justify-between px-8 pt-8 shrink-0">
            <FullLogo color="white" />
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="text-white/60 hover:text-white transition-colors cursor-pointer"
            >
              <Close />
            </button>
          </div>

          {/* Centered content */}
          <div className="flex-1 flex flex-col items-center justify-center gap-[60px] py-12">
            <p className="text-body-sm text-white text-center">{title}</p>
            <div className="flex flex-col gap-4 w-[366px]">{children}</div>
          </div>
        </div>
      )}

      {/* Mobile: bottom sheet */}
      <div className="fixed inset-0 z-[60] lg:hidden flex flex-col justify-end">
      {/* Scrim */}
      <div
        className={`absolute inset-0 bg-black/40 transition-opacity duration-300 ${isAnimating ? "opacity-100" : "opacity-0"}`}
        onClick={onClose}
      />

      {/* Panel */}
      <div
        className={`relative bg-black rounded-t-[24px] flex flex-col gap-5 px-6 pt-6 pb-9 transition-transform duration-300 ${isAnimating ? "translate-y-0" : "translate-y-full"}`}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex flex-col">
            <p className="text-body-sm-bold text-white">{title}</p>
            {subtitle && <p className="text-body-xs text-grey">{subtitle}</p>}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="text-white/60 hover:text-white transition-colors shrink-0"
          >
            <Close />
          </button>
        </div>

        {/* Body */}
        <div className="flex flex-col gap-4">{children}</div>

        {/* Footer */}
        {footer && (
          <div className="pt-3">{footer}</div>
        )}
      </div>
    </div>
    </>
  );
}
