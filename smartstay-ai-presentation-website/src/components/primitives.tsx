import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import { cn } from "@/utils/cn";

/* ------------------------------------------------------------------ */
/* Render context: still thumbnails & reduced-motion support           */
/* ------------------------------------------------------------------ */

type DeckRenderState = {
  still: boolean;
};

const DeckRenderContext = createContext<DeckRenderState>({ still: false });

export function DeckRenderProvider({
  still,
  children,
}: {
  still: boolean;
  children: ReactNode;
}) {
  return (
    <DeckRenderContext.Provider value={{ still }}>
      {children}
    </DeckRenderContext.Provider>
  );
}

export function useDeckRender() {
  return useContext(DeckRenderContext);
}

export function useReducedMotion() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  return reduced;
}

/* ------------------------------------------------------------------ */
/* Animated numbers — always end on the exact source string            */
/* ------------------------------------------------------------------ */

type NumberMeta = {
  target: number;
  decimals: number;
  grouping: boolean;
  decimalSep: string;
  negative: boolean;
  pad: number;
};

function parseNumericToken(raw: string): NumberMeta {
  const negative = raw.startsWith("-");
  const body = negative ? raw.slice(1) : raw;
  const hasComma = body.includes(",");
  const dotParts = body.split(".");

  let integerPart = body;
  let fractionPart = "";
  let decimals = 0;
  let grouping = false;
  let decimalSep = ",";

  if (hasComma) {
    const parts = body.split(",");
    integerPart = parts[0];
    fractionPart = parts[1] ?? "";
    decimals = fractionPart.length;
    decimalSep = ",";
    grouping = integerPart.includes(".");
  } else if (dotParts.length > 1) {
    const grouped = dotParts.slice(1).every((part) => part.length === 3);
    if (grouped) {
      grouping = true;
      integerPart = dotParts.join("");
      decimals = 0;
    } else {
      integerPart = dotParts[0];
      fractionPart = dotParts.slice(1).join("");
      decimals = fractionPart.length;
      decimalSep = ".";
    }
  }

  const numeric = Number(
    `${integerPart || "0"}${fractionPart ? `.${fractionPart}` : ""}`,
  );
  const pad =
    integerPart.length > 1 && integerPart.startsWith("0")
      ? integerPart.length
      : 0;

  return {
    target: Number.isFinite(numeric) ? (negative ? -numeric : numeric) : 0,
    decimals,
    grouping,
    decimalSep,
    negative,
    pad,
  };
}

function formatNumeric(value: number, meta: NumberMeta) {
  const sign = value < 0 ? "-" : "";
  const fixed =
    meta.decimals > 0
      ? Math.abs(value).toFixed(meta.decimals)
      : String(Math.round(Math.abs(value)));
  const [integerRaw, fraction] = fixed.split(".");
  let integer = integerRaw;
  if (meta.pad) integer = integer.padStart(meta.pad, "0");
  if (meta.grouping) integer = integer.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  if (meta.decimals > 0) {
    return `${sign}${integer}${meta.decimalSep}${fraction}`;
  }
  return `${sign}${integer}`;
}

const NUMBER_PATTERN = /(?<![\p{L}\p{N}_])-?\d+(?:[.,]\d+)*/gu;

function tokenizeText(text: string) {
  const parts: Array<{ type: "text" | "number"; value: string }> = [];
  let lastIndex = 0;
  for (const match of text.matchAll(NUMBER_PATTERN)) {
    const index = match.index ?? 0;
    if (index > lastIndex) {
      parts.push({ type: "text", value: text.slice(lastIndex, index) });
    }
    parts.push({ type: "number", value: match[0] });
    lastIndex = index + match[0].length;
  }
  if (lastIndex < text.length) {
    parts.push({ type: "text", value: text.slice(lastIndex) });
  }
  return parts;
}

function useCountUp(raw: string, delay: number, duration: number) {
  const { still } = useDeckRender();
  const [display, setDisplay] = useState(still ? raw : "");

  useEffect(() => {
    const meta = parseNumericToken(raw);
    if (still) {
      setDisplay(raw);
      return;
    }

    let frame = 0;
    let startTime = 0;
    const tick = (now: number) => {
      if (!startTime) startTime = now;
      const elapsed = now - startTime;
      if (elapsed < delay) {
        setDisplay("");
        frame = requestAnimationFrame(tick);
        return;
      }
      const progress = Math.min(1, (elapsed - delay) / duration);
      if (progress >= 1) {
        setDisplay(raw);
        return;
      }
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(formatNumeric(meta.target * eased, meta));
      frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [raw, delay, duration, still]);

  return display;
}

export function AnimatedNumber({
  raw,
  delay = 0,
  duration = 1050,
  className,
}: {
  raw: string;
  delay?: number;
  duration?: number;
  className?: string;
}) {
  const display = useCountUp(raw, delay, duration);
  return <span className={cn("tnum", className)}>{display}</span>;
}

/**
 * T — renders a source string, counting up every numeric token inside.
 * Punctuation, units, percentages, ranges and identifiers (E1, v1) are
 * never rewritten; the final frame is always the exact original string.
 */
export function T({
  children,
  delay = 0,
  each = 0,
  duration = 1050,
  className,
}: {
  children: ReactNode;
  delay?: number;
  each?: number;
  duration?: number;
  className?: string;
}) {
  const text = typeof children === "string" ? children : String(children ?? "");
  const parts = useMemo(() => tokenizeText(text), [text]);
  let numberIndex = 0;

  return (
    <span className={className}>
      {parts.map((part, index) => {
        if (part.type === "text") {
          return <span key={`t-${index}`}>{part.value}</span>;
        }
        const currentDelay = delay + numberIndex * each;
        numberIndex += 1;
        return (
          <AnimatedNumber
            key={`n-${index}`}
            raw={part.value}
            delay={currentDelay}
            duration={duration}
          />
        );
      })}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* Staggered reveal wrapper                                            */
/* ------------------------------------------------------------------ */

type RevealVariant =
  | "up"
  | "down"
  | "left"
  | "right"
  | "scale"
  | "mask"
  | "line"
  | "soft";

export function Reveal({
  children,
  d = 0,
  v = "up",
  className,
  style,
  as: Tag = "div",
}: {
  children?: ReactNode;
  d?: number;
  v?: RevealVariant;
  className?: string;
  style?: CSSProperties;
  as?: "div" | "span" | "li" | "section" | "tr";
}) {
  return (
    <Tag
      className={cn("rv", `rv-${v}`, className)}
      style={{ animationDelay: `${d}ms`, ...style }}
    >
      {children}
    </Tag>
  );
}

/* ------------------------------------------------------------------ */
/* Shared slide chrome pieces                                          */
/* ------------------------------------------------------------------ */

export function SlideMark({ tone = "clay" }: { tone?: "clay" | "sage" }) {
  return (
    <span
      className="inline-flex items-center gap-[9px]"
      aria-hidden="true"
      style={{ color: tone === "clay" ? "#b9572f" : "#2f7163" }}
    >
      <span className="block h-[2px] w-[30px] rounded-full bg-current" />
      <span className="block h-[2px] w-[8px] rounded-full bg-current opacity-60" />
      <span className="block h-[2px] w-[4px] rounded-full bg-current opacity-40" />
    </span>
  );
}

export function Note({
  children,
  tone = "dark",
  d = 0,
  className,
}: {
  children: ReactNode;
  tone?: "dark" | "sage" | "clay" | "quiet";
  d?: number;
  className?: string;
}) {
  const palette = {
    dark: "bg-ink text-[#f0eadf] border-transparent",
    sage: "bg-[#e2e9e1] text-ink border-[#c3d2c6]",
    clay: "bg-[#f0dccd] text-[#5e331c] border-[#dfc1ab]",
    quiet: "bg-white/60 text-[#3c4a44] border-[#d8cfbf]",
  } as const;

  return (
    <Reveal
      d={d}
      v="up"
      className={cn(
        "flex items-start gap-12 rounded-[12px] border px-22 py-16 text-[19px] leading-[1.5]",
        palette[tone],
        className,
      )}
    >
      {children}
    </Reveal>
  );
}

export function QuoteRule({ tone = "clay" }: { tone?: "clay" | "sage" }) {
  return (
    <span
      aria-hidden="true"
      className="block w-[4px] shrink-0 self-stretch rounded-full"
      style={{ background: tone === "clay" ? "#b9572f" : "#7fa89a" }}
    />
  );
}

/** A restrained decorative arc used across content slides. */
export function CornerArc({ dark = false }: { dark?: boolean }) {
  return (
    <svg
      aria-hidden="true"
      className="pointer-events-none absolute -right-[96px] -top-[108px] h-[360px] w-[360px]"
      viewBox="0 0 360 360"
      fill="none"
    >
      <circle
        cx="180"
        cy="180"
        r="156"
        stroke={dark ? "#e6ddca" : "#b9572f"}
        strokeOpacity={dark ? 0.16 : 0.14}
      />
      <circle
        cx="180"
        cy="180"
        r="118"
        stroke={dark ? "#e6ddca" : "#2f7163"}
        strokeOpacity={dark ? 0.12 : 0.13}
      />
      <circle
        cx="180"
        cy="180"
        r="80"
        stroke={dark ? "#dfae8e" : "#b9572f"}
        strokeOpacity={dark ? 0.24 : 0.2}
      />
    </svg>
  );
}

/* Ref measurement hook used for the 16:9 thumbnails */
export function useMeasure<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const update = () => {
      const rect = node.getBoundingClientRect();
      setSize({ width: rect.width, height: rect.height });
    };
    update();
    const observer = new ResizeObserver(update);
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return { ref, size };
}
