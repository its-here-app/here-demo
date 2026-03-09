export type AvatarSize = "sm" | "md" | "lg" | "xl" | "2xl";

interface AvatarProps {
  size?: AvatarSize;
  lgSize?: AvatarSize;
  src?: string;
  alt?: string;
  username?: string;
  editIcon?: boolean;
  focus?: boolean;
  className?: string;
}

const sizeClasses: Record<AvatarSize, string> = {
  sm: "size-5",         // 20px
  md: "size-7",         // 28px
  lg: "size-10",        // 40px
  xl: "size-[6.125rem]",    // 98px
  "2xl": "size-[11.9375rem]", // 191px
};

const lgSizeClasses: Record<AvatarSize, string> = {
  sm: "lg:size-5",
  md: "lg:size-7",
  lg: "lg:size-10",
  xl: "lg:size-[6.125rem]",
  "2xl": "lg:size-[11.9375rem]",
};

export function Avatar({
  size = "sm",
  lgSize,
  src,
  alt = "",
  username,
  editIcon = false,
  focus = false,
  className,
}: AvatarProps) {
  return (
    <div className={`inline-flex items-center gap-2 ${className ?? ""}`}>
      <div
        className={`relative rounded-full shrink-0 ${sizeClasses[size]} ${lgSize ? lgSizeClasses[lgSize] : ""} ${
          focus ? "outline outline-1 outline-offset-2 outline-black" : ""
        }`}
      >
        <div className="size-full rounded-full overflow-hidden bg-black/10">
          <img src={src || "/avatar.png"} alt={alt} className="size-full object-cover" />
        </div>

        {editIcon && size === "xl" && (
          <div className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M9 3L7.5 4.5H5A2 2 0 0 0 3 6.5V17.5A2 2 0 0 0 5 19.5H19A2 2 0 0 0 21 17.5V6.5A2 2 0 0 0 19 4.5H16.5L15 3H9Z"
                stroke="white"
                strokeWidth="1.5"
                strokeLinejoin="round"
              />
              <circle cx="12" cy="12" r="3" stroke="white" strokeWidth="1.5" />
            </svg>
          </div>
        )}
      </div>

      {username && size === "sm" && (
        <span className="text-body-xs text-black whitespace-nowrap">
          {username}
        </span>
      )}
    </div>
  );
}
