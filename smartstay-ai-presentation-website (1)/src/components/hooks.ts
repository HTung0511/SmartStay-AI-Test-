import { useCallback, useEffect, useRef, useState } from "react";

/** Người dùng bật "giảm chuyển động" trong hệ điều hành/trình duyệt */
export function useReducedMotion() {
  const [reduced, setReduced] = useState(
    () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const on = () => setReduced(mq.matches);
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);
  return reduced;
}

/** Canvas 1920×1080 co giãn vừa khít khung nhìn, giữ nguyên tỉ lệ 16:9 */
export function useFit(w = 1920, h = 1080) {
  const read = () => ({ vw: window.innerWidth, vh: window.innerHeight });
  const [vp, setVp] = useState(read);
  useEffect(() => {
    const on = () => setVp(read());
    window.addEventListener("resize", on);
    window.visualViewport?.addEventListener("resize", on);
    return () => {
      window.removeEventListener("resize", on);
      window.visualViewport?.removeEventListener("resize", on);
    };
  }, []);
  const scale = Math.min(vp.vw / w, vp.vh / h);
  return { scale, x: (vp.vw - w * scale) / 2, y: (vp.vh - h * scale) / 2 };
}

/** Chờ font nhúng sẵn sàng để đo độ rộng số (Count-up) chính xác */
export function useFontsReady() {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    let alive = true;
    const sample = "Hạn chế ệ ữ ố ằ 0123456789";
    const loads = [
      document.fonts.load('400 24px "InterV"', sample),
      document.fonts.load('600 24px "InterV"', sample),
      document.fonts.load('650 24px "InterV"', sample),
      document.fonts.load('700 24px "InterV"', sample),
      document.fonts.load('600 60px "FrauncesV"', sample),
      document.fonts.load('700 60px "FrauncesV"', sample),
    ];
    const done = () => alive && setReady(true);
    Promise.all(loads).then(() => document.fonts.ready).then(done, done);
    const t = window.setTimeout(done, 2500); // dự phòng
    return () => {
      alive = false;
      clearTimeout(t);
    };
  }, []);
  return ready;
}

/** Tự ẩn sau `ms` không thao tác; hiện lại khi rê chuột / chạm / bấm phím */
export function useAutoHide(ms = 2600) {
  const [active, setActive] = useState(true);
  const hover = useRef(false);
  const timer = useRef<number | undefined>(undefined);
  const lastPos = useRef<[number, number]>([-1, -1]);

  const poke = useCallback(() => {
    setActive(true);
    window.clearTimeout(timer.current);
    if (!hover.current) timer.current = window.setTimeout(() => setActive(false), ms);
  }, [ms]);

  useEffect(() => {
    poke();
    const onMove = (e: MouseEvent) => {
      // bỏ qua mousemove "ảo" do trình duyệt phát khi bố cục đổi dưới con trỏ đứng yên
      const p: [number, number] = [e.screenX, e.screenY];
      if (p[0] === lastPos.current[0] && p[1] === lastPos.current[1]) return;
      lastPos.current = p;
      poke();
    };
    const others = ["pointerdown", "keydown", "touchstart", "wheel"] as const;
    window.addEventListener("mousemove", onMove, { passive: true });
    others.forEach((n) => window.addEventListener(n, poke, { passive: true }));
    return () => {
      window.removeEventListener("mousemove", onMove);
      others.forEach((n) => window.removeEventListener(n, poke));
      window.clearTimeout(timer.current);
    };
  }, [poke]);

  const setHover = useCallback(
    (v: boolean) => {
      hover.current = v;
      poke();
    },
    [poke],
  );
  return { active, setHover };
}
