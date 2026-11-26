import { useCallback, useEffect, useRef, useState } from "react";
import { SLIDES } from "@/slides/slides";
import { Stage } from "@/components/Stage";
import { Controls } from "@/components/Controls";
import { Overview } from "@/components/Overview";
import { useAutoHide, useFontsReady } from "@/components/hooks";

type Mode = "present" | "overview";
const TOTAL = SLIDES.length;

export default function App() {
  const ready = useFontsReady();
  const [mode, setMode] = useState<Mode>("present");
  const [index, setIndex] = useState(0);
  const { active, setHover } = useAutoHide(2600);
  const modeRef = useRef(mode);
  modeRef.current = mode;

  const prev = useCallback(() => setIndex((i) => Math.max(0, i - 1)), []);
  const next = useCallback(() => setIndex((i) => Math.min(TOTAL - 1, i + 1)), []);
  const openOverview = useCallback(() => setMode("overview"), []);
  const present = useCallback(() => setMode("present"), []);
  const openSlide = useCallback((i: number) => {
    setIndex(i);
    setMode("present");
  }, []);

  // Phím tắt khi trình chiếu: A = về trước, D = sang tiếp theo, Esc = tổng quan
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (modeRef.current !== "present" || e.ctrlKey || e.metaKey || e.altKey) return;
      const k = e.key.toLowerCase();
      if (k === "a" || e.code === "KeyA" || k === "arrowleft") {
        if (!e.repeat) prev();
      } else if (k === "d" || e.code === "KeyD" || k === "arrowright") {
        if (!e.repeat) next();
      } else if (k === "escape") {
        openOverview();
      } else return;
      e.preventDefault();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [prev, next, openOverview]);

  if (!ready) return <div style={{ position: "fixed", inset: 0, background: "#04080c" }} />;

  if (mode === "overview") {
    return <Overview current={index} onOpen={openSlide} onClose={present} />;
  }

  return (
    <>
      <Stage index={index} idle={!active} />
      <Controls
        index={index}
        total={TOTAL}
        active={active}
        onPrev={prev}
        onNext={next}
        onOverview={openOverview}
        onHover={setHover}
      />
    </>
  );
}
