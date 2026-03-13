"use client";

import { useRef, type ReactNode } from "react";

export type SearchInputState = "default" | "focused" | "typing";

interface SearchInputProps {
  state?: SearchInputState;
  value?: string;
  onChange?: (value: string) => void;
  onFocus?: () => void;
  onClear?: () => void;
  leftIcon?: ReactNode;
  placeholder?: string;
  className?: string;
}

const SearchIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
    <circle cx="8" cy="8" r="5" stroke="currentColor" strokeWidth="1.5" />
    <path d="M12 12L15 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const CloseIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
    <path d="M4 4L14 14M14 4L4 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

export function SearchInput({
  state = "default",
  value = "",
  onChange,
  onFocus,
  onClear,
  leftIcon,
  placeholder = "Search",
  className,
}: SearchInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  if (state === "default") {
    return (
      <button
        type="button"
        onClick={onFocus}
        className={`bg-black/5 flex gap-2.5 items-center px-3 py-2.5 rounded-[0.75rem] w-full cursor-pointer text-left ${className ?? ""}`}
      >
        <span className="shrink-0 text-grey">
          {leftIcon ?? <SearchIcon />}
        </span>
        <span className="text-body-sm text-grey">{placeholder}</span>
      </button>
    );
  }

  return (
    <div
      className={`border border-black/10 flex gap-2 items-center px-3 py-2.5 rounded-[0.75rem] w-full ${className ?? ""}`}
    >
      <span className="shrink-0 text-black">
        {leftIcon ?? <SearchIcon />}
      </span>
      <input
        ref={inputRef}
        autoFocus={state === "focused"}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder={placeholder}
        className="flex-1 min-w-0 bg-transparent text-body-sm text-black placeholder:text-tertiary outline-none"
      />
      <button
        type="button"
        onClick={onClear}
        className="shrink-0 text-grey hover:text-black transition-colors"
        aria-label="Clear search"
      >
        <CloseIcon />
      </button>
    </div>
  );
}
