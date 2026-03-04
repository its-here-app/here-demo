// Logo components — place your exported SVG files in /public/:
//   /public/logo.svg        (icon only, ~56×60px)
//   /public/logo-full.svg   (wordmark, ~117×40px)

interface LogoProps {
  className?: string;
  alt?: string;
}

/** Icon-only logo mark (56×60px) */
export function Logo({ className, alt = "here*" }: LogoProps) {
  return (
    <img
      src="/logo.svg"
      alt={alt}
      width={56}
      height={60}
      className={className}
    />
  );
}

/** Full wordmark logo (58.5×20px) */
export function FullLogo({ className, alt = "here*" }: LogoProps) {
  return (
    <img
      src="/logo-full.svg"
      alt={alt}
      width={58.5}
      height={20}
      className={className}
    />
  );
}
