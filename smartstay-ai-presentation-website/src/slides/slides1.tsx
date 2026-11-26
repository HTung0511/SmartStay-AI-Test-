import { CornerArc, Reveal, T } from "@/components/primitives";
import { PageIcon, SlideHead, SlideShell } from "./shared";

/* ================================================================== */
/* 01 — Title                                                          */
/* ================================================================== */

export function Slide01() {
  return (
    <div className="slide slide-dark on-dark">
      <div className="absolute inset-0 overflow-hidden">
        <img
          src="/images/hotel-hero.jpg"
          alt=""
          className="kenburns absolute inset-0 h-full w-full object-cover"
          style={{ objectPosition: "62% 48%" }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(96deg, rgba(7,24,21,0.96) 0%, rgba(8,27,24,0.89) 34%, rgba(8,27,24,0.52) 64%, rgba(8,27,24,0.34) 100%)",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(900px 620px at 78% 42%, rgba(197, 123, 77, 0.16), transparent 62%), linear-gradient(0deg, rgba(5,19,17,0.72), transparent 44%)",
          }}
        />
        <div className="sheen pointer-events-none absolute inset-0" />
      </div>

      <div className="relative z-10 flex h-full flex-col justify-between px-[96px] py-[70px]">
        <Reveal d={60} v="down" className="flex items-center gap-[22px]">
          <span className="block h-[1px] w-[54px] bg-[#d9a780]" />
          <span className="s-eyebrow !text-[17px] !tracking-[0.26em] !text-[#e8dcc8]">
            Học phần Trí tuệ nhân tạo
          </span>
        </Reveal>

        <div className="max-w-[1080px] pb-[16px]">
          <Reveal d={150} v="mask">
            <h1
              className="font-display leading-[0.96]"
              style={{
                fontSize: 148,
                fontWeight: 600,
                letterSpacing: "-0.035em",
                color: "#f8f2e5",
              }}
            >
              SmartStay{" "}
              <span className="italic" style={{ color: "#e3b18a" }}>
                AI
              </span>
            </h1>
          </Reveal>

          <Reveal d={360} v="line" className="mt-[30px] h-[1px] w-[470px] bg-[#d7a67f]/55" />

          <Reveal d={430} v="up" className="mt-[30px] max-w-[790px]">
            <p
              className="font-light leading-[1.42]"
              style={{
                fontSize: 33,
                color: "#e6dfd1",
                letterSpacing: "-0.005em",
              }}
            >
              Ứng dụng học máy vào dự đoán khách hàng hủy đặt phòng
            </p>
          </Reveal>

          <Reveal d={580} v="soft" className="mt-[38px] flex items-center gap-[18px]">
            <span className="flex h-[38px] w-[38px] items-center justify-center rounded-full border border-[#e3b18a]/45">
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                className="h-[17px] w-[17px]"
                fill="none"
                stroke="#e3b18a"
                strokeWidth="1.5"
                strokeLinecap="round"
              >
                <path d="M4 20V8.5L12 4l8 4.5V20" />
                <path d="M9 20v-6h6v6" />
              </svg>
            </span>
            <span className="block h-[1px] w-[210px] bg-[#e6dfd1]/22" />
            <span className="block h-[5px] w-[5px] rounded-full bg-[#e3b18a]" />
            <span className="block h-[1px] w-[54px] bg-[#e6dfd1]/22" />
          </Reveal>
        </div>

        <div className="flex items-end justify-between">
          <Reveal d={760} v="up" className="flex items-center gap-[13px]">
            {[0, 1, 2, 3].map((i) => (
              <span
                key={i}
                className="block h-[3px] rounded-full"
                style={{
                  width: i === 0 ? 64 : 22,
                  background:
                    i === 0 ? "#d9a780" : "rgba(230, 223, 209, 0.28)",
                }}
              />
            ))}
          </Reveal>
          <div
            aria-hidden="true"
            className="pointer-events-none relative h-[118px] w-[300px]"
          >
            <div
              className="float-slow absolute right-0 top-0 h-[118px] w-[300px] rounded-[14px] border border-[#f2e9d8]/18"
              style={{
                background:
                  "linear-gradient(140deg, rgba(250,244,232,0.12), rgba(250,244,232,0.02))",
                backdropFilter: "blur(8px)",
              }}
            >
              <div className="flex h-full flex-col justify-between p-[18px]">
                <div className="flex items-center justify-between">
                  <span className="block h-[1px] w-[54px] bg-[#f2e9d8]/45" />
                  <svg
                    viewBox="0 0 24 24"
                    className="h-[18px] w-[18px]"
                    fill="none"
                    stroke="#e3b18a"
                    strokeWidth="1.4"
                    aria-hidden="true"
                  >
                    <rect x="3.5" y="5" width="17" height="15" rx="2" />
                    <path d="M8 3v4M16 3v4M3.5 9.5h17" />
                  </svg>
                </div>
                <div className="flex items-end gap-[7px]">
                  {[26, 44, 34, 62, 48, 78, 58, 90].map((height, i) => (
                    <span
                      key={i}
                      className="block w-[16px] rounded-t-[2px]"
                      style={{
                        height,
                        background:
                          i === 7 ? "#d9a780" : "rgba(242, 233, 216, 0.24)",
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ================================================================== */
/* 02 — Phân công công việc                                            */
/* ================================================================== */

const members = [
  {
    member: "Dương Minh Tuấn",
    model: "Dummy, Logistic Regression, Decision Tree",
    work: "E3 giữ/xóa dòng trùng; E4 có/không adr và special_requests; xác định bài toán, làm sạch dữ liệu",
  },
  {
    member: "Phạm Tuấn Mạnh",
    model: "Random Forest",
    work: "E5 chia ngẫu nhiên và theo thời gian; E6 huấn luyện khách sạn này, kiểm tra khách sạn kia; phân tích lỗi, trực quan hóa",
  },
  {
    member: "Lưu Văn Lịch",
    model: "LightGBM + SMOTENC",
    work: "E7 hiệu chỉnh xác suất; E9 giải thích bằng SHAP",
  },
  {
    member: "Trần Hoàng Tùng",
    model: "MLP",
    work: "E8 ngưỡng theo chi phí; bootstrap, ngưỡng khóa; web demo Streamlit",
  },
];

export function Slide02() {
  return (
    <SlideShell>
      <CornerArc />
      <SlideHead
        title="Phân công công việc"
        sub="Mỗi thành viên phụ trách một nhóm mô hình và các thực nghiệm đi kèm"
      />

      <div className="mt-[28px] flex-1">
        <div className="panel overflow-hidden p-[10px]">
        <table className="dt" style={{ fontSize: 19.5 }}>
          <colgroup>
            <col style={{ width: "20%" }} />
            <col style={{ width: "25%" }} />
            <col style={{ width: "55%" }} />
          </colgroup>
          <thead>
            <tr>
              <th>Thành viên</th>
              <th>Mô hình</th>
              <th>Thực nghiệm và công việc</th>
            </tr>
          </thead>
          <tbody>
            {members.map((row, i) => (
              <Reveal as="tr" key={row.member} d={300 + i * 90} v="left">
                <td style={{ paddingTop: 30, paddingBottom: 30 }}>
                  <span className="strong" style={{ fontSize: 20 }}>
                    {row.member}
                  </span>
                </td>
                <td>
                  <span style={{ color: "#24594e", fontWeight: 500 }}>
                    {row.model}
                  </span>
                </td>
                <td style={{ color: "#3f4b45" }}>{row.work}</td>
              </Reveal>
            ))}
          </tbody>
        </table>
        </div>
      </div>

      <Reveal
        d={760}
        v="up"
        className="mt-[24px] flex items-start gap-[16px] rounded-[12px] bg-ink px-[24px] py-[18px] text-[18.5px] leading-[1.45] text-[#efe9dc]"
      >
        <span className="mt-[9px] block h-[5px] w-[5px] shrink-0 rounded-full bg-[#d9a780]" />
        <p>
          E1 (so sánh mô hình) và E2 (xử lý mất cân bằng lớp): mỗi thành viên tự
          chạy trên mô hình của mình.
        </p>
      </Reveal>
    </SlideShell>
  );
}

/* ================================================================== */
/* 03 — Bài toán                                                       */
/* ================================================================== */

export function Slide03() {
  return (
    <SlideShell>
      <CornerArc />
      <SlideHead
        title="Bài toán: overbooking khi nào có lợi?"
        sub="Dự đoán hủy chỉ có giá trị khi biến được thành quyết định bán thêm phòng"
      />

      <div className="mt-[26px] grid flex-1 grid-cols-[1.03fr_1fr] gap-[26px]">
        <Reveal
          d={280}
          v="scale"
          className="relative overflow-hidden rounded-[20px] bg-ink p-[38px] text-[#f3ecdf]"
        >
          <div
            aria-hidden="true"
            className="absolute -right-[70px] -top-[70px] h-[300px] w-[300px] rounded-full border border-[#e9c9b6]/20"
          />
          <div
            aria-hidden="true"
            className="absolute -right-[26px] -top-[26px] h-[160px] w-[160px] rounded-full border border-[#e9c9b6]/16"
          />
          <div className="relative flex h-full flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="block h-[1px] w-[64px] bg-[#e3b18a]/70" />
              <span className="block h-[6px] w-[6px] rounded-full bg-[#e3b18a]" />
            </div>
            <div>
              <div
                className="serif-num leading-[0.88]"
                style={{ fontSize: 142, color: "#f4c9a6" }}
              >
                <T delay={420} duration={1350}>
                  37,0%
                </T>
              </div>
              <p
                className="mt-[28px] max-w-[440px] leading-[1.5]"
                style={{ fontSize: 23, color: "#ded8ca" }}
              >
                <T delay={700} duration={1100}>
                  đơn đặt phòng gốc bị hủy (27,7% sau làm sạch), mỗi đơn để lại
                  một phòng trống
                </T>
              </p>
            </div>
            <div className="mt-[22px] flex items-center gap-[10px]">
              <span className="block h-[1px] flex-1 bg-[#e6dfd1]/18" />
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                className="h-[20px] w-[20px]"
                fill="none"
                stroke="#c9b9a2"
                strokeWidth="1.4"
                strokeLinecap="round"
              >
                <path d="M4 10.5 12 4l8 6.5" />
                <path d="M6 9.5V20h12V9.5M10 20v-5.5h4V20" />
              </svg>
            </div>
          </div>
        </Reveal>

        <div className="flex flex-col gap-[20px]">
          <Reveal d={390} v="right" className="panel panel-underline-clay p-[26px]">
            <div className="flex items-start gap-[16px]">
              <span className="mt-[2px] flex h-[40px] w-[40px] items-center justify-center rounded-[10px] border border-[#d9c6b4] bg-[#f5e6da]">
                <PageIcon name="spark" />
              </span>
              <div>
                <h3
                  className="font-display"
                  style={{ fontSize: 27, fontWeight: 600 }}
                >
                  Dự đoán lúc đặt
                </h3>
                <p className="mt-[7px] text-[20px] leading-[1.45] text-[#43514a]">
                  Mô hình chấm nguy cơ hủy cho từng đơn; vượt ngưỡng thì
                  overbook đúng một phòng
                </p>
              </div>
            </div>
          </Reveal>

          <div className="grid flex-1 grid-cols-2 gap-[20px]">
            <Reveal
              d={500}
              v="up"
              className="panel flex flex-col justify-between p-[24px]"
            >
              <div>
                <h4
                  className="font-display leading-[1.18]"
                  style={{ fontSize: 25, fontWeight: 600 }}
                >
                  FP: overbook nhầm
                </h4>
                <p className="mt-[10px] text-[18px] leading-[1.45] text-[#4a554f]">
                  Khách vẫn đến nhưng hết phòng, tốn r
                </p>
              </div>
              <div
                aria-hidden="true"
                className="mt-[16px] h-[3px] w-full rounded-full bg-[#e9c9b6]"
              />
            </Reveal>
            <Reveal
              d={600}
              v="up"
              className="panel flex flex-col justify-between p-[24px]"
            >
              <div>
                <h4
                  className="font-display leading-[1.18]"
                  style={{ fontSize: 25, fontWeight: 600 }}
                >
                  FN: bỏ lỡ
                </h4>
                <p className="mt-[10px] text-[18px] leading-[1.45] text-[#4a554f]">
                  <T delay={680}>Khách hủy, phòng trống, tốn 1</T>
                </p>
              </div>
              <div
                aria-hidden="true"
                className="mt-[16px] h-[3px] w-full rounded-full bg-[#bcd3c8]"
              />
            </Reveal>
          </div>
        </div>
      </div>

      <Reveal
        d={780}
        v="up"
        className="mt-[22px] flex items-center gap-[20px] rounded-[12px] bg-ink px-[28px] py-[18px] text-[#f2ecdf]"
      >
        <span
          aria-hidden="true"
          className="flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-full border border-[#e9c9b6]/35"
        >
          <svg viewBox="0 0 24 24" className="h-[19px] w-[19px]" fill="none" stroke="#e9c9b6" strokeWidth="1.4" strokeLinecap="round">
            <path d="M7 4h10M9 4v7L5.5 18a2.4 2.4 0 0 0 2.2 3.5h8.6a2.4 2.4 0 0 0 2.2-3.5L15 11V4" />
            <path d="M7.8 15h8.4" />
          </svg>
        </span>
        <p className="text-[19px] leading-[1.4]">
          <T delay={900}>
            Công thức tính chi phí: Cost(t) = r·FP + FN. Mức chính r = 2 (giả
            định của nhóm)
          </T>
        </p>
      </Reveal>
    </SlideShell>
  );
}

/* ================================================================== */
/* 04 — Dữ liệu                                                        */
/* ================================================================== */

export function Slide04() {
  return (
    <SlideShell>
      <CornerArc />
      <SlideHead
        title="Dữ liệu Hotel Booking Demand"
        sub={
          <T delay={220} each={55}>
            Antonio, Almeida & Nunes (2019), Data in Brief 22, 41–50. Hai khách
            sạn City và Resort, 07/2015–08/2017
          </T>
        }
        maxSub={1280}
      />

      <div className="mt-[30px] grid flex-1 grid-cols-[1fr_1.08fr] gap-[44px]">
        <div className="flex flex-col justify-between gap-[22px]">
          <Reveal
            d={300}
            v="left"
            className="panel relative flex-1 overflow-hidden px-[30px] py-[24px]"
          >
            <div
              aria-hidden="true"
              className="absolute inset-y-0 left-0 w-[4px] bg-[#b9572f]"
            />
            <div
              className="serif-num leading-[0.95]"
              style={{ fontSize: 82, color: "#17453c" }}
            >
              <T delay={420} duration={1500}>
                119.390
              </T>
            </div>
            <p className="mt-[13px] text-[19.5px] leading-[1.45] text-[#4b5851]">
              <T delay={600}>
                bản ghi gốc × 32 cột, hủy 37,0%
              </T>
            </p>
            <div
              aria-hidden="true"
              className="absolute bottom-[20px] right-[26px] flex gap-[5px]"
            >
              {[18, 26, 22, 34, 29, 40].map((h, i) => (
                <span
                  key={i}
                  className="block w-[9px] rounded-t-[2px] bg-[#2f7163]/25"
                  style={{ height: h }}
                />
              ))}
            </div>
          </Reveal>

          <Reveal
            d={430}
            v="left"
            className="panel relative flex-1 overflow-hidden px-[30px] py-[24px]"
          >
            <div
              aria-hidden="true"
              className="absolute inset-y-0 left-0 w-[4px] bg-[#2f7163]"
            />
            <div
              className="serif-num leading-[0.95]"
              style={{ fontSize: 82, color: "#17453c" }}
            >
              <T delay={560} duration={1500}>
                86.617
              </T>
            </div>
            <p className="mt-[13px] text-[19.5px] leading-[1.45] text-[#4b5851]">
              <T delay={740}>
                bản ghi × 25 cột sau 34 bước làm sạch, hủy 27,7%
              </T>
            </p>
            <div
              aria-hidden="true"
              className="absolute bottom-[20px] right-[26px] flex gap-[5px]"
            >
              {[32, 26, 38, 30, 42, 24].map((h, i) => (
                <span
                  key={i}
                  className="block w-[9px] rounded-t-[2px] bg-[#b9572f]/22"
                  style={{ height: h }}
                />
              ))}
            </div>
          </Reveal>
        </div>

        <Reveal d={420} v="right" className="panel flex flex-col justify-center px-[22px] py-[26px]">
          <table className="dt" style={{ fontSize: 18.5 }}>
            <colgroup>
              <col style={{ width: "10%" }} />
              <col style={{ width: "24%" }} />
              <col style={{ width: "15%" }} />
              <col style={{ width: "15%" }} />
              <col style={{ width: "36%" }} />
            </colgroup>
            <thead>
              <tr>
                <th>Tập</th>
                <th>Giai đoạn</th>
                <th className="num">Số dòng</th>
                <th className="num">Tỉ lệ hủy</th>
                <th>Dùng để</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["Train", "07/2015–08/2016", "40.688", "24,0%", "Huấn luyện"],
                ["Val", "09–12/2016", "14.400", "28,4%", "Chọn mô hình, ngưỡng"],
                ["Test", "01–08/2017", "31.529", "32,0%", "Kiểm tra"],
              ].map((row, i) => (
                <Reveal as="tr" key={row[0]} d={520 + i * 100} v="left">
                  <td className="strong" style={{ paddingTop: 23, paddingBottom: 23 }}>
                    {row[0]}
                  </td>
                  <td className="mono">{row[1]}</td>
                  <td className="num strong">
                    <T delay={600 + i * 100}>{row[2]}</T>
                  </td>
                  <td
                    className="num"
                    style={{ color: i === 2 ? "#a34d29" : "#24594e", fontWeight: 600 }}
                  >
                    <T delay={650 + i * 100}>{row[3]}</T>
                  </td>
                  <td>{row[4]}</td>
                </Reveal>
              ))}
            </tbody>
          </table>

          <Reveal d={820} v="soft" className="mt-[26px]">
            <div className="flex h-[10px] w-full overflow-hidden rounded-full bg-[#e5ddce]">
              <div className="col-grow h-full" style={{ width: "44.1%", background: "#2f7163", animationDelay: "900ms" }} />
              <div className="col-grow h-full" style={{ width: "15.6%", background: "#79a696", animationDelay: "1030ms" }} />
              <div className="col-grow h-full" style={{ width: "34.2%", background: "#b9572f", animationDelay: "1160ms" }} />
              <div className="h-full flex-1 bg-[#d8cfbf]" />
            </div>
            <div className="mt-[12px] flex items-center justify-between">
              <span className="block h-[1px] flex-1 bg-[#d8cfbf]" aria-hidden="true" />
              <span className="mx-[14px] text-[15px] font-semibold uppercase tracking-[0.13em] text-[#365a4f]">
                Chia dữ liệu theo thời gian
              </span>
              <span className="block h-[1px] flex-1 bg-[#d8cfbf]" aria-hidden="true" />
            </div>
          </Reveal>
          <Reveal d={930} v="line" className="mt-[24px] h-[1px] w-full bg-[#d8cfbf]" />
          <Reveal d={900} v="up" className="mt-[18px] flex items-center gap-[12px]">
            <span className="block h-[1px] flex-1 bg-[#d8cfbf]" />
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              className="h-[22px] w-[22px]"
              fill="none"
              stroke="#2f7163"
              strokeWidth="1.4"
              strokeLinecap="round"
            >
              <path d="M4 18.5h16M7 18.5V9M12 18.5V5M17 18.5v-6" />
            </svg>
          </Reveal>
        </Reveal>
      </div>
    </SlideShell>
  );
}

/* ================================================================== */
/* 05 — Quyết định làm sạch                                            */
/* ================================================================== */

const cleaning = [
  [
    "Xóa dòng trùng hoàn toàn",
    "31.994 dòng",
    "Nhóm trùng hủy 63,1% so với 37,0% chung; giữ lại làm điểm đẹp giả (E3)",
  ],
  [
    "Loại cột rò rỉ nhãn",
    "6 cột",
    "Chỉ biết sau khi đặt phòng, như reservation_status",
  ],
  [
    "Xóa bản ghi bất khả",
    "166 + 591 dòng",
    "166 dòng không có khách, 591 dòng 0 đêm",
  ],
  [
    "Giữ adr = 0",
    "420 dòng",
    "Hủy chỉ 13,3%, có thể là đặt phòng tặng, không phải lỗi",
  ],
  [
    "Bỏ special_requests",
    "1 cột",
    "Nghi rò rỉ nhãn; chấp nhận mất 0,05–0,08 PR-AUC (E4)",
  ],
];

export function Slide05() {
  return (
    <SlideShell>
      <CornerArc />
      <SlideHead
        title="Các quyết định làm sạch quan trọng"
        sub={
          <T delay={220} each={0}>
            Mỗi quyết định đều ghi vào cleaning log (34 bước), kể cả quyết định
            giữ lại
          </T>
        }
      />

      <div className="mt-[30px] flex-1">
        <table className="dt" style={{ fontSize: 19.5 }}>
          <colgroup>
            <col style={{ width: "25%" }} />
            <col style={{ width: "17%" }} />
            <col style={{ width: "58%" }} />
          </colgroup>
          <thead>
            <tr>
              <th>Quyết định</th>
              <th>Quy mô</th>
              <th>Lý do</th>
            </tr>
          </thead>
          <tbody>
            {cleaning.map((row, i) => (
              <Reveal as="tr" key={row[0]} d={300 + i * 100} v="left">
                <td className="strong" style={{ paddingTop: 32, paddingBottom: 32 }}>
                  <T delay={320 + i * 100}>{row[0]}</T>
                </td>
                <td style={{ color: "#a34d29", fontWeight: 600 }}>
                  <T delay={360 + i * 100}>{row[1]}</T>
                </td>
                <td style={{ color: "#43514a" }}>
                  <T delay={400 + i * 100}>{row[2]}</T>
                </td>
              </Reveal>
            ))}
          </tbody>
        </table>
      </div>

      <Reveal d={900} v="soft" className="mt-[26px] flex items-center gap-[10px]">
        {Array.from({ length: 34 }).map((_, index) => (
          <span
            key={index}
            aria-hidden="true"
            className="block rounded-full"
            style={{
              height: index % 5 === 0 ? 7 : 4,
              width: index % 5 === 0 ? 7 : 18,
              background:
                index % 5 === 0 ? "#b9572f" : "#c9cdbc",
            }}
          />
        ))}
      </Reveal>
    </SlideShell>
  );
}

/* ================================================================== */
/* 06 — Chín kịch bản thực nghiệm                                      */
/* ================================================================== */

const experiments = [
  ["E1", "So sánh mô hình", "Chọn mô hình tốt nhất và hiểu vì sao"],
  ["E2", "Xử lý mất cân bằng lớp", "Kiểm tra có cần cân bằng lớp (hủy chiếm 27,7%)"],
  ["E3", "Giữ / xóa dòng trùng", "Xem việc xóa 31.994 dòng trùng ảnh hưởng thế nào"],
  ["E4", "Có / không adr, special_requests", "Đo đóng góp của hai cột vùng xám, nghi rò rỉ"],
  ["E5", "Chia ngẫu nhiên / theo thời gian", "Đo mức điểm bị đẹp giả khi chia ngẫu nhiên"],
  ["E6", "Khách sạn này → khách sạn kia", "Kiểm tra mô hình có tổng quát hóa giữa hai khách sạn"],
  ["E7", "Hiệu chỉnh xác suất", "Xem xác suất có đủ tin cậy để tính chi phí"],
  ["E8", "Ngưỡng theo chi phí, overbooking", "Câu hỏi chính: chọn ngưỡng nào, overbook có lợi không"],
  ["E9", "SHAP và phân tích lỗi", "Biết mô hình dựa vào đâu và sai ở đâu"],
];

export function Slide06() {
  return (
    <SlideShell tight>
      <CornerArc />
      <SlideHead title="Chín kịch bản thực nghiệm" size="sm" />

      <div className="mt-[26px] flex-1">
        <table className="dt" style={{ fontSize: 18.5 }}>
          <colgroup>
            <col style={{ width: "7%" }} />
            <col style={{ width: "38%" }} />
            <col style={{ width: "55%" }} />
          </colgroup>
          <thead>
            <tr>
              <th>#</th>
              <th>Thực nghiệm</th>
              <th>Lý do / mục đích</th>
            </tr>
          </thead>
          <tbody>
            {experiments.map((row, i) => (
              <Reveal
                as="tr"
                key={row[0]}
                d={240 + i * 62}
                v="left"
                className={row[0] === "E8" ? "spot" : undefined}
              >
                <td style={{ paddingTop: 15, paddingBottom: 15 }}>
                  <span
                    className="inline-flex h-[32px] min-w-[46px] items-center justify-center rounded-full border px-[9px] text-[15px] font-semibold"
                    style={{
                      borderColor: row[0] === "E8" ? "#d9b199" : "#cfc6b6",
                      background:
                        row[0] === "E8" ? "#f3e0d3" : "rgba(255,255,255,0.6)",
                      color: row[0] === "E8" ? "#984626" : "#305e53",
                    }}
                  >
                    {row[0]}
                  </span>
                </td>
                <td className="strong">
                  <T delay={280 + i * 62} each={45}>{row[1]}</T>
                </td>
                <td style={{ color: "#43514a" }}>
                  <T delay={320 + i * 62} each={45}>{row[2]}</T>
                </td>
              </Reveal>
            ))}
          </tbody>
        </table>
      </div>

      <Reveal d={860} v="up" className="mt-[20px] flex items-center justify-between">
        <div className="flex items-center gap-[6px]" aria-hidden="true">
          {experiments.map((row) => (
            <span
              key={row[0]}
              className="block h-[4px] rounded-full"
              style={{
                width: row[0] === "E8" ? 34 : 18,
                background: row[0] === "E8" ? "#b9572f" : "#cfc6b6",
              }}
            />
          ))}
        </div>
      </Reveal>
    </SlideShell>
  );
}
