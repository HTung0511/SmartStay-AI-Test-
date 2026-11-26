import { memo, useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { cn } from "@/utils/cn";
import { SLIDES } from "@/slides/slides";
import { SlideEnvCtx } from "@/slides/kit";
import { useFit, useReducedMotion } from "./hooks";

type LayerState = { key: number; idx: number; dir: 1 | -1; out: 1 | -1; leaving: boolean };

const LEAVE_MS = 620;

const SlideLayer = memo(function SlideLayer({
  idx,
  dir,
  out,
  leaving,
  animate,
}: {
  idx: number;
  dir: 1 | -1;
  out: 1 | -1;
  leaving: boolean;
  animate: boolean;
}) {
  const Comp = SLIDES[idx].Comp;
  const env = useMemo(() => ({ animate, dir }), [animate, dir]);
  return (
    <div
      className={cn("layer", leaving && "layer-leave")}
      style={{ zIndex: leaving ? 2 : 1, "--dir": dir, "--out": out } as CSSProperties}
      aria-hidden={leaving || undefined}
    >
      <SlideEnvCtx.Provider value={env}>
        <Comp />
      </SlideEnvCtx.Provider>
    </div>
  );
});

/**
 * Mỗi lần đổi slide: slide cũ chuyển sang trạng thái "thoát" (mờ dần + trượt ngược chiều điều hướng,
 * nằm trên cùng), slide mới nằm bên dưới với các tầng chữ vào theo cùng chiều điều hướng.
 */
export function Stage({ index, idle }: { index: number; idle: boolean }) {
  const reduced = useReducedMotion();
  const { scale, x, y } = useFit();
  const [layers, setLayers] = useState<LayerState[]>(() => [
    { key: 0, idx: index, dir: 1, out: 1, leaving: false },
  ]);
  const last = useRef(index);
  const counter = useRef(1);
  const layersRef = useRef(layers);
  layersRef.current = layers;
  const timers = useRef<number[]>([]);

  useEffect(() => {
    if (index === last.current) return;
    const dir: 1 | -1 = index > last.current ? 1 : -1;
    last.current = index;
    const key = counter.current++;
    const olds = layersRef.current.filter((l) => !l.leaving).map((l) => l.key);
    setLayers((ls) => [
      ...ls.map((l) => (l.leaving ? l : { ...l, leaving: true, out: dir })),
      { key, idx: index, dir, out: dir, leaving: false },
    ]);
    timers.current.push(
      window.setTimeout(() => setLayers((ls) => ls.filter((l) => !olds.includes(l.key))), reduced ? 200 : LEAVE_MS),
    );
  }, [index, reduced]);

  useEffect(
    () => () => {
      timers.current.forEach((t) => window.clearTimeout(t));
    },
    [],
  );

  return (
    <div className={cn("stage", idle && "idle")} role="region" aria-label="Trình chiếu SmartStay AI">
      <div className="canvas" style={{ transform: `translate3d(${x}px, ${y}px, 0) scale(${scale})` }}>
        {layers.map((l) => (
          <SlideLayer key={l.key} idx={l.idx} dir={l.dir} out={l.out} leaving={l.leaving} animate={!reduced} />
        ))}
      </div>
      <div className="sr-only" aria-live="polite">
        Slide {index + 1} / {SLIDES.length}
      </div>
    </div>
  );
}
