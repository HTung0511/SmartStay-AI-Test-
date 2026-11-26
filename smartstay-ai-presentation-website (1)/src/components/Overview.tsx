import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { cn } from "@/utils/cn";
import { SLIDES } from "@/slides/slides";
import { SlideEnvCtx } from "@/slides/kit";

const STATIC_ENV = { animate: false, dir: 1 as const };

/**
 * Xem tổng quan: toàn bộ slide dạng thumbnail như PowerPoint.
 * Thumbnail render chính slide thật ở trạng thái cuối (không hoạt ảnh, số liệu đã hiển thị đủ).
 */
export function Overview({
  current,
  onOpen,
  onClose,
}: {
  current: number;
  onOpen: (i: number) => void;
  onClose: () => void;
}) {
  const [sel, setSel] = useState(current);
  const [scale, setScale] = useState(0.18);
  const probe = useRef<HTMLSpanElement>(null);
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);

  // tỉ lệ thu nhỏ theo bề rộng thumbnail thực tế
  useLayoutEffect(() => {
    const el = probe.current;
    if (!el) return;
    const update = () => setScale(el.clientWidth / 1920);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // đưa slide đang chọn vào tầm nhìn khi mở
  useEffect(() => {
    itemRefs.current[current]?.scrollIntoView({ block: "center" });
    itemRefs.current[current]?.focus({ preventScroll: true });
  }, [current]);

  // bàn phím: A/D hoặc mũi tên di chuyển vùng chọn, Enter mở slide, Esc quay lại trình chiếu
  useEffect(() => {
    const cols = () => {
      const g = itemRefs.current[0]?.parentElement;
      if (!g) return 1;
      return getComputedStyle(g).gridTemplateColumns.split(" ").length;
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      const k = e.key.toLowerCase();
      let next: number | null = null;
      if (k === "a" || k === "arrowleft") next = Math.max(0, sel - 1);
      else if (k === "d" || k === "arrowright") next = Math.min(SLIDES.length - 1, sel + 1);
      else if (k === "arrowup") next = Math.max(0, sel - cols());
      else if (k === "arrowdown") next = Math.min(SLIDES.length - 1, sel + cols());
      if (next !== null) {
        e.preventDefault();
        setSel(next);
        itemRefs.current[next]?.focus({ preventScroll: true });
        itemRefs.current[next]?.scrollIntoView({ block: "nearest", behavior: "smooth" });
      } else if (k === "enter") {
        e.preventDefault();
        onOpen(sel);
      } else if (k === "escape") {
        e.preventDefault();
        onClose();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [sel, onOpen, onClose]);

  return (
    <div className="ov" role="region" aria-label="Xem tổng quan">
      <div className="ov-head">
        <span className="ov-title">Tổng quan</span>
        <button className="ov-btn" onClick={onClose} title="Quay lại trình chiếu (Esc)">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M7 4.5v15l12-7.5z" />
          </svg>
          Trình chiếu
          <kbd>Esc</kbd>
        </button>
      </div>

      <div className="ov-grid">
        {SLIDES.map(({ id, Comp }, i) => (
          <button
            key={id}
            ref={(el) => {
              itemRefs.current[i] = el;
            }}
            className={cn("ov-item", i === sel && "sel")}
            style={{ animationDelay: `${Math.min(i, 15) * 28}ms` }}
            onClick={() => onOpen(i)}
            onMouseEnter={() => setSel(i)}
            onFocus={() => setSel(i)}
            aria-label={`Mở slide ${i + 1}`}
          >
            <span className="ov-num">{i + 1}</span>
            <span className="ov-thumb" ref={i === 0 ? probe : undefined}>
              <span className="ov-slide" style={{ transform: `scale(${scale})` }} aria-hidden="true">
                <SlideEnvCtx.Provider value={STATIC_ENV}>
                  <Comp />
                </SlideEnvCtx.Provider>
              </span>
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
