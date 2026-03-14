import type { ReactNode } from "react";

interface ProfileMessageProps {
  icon?: ReactNode;
  header?: string;
  children?: ReactNode;
}

export default function ProfileMessage({ icon, header, children }: ProfileMessageProps) {
  return (
    <div className="text-center flex flex-col items-center mt-16">
      {icon && (
        <div className="size-12 rounded-full bg-black/5 flex items-center justify-center mb-4">
          {icon}
        </div>
      )}
      <div className="max-w-sm">
        {header && <h1 className="text-header-radio-1 mb-2">{header}</h1>}
        {children && (
          <div className="text-body-sm text-secondary mb-6">{children}</div>
        )}
      </div>
    </div>
  );
}
