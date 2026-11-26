import {
  createContext,
  useContext,
  useEffect,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";

/* -------------------------------------------------------------------------- */
/*  Ngữ cảnh slide: animate = true khi trình chiếu, false khi hiển thị thumbnail */
/* -------------------------------------------------------------------------- */
export const SlideCtx = createContext<{ animate: boolean }>({ animate: false });
export const useSlide = () => useContext(SlideCtx);

export function usePrefersReducedMotion() {
  const query = "(prefers-reduced-motion: reduce)";
  const [reduced, setReduced] = useState(
    () => typeof window !== "undefined" && window.matchMedia(query).matches,
  );
  useEffect(() => {
    const mq = window.matchMedia(query);
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);
  return reduced;
}

/** Độ trễ hoạt ảnh (ms) truyền qua biến CSS --d */
export const dl = (ms: number, extra: CSSProperties = {}): CSSProperties =>
  ({ "--d": ms, ...extra }) as CSSProperties;

/* -------------------------------------------------------------------------- */
/*  CountUp: số tăng dần, luôn kết thúc đúng bằng chuỗi gốc                    */
/* -------------------------------------------------------------------------- */
function parseNumber(text: string) {
  const m = text.match(/^(\D*?)(\d[\d.,]*)(\D*)$/);
  if (!m) return null;
  const [, prefix, num, suffix] = m;
  const comma = num.indexOf(",");
  const decimals = comma >= 0 ? num.length - comma - 1 : 0;
  const value = parseFloat(num.replace(/\./g, "").replace(",", "."));
  if (Number.isNaN(value)) return null;
  return { prefix, suffix, decimals, value };
}

function formatVi(v: number, decimals: number) {
  const [int, frac] = v.toFixed(decimals).split(".");
  const grouped = int.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return frac ? `${grouped},${frac}` : grouped;
}

export function CountUp({
  text,
  delay = 0,
  duration = 1500,
}: {
  text: string;
  delay?: number;
  duration?: number;
}) {
  const { animate } = useSlide();
  const reduced = usePrefersReducedMotion();
  const parsed = parseNumber(text);
  const active = animate && !reduced && parsed !== null;
  const [display, setDisplay] = useState(() =>
    active && parsed ? `${parsed.prefix}${formatVi(0, parsed.decimals)}${parsed.suffix}` : text,
  );

  useEffect(() => {
    if (!active || !parsed) {
      setDisplay(text);
      return;
    }
    let raf = 0;
    const start = performance.now() + delay + 120;
    const tick = (now: number) => {
      const p = Math.min(1, Math.max(0, (now - start) / duration));
      if (p >= 1) {
        setDisplay(text); // giá trị cuối luôn là chuỗi gốc
        return;
      }
      const eased = 1 - Math.pow(1 - p, 3);
      setDisplay(`${parsed.prefix}${formatVi(parsed.value * eased, parsed.decimals)}${parsed.suffix}`);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, text, delay, duration]);

  return <span>{display}</span>;
}

/* -------------------------------------------------------------------------- */
/*  Khung slide nội dung: dải ảnh khách sạn + tiêu đề + vùng nội dung          */
/* -------------------------------------------------------------------------- */
export function SlideShell({
  band,
  title,
  subtitle,
  children,
}: {
  band: string;
  title: string;
  subtitle?: string;
  children: ReactNode;
}) {
  const headerH = subtitle ? 190 : 150;
  return (
    <div
      className="relative h-[900px] w-[1600px] overflow-hidden text-ink"
      style={{
        background:
          "radial-gradient(900px 420px at 96% 108%, rgba(26,127,122,0.13), transparent 62%), radial-gradient(760px 380px at 2% 104%, rgba(201,162,74,0.16), transparent 60%), linear-gradient(180deg, #f6f2ea 0%, #f1ece1 100%)",
      }}
    >
      <header className="absolute inset-x-0 top-0 overflow-hidden" style={{ height: headerH }}>
        <img src={band} alt="" className="kb absolute inset-0 h-full w-full object-cover" />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(96deg, rgba(9,20,31,0.97) 0%, rgba(13,30,44,0.92) 42%, rgba(16,44,60,0.5) 100%)",
          }}
        />
        <div className="draw absolute inset-x-0 bottom-0 h-[4px] bg-gold" />
        <div className="relative flex h-full flex-col justify-center px-[88px]">
          <h2 className="rv-left font-display text-[52px] font-bold leading-[1.12] tracking-[-0.005em] text-cream">
            {title}
          </h2>
          {subtitle && (
            <p className="rv mt-[10px] text-[25px] leading-[1.35] text-[#cfdbe0]" style={dl(160)}>
              {subtitle}
            </p>
          )}
        </div>
      </header>
      <div
        className="absolute inset-x-[88px] bottom-[44px] flex flex-col"
        style={{ top: headerH + 34 }}
      >
        {children}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Bảng dữ liệu                                                              */
/* -------------------------------------------------------------------------- */
export type Column = { label: string; w: string };

const SIZES = {
  xs: { text: "text-[21px]", head: "text-[20px]", py: "py-[9px]" },
  sm: { text: "text-[22px]", head: "text-[21px]", py: "py-[12px]" },
  md: { text: "text-[24px]", head: "text-[22px]", py: "py-[15px]" },
  lg: { text: "text-[27px]", head: "text-[24px]", py: "py-[19px]" },
} as const;

export function DataTable({
  columns,
  rows,
  highlight = [],
  delay = 300,
  size = "md",
  className = "",
}: {
  columns: Column[];
  rows: ReactNode[][];
  highlight?: number[];
  delay?: number;
  size?: keyof typeof SIZES;
  className?: string;
}) {
  const s = SIZES[size];
  const tpl = columns.map((c) => c.w).join(" ");
  const cell = `flex min-w-0 items-center px-6 ${s.py}`;
  return (
    <div
      role="table"
      className={`overflow-hidden rounded-[18px] border border-[#d6cdb9] bg-white tabular-nums shadow-[0_22px_44px_-26px_rgba(15,29,42,0.5)] ${className}`}
    >
      <div
        role="row"
        className={`rv-fade grid bg-navy font-semibold text-cream ${s.head}`}
        style={dl(delay, { gridTemplateColumns: tpl })}
      >
        {columns.map((c, i) => (
          <div
            key={c.label}
            role="columnheader"
            className={`${cell} ${i > 0 ? "border-l border-white/10" : ""}`}
          >
            {c.label}
          </div>
        ))}
      </div>
      {rows.map((r, ri) => {
        const hl = highlight.includes(ri);
        return (
          <div
            key={ri}
            role="row"
            className={`rv-left grid border-t border-[#e0d8c6] ${s.text} leading-[1.3] ${
              hl
                ? "bg-peach font-medium shadow-[inset_8px_0_0_#c9a24a]"
                : ri % 2 === 1
                  ? "bg-[#faf7f0]"
                  : "bg-white"
            }`}
            style={dl(delay + 160 + ri * 110, { gridTemplateColumns: tpl })}
          >
            {r.map((c, ci) => (
              <div
                key={ci}
                role="cell"
                className={`${cell} ${ci > 0 ? "border-l border-[#e6dfcf]" : ""} ${
                  ci === 0 ? "font-medium" : ""
                }`}
              >
                <div className="min-w-0">{c}</div>
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
}

/** Nhãn E1…E9 */
export function ECode({ children }: { children: ReactNode }) {
  return (
    <span className="inline-block rounded-[8px] bg-teal/12 px-3 py-[2px] font-bold tracking-wide text-teal-ink">
      {children}
    </span>
  );
}

/* -------------------------------------------------------------------------- */
/*  Thanh ghi chú tối                                                         */
/* -------------------------------------------------------------------------- */
export function NoteBar({
  children,
  delay = 900,
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <div
      className={`rv relative overflow-hidden rounded-[20px] bg-navy px-10 py-[26px] text-[26px] leading-[1.45] text-pretty text-cream shadow-[0_22px_44px_-26px_rgba(15,29,42,0.7)] ${className}`}
      style={dl(delay)}
    >
      <span className="absolute inset-y-0 left-0 w-[8px] bg-gold" />
      {children}
    </div>
  );
}

/** Thẻ trắng bo góc */
export function Card({
  children,
  className = "",
  delay = 0,
  style,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  style?: CSSProperties;
}) {
  return (
    <div
      className={`rv-pop rounded-[24px] bg-white shadow-[0_24px_48px_-30px_rgba(15,29,42,0.55)] ring-1 ring-[#e1d9c7] ${className}`}
      style={{ ...dl(delay), ...style }}
    >
      {children}
    </div>
  );
}
