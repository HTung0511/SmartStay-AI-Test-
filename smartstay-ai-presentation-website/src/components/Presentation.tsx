import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { cn } from "@/utils/cn";
import { slides, totalSlides } from "@/slides";
import { DeckRenderProvider, useReducedMotion } from "./primitives";

const HIDE_DELAY = 2700;
const TRANSITION_MS = 500;

function useFitScale() {
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const update = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      setScale(Math.min(width / 1600, height / 900));
    };
    update();
    window.addEventListener("resize", update);
    window.addEventListener("orientationchange", update);
    return () => {
      window.removeEventListener("resize", update);
      window.removeEventListener("orientationchange", update);
    };
  }, []);

  return scale;
}

export function Presentation({
  initialIndex,
  onExit,
}: {
  initialIndex: number;
  onExit: () => void;
}) {
  const reduced = useReducedMotion();
  const scale = useFitScale();
  const [current, setCurrent] = useState(
    Math.min(Math.max(initialIndex, 0), totalSlides - 1),
  );
  const [outgoing, setOutgoing] = useState<number | null>(null);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [transition, setTransition] = useState(0);
  const [controlsVisible, setControlsVisible] = useState(true);
  const hideTimer = useRef<number | null>(null);
  const controlsHovered = useRef(false);

  const clearHideTimer = useCallback(() => {
    if (hideTimer.current !== null) {
      window.clearTimeout(hideTimer.current);
      hideTimer.current = null;
    }
  }, []);

  const scheduleHide = useCallback(() => {
    clearHideTimer();
    if (controlsHovered.current) return;
    hideTimer.current = window.setTimeout(() => {
      setControlsVisible(false);
    }, HIDE_DELAY);
  }, [clearHideTimer]);

  const revealControls = useCallback(() => {
    setControlsVisible(true);
    scheduleHide();
  }, [scheduleHide]);

  const goTo = useCallback(
    (next: number) => {
      if (next < 0 || next >= totalSlides || next === current) return;
      setDirection(next > current ? 1 : -1);
      setOutgoing(current);
      setCurrent(next);
      setTransition((value) => value + 1);
      revealControls();
    },
    [current, revealControls],
  );

  const next = useCallback(() => goTo(current + 1), [current, goTo]);
  const previous = useCallback(() => goTo(current - 1), [current, goTo]);

  /* clear the outgoing layer once the hand-off completes */
  useEffect(() => {
    if (outgoing === null) return;
    const timeout = window.setTimeout(
      () => setOutgoing(null),
      reduced ? 0 : TRANSITION_MS,
    );
    return () => window.clearTimeout(timeout);
  }, [outgoing, transition, reduced]);

  /* begin the auto-hide timer, and reset it whenever the slide changes */
  useEffect(() => {
    revealControls();
    return clearHideTimer;
  }, [revealControls, clearHideTimer, current]);

  /* keyboard: A = previous, D = next */
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.metaKey || event.ctrlKey || event.altKey) return;
      const key = event.key.toLowerCase();
      revealControls();
      if (key === "a" || event.key === "ArrowLeft") {
        event.preventDefault();
        previous();
      } else if (key === "d" || event.key === "ArrowRight" || event.key === " ") {
        event.preventDefault();
        next();
      } else if (event.key === "Escape") {
        event.preventDefault();
        onExit();
      } else if (event.key === "Home") {
        event.preventDefault();
        goTo(0);
      } else if (event.key === "End") {
        event.preventDefault();
        goTo(totalSlides - 1);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [next, previous, onExit, revealControls, goTo]);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  const onPointerActivity = () => {
    revealControls();
  };

  const holdControls = (event: ReactPointerEvent<HTMLDivElement>) => {
    event.stopPropagation();
    controlsHovered.current = true;
    clearHideTimer();
    setControlsVisible(true);
  };

  const releaseControls = () => {
    controlsHovered.current = false;
    scheduleHide();
  };

  const CurrentSlide = slides[current].Component;
  const OutgoingSlide =
    outgoing !== null ? slides[outgoing]?.Component : undefined;

  return (
    <div
      className={cn(
        "fixed inset-0 z-50 overflow-hidden bg-[#061412]",
        !controlsVisible && "controls-hidden",
        reduced && "reduce-motion",
      )}
      onPointerMove={onPointerActivity}
      onPointerDown={onPointerActivity}
      role="region"
      aria-roledescription="trình chiếu"
      aria-label={`Slide ${current + 1} trên ${totalSlides}: ${slides[current].title}`}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(1200px 800px at 50% 44%, rgba(34,74,65,0.22), rgba(6,20,18,0) 68%), linear-gradient(180deg, #071715, #04100e)",
        }}
      />

      <div
        className="absolute left-1/2 top-1/2 overflow-hidden bg-[#061412]"
        style={{
          width: 1600,
          height: 900,
          transform: `translate(-50%, -50%) scale(${scale})`,
          transformOrigin: "center center",
        }}
      >
        {OutgoingSlide ? (
          <div
            key={`out-${outgoing}-${transition}`}
            className={cn(
              "absolute inset-0",
              direction === 1 ? "slide-exit-fwd" : "slide-exit-back",
            )}
          >
            <DeckRenderProvider still>
              <div className="static-slide h-full w-full">
                <OutgoingSlide />
              </div>
            </DeckRenderProvider>
          </div>
        ) : null}

        <div
          key={`in-${current}-${transition}`}
          data-live-slide="true"
          className={cn(
            "absolute inset-0",
            direction === 1 ? "slide-enter-fwd" : "slide-enter-back",
          )}
        >
          <DeckRenderProvider still={reduced}>
            <CurrentSlide />
          </DeckRenderProvider>
        </div>
      </div>

      <span className="sr-only" aria-live="polite">
        Slide {current + 1} / {totalSlides}: {slides[current].title}
      </span>

      <div
        aria-hidden="true"
        className="present-progress pointer-events-none absolute inset-x-0 bottom-0 z-30 h-[3px] bg-[#f4efe4]/12"
      >
        <div
          className="h-full rounded-r-full bg-[#d08a5f] transition-[width] duration-500 ease-out"
          style={{ width: `${((current + 1) / totalSlides) * 100}%` }}
        />
      </div>

      <div className="present-controls absolute inset-x-0 bottom-0 z-40 flex items-end justify-between gap-3 px-3 pb-3.5 sm:px-5 sm:pb-4">
        <div
          className="pointer-events-auto flex items-center gap-1 rounded-full border border-[#f4efe4]/18 bg-[#071b18]/62 p-1.5 shadow-lg backdrop-blur-md"
          onPointerEnter={holdControls}
          onPointerLeave={releaseControls}
        >
          <button
            type="button"
            onClick={onExit}
            title="Xem tổng quan (Esc)"
            aria-label="Xem tổng quan"
            className="icon-btn h-9 w-9 shrink-0"
          >
            <svg
              aria-hidden="true"
              viewBox="0 0 20 20"
              className="h-[15px] w-[15px]"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            >
              <rect x="2.5" y="2.5" width="6" height="6" rx="1" />
              <rect x="11.5" y="2.5" width="6" height="6" rx="1" />
              <rect x="2.5" y="11.5" width="6" height="6" rx="1" />
              <rect x="11.5" y="11.5" width="6" height="6" rx="1" />
            </svg>
          </button>
          <div className="hidden min-w-0 px-2 sm:block">
            <p className="text-[9px] font-medium uppercase tracking-[0.2em] text-[#aebbb2]">
              Slide {String(current + 1).padStart(2, "0")} / {totalSlides}
            </p>
            <p className="mt-0.5 max-w-[280px] truncate text-[11.5px] text-[#f1ece0]">
              {slides[current].title}
            </p>
          </div>
          <div className="mx-1 hidden items-center gap-1.5 border-l border-[#f4efe4]/18 pl-3 sm:flex">
            <kbd className="inline-flex h-[22px] min-w-[22px] items-center justify-center rounded-[5px] border border-[#f4efe4]/22 bg-[#f4efe4]/[0.06] px-1 font-mono text-[10px] text-[#e8e1d3]">
              A
            </kbd>
            <kbd className="inline-flex h-[22px] min-w-[22px] items-center justify-center rounded-[5px] border border-[#f4efe4]/22 bg-[#f4efe4]/[0.06] px-1 font-mono text-[10px] text-[#e8e1d3]">
              D
            </kbd>
          </div>
        </div>

        <div
          className="pointer-events-auto flex items-center gap-1 rounded-full border border-[#f4efe4]/18 bg-[#071b18]/62 p-1.5 shadow-lg backdrop-blur-md"
          onPointerEnter={holdControls}
          onPointerLeave={releaseControls}
        >
          <button
            type="button"
            onClick={previous}
            disabled={current === 0}
            title="Slide trước (A)"
            aria-label="Slide trước"
            className="icon-btn h-9 w-9 shrink-0"
          >
            <svg
              aria-hidden="true"
              viewBox="0 0 20 20"
              className="h-[16px] w-[16px]"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
            >
              <path d="M12.5 4.5 7 10l5.5 5.5" />
            </svg>
          </button>
          <span className="flex min-w-[64px] items-center justify-center gap-1 px-1 font-mono text-[11.5px] tabular-nums text-[#f4efe4]">
            <span>{String(current + 1).padStart(2, "0")}</span>
            <span className="text-[#9daba1]">/ {totalSlides}</span>
          </span>
          <button
            type="button"
            onClick={next}
            disabled={current === totalSlides - 1}
            title="Slide tiếp theo (D)"
            aria-label="Slide tiếp theo"
            className="icon-btn h-9 w-9 shrink-0"
          >
            <svg
              aria-hidden="true"
              viewBox="0 0 20 20"
              className="h-[16px] w-[16px]"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
            >
              <path d="M7.5 4.5 13 10l-5.5 5.5" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
