import { totalSlides, slides } from "@/slides";
import { DeckThumb } from "./DeckThumb";

export function Overview({ onOpen }: { onOpen: (index: number) => void }) {
  return (
    <div className="overview-bg min-h-screen text-ink">
      <header className="mx-auto flex w-full max-w-[1480px] items-center justify-between gap-6 px-5 pb-5 pt-6 sm:px-8 lg:px-12 lg:pt-8">
        <div className="flex min-w-0 items-center gap-3.5">
          <span
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[13px] bg-ink font-display text-[24px] italic leading-none text-[#f2d8c3] shadow-[0_10px_24px_-14px_rgba(12,36,34,0.9)]"
            aria-hidden="true"
          >
            S
          </span>
          <div className="min-w-0">
            <p className="truncate font-display text-[21px] font-semibold leading-tight tracking-[-0.01em]">
              SmartStay AI
            </p>
            <p className="mt-0.5 text-[10px] font-medium uppercase tracking-[0.22em] text-[#7b8074]">
              Bộ slide trình chiếu
            </p>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-3">
          <span className="hidden items-center gap-2 rounded-full border border-[#cfc5b4] bg-white/55 px-3.5 py-2 text-[12px] font-medium text-[#4d5b52] sm:flex">
            <span className="h-1.5 w-1.5 rounded-full bg-sage" />
            {totalSlides} slide
          </span>
          <button
            type="button"
            onClick={() => onOpen(0)}
            className="group inline-flex items-center gap-2.5 rounded-full bg-ink px-4 py-2.5 text-[13px] font-medium text-[#f7f1e4] shadow-[0_14px_28px_-18px_rgba(12,36,34,0.9)] transition hover:bg-[#173f39] active:scale-[0.98] sm:px-5"
          >
            <svg
              aria-hidden="true"
              viewBox="0 0 16 16"
              className="h-3.5 w-3.5"
              fill="currentColor"
            >
              <path d="M4.5 2.6 13 8l-8.5 5.4V2.6Z" />
            </svg>
            Trình chiếu
          </button>
        </div>
      </header>

      <main className="mx-auto w-full max-w-[1480px] px-5 pb-14 sm:px-8 lg:px-12">
        <section className="grid items-stretch gap-7 border-t border-[#d6cbbb] pt-8 lg:grid-cols-[1.12fr_0.88fr] lg:gap-12 lg:pt-10">
          <div className="flex flex-col justify-center">
            <div className="flex items-center gap-3">
              <span className="block h-[1.5px] w-8 rounded-full bg-clay" />
              <p className="text-[11.5px] font-semibold uppercase tracking-[0.23em] text-[#6e766a]">
                Học phần Trí tuệ nhân tạo
              </p>
            </div>
            <h1 className="mt-4 font-display text-[54px] font-semibold leading-[0.98] tracking-[-0.035em] sm:text-[68px] lg:text-[76px]">
              SmartStay{" "}
              <span className="italic text-clay">AI</span>
            </h1>
            <p className="mt-5 max-w-[580px] text-[17px] leading-[1.6] text-[#4f5b53] sm:text-[19px]">
              Ứng dụng học máy vào dự đoán khách hàng hủy đặt phòng
            </p>
            <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3 text-[12.5px] text-[#747a6e]">
              <span className="inline-flex items-center gap-2">
                <svg
                  aria-hidden="true"
                  viewBox="0 0 16 16"
                  className="h-3.5 w-3.5 text-sage"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <rect x="1.8" y="3" width="12.4" height="10" rx="1.6" />
                  <path d="M1.8 6.2h12.4" />
                </svg>
                {totalSlides} slide · 16:9
              </span>
              <span className="inline-flex items-center gap-2">
                <kbd className="inline-flex h-[22px] min-w-[22px] items-center justify-center rounded-[5px] border border-[#c9bfae] bg-white/70 px-1 font-mono text-[11px] text-[#3f4b44]">
                  A
                </kbd>
                <kbd className="inline-flex h-[22px] min-w-[22px] items-center justify-center rounded-[5px] border border-[#c9bfae] bg-white/70 px-1 font-mono text-[11px] text-[#3f4b44]">
                  D
                </kbd>
                <span>để chuyển slide khi trình chiếu</span>
              </span>
            </div>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => onOpen(0)}
                className="inline-flex items-center gap-2.5 rounded-full bg-clay px-5 py-3 text-[13.5px] font-medium text-[#fff7ee] shadow-[0_16px_30px_-18px_rgba(185,87,47,0.9)] transition hover:bg-clay-deep active:scale-[0.98]"
              >
                Bắt đầu trình chiếu
                <svg
                  aria-hidden="true"
                  viewBox="0 0 16 16"
                  className="h-3.5 w-3.5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                >
                  <path d="M2.5 8h11M9.3 4l4 4-4 4" />
                </svg>
              </button>
              <a
                href="#tat-ca-slide"
                className="inline-flex items-center gap-2 rounded-full border border-[#cabfae] bg-white/45 px-5 py-3 text-[13.5px] font-medium text-[#35473f] transition hover:border-[#9e8f79] hover:bg-white/70"
              >
                Xem tổng quan
              </a>
            </div>
          </div>

          <div className="relative min-h-[220px] overflow-hidden rounded-[22px] border border-[#c8bcab] shadow-[0_30px_60px_-40px_rgba(14,40,36,0.7)] sm:min-h-[280px] lg:min-h-full">
            <img
              src="/images/hotel-hero.jpg"
              alt="Không gian sảnh khách sạn với ánh đèn ấm, hình ảnh minh họa cho chủ đề đặt phòng"
              className="absolute inset-0 h-full w-full object-cover"
              style={{ objectPosition: "58% 50%" }}
            />
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(150deg, rgba(8,28,24,0.06) 10%, rgba(8,28,24,0.18) 50%, rgba(6,24,21,0.78) 100%)",
              }}
            />
            <div className="absolute right-4 top-4 flex items-center gap-2 rounded-full border border-white/25 bg-[#071916]/40 px-3 py-1.5 text-[10.5px] font-medium uppercase tracking-[0.16em] text-[#f2ecdf] backdrop-blur-md">
              <span className="h-1.5 w-1.5 rounded-full bg-[#e3b18a]" />
              16 slide
            </div>
            <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-3">
              <div>
                <p className="font-display text-[24px] italic leading-tight text-[#faf4e7]">
                  SmartStay AI
                </p>
                <p className="mt-1 text-[10.5px] uppercase tracking-[0.2em] text-[#e3d9c8]/80">
                  Ứng dụng học máy
                </p>
              </div>
              <div className="flex items-end gap-[4px]" aria-hidden="true">
                {[14, 22, 18, 30, 24, 36].map((height, index) => (
                  <span
                    key={index}
                    className="block w-[5px] rounded-t-[2px]"
                    style={{
                      height,
                      background:
                        index === 5 ? "#e3b18a" : "rgba(250,244,231,0.45)",
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="tat-ca-slide" className="mt-12 scroll-mt-6 lg:mt-16">
          <div className="flex flex-wrap items-end justify-between gap-4 border-b border-[#d6cbbb] pb-4">
            <div>
              <h2 className="font-display text-[28px] font-semibold tracking-[-0.02em] sm:text-[32px]">
                Tổng quan
              </h2>
              <p className="mt-1.5 text-[13px] text-[#747a6e]">
                Chọn một slide để mở chế độ trình chiếu
              </p>
            </div>
            <p className="text-[12px] font-medium tabular-nums text-[#7d8176]">
              {totalSlides} slide
            </p>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-x-5 gap-y-7 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {slides.map((slide, index) => (
              <button
                key={slide.id}
                type="button"
                onClick={() => onOpen(index)}
                className="thumb-card group block w-full text-left"
                aria-label={`Mở slide ${index + 1}: ${slide.title}`}
              >
                <div className="thumb-frame relative aspect-video w-full overflow-hidden rounded-[13px] border border-[#c6baa7] bg-[#0c2422] shadow-[0_14px_28px_-24px_rgba(12,36,34,0.8)]">
                  <DeckThumb slide={slide} />
                  <span className="thumb-open absolute bottom-2.5 right-2.5 inline-flex items-center gap-1.5 rounded-full bg-[#f7f1e4] px-2.5 py-1.5 text-[10.5px] font-semibold text-[#173f38] shadow-sm">
                    Mở slide
                    <svg
                      aria-hidden="true"
                      viewBox="0 0 12 12"
                      className="h-2.5 w-2.5"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                    >
                      <path d="M2 6h7.5M6.5 3 9.5 6l-3 3" />
                    </svg>
                  </span>
                </div>
                <div className="mt-2.5 flex items-start gap-3 px-0.5">
                  <span className="mt-[1px] shrink-0 font-mono text-[11px] tabular-nums text-[#9a9d91] transition group-hover:text-clay">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <h3 className="flex-1 text-[13.5px] font-medium leading-[1.45] text-[#2c3b35] transition group-hover:text-clay-deep">
                    {slide.title}
                  </h3>
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 12 12"
                    className="mt-[5px] h-3 w-3 shrink-0 text-[#b0b3a6] transition group-hover:text-clay"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.4"
                    strokeLinecap="round"
                  >
                    <path d="M2 6h7.5M6.5 3 9.5 6l-3 3" />
                  </svg>
                </div>
              </button>
            ))}
          </div>
        </section>
      </main>

      <footer className="border-t border-[#d6cbbb]/80">
        <div className="mx-auto flex w-full max-w-[1480px] flex-wrap items-center justify-between gap-3 px-5 py-5 text-[11.5px] text-[#7c8175] sm:px-8 lg:px-12">
          <p>SmartStay AI · Học phần Trí tuệ nhân tạo</p>
          <p className="inline-flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-sage/70" />
            Trình chiếu · A / D để chuyển slide
          </p>
        </div>
      </footer>
    </div>
  );
}
