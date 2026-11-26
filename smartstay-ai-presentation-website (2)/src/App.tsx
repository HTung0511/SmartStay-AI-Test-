import { memo, useCallback, useEffect, useLayoutEffect, useRef, useState, type CSSProperties } from "react";
import { AnimCtx } from "./lib/anim";
import { SLIDES } from "./slides/Slides";

const W = 1920;
const H = 1080;
const N = SLIDES.length;

const clamp = (i: number) => Math.max(0, Math.min(N - 1, i));
const pad = (n: number) => String(n).padStart(2, "0");

function initialIndex() {
  const m = /^#(\d+)/.exec(window.location.hash);
  return m ? clamp(parseInt(m[1], 10) - 1) : 0;
}

/* ------------------------------------------------------------------ */
/* Thumbnail: render slide thật ở trạng thái tĩnh (số liệu cuối cùng)   */
/* ------------------------------------------------------------------ */

const Thumb = memo(function Thumb({ i }: { i: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [s, setS] = useState(0.2);
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const update = () => setS(el.clientWidth / W);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return (
    <div className="thumb-frame" ref={ref}>
      <div style={{ width: W, height: H, transform: `scale(${s})`, transformOrigin: "0 0", position: "relative" }}>
        <AnimCtx.Provider value={false}>{SLIDES[i]()}</AnimCtx.Provider>
      </div>
    </div>
  );
});

/* ------------------------------------------------------------------ */
/* Chế độ 1: Xem tổng quan                                              */
/* ------------------------------------------------------------------ */

function Overview({
  index,
  onOpen,
  onPresent,
}: {
  index: number;
  onOpen: (i: number) => void;
  onPresent: () => void;
}) {
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  useEffect(() => {
    refs.current[index]?.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }, [index]);
  return (
    <div className="ov">
      <div className="ov-top">
        <span>Tổng quan · {N} slide</span>
        <button className="ui-pill" onClick={onPresent}>
          <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" aria-hidden>
            <path d="M8 5v14l11-7z" />
          </svg>
          Trình chiếu
        </button>
      </div>
      <div className="ov-grid">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            ref={(el) => {
              refs.current[i] = el;
            }}
            className={`ov-item ${i === index ? "sel" : ""}`}
            style={{ ["--i" as string]: i } as CSSProperties}
            onClick={() => onOpen(i)}
            aria-label={`Mở slide ${i + 1}`}
          >
            <Thumb i={i} />
            <span className="ov-num">{i + 1}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Chế độ 2: Trình chiếu                                                */
/* ------------------------------------------------------------------ */

function Present({
  index,
  step,
  onOverview,
}: {
  index: number;
  step: (d: number) => void;
  onOverview: () => void;
}) {
  // giữ nguyên DOM của slide cũ (theo key) để nền và hoạt ảnh không bị khởi động lại khi thoát
  const [layers, setLayers] = useState<{
    cur: number;
    curKey: number;
    prev: number | null;
    prevKey: number;
    dir: 1 | -1;
  }>({ cur: index, curKey: 0, prev: null, prevKey: -1, dir: 1 });
  if (index !== layers.cur) {
    setLayers({
      cur: index,
      curKey: layers.curKey + 1,
      prev: layers.cur,
      prevKey: layers.curKey,
      dir: index > layers.cur ? 1 : -1,
    });
  }

  // dọn slide cũ sau khi chuyển cảnh xong
  useEffect(() => {
    if (layers.prev === null) return;
    const id = window.setTimeout(() => setLayers((l) => (l.cur === layers.cur ? { ...l, prev: null } : l)), 800);
    return () => window.clearTimeout(id);
  }, [layers.prev, layers.cur]);

  // kích thước canvas 16:9 lớn nhất có thể
  const [vp, setVp] = useState({ w: window.innerWidth, h: window.innerHeight });
  useEffect(() => {
    const on = () => setVp({ w: window.innerWidth, h: window.innerHeight });
    window.addEventListener("resize", on);
    return () => window.removeEventListener("resize", on);
  }, []);
  const scale = Math.min(vp.w / W, vp.h / H);
  const sw = W * scale;
  const sh = H * scale;

  // điều khiển tự ẩn sau 2,5 giây không thao tác
  const [vis, setVis] = useState(true);
  const timer = useRef<number>(0);
  const poke = useCallback(() => {
    setVis(true);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setVis(false), 2500);
  }, []);
  useEffect(() => {
    poke();
    const evs = ["mousemove", "mousedown", "touchstart", "keydown", "wheel"] as const;
    evs.forEach((e) => window.addEventListener(e, poke, { passive: true }));
    return () => {
      evs.forEach((e) => window.removeEventListener(e, poke));
      window.clearTimeout(timer.current);
    };
  }, [poke]);

  // vuốt trên màn hình cảm ứng
  const touchX = useRef<number | null>(null);

  return (
    <div
      className={`pres ${vis ? "" : "nocursor"}`}
      onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
      onTouchEnd={(e) => {
        if (touchX.current === null) return;
        const dx = e.changedTouches[0].clientX - touchX.current;
        touchX.current = null;
        if (Math.abs(dx) > 60) step(dx < 0 ? 1 : -1);
      }}
    >
      <div
        className="stage"
        style={{ width: sw, height: sh, left: (vp.w - sw) / 2, top: (vp.h - sh) / 2 }}
      >
        <div className="canvas" style={{ width: W, height: H, transform: `scale(${scale})` }}>
          {layers.prev !== null && (
            <div
              key={layers.prevKey}
              className="layer out"
              style={{ ["--dir" as string]: layers.dir } as CSSProperties}
            >
              <AnimCtx.Provider value={true}>{SLIDES[layers.prev]()}</AnimCtx.Provider>
            </div>
          )}
          <div
            key={layers.curKey}
            className={`layer ${layers.prev !== null ? "in" : "first"}`}
            style={{ ["--dir" as string]: layers.dir } as CSSProperties}
          >
            <AnimCtx.Provider value={true}>{SLIDES[layers.cur]()}</AnimCtx.Provider>
          </div>
        </div>
      </div>

      {/* Overlay điều khiển: nhỏ gọn, sát mép, tự ẩn */}
      <div className={`ui ui-bar ${vis ? "on" : ""}`}>
        <div className="ui-pill">
          <button onClick={() => step(-1)} disabled={index === 0} title="Slide trước (A)" aria-label="Slide trước">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 5l-7 7 7 7" />
            </svg>
          </button>
          <span className="ui-count">
            {pad(index + 1)} / {pad(N)}
          </span>
          <button onClick={() => step(1)} disabled={index === N - 1} title="Slide tiếp theo (D)" aria-label="Slide tiếp theo">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
        <button className="ui-pill" onClick={onOverview} title="Xem tổng quan (Esc)">
          <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" aria-hidden>
            <path d="M3 3h8v8H3zM13 3h8v8h-8zM3 13h8v8H3zM13 13h8v8h-8z" />
          </svg>
          Tổng quan
        </button>
      </div>
      <div className={`ui ui-progress ${vis ? "on" : ""}`}>
        <i style={{ transform: `scaleX(${(index + 1) / N})` }} />
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */

export default function App() {
  const [mode, setMode] = useState<"present" | "overview">("present");
  const [index, setIndex] = useState(initialIndex);

  const step = useCallback((d: number) => setIndex((i) => clamp(i + d)), []);

  useEffect(() => {
    window.history.replaceState(null, "", `#${index + 1}`);
  }, [index]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      if (e.key === "Escape") {
        setMode((m) => (m === "present" ? "overview" : "present"));
        return;
      }
      if (e.key === "Enter" && mode === "overview") {
        setMode("present");
        return;
      }
      if (e.key === "a" || e.key === "A" || e.code === "KeyA" || e.key === "ArrowLeft") {
        e.preventDefault();
        step(-1);
      } else if (e.key === "d" || e.key === "D" || e.code === "KeyD" || e.key === "ArrowRight") {
        e.preventDefault();
        step(1);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [mode, step]);

  return mode === "present" ? (
    <Present index={index} step={step} onOverview={() => setMode("overview")} />
  ) : (
    <Overview
      index={index}
      onOpen={(i) => {
        setIndex(i);
        setMode("present");
      }}
      onPresent={() => setMode("present")}
    />
  );
}
