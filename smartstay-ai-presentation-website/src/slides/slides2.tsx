import { CornerArc, Note, Reveal, T } from "@/components/primitives";
import { SlideHead, SlideShell } from "./shared";

/* ================================================================== */
/* 07 — Kết quả của chín thực nghiệm                                   */
/* ================================================================== */

const results = [
  [
    "E1",
    "MLP cao nhất, PR-AUC val 0,631; LogReg 0,573, Tree 0,508",
    "Chọn MLP v2 làm mô hình chính",
  ],
  [
    "E2",
    "LogReg: recall 0,148 → 0,537, PR-AUC giảm nhẹ; LightGBM: 0,546 → 0,576",
    "Chỉ SMOTENC có ích, cho LightGBM",
  ],
  [
    "E3",
    "Giữ trùng: PR-AUC báo cáo 0,803 so với 0,571, kém hơn ~0,01 trên val sạch",
    "Xóa dòng trùng",
  ],
  [
    "E4",
    "adr đóng góp nhỏ; special_requests +0,081 (LogReg), +0,049 (RF)",
    "Giữ adr; loại special_requests (nghi rò rỉ)",
  ],
  [
    "E5",
    "Random Forest: PR-AUC 0,685 (ngẫu nhiên) so với 0,592 (theo thời gian)",
    "Chia theo thời gian",
  ],
  [
    "E6",
    "Random Forest: 0,413 (City → Resort), 0,464 (Resort → City), 0,585 (cả hai)",
    "Mô hình kém khi chuyển khách sạn",
  ],
  [
    "E7",
    "LightGBM, sigmoid: Brier 0,210 → 0,185; ROC-AUC không đổi (0,705)",
    "Không dùng cho mô hình chính",
  ],
  [
    "E8",
    "Ngưỡng khóa trên val ở r = 2: MLP v2 là 0,43, chi phí val 3.757",
    "Đánh giá trên test ở các slide sau",
  ],
  [
    "E9",
    "SHAP top 5: country, tháng đến, agent, lead_time, market_segment",
    "Sai nhiều nhất ở nhóm không đặt cọc",
  ],
];

export function Slide07() {
  return (
    <SlideShell tight>
      <CornerArc />
      <SlideHead title="Kết quả của chín thực nghiệm" size="sm" />

      <div className="mt-[22px] flex-1">
        <table className="dt" style={{ fontSize: 18 }}>
          <colgroup>
            <col style={{ width: "6.5%" }} />
            <col style={{ width: "54%" }} />
            <col style={{ width: "39.5%" }} />
          </colgroup>
          <thead>
            <tr>
              <th>#</th>
              <th>Kết quả chính</th>
              <th>Quyết định / kết luận</th>
            </tr>
          </thead>
          <tbody>
            {results.map((row, i) => (
              <Reveal as="tr" key={row[0]} d={200 + i * 65} v="left">
                <td style={{ paddingTop: 12, paddingBottom: 12 }}>
                  <span
                    className="inline-flex h-[30px] min-w-[44px] items-center justify-center rounded-full px-[8px] text-[14.5px] font-semibold"
                    style={{
                      background:
                        row[0] === "E8" ? "#f2dfd2" : "rgba(47,113,99,0.09)",
                      color: row[0] === "E8" ? "#96482a" : "#2b6155",
                      border:
                        row[0] === "E8"
                          ? "1px solid #ddb99f"
                          : "1px solid rgba(47,113,99,0.18)",
                    }}
                  >
                    {row[0]}
                  </span>
                </td>
                <td style={{ color: "#2c3b35" }}>
                  <T delay={260 + i * 65} each={55}>
                    {row[1]}
                  </T>
                </td>
                <td
                  className="strong"
                  style={{ fontWeight: 500, color: "#1c3f37" }}
                >
                  <T delay={300 + i * 65} each={55}>
                    {row[2]}
                  </T>
                </td>
              </Reveal>
            ))}
          </tbody>
        </table>
      </div>

      <Reveal d={880} v="line" className="mt-[18px] h-[1px] w-full bg-[#d8cfbf]" />
    </SlideShell>
  );
}

/* ================================================================== */
/* 08 — So sánh mô hình trên validation                                */
/* ================================================================== */

const validation = [
  ["Dummy", "Mốc cơ sở để đối chiếu", "0,284", "0,500", "không đoán hủy", 0.284],
  [
    "Logistic Regression",
    "Mô hình tuyến tính, dễ diễn giải",
    "0,573",
    "0,784",
    "0,67",
    0.573,
  ],
  [
    "Decision Tree",
    "Mô hình dạng cây, dễ quan sát các quy tắc",
    "0,508",
    "0,767",
    "0,60",
    0.508,
  ],
  [
    "LightGBM + SMOTENC",
    "Mô hình boosting kết hợp xử lý mất cân bằng lớp",
    "0,575",
    "0,771",
    "0,58",
    0.575,
  ],
  [
    "MLP",
    "Mạng nơ-ron học các quan hệ phi tuyến",
    "0,631",
    "0,813",
    "0,43",
    0.631,
  ],
];

export function Slide08() {
  return (
    <SlideShell>
      <CornerArc />
      <SlideHead
        title="So sánh mô hình trên tập validation (kiểm định)"
        sub="Mọi mô hình huấn luyện trên train; điểm dưới đây tính trên val, chọn theo PR-AUC"
      />

      <div className="mt-[28px] flex-1">
        <table className="dt" style={{ fontSize: 19 }}>
          <colgroup>
            <col style={{ width: "19%" }} />
            <col style={{ width: "41%" }} />
            <col style={{ width: "14%" }} />
            <col style={{ width: "13%" }} />
            <col style={{ width: "13%" }} />
          </colgroup>
          <thead>
            <tr>
              <th>Mô hình</th>
              <th>Đặc điểm mô hình</th>
              <th className="num">PR-AUC</th>
              <th className="num">ROC-AUC</th>
              <th className="num">Ngưỡng r = 2</th>
            </tr>
          </thead>
          <tbody>
            {validation.map((row, i) => (
              <Reveal as="tr" key={row[0]} d={280 + i * 95} v="left">
                <td
                  className="strong"
                  style={{
                    paddingTop: 19,
                    paddingBottom: 19,
                    fontSize: 19.5,
                    boxShadow:
                      row[0] === "MLP"
                        ? "inset 3px 0 0 #b9572f"
                        : undefined,
                    background:
                      row[0] === "MLP" ? "rgba(233,201,182,0.3)" : undefined,
                  }}
                >
                  {row[0]}
                </td>
                <td style={{ color: "#41504a" }}>{row[1]}</td>
                <td className="num">
                  <span
                    className="inline-block min-w-[54px] text-right font-semibold"
                    style={{ color: row[0] === "MLP" ? "#a34d29" : "#24594e" }}
                  >
                    <T delay={340 + i * 95}>{row[2]}</T>
                  </span>
                  <div className="mt-[5px] ml-auto h-[2px] w-[64px] overflow-hidden rounded-full bg-[#e4dccd]">
                    <div
                      className="bar-grow h-full rounded-full"
                      style={{
                        width: `${(Number(row[5]) / 0.65) * 100}%`,
                        background:
                          row[0] === "MLP" ? "#b9572f" : "#6f9e8f",
                        animationDelay: `${520 + i * 95}ms`,
                      }}
                    />
                  </div>
                </td>
                <td className="num" style={{ color: "#3b4a44" }}>
                  <T delay={360 + i * 95}>{row[3]}</T>
                </td>
                <td className="num" style={{ color: "#3b4a44" }}>
                  <T delay={380 + i * 95}>{row[4]}</T>
                </td>
              </Reveal>
            ))}
          </tbody>
        </table>
      </div>

      <Note d={820} tone="dark" className="mt-[22px]">
        <span className="mt-[8px] block h-[5px] w-[5px] shrink-0 rounded-full bg-[#e3b18a]" />
        <p>
          MLP đạt PR-AUC cao nhất trên validation và được chọn làm mô hình chính.
          Tuy nhiên, MLP được tinh chỉnh nhiều hơn các mô hình còn lại.
        </p>
      </Note>
    </SlideShell>
  );
}

/* ================================================================== */
/* 09 — Kết quả phân loại trên test                                    */
/* ================================================================== */

const testRows = [
  ["Dummy", "0,99", "0,320", "0,500", "0", "0"],
  ["Logistic Regression", "0,67", "0,594", "0,779", "0,733", "0,097"],
  ["Decision Tree", "0,60", "0,505", "0,731", "0,977", "0,033"],
  ["LightGBM + SMOTENC", "0,58", "0,611", "0,785", "0,684", "0,217"],
  ["MLP", "0,43", "0,616", "0,793", "0,589", "0,495"],
];

export function Slide09() {
  return (
    <SlideShell>
      <CornerArc />
      <SlideHead
        title="Kết quả phân loại trên test"
        sub={
          <T delay={220} each={55}>
            31.529 đơn mô hình chưa từng thấy, tỉ lệ hủy 32,0% (mốc PR-AUC của
            Dummy)
          </T>
        }
      />

      <div className="mt-[28px] flex-1">
        <table className="dt" style={{ fontSize: 19.5 }}>
          <colgroup>
            <col style={{ width: "26%" }} />
            <col style={{ width: "12%" }} />
            <col style={{ width: "14%" }} />
            <col style={{ width: "15%" }} />
            <col style={{ width: "16%" }} />
            <col style={{ width: "17%" }} />
          </colgroup>
          <thead>
            <tr>
              <th>Mô hình</th>
              <th className="num">Ngưỡng</th>
              <th className="num">PR-AUC</th>
              <th className="num">ROC-AUC</th>
              <th className="num">Precision</th>
              <th className="num">Recall</th>
            </tr>
          </thead>
          <tbody>
            {testRows.map((row, i) => (
              <Reveal as="tr" key={row[0]} d={280 + i * 100} v="left">
                <td
                  className="strong"
                  style={{
                    paddingTop: 23,
                    paddingBottom: 23,
                    fontSize: 20,
                    boxShadow:
                      row[0] === "MLP"
                        ? "inset 3px 0 0 #b9572f"
                        : undefined,
                    background:
                      row[0] === "MLP" ? "rgba(233,201,182,0.3)" : undefined,
                  }}
                >
                  {row[0]}
                </td>
                {row.slice(1).map((cell, cellIndex) => (
                  <td
                    key={cellIndex}
                    className="num"
                    style={{
                      color:
                        row[0] === "MLP"
                          ? cellIndex === 4
                            ? "#a34d29"
                            : "#1d4038"
                          : "#3b4a44",
                      fontWeight: row[0] === "MLP" ? 600 : 400,
                    }}
                  >
                    <T delay={340 + i * 100 + cellIndex * 45} each={0}>
                      {cell}
                    </T>
                  </td>
                ))}
              </Reveal>
            ))}
          </tbody>
        </table>
      </div>

      <Note d={820} tone="dark" className="mt-[24px]">
        <span className="mt-[8px] block h-[5px] w-[5px] shrink-0 rounded-full bg-[#e3b18a]" />
        <p>
          <T delay={880}>
            MLP đứng đầu PR-AUC và ROC-AUC. Tree và LogReg có precision cao
            nhưng bỏ sót gần hết đơn hủy (recall ≤ 0,10).
          </T>
        </p>
      </Note>
    </SlideShell>
  );
}

/* ================================================================== */
/* 10 — Chi phí overbooking trên test                                  */
/* ================================================================== */

const costs = [
  { label: "Không overbook", value: "10.102", width: 77.7, tone: "base" },
  { label: "Logistic Regression", value: "9.835", width: 75.65, tone: "model" },
  { label: "Decision Tree", value: "9.781", width: 75.24, tone: "model" },
  { label: "LightGBM + SMOTENC", value: "9.938", width: 76.45, tone: "model" },
  { label: "MLP v2", value: "12.071", width: 92.85, tone: "alert" },
];

export function Slide10() {
  return (
    <SlideShell>
      <CornerArc />
      <SlideHead
        title={
          <>
            Chi phí overbooking trên test (r = <T delay={320}>2</T>)
          </>
        }
        sub={
          <T delay={220} each={55}>
            Không overbook tốn 10.102 (chi phí), bằng số đơn hủy thật. Thấp hơn
            nghĩa là có lợi
          </T>
        }
      />

      <Reveal
        d={290}
        v="up"
        className="relative mt-[26px] flex-1 overflow-hidden rounded-[22px] bg-ink px-[38px] py-[36px]"
      >
        <div
          aria-hidden="true"
          className="absolute inset-y-[28px] right-[146px] w-[calc(100%-538px)]"
        >
          <span
            className="absolute inset-y-0 border-l border-dashed border-[#efe9dc]/25"
            style={{ left: "77.7%" }}
          />
        </div>

        <div className="relative flex h-full flex-col justify-between">
          {costs.map((row, i) => (
            <Reveal
              key={row.label}
              d={360 + i * 120}
              v="left"
              className="flex items-center gap-[22px]"
            >
              <div
                className="w-[248px] shrink-0 text-right text-[19px]"
                style={{
                  color: row.tone === "alert" ? "#f2c9ac" : "#dcd6c8",
                  fontWeight: row.tone === "alert" ? 600 : 400,
                }}
              >
                {row.label}
              </div>
              <div className="relative h-[34px] flex-1">
                <div className="absolute inset-0 overflow-hidden rounded-[3px] bg-[#f4efe4]/[0.055]">
                  <div
                    className="bar-grow h-full rounded-r-[3px]"
                    style={{
                      width: `${row.width}%`,
                      background:
                        row.tone === "alert"
                          ? "linear-gradient(90deg, #b9572f, #d5774a)"
                          : row.tone === "base"
                            ? "#8c9f94"
                            : "linear-gradient(90deg, #3f7869, #79a696)",
                      animationDelay: `${520 + i * 120}ms`,
                    }}
                  />
                </div>
              </div>
              <div
                className="w-[92px] shrink-0 text-right"
                style={{
                  fontSize: row.tone === "alert" ? 25 : 23,
                  fontWeight: row.tone === "alert" ? 600 : 500,
                  color: row.tone === "alert" ? "#f4c9a6" : "#f0eadf",
                  fontVariantNumeric: "tabular-nums",
                }}
              >
                <T delay={620 + i * 120} duration={1250}>
                  {row.value}
                </T>
              </div>
            </Reveal>
          ))}
        </div>
      </Reveal>

      <Reveal
        d={1050}
        v="up"
        className="mt-[22px] flex items-start gap-[16px] rounded-[12px] px-[24px] py-[17px] text-[19px] leading-[1.45]"
        style={{ background: "#f2e2d6", border: "1px solid #e2c7b4" }}
      >
        <span className="mt-[4px] block h-[26px] w-[3px] shrink-0 rounded-full bg-[#b9572f]" />
        <p style={{ color: "#5d3620" }}>
          <T delay={1120}>
            MLP tốn hơn 19,5%: ngưỡng 0,43 overbook nhầm 3.483 đơn (FP × 2 =
            6.966) cộng 5.105 đơn hủy bị bỏ lỡ.
          </T>
        </p>
      </Reveal>
    </SlideShell>
  );
}

/* ================================================================== */
/* 11 — Độ nhạy theo r                                                 */
/* ================================================================== */

const sensitivity = [
  ["0,5", "0,18", "5.809", "tiết kiệm 42,49%", "save"],
  ["1", "0,26", "9.271", "tiết kiệm 8,23%", "save"],
  ["2", "0,43", "12.071", "tệ hơn 19,5%", "loss"],
  ["3", "0,57", "10.509", "tệ hơn 4,03%", "loss"],
  ["5", "0,79", "9.795", "tiết kiệm 3,04%", "save"],
];

export function Slide11() {
  return (
    <SlideShell>
      <CornerArc />
      <SlideHead
        title="Độ nhạy theo r"
        sub="Mỗi r có ngưỡng riêng, chọn trên val và khóa trước khi mở test"
      />

      <div className="mt-[28px] flex-1">
        <table className="dt" style={{ fontSize: 20 }}>
          <colgroup>
            <col style={{ width: "8%" }} />
            <col style={{ width: "21%" }} />
            <col style={{ width: "21%" }} />
            <col style={{ width: "50%" }} />
          </colgroup>
          <thead>
            <tr>
              <th>r</th>
              <th className="num">Ngưỡng khóa</th>
              <th className="num">Chi phí test</th>
              <th>
                So với không overbook (
                <T delay={260} duration={1200} className="!font-normal">
                  10.102
                </T>
                )
              </th>
            </tr>
          </thead>
          <tbody>
            {sensitivity.map((row, i) => (
              <Reveal
                as="tr"
                key={row[0]}
                d={280 + i * 100}
                v="left"
                className={row[0] === "2" ? "spot" : undefined}
              >
                <td className="strong" style={{ paddingTop: 21, paddingBottom: 21 }}>
                  <span
                    className="inline-flex h-[38px] min-w-[44px] items-center justify-center rounded-full px-[10px]"
                    style={{
                      background: row[0] === "2" ? "#b9572f" : "#edf1ee",
                      color: row[0] === "2" ? "#fbf6ec" : "#2b5f53",
                      fontSize: 18,
                      fontWeight: 600,
                    }}
                  >
                    <T delay={330 + i * 100}>{row[0]}</T>
                  </span>
                </td>
                <td className="num" style={{ color: "#3b4a44", fontWeight: 500 }}>
                  <T delay={350 + i * 100}>{row[1]}</T>
                </td>
                <td className="num strong" style={{ color: "#1d4038" }}>
                  <T delay={370 + i * 100}>{row[2]}</T>
                </td>
                <td>
                  <span
                    className="inline-flex items-center gap-[10px] rounded-full px-[14px] py-[7px] text-[18px] font-medium"
                    style={{
                      background:
                        row[4] === "save"
                          ? "rgba(47,113,99,0.1)"
                          : "rgba(185,87,47,0.12)",
                      color: row[4] === "save" ? "#246053" : "#984626",
                    }}
                  >
                    <span
                      aria-hidden="true"
                      className="flex h-[18px] w-[18px] items-center justify-center rounded-full"
                      style={{
                        background:
                          row[4] === "save"
                            ? "rgba(47,113,99,0.16)"
                            : "rgba(185,87,47,0.16)",
                      }}
                    >
                      <svg
                        viewBox="0 0 12 12"
                        className="h-[9px] w-[9px]"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                      >
                        {row[4] === "save" ? (
                          <path d="M6 9.5V2.5M3 5.5 6 2.5l3 3" />
                        ) : (
                          <path d="M6 2.5v7M3 6.5l3 3 3-3" />
                        )}
                      </svg>
                    </span>
                    <T delay={390 + i * 100}>{row[3]}</T>
                  </span>
                </td>
              </Reveal>
            ))}
          </tbody>
        </table>
      </div>

      <Reveal
        d={880}
        v="up"
        className="mt-[26px] flex items-start gap-[16px] rounded-[12px] px-[24px] py-[18px] text-[19px] leading-[1.45]"
        style={{ background: "rgba(255,255,255,0.55)", border: "1px solid #d8cfbf" }}
      >
        <span className="mt-[4px] block h-[26px] w-[3px] shrink-0 rounded-full bg-[#2f7163]" />
        <p style={{ color: "#3f4d46" }}>
          <T delay={950}>
            Lưu ý: Hiệu quả phụ thuộc vào mức chi phí giả định; kết quả cần được
            kiểm tra thêm với dữ liệu và chi phí thực tế.
          </T>
        </p>
      </Reveal>
    </SlideShell>
  );
}
