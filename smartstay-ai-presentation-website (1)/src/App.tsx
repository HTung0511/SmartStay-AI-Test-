import { useCallback, useEffect, useState } from "react";
import { Overview } from "./components/Overview";
import { Presenter } from "./components/Presenter";
import { slides } from "./slides";

type Route = { mode: "overview" } | { mode: "present"; index: number };

const total = slides.length;

function parseHash(): Route {
  const m = window.location.hash.match(/^#\/slide\/(\d+)/);
  if (m) {
    const n = Math.min(Math.max(parseInt(m[1], 10), 1), total);
    return { mode: "present", index: n - 1 };
  }
  return { mode: "overview" };
}
const slideHash = (i: number) => `#/slide/${i + 1}`;

export default function App() {
  const [route, setRoute] = useState<Route>(parseHash);
  const [selected, setSelected] = useState(() => {
    const r = parseHash();
    return r.mode === "present" ? r.index : 0;
  });

  useEffect(() => {
    const onHash = () => setRoute(parseHash());
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  useEffect(() => {
    if (route.mode === "present") setSelected(route.index);
  }, [route]);

  const openSlide = useCallback((i: number) => {
    window.location.hash = slideHash(i);
  }, []);
  const openOverview = useCallback(() => {
    window.location.hash = "#/overview";
  }, []);
  /** Đổi slide trong lúc trình chiếu: thay thế mục lịch sử để nút Back quay về trang tổng quát */
  const moveTo = useCallback((i: number) => {
    if (i < 0 || i >= total) return;
    window.history.replaceState(null, "", slideHash(i));
    setRoute({ mode: "present", index: i });
  }, []);

  const presentIndex = route.mode === "present" ? route.index : -1;

  /* Phím tắt: chỉ hoạt động ở chế độ trình chiếu và không kích hoạt khi đang nhập liệu */
  useEffect(() => {
    if (presentIndex < 0) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.defaultPrevented || e.repeat || e.isComposing) return;
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      const t = e.target as HTMLElement | null;
      if (t && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName))) return;
      const key = e.key.toLowerCase();
      if (key === "d") {
        moveTo(presentIndex + 1);
      } else if (key === "a") {
        moveTo(presentIndex - 1);
      } else if (e.key === "Escape") {
        openOverview();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [presentIndex, moveTo, openOverview]);

  if (route.mode === "present") {
    return (
      <Presenter
        index={route.index}
        onPrev={() => moveTo(route.index - 1)}
        onNext={() => moveTo(route.index + 1)}
        onExit={openOverview}
      />
    );
  }

  return (
    <div className="h-dvh overflow-y-auto overflow-x-hidden bg-[#08121b]">
      <Overview selected={selected} onOpen={openSlide} onStart={() => openSlide(selected)} />
    </div>
  );
}
