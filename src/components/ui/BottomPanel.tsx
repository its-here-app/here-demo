"use client";

import { useEffect, useState, type ReactNode } from "react";
import { Close } from "./icons/Close";
import { FullLogo } from "./Logo";
import { Scrim } from "./Scrim";

interface BottomPanelProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  /** Optional secondary line below title */
  subtitle?: string;
  /** Optional footer area (e.g. a save/confirm button) */
  footer?: ReactNode;
  /** Controls the desktop rendering: "full-page" = full-screen overlay, "floating" = centered card */
  desktopVariant?: "full-page" | "floating";
  /** Custom width for the floating desktop variant (default: 24.375rem / 390px) */
  desktopWidth?: string;
  /** Optional min-height for the floating desktop variant */
  desktopMinHeight?: string;
  /** Scrim color for the floating desktop variant — default is black/40, "black" is fully opaque */
  scrim?: "black";
  /** Show the FullLogo in the top-left corner of the floating desktop overlay */
  logo?: boolean;
  /** Centers the title in the header */
  centerTitle?: boolean;
  /** Renders the title in bold */
  boldTitle?: boolean;
  /** Optional fixed height for the mobile panel (e.g. "30rem") */
  panelHeight?: string;
  children: ReactNode;
}

export function BottomPanel({
  isOpen,
  onClose,
  title,
  subtitle,
  footer,
  desktopVariant,
  desktopWidth,
  desktopMinHeight,
  scrim,
  logo = false,
  centerTitle = false,
  boldTitle = false,
  panelHeight,
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

  const fadeIn = isAnimating ? "opacity-100" : "opacity-0";
  const closeBtn = (
    <button
      type="button"
      onClick={onClose}
      aria-label="Close"
      className="text-white shrink-0 cursor-pointer"
    >
      <Close focus />
    </button>
  );

  return (
    <>
      {/* Desktop: full-page overlay */}
      {desktopVariant === "full-page" && (
        <div
          className={`fixed inset-0 z-[60] bg-black hidden lg:flex flex-col transition-opacity duration-300 ${fadeIn}`}
        >
          <div className="flex items-center justify-between p-[var(--space-page)] shrink-0">
            <FullLogo color="white" className="w-20" />
            {closeBtn}
          </div>
          <div className="flex-1 flex flex-col items-center justify-center gap-[3.75rem] py-12">
            <p
              className={`${boldTitle ? "text-body-sm-bold" : "text-body-sm"} text-white text-center`}
            >
              {title}
            </p>
            <div className="flex flex-col gap-4 w-[22.875rem]">{children}</div>
          </div>
        </div>
      )}

      {/* Desktop: floating card */}
      {desktopVariant === "floating" && (
        <div
          className={`fixed inset-0 z-[60] hidden lg:flex flex-col items-center justify-center transition-opacity duration-300 ${fadeIn}`}
        >
          <Scrim
            visible={isAnimating}
            onClick={onClose}
            variant={scrim === "black" ? "dark" : "default"}
          />
          {logo && (
            <div className="absolute top-8 left-8">
              <FullLogo color="white" />
            </div>
          )}
          <div
            className="relative bg-black rounded-[2rem] p-6 flex flex-col gap-5 overflow-x-hidden"
            style={{
              width: desktopWidth ?? "24.375rem",
              minHeight: desktopMinHeight,
            }}
          >
            <div className="flex items-start justify-between gap-2">
              <div className="size-6 shrink-0" />
              <p className="text-body-sm-bold text-white text-center flex-1">
                {title}
              </p>
              {closeBtn}
            </div>
            {children}
          </div>
        </div>
      )}

      {/* Mobile: bottom sheet */}
      <div className="fixed inset-0 z-[60] lg:hidden flex flex-col justify-end">
        <Scrim visible={isAnimating} onClick={onClose} />
        <div
          className={`relative bg-black rounded-t-[1.5rem] flex flex-col gap-5 px-6 pt-6 pb-9 overflow-x-hidden transition-transform duration-300 ${isAnimating ? "translate-y-0" : "translate-y-full"}`}
          style={panelHeight ? { height: panelHeight } : undefined}
        >
          <div className="flex items-start justify-between gap-2">
            {centerTitle && <div className="size-6 shrink-0" />}
            <div
              className={`flex flex-col ${centerTitle ? "flex-1 items-center" : ""}`}
            >
              <p
                className={`${boldTitle ? "text-body-sm-bold" : "text-body-sm"} text-white`}
              >
                {title}
              </p>
              {subtitle && <p className="text-body-xs text-grey">{subtitle}</p>}
            </div>
            {closeBtn}
          </div>
          <div className="flex flex-col gap-4">{children}</div>
          {footer && <div className="pt-3">{footer}</div>}
        </div>
      </div>
    </>
  );
}
