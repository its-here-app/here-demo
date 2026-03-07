"use client";

export type ToggleView = "list" | "expanded" | "map";

interface TogglesProps {
  value: ToggleView;
  onChange: (value: ToggleView) => void;
  className?: string;
}

const options: { value: ToggleView; label: string; icon: React.ReactNode }[] = [
  {
    value: "list",
    label: "List",
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
        <rect x="2" y="4" width="14" height="1.5" rx="0.75" fill="currentColor" />
        <rect x="2" y="8.25" width="14" height="1.5" rx="0.75" fill="currentColor" />
        <rect x="2" y="12.5" width="14" height="1.5" rx="0.75" fill="currentColor" />
      </svg>
    ),
  },
  {
    value: "expanded",
    label: "Expanded",
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
        <rect x="2" y="2" width="14" height="6" rx="1" fill="currentColor" />
        <rect x="2" y="10" width="14" height="6" rx="1" fill="currentColor" />
      </svg>
    ),
  },
  {
    value: "map",
    label: "Map",
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
        <path
          d="M9 2C6.79 2 5 3.79 5 6C5 9.5 9 14 9 14C9 14 13 9.5 13 6C13 3.79 11.21 2 9 2ZM9 7.5C8.17 7.5 7.5 6.83 7.5 6C7.5 5.17 8.17 4.5 9 4.5C9.83 4.5 10.5 5.17 10.5 6C10.5 6.83 9.83 7.5 9 7.5Z"
          fill="currentColor"
        />
        <path d="M5 14.5C4 15 3 15.5 3 16H15C15 15.5 14 15 13 14.5" stroke="currentColor" strokeWidth="1" />
      </svg>
    ),
  },
];

export function Toggles({ value, onChange, className }: TogglesProps) {
  return (
    <div
      className={`relative flex items-center h-[2.875rem] w-[8.125rem] rounded-[2.5rem] border border-black/10 p-1 gap-0 ${className ?? ""}`}
    >
      {options.map((option) => {
        const isActive = value === option.value;
        return (
          <button
            key={option.value}
            aria-label={option.label}
            aria-pressed={isActive}
            onClick={() => onChange(option.value)}
            className={`relative z-10 flex items-center justify-center size-9 rounded-[1.875rem] cursor-pointer transition-colors ${
              isActive ? "bg-black text-white" : "text-black hover:bg-black/5"
            }`}
          >
            {option.icon}
          </button>
        );
      })}
    </div>
  );
}
