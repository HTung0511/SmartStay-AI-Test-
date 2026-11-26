import { useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { SlideCtx } from "../slides/ui";
import { slides } from "../slides";

export const DESIGN_W = 1600;
export const DESIGN_H = 900;

/** Co giãn khung thiết kế 1600×900 để vừa khít vùng chứa (giữ tỉ lệ 16:9, căn giữa). */
export function SlideCanvas({ children, className = "" }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const measure = () => setScale(Math.min(el.clientWidth / DESIGN_W, el.clientHeight / DESIGN_H));
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <div ref={ref} className={`overflow-hidden ${className}`}>
      <div
        className="absolute left-1/2 top-1/2"
        style={{
          width: DESIGN_W,
          height: DESIGN_H,
          transform: `translate(-50%, -50%) scale(${scale})`,
          transformOrigin: "center center",
          visibility: scale === 0 ? "hidden" : "visible",
        }}
      >
        {children}
      </div>
    </div>
  );
}

/** Hiển thị một slide. animate=false → trạng thái cuối, tĩnh (dùng cho thumbnail). */
export function SlideView({ index, animate }: { index: number; animate: boolean }) {
  const { Component } = slides[index];
  return (
    <SlideCtx.Provider value={{ animate }}>
      <div className={`relative h-[900px] w-[1600px] ${animate ? "anim" : ""}`}>
        <Component />
      </div>
    </SlideCtx.Provider>
  );
}
