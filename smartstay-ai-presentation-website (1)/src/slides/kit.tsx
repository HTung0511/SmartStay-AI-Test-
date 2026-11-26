import {
  createContext,
  createElement,
  useContext,
  useLayoutEffect,
  useMemo,
  useRef,
  type CSSProperties,
  type ElementType,
  type ReactNode,
} from "react";
import { cn } from "@/utils/cn";

/* ───────────────────────── Môi trường của slide ─────────────────────────
   animate = false  → hiển thị ngay trạng thái cuối (thumbnail, giảm chuyển động)
   dir             → chiều điều hướng (+1 sang tiếp theo, -1 về trước)        */
export type SlideEnv = { animate: boolean; dir: 1 | -1 };
export const SlideEnvCtx = createContext<SlideEnv>({ animate: false, dir: 1 });
export const useEnv = () => useContext(SlideEnvCtx);

/** Độ trễ nền: chờ lớp nền của slide mới hiện ra rồi mới bắt đầu các tầng chữ */
export const BASE_DELAY = 200;
export const DelayCtx = createContext(BASE_DELAY);

export const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);
export const easeOutQuart = (t: number) => 1 - Math.pow(1 - t, 4);

/* ───────────────────────── Xuất hiện theo tầng ───────────────────────── */
export type RevealKind = "up" | "side" | "row" | "zoom" | "fade" | "pop" | "grow" | "title" | "wipe";

type RProps = {
  d?: number;
  k?: RevealKind;
  dur?: number;
  as?: ElementType;
  className?: string;
  style?: CSSProperties;
  role?: string;
  children?: ReactNode;
};

export function R({ d = 0, k = "up", dur, as = "div", className, style, role, children }: RProps) {
  const env = useEnv();
  if (!env.animate) {
    return createElement(as, { className, style, role }, children);
  }
  const delay = d + BASE_DELAY;
  const kind = k === "title" || k === "wipe" ? `${k}-${env.dir > 0 ? "f" : "b"}` : k;
  return (
    <DelayCtx.Provider value={delay}>
      {createElement(
        as,
        {
          className: cn("rv", `rv-${kind}`, className),
          role,
          style: { ...style, "--d": `${delay}ms`, ...(dur ? { "--dur": `${dur}ms` } : {}) } as CSSProperties,
        },
        children,
      )}
    </DelayCtx.Provider>
  );
}

/* ───────────────────────── Count-up ───────────────────────── */
// Quy ước số Việt Nam: dấu "." ngăn nghìn, dấu "," thập phân.
// Mã định danh như E1…E9, v1, v2 (đứng sau chữ cái) không phải giá trị số.
const NUM_RE = /(?<![A-Za-z_])(\d{1,3}(?:\.\d{3})+(?:,\d+)?|\d+(?:,\d+)?)(?![A-Za-z_])/g;

type NumInfo = { value: number; decimals: number; thousands: boolean; pad: number };

function parseNum(tok: string): NumInfo {
  const [ip, dp = ""] = tok.split(",");
  const thousands = /^\d{1,3}(\.\d{3})+$/.test(ip);
  const intVal = parseInt(ip.replace(/\./g, ""), 10);
  const value = dp ? parseFloat(`${intVal}.${dp}`) : intVal;
  const pad = !thousands && ip.length > 1 && ip[0] === "0" ? ip.length : 0;
  return { value, decimals: dp.length, thousands, pad };
}

function formatNum(v: number, n: NumInfo) {
  const s = v.toFixed(n.decimals);
  const parts = s.split(".");
  let ip = parts[0];
  const dp = parts[1];
  if (n.thousands) ip = ip.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  if (n.pad) ip = ip.padStart(n.pad, "0");
  return dp ? `${ip},${dp}` : ip;
}

type Part = { s: string; num: boolean };
function splitNums(text: string): Part[] {
  const out: Part[] = [];
  let last = 0;
  for (const m of text.matchAll(NUM_RE)) {
    const i = m.index ?? 0;
    if (i > last) out.push({ s: text.slice(last, i), num: false });
    out.push({ s: m[0], num: true });
    last = i + m[0].length;
  }
  if (last < text.length) out.push({ s: text.slice(last), num: false });
  return out;
}

type CountUpProps = {
  token: string;
  delay?: number;
  dur?: number;
  ease?: (t: number) => number;
  className?: string;
};

/* Gom việc đo độ rộng của mọi số trên slide vừa gắn vào MỘT lượt (chỉ 1 lần tính bố cục),
   chạy trong microtask ngay sau commit và trước khi trình duyệt vẽ → không nháy, không giật. */
type Pending = { el: HTMLElement; zero: string };
const pending: Pending[] = [];
let flushScheduled = false;
function flushReserve() {
  flushScheduled = false;
  const items = pending.splice(0).filter((it) => it.el.isConnected);
  const widths = items.map((it) => it.el.offsetWidth); // chỉ đọc
  items.forEach((it, i) => {
    // chỉ ghi
    it.el.style.minWidth = `${widths[i]}px`;
    it.el.textContent = it.zero;
  });
}
function reserveWidth(el: HTMLElement, token: string, zero: string) {
  el.textContent = token; // đo bằng chuỗi cuối để giữ chỗ đúng bằng độ rộng thật
  pending.push({ el, zero });
  if (!flushScheduled) {
    flushScheduled = true;
    queueMicrotask(flushReserve);
  }
}

/** Đếm từ 0 tới đúng chuỗi `token`; kết thúc luôn gán lại chính chuỗi gốc. */
export function CountUp({ token, delay, dur = 1100, ease = easeOutCubic, className }: CountUpProps) {
  const env = useEnv();
  const base = useContext(DelayCtx);
  const ref = useRef<HTMLSpanElement>(null);
  const info = useMemo(() => parseNum(token), [token]);
  const start = delay ?? base + 220;

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el || !env.animate) return;
    reserveWidth(el, token, formatNum(0, info));
    const t0 = performance.now() + start;
    let raf = 0;
    const tick = (now: number) => {
      const p = (now - t0) / dur;
      if (p >= 1) {
        el.textContent = token;
        return;
      }
      if (p > 0) el.textContent = formatNum(info.value * ease(p), info);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      el.textContent = token;
      el.style.minWidth = "";
    };
  }, [env.animate, token, info, start, dur, ease]);

  return (
    <span ref={ref} className={cn("cu", className)}>
      {env.animate ? null : token}
    </span>
  );
}

/** Văn bản: tự nhận mọi số và cho chạy Count-up, phần chữ giữ nguyên từng ký tự. */
export function T({ children }: { children: string }) {
  const env = useEnv();
  const base = useContext(DelayCtx);
  const parts = useMemo(() => splitNums(children), [children]);
  if (!env.animate) return <>{children}</>;
  let n = 0;
  return (
    <>
      {parts.map((p, i) =>
        p.num ? <CountUp key={i} token={p.s} delay={base + 240 + n++ * 90} /> : p.s,
      )}
    </>
  );
}

/* ───────────────────────── Thanh biểu đồ tăng dần ───────────────────────── */
export function GrowBar({
  widthPx,
  delay,
  dur = 1300,
  className,
}: {
  widthPx: number;
  delay: number;
  dur?: number;
  className?: string;
}) {
  const env = useEnv();
  const ref = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el || !env.animate) return;
    el.style.width = "0px";
    const t0 = performance.now() + delay;
    let raf = 0;
    const tick = (now: number) => {
      const p = (now - t0) / dur;
      if (p >= 1) {
        el.style.width = `${widthPx}px`;
        return;
      }
      if (p > 0) el.style.width = `${widthPx * easeOutQuart(p)}px`;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      el.style.width = `${widthPx}px`;
    };
  }, [env.animate, widthPx, delay, dur]);
  return <div ref={ref} className={className} style={{ width: env.animate ? 0 : widthPx }} />;
}

/* ───────────────────────── Bảng ───────────────────────── */
export type Cell = string | { t: string; cls?: string; kind?: "badge" | "rank" };

function CellView({ c }: { c: Cell }) {
  if (typeof c === "string") return <T>{c}</T>;
  const inner = <T>{c.t}</T>;
  if (c.kind === "badge") return <span className="badge">{inner}</span>;
  if (c.kind === "rank") return <span className="rank">{inner}</span>;
  return c.cls ? <span className={c.cls}>{inner}</span> : inner;
}

export function Table({
  cols,
  head,
  rows,
  fs = 26,
  py = 14,
  d0 = 420,
  step = 90,
  hl,
  colCls = [],
}: {
  cols: string;
  head: string[];
  rows: Cell[][];
  fs?: number;
  py?: number;
  d0?: number;
  step?: number;
  hl?: number;
  colCls?: string[];
}) {
  return (
    <R
      k="fade"
      d={d0 - 280}
      className="tbl"
      role="table"
      style={{ "--cols": cols, "--fs": `${fs}px`, "--py": `${py}px` } as CSSProperties}
    >
      <R k="wipe" d={d0 - 140} className="tr tr-h" role="row">
        {head.map((h, i) => (
          <div key={i} role="columnheader">
            <T>{h}</T>
          </div>
        ))}
      </R>
      {rows.map((r, i) => (
        <R key={i} k="row" d={d0 + i * step} className={cn("tr", hl === i && "tr-hl")} role="row">
          {r.map((c, j) => (
            <div key={j} role="cell" className={colCls[j]}>
              <CellView c={c} />
            </div>
          ))}
        </R>
      ))}
    </R>
  );
}
