import type { ReactNode } from "react";
import { cn } from "@/utils/cn";
import { Reveal, SlideMark, T } from "@/components/primitives";

export function SlideHead({
  title,
  sub,
  dark = false,
  size = "md",
  maxSub = 1120,
}: {
  title: ReactNode;
  sub?: ReactNode;
  dark?: boolean;
  size?: "md" | "lg" | "sm";
  maxSub?: number;
}) {
  const titleSize = size === "lg" ? 62 : size === "sm" ? 46 : 53;
  return (
    <header className="relative shrink-0">
      <Reveal d={20} v="left" className="mb-[18px] flex items-center">
        <SlideMark tone={dark ? "clay" : "sage"} />
      </Reveal>
      <Reveal d={80} v="mask">
        <h2
          className="s-title"
          style={{ fontSize: titleSize, lineHeight: 1.07 }}
        >
          {title}
        </h2>
      </Reveal>
      {sub ? (
        <Reveal d={190} v="up" className="mt-[14px]">
          <p className="s-sub" style={{ maxWidth: maxSub }}>
            {sub}
          </p>
        </Reveal>
      ) : null}
    </header>
  );
}

export function SlideShell({
  children,
  dark = false,
  tight = false,
  className,
}: {
  children: ReactNode;
  dark?: boolean;
  tight?: boolean;
  className?: string;
}) {
  return (
    <div className={cn("slide", dark ? "slide-dark on-dark" : "slide-paper")}>
      <div className={cn("slide-inner", tight && "tight", className)}>
        {children}
      </div>
    </div>
  );
}

/** Inline line icons used purely as visual markers (no new wording). */
export function PageIcon({ name, dark = false }: { name: string; dark?: boolean }) {
  const common = {
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.5,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };
  const paths: Record<string, ReactNode> = {
    spark: (
      <>
        <path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M18.4 5.6l-2.1 2.1M7.7 16.3l-2.1 2.1" />
        <circle cx="12" cy="12" r="3.2" />
      </>
    ),
    layers: (
      <>
        <path d="M12 3 3.5 7.5 12 12l8.5-4.5L12 3Z" />
        <path d="m3.5 12 8.5 4.5 8.5-4.5" />
        <path d="m3.5 16.5 8.5 4.5 8.5-4.5" />
      </>
    ),
    calendar: (
      <>
        <rect x="3.5" y="5" width="17" height="15" rx="2" />
        <path d="M8 3v4M16 3v4M3.5 9.5h17M8 13h2M14 13h2M8 16.5h2M14 16.5h2" />
      </>
    ),
    chart: (
      <>
        <path d="M4 20V4M4 20h16" />
        <path d="M8 16v-4M12.5 16V8M17 16v-6" />
      </>
    ),
    slider: (
      <>
        <path d="M3.5 7h9M17.5 7h3M3.5 17h4M12.5 17h8" />
        <circle cx="15" cy="7" r="2.5" />
        <circle cx="10" cy="17" r="2.5" />
      </>
    ),
    info: (
      <>
        <circle cx="12" cy="12" r="8.5" />
        <path d="M12 11v5.5M12 7.8v.4" />
      </>
    ),
  };
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-[26px] w-[26px]"
      style={{ color: dark ? "#e6b391" : "#2f7163" }}
      {...common}
    >
      {paths[name] ?? paths.info}
    </svg>
  );
}

export function Formula({
  children,
  dark = false,
}: {
  children: string;
  dark?: boolean;
}) {
  return (
    <span
      className="mono rounded-md px-2 py-[2px]"
      style={{
        background: dark ? "rgba(230, 179, 145, 0.14)" : "rgba(185, 87, 47, 0.09)",
        color: dark ? "#f0c9ab" : "#93482a",
        fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
        fontSize: "0.94em",
      }}
    >
      <T>{children}</T>
    </span>
  );
}
