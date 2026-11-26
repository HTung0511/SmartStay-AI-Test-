import { BedDouble, BrainCircuit, CalendarX2, ClipboardCheck, Coins, DoorOpen, Target } from "lucide-react";
import type { ReactNode } from "react";
import bandBell from "../assets/b-bell.jpg";
import bandPlanner from "../assets/b-planner.jpg";
import bandCheckin from "../assets/b-checkin.jpg";
import bandDark from "../assets/b-dark.jpg";
import conclusionBg from "../assets/conclusion-bg.jpg";
import { Card, CountUp, DataTable, NoteBar, SlideShell, dl } from "./ui";

function IconBadge({ children }: { children: ReactNode }) {
  return (
    <span className="absolute right-7 top-7 flex h-[64px] w-[64px] items-center justify-center rounded-full bg-navy text-gold-soft shadow-lg">
      {children}
    </span>
  );
}

/* ------------------------------ Slide 3 ------------------------------ */
export function ProblemSlide() {
  return (
    <SlideShell
      band={bandBell}
      title="Bài toán: overbooking khi nào có lợi?"
      subtitle="Dự đoán hủy chỉ có giá trị khi biến được thành quyết định bán thêm phòng"
    >
      <div className="grid h-[262px] grid-cols-2 gap-[26px]">
        <Card delay={200} className="relative px-10 py-7">
          <IconBadge>
            <CalendarX2 size={32} strokeWidth={1.8} aria-hidden="true" />
          </IconBadge>
          <div className="text-[122px] font-extrabold leading-[1] tracking-[-0.02em] text-teal tabular-nums">
            <CountUp text="37,0%" delay={250} />
          </div>
          <p className="mt-3 max-w-[560px] text-[27px] leading-[1.35]">
            đơn đặt phòng gốc bị hủy (27,7% sau làm sạch), mỗi đơn để lại một phòng trống
          </p>
        </Card>
        <Card delay={330} className="relative px-10 py-8">
          <IconBadge>
            <BrainCircuit size={32} strokeWidth={1.8} aria-hidden="true" />
          </IconBadge>
          <h3 className="pr-24 text-[36px] font-bold leading-[1.2]">Dự đoán lúc đặt</h3>
          <p className="mt-5 text-[28px] leading-[1.4]">
            Mô hình chấm nguy cơ hủy cho từng đơn; vượt ngưỡng thì overbook đúng một phòng
          </p>
        </Card>
      </div>
      <div className="mt-[26px] grid h-[204px] grid-cols-2 gap-[26px]">
        <Card delay={460} className="relative px-10 py-8">
          <IconBadge>
            <BedDouble size={32} strokeWidth={1.8} aria-hidden="true" />
          </IconBadge>
          <h3 className="pr-24 text-[36px] font-bold leading-[1.2]">FP: overbook nhầm</h3>
          <p className="mt-4 text-[28px] leading-[1.4]">Khách vẫn đến nhưng hết phòng, tốn r</p>
        </Card>
        <Card delay={590} className="relative px-10 py-8">
          <IconBadge>
            <DoorOpen size={32} strokeWidth={1.8} aria-hidden="true" />
          </IconBadge>
          <h3 className="pr-24 text-[36px] font-bold leading-[1.2]">FN: bỏ lỡ</h3>
          <p className="mt-4 text-[28px] leading-[1.4]">Khách hủy, phòng trống, tốn 1</p>
        </Card>
      </div>
      <NoteBar delay={800} className="mt-[26px] py-[28px]! text-[29px]!">
        <strong className="font-bold">Công thức tính chi phí: Cost(t) = r·FP + FN</strong>. Mức chính r = 2 (giả định của nhóm)
      </NoteBar>
    </SlideShell>
  );
}

/* ------------------------------ Slide 4 ------------------------------ */
export function DataSlide() {
  return (
    <SlideShell
      band={bandPlanner}
      title="Dữ liệu Hotel Booking Demand"
      subtitle={
        "Antonio, Almeida & Nunes (2019), Data in Brief 22, 41–50. Hai khách sạn City và Resort, 07/2015–08/2017"
      }
    >
      <div className="grid grid-cols-[1fr_1.3fr] gap-[26px]">
        <Card delay={200} className="px-10 py-6">
          <div className="text-[96px] font-extrabold leading-[1] tracking-[-0.02em] text-teal tabular-nums">
            <CountUp text="119.390" delay={250} />
          </div>
          <p className="mt-3 text-[27px] leading-[1.3]">bản ghi gốc × 32 cột, hủy 37,0%</p>
        </Card>
        <Card delay={340} className="px-10 py-6">
          <div className="text-[96px] font-extrabold leading-[1] tracking-[-0.02em] text-teal tabular-nums">
            <CountUp text="86.617" delay={400} />
          </div>
          <p className="mt-3 text-[26px] leading-[1.3]">bản ghi × 25 cột sau 34 bước làm sạch, hủy 27,7%</p>
        </Card>
      </div>
      <p className="rv mb-[14px] mt-[30px] text-[30px] font-semibold" style={dl(500)}>
        Chia dữ liệu theo thời gian
      </p>
      <DataTable
        size="lg"
        delay={600}
        columns={[
          { label: "Tập", w: "190px" },
          { label: "Giai đoạn", w: "1.3fr" },
          { label: "Số dòng", w: "1fr" },
          { label: "Tỉ lệ hủy", w: "1fr" },
          { label: "Dùng để", w: "1.6fr" },
        ]}
        rows={[
          ["Train", "07/2015–08/2016", "40.688", "24,0%", "Huấn luyện"],
          ["Val", "09–12/2016", "14.400", "28,4%", "Chọn mô hình, ngưỡng"],
          ["Test", "01–08/2017", "31.529", "32,0%", "Kiểm tra"],
        ]}
      />
    </SlideShell>
  );
}

/* ------------------------------ Slide 10 ----------------------------- */
const MAX = 12071;
const TRACK = 880;
const COST_BARS = [
  { label: "Không overbook", value: "10.102", n: 10102, color: "#8a97a3" },
  { label: "Logistic Regression", value: "9.835", n: 9835, color: "#1a7f7a" },
  { label: "Decision Tree", value: "9.781", n: 9781, color: "#1a7f7a" },
  { label: "LightGBM + SMOTENC", value: "9.938", n: 9938, color: "#1a7f7a" },
  { label: "MLP v2", value: "12.071", n: 12071, color: "#c4400d", strong: true },
];

export function CostSlide() {
  return (
    <SlideShell
      band={bandCheckin}
      title="Chi phí overbooking trên test (r = 2)"
      subtitle="Không overbook tốn 10.102 (chi phí), bằng số đơn hủy thật. Thấp hơn nghĩa là có lợi"
    >
      <Card delay={150} className="px-10 py-[26px]">
        <div role="img" aria-label="Biểu đồ cột: chi phí overbooking trên test, r = 2" className="flex flex-col gap-[12px]">
          {COST_BARS.map((b, i) => (
            <div key={b.label} className="flex h-[70px] items-center">
              <div
                className={`w-[350px] shrink-0 pr-4 text-[29px] ${b.strong ? "font-bold" : "font-medium"}`}
              >
                {b.label}
              </div>
              <div className="flex items-center border-l-[3px] border-[#b9b09c]">
                <div
                  className="bar-grow h-[52px] rounded-r-[8px]"
                  style={dl(300 + i * 140, { width: (b.n / MAX) * TRACK, background: b.color })}
                />
                <div
                  className="rv-fade ml-[20px] text-[32px] font-bold tabular-nums"
                  style={dl(300 + i * 140 + 500, { color: b.strong ? "#b83a0a" : "#14202b" })}
                >
                  <CountUp text={b.value} delay={300 + i * 140} duration={1300} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
      <NoteBar delay={1100} className="mt-[28px] text-[27px]!">
        MLP tốn hơn 19,5%: ngưỡng 0,43 overbook nhầm 3.483 đơn (FP × 2 = 6.966) cộng 5.105 đơn hủy bị bỏ lỡ.
      </NoteBar>
    </SlideShell>
  );
}

/* ------------------------------ Slide 14 ----------------------------- */
const LIMITS = [
  "Chi phí r chỉ là giả định, chưa có số liệu thật của khách sạn",
  "Xác suất MLP chưa hiệu chỉnh; tỉ lệ hủy trôi 24% → 28% → 32%",
  "Điểm val lạc quan (33 lần thử); ngưỡng dao động 0,43–0,70 giữa các seed",
  "Train-only: bốn tháng val gần test nhất không dùng để huấn luyện",
  "Chỉ hai khách sạn, giai đoạn 2015–2017",
  "Loại special_requests có thể làm mất 0,05–0,08 PR-AUC",
  "Xóa dòng trùng khi không có mã đặt phòng nên không rõ là bản ghi lặp hay đơn thật",
];

export function LimitsSlide() {
  return (
    <SlideShell
      band={bandDark}
      title="Hạn chế"
      subtitle="Những điều khiến kết quả chưa thể dùng để ra quyết định"
    >
      <Card delay={200} className="px-14 py-10">
        <ul className="flex flex-col gap-[30px]">
          {LIMITS.map((t, i) => (
            <li key={t} className="rv-left flex items-start gap-6 text-[30px] leading-[1.35]" style={dl(400 + i * 140)}>
              <span className="mt-[15px] h-[12px] w-[12px] shrink-0 rounded-full bg-gold" />
              <span>{t}</span>
            </li>
          ))}
        </ul>
      </Card>
    </SlideShell>
  );
}

/* ------------------------------ Slide 15 ----------------------------- */
const CONCLUSIONS = [
  {
    head: "Đã thực hiện",
    text: "Xây dựng quy trình từ xử lý dữ liệu, so sánh mô hình, các kịch bản thử nghiệm đến web demo.",
    icon: <ClipboardCheck size={34} strokeWidth={1.8} aria-hidden="true" />,
  },
  {
    head: "Kết quả dự đoán",
    text: "MLP đạt PR-AUC 0,616 trên test; nhận diện 49,5% đơn hủy tại ngưỡng 0,43.",
    icon: <Target size={34} strokeWidth={1.8} aria-hidden="true" />,
  },
  {
    head: "Kết quả nghiệp vụ",
    text: "Ở r = 2, chi phí MLP là 12.071, tệ hơn 19,5% so với không overbook (chi phí 10.102).",
    icon: <Coins size={34} strokeWidth={1.8} aria-hidden="true" />,
  },
];

export function ConclusionSlide() {
  return (
    <div className="relative h-[900px] w-[1600px] overflow-hidden bg-navy text-cream">
      <img src={conclusionBg} alt="" className="kb absolute inset-0 h-full w-full object-cover" />
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(10,21,32,0.93) 0%, rgba(12,26,39,0.9) 55%, rgba(8,17,26,0.97) 100%)",
        }}
      />
      <div className="absolute inset-x-[88px] top-[78px]">
        <h2 className="rv-left font-display text-[68px] font-bold leading-[1.1]">Kết luận</h2>
        <p className="rv mt-[14px] text-[29px] text-[#b8c8d0]" style={dl(160)}>
          Dự đoán rủi ro và mô phỏng chi phí: kết quả và ý nghĩa
        </p>
        <div className="draw mt-[22px] h-[4px] w-[160px] bg-gold" />
      </div>

      <div className="absolute inset-x-[88px] top-[290px] grid grid-cols-3 gap-[28px]">
        {CONCLUSIONS.map((c, i) => (
          <div
            key={c.head}
            className="rv-pop relative h-[372px] rounded-[26px] bg-[#1c3145]/90 p-9 ring-1 ring-white/12 shadow-[0_30px_50px_-30px_rgba(0,0,0,0.8)]"
            style={dl(350 + i * 170)}
          >
            <span className="flex h-[64px] w-[64px] items-center justify-center rounded-full bg-gold/15 text-gold-soft ring-1 ring-gold/40">
              {c.icon}
            </span>
            <h3 className="mt-6 text-[35px] font-bold leading-[1.2] text-gold-soft">{c.head}</h3>
            <p className="mt-3 text-[27px] leading-[1.42] text-[#e9eef0]">{c.text}</p>
          </div>
        ))}
      </div>

      <div className="absolute inset-x-[88px] bottom-[70px]">
        <div className="draw mb-[26px] h-px w-full bg-white/15" style={dl(1000)} />
        <p className="rv text-[42px] font-bold leading-[1.25]" style={dl(1100)}>
          Dự đoán tốt chưa chắc tạo ra quyết định có lợi về chi phí.
        </p>
        <p className="rv mt-3 text-[28px] text-[#b8c8d0]" style={dl(1250)}>
          Chi phí dựa trên mô phỏng và các giả định của nhóm.
        </p>
      </div>
    </div>
  );
}
