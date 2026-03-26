import Link from "next/link";
import { Camera } from "./icons/Camera";

export type AvatarSize = "sm" | "md" | "lg" | "xl" | "2xl";

interface AvatarProps {
  size?: AvatarSize;
  lgSize?: AvatarSize;
  src?: string;
  alt?: string;
  username?: string;
  href?: string;
  editIcon?: boolean;
  focus?: boolean;
  className?: string;
}

const sizeClasses: Record<AvatarSize, string> = {
  sm:  "size-5",                // 20px
  md:  "size-[1.375rem]",       // 22px
  lg:  "size-7",                // 28px
  xl:  "size-10",               // 40px
  "2xl": "size-[6.125rem]",     // 98px
};

const lgSizeClasses: Record<AvatarSize, string> = {
  sm:  "lg:size-5",
  md:  "lg:size-[1.375rem]",
  lg:  "lg:size-7",
  xl:  "lg:size-10",
  "2xl": "lg:size-[6.125rem]",
};

export function Avatar({
  size = "sm",
  lgSize,
  src,
  alt = "",
  username,
  href,
  editIcon = false,
  focus = false,
  className,
}: AvatarProps) {
  const inner = (
    <>
      <div
        className={`relative rounded-full shrink-0 ${sizeClasses[size]} ${lgSize ? lgSizeClasses[lgSize] : ""} ${
          focus ? "outline outline-1 outline-offset-2 outline-black" : ""
        }`}
      >
        <div className="size-full rounded-full overflow-hidden bg-black/10">
          <img src={src || "/avatar.png"} alt={alt || username || ""} className="size-full object-cover" />
        </div>

        {editIcon && size === "2xl" && (
          <div className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center text-white">
            <Camera className="size-9" />
          </div>
        )}
      </div>

      {username && size === "sm" && (
        <span className="text-body-xs text-neon whitespace-nowrap">
          {username.replace(/^@/, "")}
        </span>
      )}
    </>
  );

  const wrapperClass = `inline-flex items-center gap-2 ${href ? "cursor-pointer" : ""} ${className ?? ""}`;

  if (href) {
    return <Link href={href} className={wrapperClass}>{inner}</Link>;
  }

  return <div className={wrapperClass}>{inner}</div>;
}
