import Link from "next/link";

export type FooterType = "default" | "logged-out";

interface FooterLink {
  label: string;
  href: string;
}

interface FooterProps {
  type?: FooterType;
  links?: FooterLink[];
  onEmailSubmit?: (email: string) => void;
  className?: string;
}

const defaultLinks: FooterLink[] = [
  { label: "Instagram", href: "#" },
  { label: "Contact", href: "#" },
  { label: "Give us feedback", href: "#" },
  { label: "About", href: "#" },
  { label: "Terms", href: "#" },
  { label: "Privacy", href: "#" },
];

// Inline logo wordmark (public/logo-full.svg recommended — using img fallback)
function LogoWordmark({ className }: { className?: string }) {
  return (
    <img
      src="/logo-full.svg"
      alt="here*"
      className={`h-6 w-auto ${className ?? ""}`}
    />
  );
}

export function Footer({
  type = "default",
  links = defaultLinks,
  onEmailSubmit,
  className,
}: FooterProps) {
  const isLoggedOut = type === "logged-out";

  if (!isLoggedOut) {
    // ── Default footer ──────────────────────────────────────────────────────
    return (
      <footer
        className={`bg-black rounded-tl-[36px] rounded-tr-[36px] w-full h-[141px] relative ${className ?? ""}`}
      >
        <div className="absolute bottom-[73px] left-8">
          <LogoWordmark />
        </div>
        <p className="absolute bottom-10 right-8 text-body-sm text-grey whitespace-nowrap">
          © Here* 2024. All rights reserved
        </p>
      </footer>
    );
  }

  // ── Logged-out footer ─────────────────────────────────────────────────────
  return (
    <footer
      className={`bg-black rounded-tl-[36px] rounded-tr-[36px] w-full relative overflow-hidden ${className ?? ""}`}
    >
      {/* Email signup */}
      <div className="px-8 pt-14 pb-10 flex flex-col gap-5">
        <p className="text-header-radio-1 text-cream w-[314px]">
          Keep up with our new{"\n"}features and exclusives
        </p>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const input = e.currentTarget.querySelector("input");
            if (input?.value) onEmailSubmit?.(input.value);
          }}
          className="relative border border-neon rounded-[16px] h-[52px] flex items-center px-4"
        >
          <input
            type="email"
            placeholder="Enter email for latest updates"
            className="flex-1 bg-transparent text-body-sm text-neon placeholder:text-neon/60 outline-none"
          />
          <button
            type="submit"
            className="shrink-0 size-8 rounded-full bg-neon flex items-center justify-center"
            aria-label="Subscribe"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M3 8H13M13 8L9 4M13 8L9 12" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </form>
      </div>

      {/* Bottom section */}
      <div className="px-8 pb-10 flex justify-between items-end">
        <div className="flex flex-col gap-8">
          <LogoWordmark />
          <nav className="flex flex-col gap-5">
            {links.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-body-sm text-grey hover:text-white transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <p className="text-body-sm text-grey">© Here* 2024. All rights reserved</p>
        </div>

        {/* Logo icon — ocean circle */}
        <div className="size-[70px] rounded-full bg-ocean flex items-center justify-center shrink-0 -rotate-[14deg]">
          <img src="/logo.svg" alt="" className="size-[40px] object-contain" aria-hidden="true" />
        </div>
      </div>
    </footer>
  );
}
