"use client";

import { useEffect, useState, type ReactNode } from "react";
import { Close } from "./icons/Close";
import { FullLogo } from "./Logo";
import { Scrim } from "./Scrim";

interface BottomPanelProps {
  isOpen: boolean;
  onClose: () => void;
  header: string;
  /** Optional line directly below the header, same font as header but grey */
  subheader?: string;
  /** Optional footer area (e.g. a save/confirm button) */
  footer?: ReactNode;
  /** Overrides footer in the full-page desktop variant */
  desktopFooter?: ReactNode;
  /** Controls the desktop rendering: "full-page" = full-screen overlay, "floating" = centered card */
  desktopVariant: "full-page" | "floating";
  /** Custom width for the floating desktop variant (default: 24.375rem / 390px) */
  desktopWidth?: string;
  /** Optional fixed height for the floating desktop variant */
  desktopHeight?: string;
  /** Show the FullLogo — in the top bar for full-page, or top-left corner for floating */
  logo?: boolean;
  /** Centers the header text */
  centerHeader?: boolean;
  /** Mobile panel height: "tall" = 90vh, or a fixed value (e.g. "30rem"). Default is auto. */
  mobileHeight?: "tall" | string;
  /** Vertically centers the body/children within the available space */
  centerBody?: boolean;
  children: ReactNode;
}

export function BottomPanel({
  isOpen,
  onClose,
  header,
  subheader,
  footer,
  desktopFooter,
  desktopVariant,
  desktopWidth,
  desktopHeight,
  logo = false,
  centerHeader = false,
  mobileHeight,
  centerBody = false,
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
      className="text-primary shrink-0 cursor-pointer"
    >
      <Close focus />
    </button>
  );

  return (
    <>
      {/* Desktop: full-page overlay */}
      {desktopVariant === "full-page" && (
        <div
          className={`fixed inset-0 z-[60] bg-black dark hidden lg:flex flex-col transition-opacity duration-300 ${fadeIn}`}
        >
          <div className="relative z-10 flex items-center justify-between p-[var(--space-page)] shrink-0">
            {logo ? <FullLogo color="white" className="w-20" /> : <div />}
            {closeBtn}
          </div>
          <div className="absolute inset-0 flex flex-col items-center justify-center py-12">
            <div className="flex flex-col gap-[3.75rem] w-[22.875rem]">
              <div className="flex flex-col items-center">
                <p className="text-body-sm-bold text-primary text-center">
                  {header}
                </p>
                {subheader && (
                  <p className="text-body-sm-bold text-secondary text-center">
                    {subheader}
                  </p>
                )}
              </div>
              {children}
              {(desktopFooter ?? footer) && (
                <div className="flex justify-center">
                  {desktopFooter ?? footer}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Desktop: floating card */}
      {desktopVariant === "floating" && (
        <div
          className={`fixed inset-0 z-[60] hidden lg:flex flex-col items-center justify-center transition-opacity duration-300 ${fadeIn}`}
        >
          <Scrim visible={isAnimating} onClick={onClose} variant="default" />
          {logo && (
            <div className="absolute top-8 left-8">
              <FullLogo color="white" />
            </div>
          )}
          <div
            className="relative bg-black dark rounded-[2rem] p-6 flex flex-col gap-5 overflow-x-hidden"
            style={{
              width: desktopWidth ?? "24.375rem",
              height: desktopHeight,
            }}
          >
            <div>
              <div className="flex items-start justify-between gap-2">
                <div className="size-6 shrink-0" />
                <p className="text-body-sm-bold text-primary text-center flex-1">
                  {header}
                </p>
                {closeBtn}
              </div>
              {subheader && (
                <p className="text-body-sm-bold text-secondary text-center">
                  {subheader}
                </p>
              )}
            </div>
            {children}
          </div>
        </div>
      )}

      {/* Mobile: bottom sheet */}
      <div className="fixed inset-0 z-[60] lg:hidden flex flex-col justify-end">
        <Scrim visible={isAnimating} onClick={onClose} />
        <div
          className={`relative bg-black dark rounded-t-[1.5rem] flex flex-col gap-5 px-6 pt-6 pb-9 overflow-x-hidden transition-transform duration-300 ${isAnimating ? "translate-y-0" : "translate-y-full"}`}
          style={{ height: mobileHeight === "tall" ? "90vh" : mobileHeight }}
        >
          <div className="relative">
            <div
              className={`flex flex-col ${centerHeader ? "items-center px-8" : "pr-8"}`}
            >
              <p className="text-body-sm-bold text-primary">{header}</p>
            </div>
            {subheader && (
              <p
                className={`text-body-sm-bold text-secondary ${centerHeader ? "text-center px-8" : "pr-8"}`}
              >
                {subheader}
              </p>
            )}
            <div className="absolute top-0 right-0">{closeBtn}</div>
          </div>
          <div
            className={`flex flex-col gap-4 ${mobileHeight || centerBody ? "flex-1" : ""} ${centerBody ? "justify-center" : ""}`}
          >
            {children}
          </div>
          {footer && <div className="pt-3 flex justify-center">{footer}</div>}
        </div>
      </div>
    </>
  );
}
