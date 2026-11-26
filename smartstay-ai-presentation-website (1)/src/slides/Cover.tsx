import coverImg from "../assets/cover.jpg";
import { dl } from "./ui";

/* Dải chân trời với cửa sổ phòng sáng đèn (trang trí, sinh cố định để không đổi giữa các lần hiển thị) */
function makeSkyline() {
  let seed = 7;
  const rnd = () => {
    seed = (seed * 16807) % 2147483647;
    return seed / 2147483647;
  };
  const buildings: { x: number; w: number; h: number }[] = [];
  let x = -20;
  while (x < 1620) {
    const w = 90 + Math.floor(rnd() * 110);
    const h = 90 + Math.floor(rnd() * 190);
    buildings.push({ x, w, h });
    x += w + 8 + Math.floor(rnd() * 14);
  }
  const windows: { x: number; y: number; lit: boolean; glow: boolean; d: number }[] = [];
  buildings.forEach((b) => {
    for (let wx = b.x + 14; wx < b.x + b.w - 18; wx += 24) {
      for (let wy = 300 - b.h + 16; wy < 292; wy += 26) {
        const r = rnd();
        windows.push({ x: wx, y: wy, lit: r > 0.52, glow: r > 0.88, d: Math.floor(rnd() * 4000) });
      }
    }
  });
  return { buildings, windows };
}
const SKY = makeSkyline();

function Letters({ text, base }: { text: string; base: number }) {
  let n = 0;
  const words = text.split(" ");
  return (
    <>
      {words.map((w, wi) => (
        <span key={wi} className="inline-block whitespace-nowrap">
          {[...w].map((ch) => {
            const i = n++;
            return (
              <span key={i} className="rv inline-block" style={dl(base + i * 60)}>
                {ch}
              </span>
            );
          })}
          {wi < words.length - 1 ? " " : ""}
        </span>
      ))}
    </>
  );
}

function KeyCard() {
  return (
    <svg width="380" height="240" viewBox="0 0 380 240" aria-hidden="true" className="drop-shadow-[0_30px_40px_rgba(0,0,0,0.45)]">
      <defs>
        <linearGradient id="kc" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#1f8f89" />
          <stop offset="0.55" stopColor="#14566b" />
          <stop offset="1" stopColor="#12304a" />
        </linearGradient>
        <linearGradient id="chip" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#f0dba0" />
          <stop offset="1" stopColor="#bf9740" />
        </linearGradient>
      </defs>
      <rect x="2" y="2" width="376" height="236" rx="26" fill="url(#kc)" stroke="rgba(255,255,255,0.28)" strokeWidth="2" />
      <rect x="2" y="44" width="376" height="38" fill="rgba(6,16,26,0.78)" />
      <rect x="34" y="120" width="62" height="48" rx="9" fill="url(#chip)" />
      <path d="M34 144h62M65 120v48M34 132h20M76 132h20M34 156h20M76 156h20" stroke="rgba(90,62,10,0.55)" strokeWidth="2" fill="none" />
      <g fill="none" stroke="rgba(255,255,255,0.8)" strokeWidth="5" strokeLinecap="round">
        <path d="M280 128a28 28 0 0 1 0 40" />
        <path d="M300 112a52 52 0 0 1 0 72" />
        <path d="M320 96a76 76 0 0 1 0 104" />
      </g>
      <rect x="34" y="196" width="150" height="8" rx="4" fill="rgba(255,255,255,0.35)" />
    </svg>
  );
}

export default function Cover() {
  return (
    <div className="relative h-[900px] w-[1600px] overflow-hidden bg-[#0a141d] text-cream">
      <img src={coverImg} alt="" className="kb absolute inset-0 h-full w-full object-cover" />
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(98deg, rgba(7,15,24,0.96) 0%, rgba(9,21,32,0.9) 42%, rgba(10,28,42,0.55) 78%, rgba(10,28,42,0.38) 100%)",
        }}
      />
      <div
        className="absolute inset-x-0 bottom-0 h-[420px]"
        style={{ background: "linear-gradient(180deg, transparent, rgba(6,13,20,0.92))" }}
      />

      {/* Đường chân trời */}
      <svg
        className="rv-fade absolute bottom-0 left-0"
        style={dl(500)}
        width="1600"
        height="300"
        viewBox="0 0 1600 300"
        aria-hidden="true"
      >
        {SKY.buildings.map((b, i) => (
          <rect key={i} x={b.x} y={300 - b.h} width={b.w} height={b.h + 10} fill="#09131c" fillOpacity="0.9" />
        ))}
        {SKY.windows.map((w, i) => (
          <rect
            key={i}
            x={w.x}
            y={w.y}
            width="10"
            height="14"
            rx="1.5"
            fill={w.lit ? "#e0b865" : "#1b2a37"}
            fillOpacity={w.lit ? 0.62 : 0.5}
            className={w.glow ? "room-glow" : undefined}
            style={w.glow ? dl(w.d) : undefined}
          />
        ))}
      </svg>

      {/* Thẻ chìa khóa phòng (trang trí) */}
      <div className="rv-pop absolute right-[96px] top-[52px]" style={dl(900)}>
        <div className="float-card" style={{ transform: "rotate(-9deg)" }}>
          <KeyCard />
        </div>
      </div>

      {/* Khối chữ */}
      <div className="absolute left-[120px] top-[228px] w-[1360px]">
        <div className="rv-left flex items-center gap-5" style={dl(150)}>
          <span className="draw block h-[3px] w-[72px] bg-gold" style={dl(250)} />
          <p className="text-[30px] font-medium tracking-[0.16em] text-gold-soft">
            Học phần Trí tuệ nhân tạo
          </p>
        </div>

        <h1
          aria-label="SmartStay AI"
          className="mt-[22px] font-display text-[196px] font-extrabold leading-[1.02] tracking-[-0.015em]"
        >
          <span aria-hidden="true">
            <span className="text-cream">
              <Letters text="SmartStay" base={350} />
            </span>{" "}
            <span className="rv inline-block" style={dl(350 + 9 * 60 + 80)}>
              <span className="shimmer-text">AI</span>
            </span>
          </span>
        </h1>

        <div className="draw mt-[26px] h-[4px] w-[210px] bg-gradient-to-r from-gold to-transparent" style={dl(1100)} />

        <p
          className="rv mt-[30px] w-[1400px] text-[45px] font-light leading-[1.25] text-[#e9eef0]"
          style={dl(1250)}
        >
          Ứng dụng học máy vào dự đoán khách hàng hủy đặt phòng
        </p>
      </div>
    </div>
  );
}
