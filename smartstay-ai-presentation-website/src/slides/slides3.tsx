import { CornerArc, Reveal, T } from "@/components/primitives";
import { PageIcon, SlideHead, SlideShell } from "./shared";

/* ================================================================== */
/* 12 — SHAP                                                           */
/* ================================================================== */

const shapRows = [
  ["1", "country", "Quốc gia của khách"],
  ["2", "arrival_date_month", "Tháng khách đến"],
  ["3", "agent", "Đại lý đặt phòng"],
  ["4", "lead_time", "Số ngày từ lúc đặt đến lúc đến"],
  ["5", "market_segment", "Phân khúc thị trường"],
];

export function Slide12() {
  return (
    <SlideShell dark>
      <CornerArc dark />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-[120px] top-[280px] h-[520px] w-[520px] rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(185,87,47,0.18), transparent 68%)",
        }}
      />
      <SlideHead
        dark
        title="Mô hình dựa vào đâu để dự đoán?"
        sub="Năm đặc trưng (cột) ảnh hưởng nhiều nhất theo SHAP"
      />

      <div className="mt-[30px] flex-1">
        <table className="dt dt-dark" style={{ fontSize: 20 }}>
          <colgroup>
            <col style={{ width: "9%" }} />
            <col style={{ width: "34%" }} />
            <col style={{ width: "57%" }} />
          </colgroup>
          <thead>
            <tr>
              <th>Hạng</th>
              <th>Đặc trưng</th>
              <th>Ý nghĩa</th>
            </tr>
          </thead>
          <tbody>
            {shapRows.map((row, i) => (
              <Reveal as="tr" key={row[1]} d={280 + i * 105} v="left">
                <td style={{ paddingTop: 24, paddingBottom: 24 }}>
                  <span
                    className="serif-num"
                    style={{
                      fontSize: 38,
                      color: i === 0 ? "#e8b58f" : "#9db6ab",
                      lineHeight: 1,
                    }}
                  >
                    <T delay={340 + i * 105}>{row[0]}</T>
                  </span>
                </td>
                <td>
                  <span
                    className="mono rounded-md px-[10px] py-[5px] text-[18px]"
                    style={{
                      background: "rgba(241,236,224,0.08)",
                      border: "1px solid rgba(241,236,224,0.12)",
                      color: "#f1dfcc",
                    }}
                  >
                    {row[1]}
                  </span>
                </td>
                <td style={{ color: "#e2dccf" }}>{row[2]}</td>
              </Reveal>
            ))}
          </tbody>
        </table>
      </div>

      <Reveal
        d={860}
        v="up"
        className="mt-[24px] flex items-start gap-[16px] rounded-[12px] border border-[#e9c9b6]/22 px-[24px] py-[18px] text-[19px] leading-[1.48]"
        style={{ background: "rgba(244,240,230,0.07)" }}
      >
        <span className="mt-[4px] block h-[26px] w-[3px] shrink-0 rounded-full bg-[#e3b18a]" />
        <p style={{ color: "#ded8ca" }}>
          SHAP chỉ mô tả hành vi mô hình, không chứng minh cột nào gây ra việc
          hủy; tháng và quốc gia cần kiểm tra thêm vì val diễn ra sau train.
        </p>
      </Reveal>
    </SlideShell>
  );
}

/* ================================================================== */
/* 13 — Web demo                                                       */
/* ================================================================== */

const pages = [
  ["Dự đoán", "Nhập một đơn, xem mức nguy cơ và lý do", "spark"],
  ["Chấm hàng loạt", "Tải danh sách đơn, nhận bảng xếp hạng", "layers"],
  ["Một tuần vận hành", "Mô phỏng overbook theo mô hình", "calendar"],
  ["Kết quả mô hình", "Chi phí từng mô hình trên test", "chart"],
  ["Thử mức chi phí", "Kéo r, xem đường chi phí theo ngưỡng", "slider"],
  ["Giới hạn, Về dự án", "Hạn chế đã biết, giải thích thuật ngữ", "info"],
];

export function Slide13() {
  return (
    <SlideShell>
      <CornerArc />
      <SlideHead
        title="Web demo SmartStay AI"
        sub={
          <T delay={220} each={45}>
            Streamlit, 7 trang, dùng đúng mô hình và ngưỡng đã khóa của
            protocol-v1
          </T>
        }
      />

      <div className="mt-[22px] flex flex-1 flex-col justify-center">
        <Reveal d={300} v="up" className="overflow-hidden rounded-[18px] border border-[#cfc4b2] bg-white/50 shadow-[0_22px_50px_-42px_rgba(18,44,38,0.7)]">
          <div className="grid grid-cols-[36%_64%] bg-ink text-[#f3eddf]">
            <div className="px-[26px] py-[15px] text-[14.5px] font-medium uppercase tracking-[0.17em]">
              Trang
            </div>
            <div className="border-l border-[#f3eddf]/12 px-[26px] py-[15px] text-[14.5px] font-medium uppercase tracking-[0.17em]">
              Chức năng
            </div>
          </div>

          {pages.map((page, i) => (
            <Reveal
              key={page[0]}
              d={380 + i * 75}
              v="left"
              className="grid grid-cols-[36%_64%] border-b border-[#ded4c3] last:border-b-0"
            >
              <div className="flex items-center gap-[14px] px-[26px] py-[24px]">
                <span
                  className="flex h-[40px] w-[40px] shrink-0 items-center justify-center rounded-[10px]"
                  style={{
                    background:
                      i === 0 ? "rgba(185,87,47,0.1)" : "rgba(47,113,99,0.08)",
                    border:
                      i === 0
                        ? "1px solid rgba(185,87,47,0.22)"
                        : "1px solid rgba(47,113,99,0.18)",
                  }}
                >
                  <PageIcon name={page[2]} />
                </span>
                <span
                  className="font-display"
                  style={{
                    fontSize: 23,
                    fontWeight: 600,
                    color: i === 0 ? "#8f4526" : "#173f38",
                    lineHeight: 1.2,
                  }}
                >
                  {page[0]}
                </span>
              </div>
              <div className="flex items-center border-l border-[#ded4c3] px-[26px] py-[24px]">
                <p className="text-[19px] leading-[1.4] text-[#43514a]">
                  {page[1]}
                </p>
              </div>
            </Reveal>
          ))}
        </Reveal>

        <Reveal d={880} v="up" className="mt-[20px] flex items-center justify-between">
          <span className="block h-[1px] flex-1 bg-[#d8cfbf]" />
          <span
            aria-hidden="true"
            className="mx-[18px] flex items-center gap-[6px]"
          >
            <span className="block h-[5px] w-[5px] rounded-full bg-[#2f7163]/50" />
            <span className="block h-[5px] w-[5px] rounded-full bg-[#b9572f]" />
            <span className="block h-[5px] w-[5px] rounded-full bg-[#2f7163]/50" />
          </span>
          <span className="block h-[1px] flex-1 bg-[#d8cfbf]" />
        </Reveal>
      </div>
    </SlideShell>
  );
}

/* ================================================================== */
/* 14 — Hạn chế                                                        */
/* ================================================================== */

const limitations = [
  "Chi phí r chỉ là giả định, chưa có số liệu thật của khách sạn",
  "Xác suất MLP chưa hiệu chỉnh; tỉ lệ hủy trôi 24% → 28% → 32%",
  "Điểm val lạc quan (33 lần thử); ngưỡng dao động 0,43–0,70 giữa các seed",
  "Train-only: bốn tháng val gần test nhất không dùng để huấn luyện",
  "Chỉ hai khách sạn, giai đoạn 2015–2017",
  "Loại special_requests có thể làm mất 0,05–0,08 PR-AUC",
  "Xóa dòng trùng khi không có mã đặt phòng nên không rõ là bản ghi lặp hay đơn thật",
];

export function Slide14() {
  return (
    <SlideShell dark tight>
      <img
        src="/images/hotel-corridor.jpg"
        alt=""
        className="kenburns absolute inset-0 h-full w-full object-cover opacity-[0.22]"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(104deg, rgba(7,25,22,0.96) 0%, rgba(8,27,24,0.9) 44%, rgba(8,27,24,0.6) 100%)",
        }}
      />
      <CornerArc dark />

      <SlideHead
        dark
        title="Hạn chế"
        sub="Những điều khiến kết quả chưa thể dùng để ra quyết định"
        size="sm"
      />

      <div className="relative z-10 mt-[26px] grid flex-1 grid-cols-2 content-start gap-x-[30px] gap-y-[14px]">
        {limitations.map((item, i) => (
          <Reveal
            key={item}
            d={260 + i * 85}
            v={i % 2 === 0 ? "right" : "up"}
            className={
              i === limitations.length - 1
                ? "col-span-2 flex items-start gap-[16px] rounded-[13px] border border-[#f1ece0]/16 px-[22px] py-[17px]"
                : "flex items-start gap-[16px] rounded-[13px] border border-[#f1ece0]/16 px-[22px] py-[17px]"
            }
            style={{ background: "rgba(247,243,234,0.055)" }}
          >
            <span
              aria-hidden="true"
              className="mt-[7px] flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-full border border-[#e3b18a]/45"
            >
              <span className="block h-[5px] w-[5px] rotate-45 bg-[#e3b18a]" />
            </span>
            <p
              className="text-[18.5px] leading-[1.42]"
              style={{ color: "#e7e1d4" }}
            >
              <T delay={300 + i * 85}>{item}</T>
            </p>
          </Reveal>
        ))}
      </div>
    </SlideShell>
  );
}

/* ================================================================== */
/* 15 — Kết luận                                                       */
/* ================================================================== */

const conclusions = [
  {
    title: "Đã thực hiện",
    body: "Xây dựng quy trình từ xử lý dữ liệu, so sánh mô hình, các kịch bản thử nghiệm đến web demo.",
    icon: "layers",
  },
  {
    title: "Kết quả dự đoán",
    body: "MLP đạt PR-AUC 0,616 trên test; nhận diện 49,5% đơn hủy tại ngưỡng 0,43.",
    icon: "spark",
  },
  {
    title: "Kết quả nghiệp vụ",
    body: "Ở r = 2, chi phí MLP là 12.071, tệ hơn 19,5% so với không overbook (chi phí 10.102).",
    icon: "chart",
  },
];

export function Slide15() {
  return (
    <SlideShell dark tight>
      <img
        src="/images/hotel-hero.jpg"
        alt=""
        className="kenburns absolute inset-0 h-full w-full object-cover opacity-40"
        style={{ objectPosition: "60% 48%" }}
      />
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(105deg, rgba(7,24,21,0.95) 0%, rgba(8,28,25,0.9) 46%, rgba(8,28,25,0.72) 100%), linear-gradient(0deg, rgba(5,18,16,0.8), transparent 55%)",
        }}
      />
      <CornerArc dark />

      <SlideHead
        dark
        title="Kết luận"
        sub="Dự đoán rủi ro và mô phỏng chi phí: kết quả và ý nghĩa"
      />

      <div className="relative z-10 mt-[30px] grid grid-cols-3 gap-[20px]">
        {conclusions.map((card, i) => (
          <Reveal
            key={card.title}
            d={320 + i * 140}
            v="up"
            className="relative overflow-hidden rounded-[18px] border border-[#f1ece0]/20 px-[26px] py-[24px]"
            style={{
              background:
                "linear-gradient(155deg, rgba(245,240,229,0.11), rgba(245,240,229,0.04))",
              minHeight: 252,
            }}
          >
            <div className="flex items-center justify-between">
              <span
                className="flex h-[42px] w-[42px] items-center justify-center rounded-[10px] border border-[#e3b18a]/28"
                style={{ background: "rgba(227,177,138,0.1)" }}
              >
                <PageIcon name={card.icon} dark />
              </span>
              <span
                className="block h-[1px] w-[64px]"
                style={{ background: "rgba(241,236,224,0.28)" }}
              />
            </div>
            <h3
              className="mt-[20px] font-display"
              style={{ fontSize: 27, fontWeight: 500, color: "#f7f1e4" }}
            >
              {card.title}
            </h3>
            <p className="mt-[10px] text-[19px] leading-[1.5]" style={{ color: "#d7d2c5" }}>
              <T delay={430 + i * 140} duration={1250}>
                {card.body}
              </T>
            </p>
          </Reveal>
        ))}
      </div>

      <div className="relative z-10 mb-[10px] mt-auto">
        <Reveal d={900} v="line" className="mb-[22px] h-[1px] w-full bg-[#f1ece0]/22" />
        <Reveal d={980} v="up" className="max-w-[1130px]">
          <p
            className="font-display italic"
            style={{ fontSize: 36, lineHeight: 1.24, color: "#f5eadd" }}
          >
            Dự đoán tốt chưa chắc tạo ra quyết định có lợi về chi phí.
          </p>
        </Reveal>
        <Reveal d={1100} v="up" className="mt-[18px] flex items-center gap-[14px]">
          <span className="block h-[1px] w-[46px] bg-[#e3b18a]/60" aria-hidden="true" />
          <p className="text-[16.5px] leading-[1.5]" style={{ color: "#b9c6bd" }}>
            Chi phí dựa trên mô phỏng và các giả định của nhóm.
          </p>
        </Reveal>
      </div>
    </SlideShell>
  );
}

/* ================================================================== */
/* 16 — Hướng phát triển tiếp theo                                     */
/* ================================================================== */

const roadmap = [
  [
    "Dùng chi phí thật",
    "Lấy c_walk (đền bù, đổi phòng) và c_empty (doanh thu phòng trống) từ khách sạn thật, thay cho r = 2 giả định",
    "Biết overbooking có lợi hay không",
  ],
  [
    "Tối ưu theo chi phí",
    "Chọn mô hình và ngưỡng theo chi phí trên dữ liệu gần thời điểm triển khai, không chỉ theo PR-AUC",
    "MLP xếp hạng tốt nhưng chi phí tệ hơn mốc",
  ],
  [
    "Xử lý drift",
    "Backtest trượt theo tháng, huấn luyện lại định kỳ, hiệu chỉnh xác suất trên dữ liệu mới nhất",
    "Tỉ lệ hủy trôi 24% → 32%",
  ],
  [
    "Ổn định kết quả",
    "Trung bình nhiều seed, chọn ngưỡng từ nhiều lần chạy thay vì một lần",
    "Ngưỡng dao động 0,43–0,70",
  ],
  [
    "Tách theo khách sạn",
    "Ngưỡng riêng cho City và Resort; thêm đặc trưng như mùa vụ, giá phòng",
    "Resort chỉ đạt recall 0,27",
  ],
];

export function Slide16() {
  return (
    <SlideShell>
      <CornerArc />
      <SlideHead title="Hướng phát triển tiếp theo" size="sm" />

      <div className="mt-[26px] flex-1">
        <table className="dt" style={{ fontSize: 18.5 }}>
          <colgroup>
            <col style={{ width: "17%" }} />
            <col style={{ width: "46%" }} />
            <col style={{ width: "37%" }} />
          </colgroup>
          <thead>
            <tr>
              <th>Hướng</th>
              <th>Việc cần làm</th>
              <th>Vấn đề giải quyết</th>
            </tr>
          </thead>
          <tbody>
            {roadmap.map((row, i) => (
              <Reveal as="tr" key={row[0]} d={260 + i * 105} v="left">
                <td
                  className="strong"
                  style={{
                    paddingTop: 33,
                    paddingBottom: 33,
                    boxShadow: "inset 2px 0 0 #bfd2c8",
                  }}
                >
                  {row[0]}
                </td>
                <td style={{ color: "#42504a" }}>
                  <T delay={310 + i * 105} each={45}>
                    {row[1]}
                  </T>
                </td>
                <td>
                  <span
                    className="inline-flex items-center gap-[10px] rounded-[8px] px-[12px] py-[8px] text-[17px]"
                    style={{
                      background:
                        i === 4 ? "rgba(185,87,47,0.1)" : "rgba(47,113,99,0.08)",
                      color: i === 4 ? "#8f4526" : "#275e52",
                    }}
                  >
                    <svg
                      aria-hidden="true"
                      viewBox="0 0 16 16"
                      className="h-[12px] w-[12px]"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                    >
                      <path d="M2 8h11M9 3.8 13.2 8 9 12.2" />
                    </svg>
                    <T delay={340 + i * 105} each={40}>
                      {row[2]}
                    </T>
                  </span>
                </td>
              </Reveal>
            ))}
          </tbody>
        </table>
      </div>
      <Reveal d={840} v="line" className="mt-[18px] h-[1px] w-full bg-[#d8cfbf]" />
    </SlideShell>
  );
}
