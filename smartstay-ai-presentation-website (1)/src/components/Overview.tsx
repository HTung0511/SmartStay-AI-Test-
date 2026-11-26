import { Hotel, LayoutGrid, Play } from "lucide-react";
import { useEffect, useRef, type CSSProperties } from "react";
import overviewBg from "../assets/overview-bg.jpg";
import { slides } from "../slides";
import { SlideCanvas, SlideView } from "./SlideCanvas";

/** Chế độ 1 — Xem tổng quát: lưới thumbnail giống trình xem PowerPoint. */
export function Overview({
  selected,
  onOpen,
  onStart,
}: {
  selected: number;
  onOpen: (index: number) => void;
  onStart: () => void;
}) {
  const selectedRef = useRef<HTMLLIElement>(null);

  useEffect(() => {
    // Khi quay lại từ trình chiếu, đưa slide vừa xem vào giữa màn hình
    if (selected > 0) selectedRef.current?.scrollIntoView({ block: "center" });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="relative min-h-full text-cream">
      <div className="fixed inset-0 -z-0">
        <img src={overviewBg} alt="" className="h-full w-full object-cover" />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(8,18,28,0.9) 0%, rgba(10,24,37,0.94) 55%, rgba(7,15,23,0.98) 100%)",
          }}
        />
      </div>

      <header className="sticky top-0 z-30 border-b border-white/10 bg-[#0a1722]/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-[1840px] items-center justify-between gap-4 px-5 py-3.5 sm:px-8">
          <div className="flex min-w-0 items-center gap-2.5 sm:gap-3">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gold/15 text-gold-soft ring-1 ring-gold/40">
              <Hotel size={22} aria-hidden="true" />
            </span>
            <span className="hidden whitespace-nowrap font-display text-[19px] font-bold min-[480px]:inline sm:text-[22px]">SmartStay AI</span>
          </div>
          <nav aria-label="Chế độ xem" className="flex shrink-0 rounded-full bg-white/8 p-1 ring-1 ring-white/12">
            <button
              type="button"
              aria-current="page"
              className="flex items-center gap-2 whitespace-nowrap rounded-full bg-cream px-3 py-2 text-[14px] font-semibold text-navy sm:px-5 sm:text-[15px]"
            >
              <LayoutGrid size={17} aria-hidden="true" className="hidden sm:block" />
              Xem tổng quát
            </button>
            <button
              type="button"
              onClick={onStart}
              className="flex cursor-pointer items-center gap-2 whitespace-nowrap rounded-full px-3 py-2 text-[14px] font-semibold text-cream transition-colors hover:bg-white/12 sm:px-5 sm:text-[15px]"
            >
              <Play size={17} aria-hidden="true" className="hidden sm:block" />
              Trình chiếu
            </button>
          </nav>
        </div>
      </header>

      <main className="relative z-10 mx-auto max-w-[1840px] px-5 pb-16 pt-9 sm:px-8">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-x-8 gap-y-3">
          <div>
            <h1 className="font-display text-[38px] font-bold leading-tight sm:text-[44px]">Xem tổng quát</h1>
            <p className="mt-1.5 text-[16px] text-[#b4c4cc]">
              {slides.length} slide · Chọn một slide để mở ở chế độ trình chiếu
            </p>
          </div>
          <p className="hidden items-center gap-2 text-[15px] text-[#b4c4cc] sm:flex">
            <kbd className="rounded-md border border-white/25 bg-white/10 px-2.5 py-0.5 font-sans text-[14px] font-bold text-cream">
              A
            </kbd>
            slide trước
            <span className="mx-1 text-white/25">|</span>
            <kbd className="rounded-md border border-white/25 bg-white/10 px-2.5 py-0.5 font-sans text-[14px] font-bold text-cream">
              D
            </kbd>
            slide tiếp theo
          </p>
        </div>

        <ol className="grid grid-cols-[repeat(auto-fill,minmax(min(100%,340px),1fr))] gap-x-7 gap-y-9">
          {slides.map((s, i) => {
            const isSel = i === selected;
            return (
              <li
                key={i}
                ref={isSel ? selectedRef : undefined}
                className="ov-item group"
                style={{ "--i": Math.min(i, 12) } as CSSProperties}
              >
                <div
                  className={`relative aspect-video overflow-hidden rounded-[14px] bg-cream shadow-[0_24px_40px_-24px_rgba(0,0,0,0.85)] ring-2 transition duration-300 ease-out group-hover:-translate-y-1 group-hover:ring-gold ${
                    isSel ? "ring-teal-soft shadow-[0_0_0_5px_rgba(111,207,198,0.18),0_24px_40px_-24px_rgba(0,0,0,0.85)]" : "ring-white/15"
                  }`}
                >
                  <div aria-hidden="true" className="pointer-events-none absolute inset-0">
                    <SlideCanvas className="absolute inset-0">
                      <SlideView index={i} animate={false} />
                    </SlideCanvas>
                  </div>
                  <button
                    type="button"
                    onClick={() => onOpen(i)}
                    aria-label={`Mở slide ${i + 1}: ${s.title}`}
                    className="absolute inset-0 z-10 cursor-pointer rounded-[14px]"
                  />
                </div>
                <div className="mt-3 flex items-center gap-3 px-1">
                  <span
                    className={`grid h-7 min-w-7 place-items-center rounded-full px-1.5 text-[13px] font-bold tabular-nums ${
                      isSel ? "bg-teal-soft text-navy" : "bg-white/12 text-gold-soft"
                    }`}
                  >
                    {i + 1}
                  </span>
                  <span className="truncate text-[15px] text-cream/90">{s.title}</span>
                </div>
              </li>
            );
          })}
        </ol>
      </main>
    </div>
  );
}
