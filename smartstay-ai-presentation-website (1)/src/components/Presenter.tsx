import { ChevronLeft, ChevronRight, LayoutGrid } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { slides } from "../slides";
import { usePrefersReducedMotion } from "../slides/ui";
import { SlideCanvas, SlideView } from "./SlideCanvas";

type Layers = { shown: number; leaving: { index: number; key: number } | null; dir: 1 | -1; seq: number };

/** Chế độ 2 — Trình chiếu: từng slide lớn, phím A (trước) / D (tiếp). */
export function Presenter({
  index,
  onPrev,
  onNext,
  onExit,
}: {
  index: number;
  onPrev: () => void;
  onNext: () => void;
  onExit: () => void;
}) {
  const reduced = usePrefersReducedMotion();
  const total = slides.length;

  /* Giữ lại slide cũ trong lúc chuyển để có hiệu ứng thoát / vào */
  const [layers, setLayers] = useState<Layers>({ shown: index, leaving: null, dir: 1, seq: 0 });
  if (layers.shown !== index) {
    setLayers({
      shown: index,
      leaving: reduced ? null : { index: layers.shown, key: layers.seq + 1 },
      dir: index > layers.shown ? 1 : -1,
      seq: layers.seq + 1,
    });
  }
  useEffect(() => {
    if (!layers.leaving) return;
    const t = window.setTimeout(() => setLayers((l) => ({ ...l, leaving: null })), 700);
    return () => window.clearTimeout(t);
  }, [layers.leaving]);

  /* Thanh điều khiển tự ẩn khi không di chuyển chuột */
  const [show, setShow] = useState(true);
  const hideTimer = useRef<number | undefined>(undefined);
  const wake = useCallback(() => {
    setShow(true);
    window.clearTimeout(hideTimer.current);
    hideTimer.current = window.setTimeout(() => setShow(false), 3000);
  }, []);
  useEffect(() => {
    wake();
    window.addEventListener("mousemove", wake);
    window.addEventListener("touchstart", wake, { passive: true });
    return () => {
      window.removeEventListener("mousemove", wake);
      window.removeEventListener("touchstart", wake);
      window.clearTimeout(hideTimer.current);
    };
  }, [wake]);

  const forward = layers.dir === 1;
  const ctrl = `transition-opacity duration-300 ${show ? "opacity-100" : "pointer-events-none opacity-0 focus-within:pointer-events-auto focus-within:opacity-100"}`;

  return (
    <div
      className={`fixed inset-0 overflow-hidden bg-[#050c13] ${show ? "" : "cursor-none"}`}
      style={{ background: "radial-gradient(120% 120% at 50% 40%, #0f2030 0%, #050c13 70%)" }}
    >
      <SlideCanvas className="absolute inset-0">
        <div className="absolute inset-0 overflow-hidden shadow-[0_0_80px_rgba(0,0,0,0.6)]">
          {layers.leaving && (
            <div
              key={`leave-${layers.leaving.key}`}
              aria-hidden="true"
              className={`absolute inset-0 ${forward ? "layer-leave-next" : "layer-leave-prev"}`}
            >
              <SlideView index={layers.leaving.index} animate />
            </div>
          )}
          <div
            key={`cur-${layers.shown}`}
            className={`absolute inset-0 ${
              layers.leaving ? (forward ? "layer-enter-next" : "layer-enter-prev") : ""
            }`}
          >
            <SlideView index={layers.shown} animate />
          </div>
        </div>
      </SlideCanvas>

      <p className="sr-only" aria-live="polite">
        Slide {index + 1} / {total}: {slides[index].title}
      </p>

      {/* Về trang xem tổng quát */}
      <div className={`absolute right-4 top-4 z-20 ${ctrl}`}>
        <button
          type="button"
          onClick={onExit}
          className="flex cursor-pointer items-center gap-2.5 rounded-full bg-[#06121c]/70 py-2 pl-4 pr-3 text-[15px] font-semibold text-white ring-1 ring-white/20 backdrop-blur-md transition-colors hover:bg-[#06121c]/90"
        >
          <LayoutGrid size={17} aria-hidden="true" />
          Xem tổng quát
          <kbd className="rounded-md border border-white/30 bg-white/10 px-2 py-0.5 font-sans text-[12px] font-bold">Esc</kbd>
        </button>
      </div>

      {/* Điều hướng slide trước / sau */}
      <div className={`absolute inset-x-0 bottom-6 z-20 flex justify-center ${ctrl}`}>
        <div className="flex items-center gap-1.5 rounded-full bg-[#06121c]/75 p-1.5 text-white ring-1 ring-white/20 backdrop-blur-md">
          <button
            type="button"
            onClick={onPrev}
            disabled={index === 0}
            aria-label="Slide trước (phím A)"
            className="flex cursor-pointer items-center gap-2 rounded-full py-2 pl-2.5 pr-4 text-[15px] font-semibold transition-colors hover:bg-white/12 disabled:cursor-default disabled:opacity-35 disabled:hover:bg-transparent"
          >
            <ChevronLeft size={20} aria-hidden="true" />
            <kbd className="rounded-md border border-white/30 bg-white/10 px-2 py-0.5 font-sans text-[12px] font-bold">A</kbd>
          </button>
          <span className="min-w-[84px] text-center text-[16px] font-semibold tabular-nums" aria-hidden="true">
            {index + 1} / {total}
          </span>
          <button
            type="button"
            onClick={onNext}
            disabled={index === total - 1}
            aria-label="Slide tiếp theo (phím D)"
            className="flex cursor-pointer items-center gap-2 rounded-full py-2 pl-4 pr-2.5 text-[15px] font-semibold transition-colors hover:bg-white/12 disabled:cursor-default disabled:opacity-35 disabled:hover:bg-transparent"
          >
            <kbd className="rounded-md border border-white/30 bg-white/10 px-2 py-0.5 font-sans text-[12px] font-bold">D</kbd>
            <ChevronRight size={20} aria-hidden="true" />
          </button>
        </div>
      </div>

      {/* Tiến độ */}
      <div className="absolute inset-x-0 bottom-0 z-20 h-[4px] bg-white/10" aria-hidden="true">
        <div
          className="h-full bg-gold transition-[width] duration-500 ease-out"
          style={{ width: `${((index + 1) / total) * 100}%` }}
        />
      </div>
    </div>
  );
}
