"use client";

import {
  type InputHTMLAttributes,
  type TextareaHTMLAttributes,
  forwardRef,
} from "react";

export type TextInputSize = "default" | "tall";
export type TextInputState = "default" | "active" | "filled";

interface BaseProps {
  size?: TextInputSize;
  state?: TextInputState;
  label?: string;
  /** Slot for a right-side element (e.g. a submit button or icon) */
  rightSlot?: React.ReactNode;
  className?: string;
}

type InputProps = BaseProps &
  Omit<InputHTMLAttributes<HTMLInputElement>, "size"> & { size?: "default" };

type TextareaProps = BaseProps &
  Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "size"> & { size: "tall" };

type TextInputProps = InputProps | TextareaProps;

const borderByState: Record<TextInputState, string> = {
  default: "border-white/15",
  active: "border-neon",
  filled: "border-white/15",
};

export const TextInput = forwardRef<
  HTMLInputElement | HTMLTextAreaElement,
  TextInputProps
>(function TextInput(props, ref) {
  const {
    size = "default",
    state = "default",
    label,
    rightSlot,
    className,
    placeholder = "Input field",
    ...rest
  } = props;

  const isTall = size === "tall";
  const textClass =
    state === "default"
      ? "text-white/50 placeholder:text-white/50"
      : "text-white placeholder:text-white/50";

  return (
    <div className={`flex flex-col gap-2 w-full ${className ?? ""}`}>
      {label && (
        <span className="text-body-xs text-grey">
          {label}
        </span>
      )}
      <div
        className={`group bg-black border ${borderByState[state]} focus-within:border-neon flex gap-2.5 px-4 py-3 rounded-[1rem] w-full ${
          isTall ? "h-[5.375rem] items-start" : "h-14 items-center"
        }`}
      >
        {isTall ? (
          <textarea
            ref={ref as React.Ref<HTMLTextAreaElement>}
            placeholder={placeholder}
            className={`flex-1 min-w-0 min-h-0 h-full bg-transparent text-body-sm resize-none outline-none ${textClass}`}
            {...(rest as TextareaHTMLAttributes<HTMLTextAreaElement>)}
          />
        ) : (
          <input
            ref={ref as React.Ref<HTMLInputElement>}
            placeholder={placeholder}
            className={`flex-1 min-w-0 bg-transparent text-body-sm outline-none ${textClass}`}
            {...(rest as InputHTMLAttributes<HTMLInputElement>)}
          />
        )}
        {rightSlot && <div className="shrink-0">{rightSlot}</div>}
      </div>
    </div>
  );
});
