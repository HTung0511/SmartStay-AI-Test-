import { cn } from "@/utils/cn";

const Chevron = ({ dir }: { dir: "l" | "r" }) => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d={dir === "l" ? "M15 5l-7 7 7 7" : "M9 5l7 7-7 7"} />
  </svg>
);

const GridIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <rect x="4" y="4" width="6.5" height="6.5" rx="1.2" />
    <rect x="13.5" y="4" width="6.5" height="6.5" rx="1.2" />
    <rect x="4" y="13.5" width="6.5" height="6.5" rx="1.2" />
    <rect x="13.5" y="13.5" width="6.5" height="6.5" rx="1.2" />
  </svg>
);

/**
 * Điều khiển nổi, nhỏ gọn, sát mép khung nhìn: không làm nhỏ slide.
 * Tự ẩn khi không thao tác (xem useAutoHide) và hiện lại khi rê chuột / bấm phím / chạm.
 */
export function Controls({
  index,
  total,
  active,
  onPrev,
  onNext,
  onOverview,
  onHover,
}: {
  index: number;
  total: number;
  active: boolean;
  onPrev: () => void;
  onNext: () => void;
  onOverview: () => void;
  onHover: (v: boolean) => void;
}) {
  return (
    <div className={cn(active && "ctl-on")}>
      <div className="ctl-hint" aria-hidden="true">
        <kbd>A</kbd>
        <span>trước</span>
        <kbd>D</kbd>
        <span>sau</span>
        <kbd>Esc</kbd>
        <span>tổng quan</span>
      </div>

      <div
        className="ctl-bar"
        onMouseEnter={() => onHover(true)}
        onMouseLeave={() => onHover(false)}
        onFocus={() => onHover(true)}
        onBlur={() => onHover(false)}
      >
        <button className="ctl-btn" onClick={onPrev} disabled={index === 0} title="Slide trước (A)" aria-label="Slide trước">
          <Chevron dir="l" />
        </button>
        <span className="ctl-count" aria-label={`Slide ${index + 1} trên ${total}`}>
          {index + 1} / {total}
        </span>
        <button
          className="ctl-btn"
          onClick={onNext}
          disabled={index === total - 1}
          title="Slide sau (D)"
          aria-label="Slide sau"
        >
          <Chevron dir="r" />
        </button>
        <span className="ctl-sep" />
        <button className="ctl-btn" onClick={onOverview} title="Xem tổng quan (Esc)" aria-label="Xem tổng quan">
          <GridIcon />
        </button>
      </div>

      <div className="ctl-prog" aria-hidden="true">
        {Array.from({ length: total }, (_, i) => (
          <i key={i} className={cn(i <= index && "on", i === index && "cur")} />
        ))}
      </div>
    </div>
  );
}
