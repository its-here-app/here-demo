"use client";

import { useEffect, useState } from "react";
import { Scrim } from "./Scrim";
import { Button } from "./Button";

export interface SheetItem {
  label: string;
  onClick: () => void;
  variant?: "default" | "danger";
}

interface SheetProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  items: SheetItem[];
}

interface ConfirmSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  items: SheetItem[];
}

export function ConfirmSheet({ isOpen, onClose, title = "Are you sure?", items }: ConfirmSheetProps) {
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
      const t = setTimeout(() => setIsVisible(false), 200);
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
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-6">
      <Scrim visible={isAnimating} onClick={onClose} />
      <div
        className={`relative w-full sm:max-w-xs bg-white rounded-[1rem] flex flex-col overflow-hidden transition-all duration-200 ${
          isAnimating ? "scale-100 opacity-100" : "scale-95 opacity-0"
        }`}
      >
        <div className="py-4 px-3 flex items-center justify-center border-b border-black/5">
          <p className="text-body-sm-bold text-primary text-center">{title}</p>
        </div>
        {items.map((item, i) => (
          <button
            type="button"
            key={i}
            onClick={() => {
              item.onClick();
              onClose();
            }}
            className={`flex h-[46px] items-center justify-center px-3 cursor-pointer text-body-xs ${
              item.variant === "danger" ? "text-danger" : "text-primary"
            } ${i < items.length - 1 ? "border-b border-black/5" : ""}`}
          >
            {item.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export function Sheet({ isOpen, onClose, title, items }: SheetProps) {
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
    <div className="fixed inset-0 z-[60] flex flex-col justify-end">
      <Scrim visible={isAnimating} onClick={onClose} />
      <div
        className={`relative flex flex-col gap-2 p-3 w-full sm:max-w-sm mx-auto transition-transform duration-300 ${
          isAnimating ? "translate-y-0" : "translate-y-full"
        }`}
      >
        {/* Options card */}
        <div className="bg-white backdrop-blur-[12px] rounded-[1rem] flex flex-col overflow-hidden">
          {title && (
            <div className="py-4 px-3 flex items-center justify-center">
              <p className="text-body-sm-bold text-primary text-center">
                {title}
              </p>
            </div>
          )}
          {items.map((item, i) => (
            <button
              key={i}
              onClick={() => {
                item.onClick();
                onClose();
              }}
              className={`flex h-[46px] items-center justify-center px-3 cursor-pointer text-body-xs ${
                item.variant === "danger" ? "text-danger" : "text-primary"
              } ${i < items.length - 1 ? "border-b border-black/5" : ""}`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Cancel */}
        <Button
          variant="tonal"
          size="lg"
          onClick={onClose}
          className="w-full !bg-grey-100 hover:opacity-100"
        >
          Cancel
        </Button>
      </div>
    </div>
  );
}
