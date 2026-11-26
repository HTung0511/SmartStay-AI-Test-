import { useContext, useMemo, type CSSProperties } from "react";
import { AnimCtx, BASE, Rv } from "../lib/anim";

function mulberry32(a: number) {
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

interface Win {
  x: number;
  y: number;
  o: number;
  tw: boolean;
  dl: number;
  du: number;
}
interface Bld {
  x: number;
  w: number;
  h: number;
  far: boolean;
  wins: Win[];
}

function makeCity(): { blds: Bld[]; stars: { x: number; y: number; s: number; dl: number; du: number }[] } {
  const r = mulberry32(11);
  const blds: Bld[] = [];
  // lớp xa: tối, ít cửa sổ
  let x = -40;
  while (x < 1960) {
    const w = 170 + r() * 150;
    const h = 250 + r() * 190;
    blds.push({ x, w, h, far: true, wins: [] });
    x += w * (0.55 + r() * 0.3);
  }
  // lớp gần: có cửa sổ sáng như phòng khách sạn
  x = -30;
  while (x < 1960) {
    const w = 150 + r() * 130;
    const h = 200 + r() * 220;
    const wins: Win[] = [];
    const cols = Math.floor((w - 34) / 38);
    const rows = Math.floor((h - 46) / 54);
    for (let cy = 0; cy < rows; cy++) {
      for (let cx = 0; cx < cols; cx++) {
        if (r() < 0.36) {
          wins.push({
            x: 20 + cx * 38,
            y: 28 + cy * 54,
            o: 0.35 + r() * 0.65,
            tw: r() < 0.28,
            dl: r() * 6,
            du: 3 + r() * 5,
          });
        }
      }
    }
    blds.push({ x, w, h, far: false, wins });
    x += w + 12 + r() * 22;
  }
  const stars = Array.from({ length: 46 }, () => ({
    x: r() * 1920,
    y: r() * 430,
    s: 2 + r() * 3,
    dl: r() * 6,
    du: 3 + r() * 4,
  }));
  return { blds, stars };
}

const CITY = makeCity();

function Letters({ text, d, className = "" }: { text: string; d: number; className?: string }) {
  return (
    <span className="word">
      {Array.from(text).map((c, i) => (
        <span className="ch-wrap" key={i}>
          <Rv k="rise" as="span" d={d + i * 70} dur={950} className={`ch ${className}`}>
            {c}
          </Rv>
        </span>
      ))}
    </span>
  );
}

export function Cover() {
  const animate = useContext(AnimCtx);
  const cls = animate ? "anim" : "";
  const city = useMemo(() => CITY, []);
  return (
    <div className={`slide cover ${cls}`}>
      <div className="cv-sky" />
      <div className="cv-moon" />
      {city.stars.map((s, i) => (
        <i
          key={i}
          className="cv-star"
          style={
            {
              left: s.x,
              top: s.y,
              width: s.s,
              height: s.s,
              ["--dl" as string]: `${s.dl}s`,
              ["--du" as string]: `${s.du}s`,
            } as CSSProperties
          }
        />
      ))}
      <div className="cv-halo" />

      <div className="cv-city">
        {city.blds.map((b, i) => (
          <div
            key={i}
            className={`bld ${b.far ? "far" : "near"}`}
            style={
              {
                left: b.x,
                width: b.w,
                height: b.h,
                ["--bd" as string]: `${BASE + 80 + (i % 9) * 70}ms`,
              } as CSSProperties
            }
          >
            {b.wins.map((w, j) => (
              <i
                key={j}
                className={w.tw ? "win tw" : "win"}
                style={
                  {
                    left: w.x,
                    top: w.y,
                    opacity: w.o,
                    ["--dl" as string]: `${w.dl}s`,
                    ["--du" as string]: `${w.du}s`,
                  } as CSSProperties
                }
              />
            ))}
          </div>
        ))}
      </div>
      <div className="cv-fade" />

      <div className="cv-text">
        <Rv k="fade" d={150} dur={1100} className="cv-kicker">
          Học phần Trí tuệ nhân tạo
        </Rv>
        <h1 className="cv-title" aria-label="SmartStay AI">
          <Letters text="SmartStay" d={350} />
          <span className="cv-space" />
          <Letters text="AI" d={350 + 9 * 70 + 120} className="amber" />
        </h1>
        <Rv k="wipe" d={1250} dur={1100} className="cv-sub">
          Ứng dụng học máy vào dự đoán khách hàng hủy đặt phòng
        </Rv>
      </div>
    </div>
  );
}
