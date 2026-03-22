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
  /** Light mode: transparent background */
  lightMode?: boolean;
  /** When true, adds focus-within:border-brand to the input wrapper */
  focusBrand?: boolean;
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

export const TextInput = forwardRef<
  HTMLInputElement | HTMLTextAreaElement,
  TextInputProps
>(function TextInput(props, ref) {
  const {
    size = "default",
    lightMode = false,
    focusBrand = false,
    label,
    rightSlot,
    className,
    placeholder = "Input field",
    ...rest
  } = props;

  const isTall = size === "tall";

  const textareaRest = isTall
    ? (rest as TextareaHTMLAttributes<HTMLTextAreaElement>)
    : null;
  const charsLeft =
    isTall && textareaRest?.maxLength != null
      ? textareaRest.maxLength - (textareaRest.value?.toString().length ?? 0)
      : null;

  const textClass = "text-primary placeholder:text-tertiary";

  const bg = lightMode ? "bg-transparent" : "bg-black";
  const focusClass = focusBrand ? "focus-within:border-brand" : "";

  return (
    <div className={`flex flex-col gap-2 w-full ${className ?? ""}`}>
      {label && <span className="text-body-xs text-secondary">{label}</span>}
      <div
        className={`group ${bg} border border-subtle ${focusClass} flex gap-2.5 px-4 py-3 rounded-[1rem] w-full ${
          isTall ? "relative h-[5.375rem] items-start" : "h-14 items-center"
        }`}
      >
        {isTall ? (
          <>
            <textarea
              ref={ref as React.Ref<HTMLTextAreaElement>}
              placeholder={placeholder}
              className={`flex-1 min-w-0 min-h-0 h-full bg-transparent text-body-sm resize-none outline-none ${textClass}`}
              {...(rest as TextareaHTMLAttributes<HTMLTextAreaElement>)}
            />
            {charsLeft != null && (
              <span className="absolute bottom-3 right-3 text-body-xs text-tertiary pointer-events-none">
                {charsLeft}
              </span>
            )}
          </>
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
