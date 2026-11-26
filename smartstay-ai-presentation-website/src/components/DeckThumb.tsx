import { useLayoutEffect, useRef, useState } from "react";
import { DeckRenderProvider } from "./primitives";
import type { SlideDefinition } from "@/slides";

/**
 * Renders a real 1600×900 slide, scaled to fit its card.
 * Thumbnails are rendered in still mode: every number shows its final,
 * source-accurate string and no animation runs.
 */
export function DeckThumb({ slide }: { slide: SlideDefinition }) {
  const frameRef = useRef<HTMLDivElement | null>(null);
  const [scale, setScale] = useState(0.2);

  useLayoutEffect(() => {
    const node = frameRef.current;
    if (!node) return;
    const update = () => {
      const width = node.getBoundingClientRect().width;
      if (width > 0) setScale(width / 1600);
    };
    update();
    const observer = new ResizeObserver(update);
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const { Component } = slide;

  return (
    <div ref={frameRef} className="relative h-full w-full overflow-hidden bg-ink">
      <div
        className="static-slide absolute left-0 top-0 origin-top-left"
        style={{
          width: 1600,
          height: 900,
          transform: `scale(${scale})`,
        }}
        aria-hidden="true"
      >
        <DeckRenderProvider still>
          <Component />
        </DeckRenderProvider>
      </div>
    </div>
  );
}
