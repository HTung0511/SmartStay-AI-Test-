import {
  createContext,
  useContext,
  useLayoutEffect,
  useMemo,
  useRef,
  type CSSProperties,
  type ElementType,
  type ReactNode,
} from "react";

/** true = phát hoạt ảnh (trình chiếu); false = hiển thị tĩnh (thumbnail) */
export const AnimCtx = createContext(true);

/** Độ trễ chung để nội dung bắt đầu khi slide đã bắt đầu trượt vào */
export const BASE = 240;

const prefersReduced = () =>
  typeof window !== "undefined" &&
  typeof window.matchMedia === "function" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ------------------------------------------------------------------ */
/* Count-up: giữ nguyên quy ước số của bản gốc (1.234 · 0,43 · 37,0%)   */
/* ------------------------------------------------------------------ */

// Số không dính liền với chữ cái (E3, v2 là mã nhãn, không phải số liệu)
const NUM_RE = /(?<![\p{L}_\d])\d+(?:[.,]\d+)*/gu;

interface Tok {
  text: string;
  val: number;
  dec: number;
  thou: boolean;
  dotDec: boolean;
  pad: number;
}

function parseTok(text: string): Tok {
  let thou = false;
  let dotDec = false;
  let dec = 0;
  let val = 0;
  let intPart = text;
  if (text.includes(",")) {
    const [i, f] = text.split(",");
    dec = f.length;
    thou = i.includes(".");
    intPart = i;
    val = parseFloat(i.replace(/\./g, "") + "." + f);
  } else if (/^\d{1,3}(\.\d{3})+$/.test(text)) {
    thou = true;
    val = parseInt(text.replace(/\./g, ""), 10);
  } else if (text.includes(".")) {
    dotDec = true;
    dec = text.split(".")[1].length;
    val = parseFloat(text);
  } else {
    val = parseInt(text, 10);
  }
  const pad = !thou && intPart.length > 1 && intPart[0] === "0" ? intPart.length : 0;
  return { text, val, dec, thou, dotDec, pad };
}

function fmt(t: Tok, p: number): string {
  if (p >= 1) return t.text;
  const v = t.val * p;
  const [ip, fp] = v.toFixed(t.dec).split(".");
  let i = ip;
  if (t.thou) i = i.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  if (t.pad) i = i.padStart(t.pad, "0");
  return fp ? i + (t.dotDec ? "." : ",") + fp : i;
}

type Part = string | Tok;

function split(text: string): Part[] {
  const out: Part[] = [];
  let last = 0;
  for (const m of text.matchAll(NUM_RE)) {
    const idx = m.index ?? 0;
    if (idx > last) out.push(text.slice(last, idx));
    out.push(parseTok(m[0]));
    last = idx + m[0].length;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}

const easeOut = (x: number) => 1 - Math.pow(1 - x, 3.2);

/**
 * Văn bản có Count-up cho mọi số bên trong.
 * d = độ trễ (ms) tính từ lúc slide xuất hiện, dur = thời lượng chạy số.
 */
export function T({
  children,
  d = 0,
  dur = 1300,
}: {
  children: string;
  d?: number;
  dur?: number;
}) {
  const animate = useContext(AnimCtx);
  const parts = useMemo(() => split(children), [children]);
  const refs = useRef<(HTMLSpanElement | null)[]>([]);
  const hasNum = parts.some((p) => typeof p !== "string");

  useLayoutEffect(() => {
    if (!animate || !hasNum || prefersReduced()) return;
    const toks: { tok: Tok; el: HTMLSpanElement }[] = [];
    parts.forEach((p, i) => {
      const el = refs.current[i];
      if (typeof p !== "string" && el) toks.push({ tok: p, el });
    });
    const paint = (p: number) => {
      for (const { tok, el } of toks) el.textContent = fmt(tok, p);
    };
    paint(0);
    const t0 = performance.now() + BASE + d;
    let raf = 0;
    let lastP = -1;
    const tick = (now: number) => {
      const raw = Math.min(1, Math.max(0, (now - t0) / dur));
      if (raw !== lastP) {
        lastP = raw;
        paint(easeOut(raw));
      }
      if (raw < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      paint(1); // luôn trả về chuỗi gốc
    };
  }, [animate, hasNum, parts, d, dur]);

  if (!hasNum) return <>{children}</>;
  return (
    <>
      {parts.map((p, i) =>
        typeof p === "string" ? (
          p
        ) : (
          <span
            key={i}
            className="n"
            ref={(el) => {
              refs.current[i] = el;
            }}
          >
            {p.text}
          </span>
        )
      )}
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Reveal: xuất hiện theo nhịp, mỗi loại nội dung một kiểu chuyển động    */
/* ------------------------------------------------------------------ */

export type RvKind =
  | "up"
  | "left"
  | "right"
  | "zoom"
  | "fade"
  | "wipe"
  | "row"
  | "pop"
  | "drop"
  | "grow"
  | "rise";

export function Rv({
  k = "up",
  d = 0,
  dur,
  as,
  className = "",
  style,
  children,
}: {
  k?: RvKind;
  d?: number;
  dur?: number;
  as?: ElementType;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
}) {
  const animate = useContext(AnimCtx);
  const Tag: ElementType = as ?? "div";
  const st: CSSProperties = animate
    ? ({
        ...style,
        ["--d" as string]: `${BASE + d}ms`,
        ...(dur ? { ["--t" as string]: `${dur}ms` } : {}),
      } as CSSProperties)
    : (style ?? {});
  return (
    <Tag className={`${animate ? `rv rv-${k}` : ""} ${className}`.trim()} style={st}>
      {children}
    </Tag>
  );
}
