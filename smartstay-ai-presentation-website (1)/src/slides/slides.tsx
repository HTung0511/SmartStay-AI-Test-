import { type ComponentType, type CSSProperties, type ReactNode } from "react";
import { cn } from "@/utils/cn";
import lobby from "@/assets/bg/lobby.jpg";
import reception from "@/assets/bg/reception.jpg";
import room from "@/assets/bg/room.jpg";
import bell from "@/assets/bg/bell.jpg";
import corridor from "@/assets/bg/corridor.jpg";
import stairs from "@/assets/bg/stairs.jpg";
import checkin from "@/assets/bg/checkin.jpg";
import {
  BASE_DELAY,
  CountUp,
  GrowBar,
  R,
  T,
  Table,
  easeOutQuart,
  useEnv,
  type Cell,
} from "./kit";

const vars = (o: Record<string, string | number>) => o as CSSProperties;

/* ═════════════════════════ Khung & tiêu đề dùng chung ═════════════════════════ */
const GLOW = {
  brass: "rgba(220,181,107,0.30)",
  teal: "rgba(70,210,192,0.24)",
  orange: "rgba(255,123,69,0.24)",
} as const;

function Frame({
  bg,
  pos = "50% 50%",
  glow = "brass",
  extraDark = false,
  children,
}: {
  bg: string;
  pos?: string;
  glow?: keyof typeof GLOW;
  extraDark?: boolean;
  children: ReactNode;
}) {
  const { animate } = useEnv();
  return (
    <div className="sl" style={vars({ "--glow-c": GLOW[glow] })}>
      <div className={cn("sl-bg", animate && "sl-bg-in")}>
        <img
          className={cn("sl-photo", animate && "sl-drift")}
          src={bg}
          alt=""
          draggable={false}
          style={{ objectPosition: pos }}
        />
        <div className="sl-shade" />
        {extraDark && <div style={{ position: "absolute", inset: 0, background: "rgba(4,9,14,0.38)" }} />}
        <div className={cn("orb orb-a", animate && "orb-anim")} />
        <div className={cn("orb orb-b", animate && "orb-anim")} />
      </div>
      <div className="sl-content">{children}</div>
    </div>
  );
}

function Head({ title, sub }: { title: string; sub?: string }) {
  return (
    <header className="head">
      <R k="grow" d={0} className="rule" />
      <R k="title" d={60} as="h1" className="ttl">
        <T>{title}</T>
      </R>
      {sub && (
        <R k="up" d={200} as="p" className="sub">
          <T>{sub}</T>
        </R>
      )}
    </header>
  );
}

/* Biểu tượng trang trí (không chứa chữ/số) */
const Icon = ({ children }: { children: ReactNode }) => (
  <span className="ic" aria-hidden="true">
    <svg viewBox="0 0 24 24">{children}</svg>
  </span>
);
const IcKey = () => (
  <Icon>
    <circle cx="8" cy="15" r="4" />
    <path d="M11 12l9-9M17 6l3 3M14 9l2 2" />
  </Icon>
);
const IcAlert = () => (
  <Icon>
    <path d="M12 3l10 18H2z" />
    <path d="M12 10v5M12 18v.01" />
  </Icon>
);
const IcBed = () => (
  <Icon>
    <path d="M3 18V6M3 14h18v4M21 14v-3a3 3 0 0 0-3-3h-7v6" />
    <circle cx="7" cy="11" r="1.6" />
  </Icon>
);

/* ═════════════════════════ 1 · Bìa ═════════════════════════ */
function mulberry32(a: number) {
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const SKY = (() => {
  const rnd = mulberry32(11);
  const defs: [number, number, number][] = [
    [-30, 170, 330],
    [160, 170, 250],
    [350, 140, 410],
    [510, 210, 300],
    [740, 150, 370],
    [910, 240, 280],
    [1170, 160, 340],
    [1350, 190, 440],
    [1560, 290, 480],
    [1870, 130, 320],
  ];
  const buildings = defs.map(([x, w, h], bi) => {
    const cols = Math.max(2, Math.floor((w - 40 + 14) / 34));
    const rows = Math.floor((h - 28 - 20) / 54);
    const bd = 0.15 + bi * 0.12;
    const wins = Array.from({ length: cols * rows }, () => {
      const lit = rnd() < 0.55;
      return {
        lit,
        o: 0.55 + rnd() * 0.4,
        wd: bd + 1 + rnd() * 3.4,
        blink: lit && rnd() < 0.1,
        bk: 4 + rnd() * 7,
      };
    });
    return { x, w, h, cols, bd, wins };
  });
  const stars = Array.from({ length: 70 }, () => ({
    x: rnd() * 1920,
    y: rnd() * 520,
    s: 2 + rnd() * 2,
    ts: 3 + rnd() * 5,
    td: rnd() * 4,
  }));
  return { buildings, stars };
})();

function Cover() {
  const { animate } = useEnv();
  const letters = [...("SmartStay AI")];
  return (
    <div className="sl">
      <div className={cn("cv", animate && "sl-bg-in")}>
        {SKY.stars.map((s, i) => (
          <i
            key={i}
            className={cn("star", animate && "star-a")}
            style={vars({ left: s.x, top: s.y, width: s.s, height: s.s, "--ts": `${s.ts}s`, "--td": `${s.td}s` })}
          />
        ))}
        <div className={cn("cv-glow", animate && "cv-glow-anim")} />
        {SKY.buildings.map((b, bi) => (
          <div
            key={bi}
            className={cn("bld", animate && "bld-in")}
            style={vars({ left: b.x, width: b.w, height: b.h, "--bd": `${b.bd}s` })}
          >
            <div className="bld-win" style={vars({ "--c": b.cols })}>
              {b.wins.map((w, wi) => (
                <i
                  key={wi}
                  className={cn("win", w.lit && "lit", animate && w.lit && (w.blink ? "win-blink" : "win-anim"))}
                  style={vars({ "--o": w.o, "--wd": `${w.wd}s`, "--bk": `${w.bk}s` })}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="sl-content" style={{ paddingTop: 205 }}>
        <R k="side" d={150}>
          <span className="cv-kicker">
            <T>Học phần Trí tuệ nhân tạo</T>
          </span>
        </R>
        <h1 className="cv-title" aria-label="SmartStay AI">
          {letters.map((ch, i) =>
            ch === " " ? (
              " "
            ) : (
              <span
                key={i}
                className={cn("ltr", i >= 10 && "ltr-ai", animate && "ltr-a")}
                style={{ animationDelay: `${450 + i * 70}ms` }}
              >
                {ch}
              </span>
            ),
          )}
        </h1>
        <R k="up" d={1250} as="p" className="cv-sub">
          <T>Ứng dụng học máy vào dự đoán khách hàng hủy đặt phòng</T>
        </R>
      </div>
    </div>
  );
}

/* ═════════════════════════ 2 · Phân công công việc ═════════════════════════ */
function S2() {
  return (
    <Frame bg={reception} pos="60% 55%">
      <Head
        title="Phân công công việc"
        sub="Mỗi thành viên phụ trách một nhóm mô hình và các thực nghiệm đi kèm"
      />
      <div className="body">
        <Table
          cols="330px 450px 1fr"
          fs={28}
          py={20}
          d0={420}
          step={130}
          head={["Thành viên", "Mô hình", "Thực nghiệm và công việc"]}
          colCls={["td-strong", "", ""]}
          rows={[
            [
              "Dương Minh Tuấn",
              "Dummy, Logistic Regression, Decision Tree",
              "E3 giữ/xóa dòng trùng; E4 có/không adr và special_requests; xác định bài toán, làm sạch dữ liệu",
            ],
            [
              "Phạm Tuấn Mạnh",
              "Random Forest",
              "E5 chia ngẫu nhiên và theo thời gian; E6 huấn luyện khách sạn này, kiểm tra khách sạn kia; phân tích lỗi, trực quan hóa",
            ],
            ["Lưu Văn Lịch", "LightGBM + SMOTENC", "E7 hiệu chỉnh xác suất; E9 giải thích bằng SHAP"],
            ["Trần Hoàng Tùng", "MLP", "E8 ngưỡng theo chi phí; bootstrap, ngưỡng khóa; web demo Streamlit"],
          ]}
        />
        <R k="up" d={1100} className="note">
          <T>E1 (so sánh mô hình) và E2 (xử lý mất cân bằng lớp): mỗi thành viên tự chạy trên mô hình của mình.</T>
        </R>
      </div>
    </Frame>
  );
}

/* ═════════════════════════ 3 · Bài toán ═════════════════════════ */
function S3() {
  return (
    <Frame bg={lobby} pos="35% 45%">
      <Head
        title="Bài toán: overbooking khi nào có lợi?"
        sub="Dự đoán hủy chỉ có giá trị khi biến được thành quyết định bán thêm phòng"
      />
      <div className="body s3-grid" style={{ alignContent: "start" }}>
        <R k="zoom" d={380} className="card">
          <div className="big">
            <T>37,0%</T>
          </div>
          <p className="card-p">
            <T>đơn đặt phòng gốc bị hủy (27,7% sau làm sạch), mỗi đơn để lại một phòng trống</T>
          </p>
        </R>
        <R k="zoom" d={520} className="card">
          <div className="flex items-center gap-5">
            <IcKey />
            <h3 className="card-h">
              <T>Dự đoán lúc đặt</T>
            </h3>
          </div>
          <p className="card-b">
            <T>Mô hình chấm nguy cơ hủy cho từng đơn; vượt ngưỡng thì overbook đúng một phòng</T>
          </p>
        </R>
        <R k="zoom" d={660} className="card" style={vars({ "--accent": "var(--orange)" })}>
          <div className="flex items-center gap-5">
            <IcAlert />
            <h3 className="card-h">
              <T>FP: overbook nhầm</T>
            </h3>
          </div>
          <p className="card-b">
            <T>Khách vẫn đến nhưng hết phòng, tốn r</T>
          </p>
        </R>
        <R k="zoom" d={800} className="card" style={vars({ "--accent": "var(--teal)" })}>
          <div className="flex items-center gap-5">
            <IcBed />
            <h3 className="card-h">
              <T>FN: bỏ lỡ</T>
            </h3>
          </div>
          <p className="card-b">
            <T>Khách hủy, phòng trống, tốn 1</T>
          </p>
        </R>
        <R k="up" d={1000} className="note">
          <b>
            <T>Công thức tính chi phí: Cost(t) = r·FP + FN.</T>
          </b>
          <T> Mức chính r = 2 (giả định của nhóm)</T>
        </R>
      </div>
    </Frame>
  );
}

/* ═════════════════════════ 4 · Dữ liệu ═════════════════════════ */
function S4() {
  return (
    <Frame bg={stairs} pos="50% 60%" glow="teal">
      <Head
        title="Dữ liệu Hotel Booking Demand"
        sub="Antonio, Almeida & Nunes (2019), Data in Brief 22, 41–50. Hai khách sạn City và Resort, 07/2015–08/2017"
      />
      <div className="body" style={{ marginTop: 34 }}>
        <div className="grid grid-cols-2 gap-7">
          <R k="zoom" d={360} className="card" style={{ padding: "34px 44px" }}>
            <div className="big big-md">
              <T>119.390</T>
            </div>
            <p className="card-p" style={{ marginTop: 14 }}>
              <T>bản ghi gốc × 32 cột, hủy 37,0%</T>
            </p>
          </R>
          <R k="zoom" d={500} className="card" style={{ padding: "34px 44px" }}>
            <div className="big big-md">
              <T>86.617</T>
            </div>
            <p className="card-p" style={{ marginTop: 14 }}>
              <T>bản ghi × 25 cột sau 34 bước làm sạch, hủy 27,7%</T>
            </p>
          </R>
        </div>
        <R k="up" d={700} as="p" className="cap" style={{ marginTop: 30, marginBottom: 14 }}>
          <T>Chia dữ liệu theo thời gian</T>
        </R>
        <Table
          cols="170px 400px 260px 260px 1fr"
          fs={29}
          py={19}
          d0={840}
          step={130}
          head={["Tập", "Giai đoạn", "Số dòng", "Tỉ lệ hủy", "Dùng để"]}
          colCls={["td-strong", "", "", "", ""]}
          rows={[
            ["Train", "07/2015–08/2016", "40.688", "24,0%", "Huấn luyện"],
            ["Val", "09–12/2016", "14.400", "28,4%", "Chọn mô hình, ngưỡng"],
            ["Test", "01–08/2017", "31.529", "32,0%", "Kiểm tra"],
          ]}
        />
      </div>
    </Frame>
  );
}

/* ═════════════════════════ 5 · Quyết định làm sạch ═════════════════════════ */
function S5() {
  return (
    <Frame bg={corridor} pos="50% 50%">
      <Head
        title="Các quyết định làm sạch quan trọng"
        sub="Mỗi quyết định đều ghi vào cleaning log (34 bước), kể cả quyết định giữ lại"
      />
      <div className="body">
        <Table
          cols="560px 360px 1fr"
          fs={28}
          py={25}
          d0={420}
          step={140}
          head={["Quyết định", "Quy mô", "Lý do"]}
          colCls={["td-strong", "t-brass", ""]}
          rows={[
            [
              "Xóa dòng trùng hoàn toàn",
              "31.994 dòng",
              "Nhóm trùng hủy 63,1% so với 37,0% chung; giữ lại làm điểm đẹp giả (E3)",
            ],
            ["Loại cột rò rỉ nhãn", "6 cột", "Chỉ biết sau khi đặt phòng, như reservation_status"],
            ["Xóa bản ghi bất khả", "166 + 591 dòng", "166 dòng không có khách, 591 dòng 0 đêm"],
            ["Giữ adr = 0", "420 dòng", "Hủy chỉ 13,3%, có thể là đặt phòng tặng, không phải lỗi"],
            ["Bỏ special_requests", "1 cột", "Nghi rò rỉ nhãn; chấp nhận mất 0,05–0,08 PR-AUC (E4)"],
          ]}
        />
      </div>
    </Frame>
  );
}

/* ═════════════════════════ 6 · Chín kịch bản ═════════════════════════ */
const E = (t: string): Cell => ({ t, kind: "badge" });

function S6() {
  return (
    <Frame bg={room} pos="50% 40%">
      <Head title="Chín kịch bản thực nghiệm" />
      <div className="body" style={{ marginTop: 34 }}>
        <Table
          cols="110px 640px 1fr"
          fs={26}
          py={12}
          d0={300}
          step={95}
          head={["#", "Thực nghiệm", "Lý do / mục đích"]}
          colCls={["", "td-strong", ""]}
          rows={[
            [E("E1"), "So sánh mô hình", "Chọn mô hình tốt nhất và hiểu vì sao"],
            [E("E2"), "Xử lý mất cân bằng lớp", "Kiểm tra có cần cân bằng lớp (hủy chiếm 27,7%)"],
            [E("E3"), "Giữ / xóa dòng trùng", "Xem việc xóa 31.994 dòng trùng ảnh hưởng thế nào"],
            [E("E4"), "Có / không adr, special_requests", "Đo đóng góp của hai cột vùng xám, nghi rò rỉ"],
            [E("E5"), "Chia ngẫu nhiên / theo thời gian", "Đo mức điểm bị đẹp giả khi chia ngẫu nhiên"],
            [E("E6"), "Khách sạn này → khách sạn kia", "Kiểm tra mô hình có tổng quát hóa giữa hai khách sạn"],
            [E("E7"), "Hiệu chỉnh xác suất", "Xem xác suất có đủ tin cậy để tính chi phí"],
            [E("E8"), "Ngưỡng theo chi phí, overbooking", "Câu hỏi chính: chọn ngưỡng nào, overbook có lợi không"],
            [E("E9"), "SHAP và phân tích lỗi", "Biết mô hình dựa vào đâu và sai ở đâu"],
          ]}
        />
      </div>
    </Frame>
  );
}

/* ═════════════════════════ 7 · Kết quả chín thực nghiệm ═════════════════════════ */
function S7() {
  return (
    <Frame bg={checkin} pos="50% 50%" glow="teal">
      <Head title="Kết quả của chín thực nghiệm" />
      <div className="body" style={{ marginTop: 34 }}>
        <Table
          cols="104px 1fr 500px"
          fs={25}
          py={14}
          d0={300}
          step={100}
          head={["#", "Kết quả chính", "Quyết định / kết luận"]}
          colCls={["", "", "t-brass"]}
          rows={[
            [E("E1"), "MLP cao nhất, PR-AUC val 0,631; LogReg 0,573, Tree 0,508", "Chọn MLP v2 làm mô hình chính"],
            [
              E("E2"),
              "LogReg: recall 0,148 → 0,537, PR-AUC giảm nhẹ; LightGBM: 0,546 → 0,576",
              "Chỉ SMOTENC có ích, cho LightGBM",
            ],
            [
              E("E3"),
              "Giữ trùng: PR-AUC báo cáo 0,803 so với 0,571, kém hơn ~0,01 trên val sạch",
              "Xóa dòng trùng",
            ],
            [
              E("E4"),
              "adr đóng góp nhỏ; special_requests +0,081 (LogReg), +0,049 (RF)",
              "Giữ adr; loại special_requests (nghi rò rỉ)",
            ],
            [
              E("E5"),
              "Random Forest: PR-AUC 0,685 (ngẫu nhiên) so với 0,592 (theo thời gian)",
              "Chia theo thời gian",
            ],
            [
              E("E6"),
              "Random Forest: 0,413 (City → Resort), 0,464 (Resort → City), 0,585 (cả hai)",
              "Mô hình kém khi chuyển khách sạn",
            ],
            [
              E("E7"),
              "LightGBM, sigmoid: Brier 0,210 → 0,185; ROC-AUC không đổi (0,705)",
              "Không dùng cho mô hình chính",
            ],
            [
              E("E8"),
              "Ngưỡng khóa trên val ở r = 2: MLP v2 là 0,43, chi phí val 3.757",
              "Đánh giá trên test ở các slide sau",
            ],
            [
              E("E9"),
              "SHAP top 5: country, tháng đến, agent, lead_time, market_segment",
              "Sai nhiều nhất ở nhóm không đặt cọc",
            ],
          ]}
        />
      </div>
    </Frame>
  );
}

/* ═════════════════════════ 8 · So sánh mô hình trên validation ═════════════════════════ */
function S8() {
  return (
    <Frame bg={lobby} pos="75% 55%" glow="teal">
      <Head
        title="So sánh mô hình trên tập validation (kiểm định)"
        sub="Mọi mô hình huấn luyện trên train; điểm dưới đây tính trên val, chọn theo PR-AUC"
      />
      <div className="body" style={{ marginTop: 36 }}>
        <Table
          cols="330px 1fr 160px 170px 230px"
          fs={28}
          py={19}
          d0={420}
          step={140}
          hl={4}
          head={["Mô hình", "Đặc điểm mô hình", "PR-AUC", "ROC-AUC", "Ngưỡng r = 2"]}
          colCls={["td-strong", "", "t-brass", "t-brass", ""]}
          rows={[
            ["Dummy", "Mốc cơ sở để đối chiếu", "0,284", "0,500", "không đoán hủy"],
            ["Logistic Regression", "Mô hình tuyến tính, dễ diễn giải", "0,573", "0,784", "0,67"],
            ["Decision Tree", "Mô hình dạng cây, dễ quan sát các quy tắc", "0,508", "0,767", "0,60"],
            [
              "LightGBM + SMOTENC",
              "Mô hình boosting kết hợp xử lý mất cân bằng lớp",
              "0,575",
              "0,771",
              "0,58",
            ],
            ["MLP", "Mạng nơ-ron học các quan hệ phi tuyến", "0,631", "0,813", "0,43"],
          ]}
        />
        <R k="up" d={1250} className="note" style={{ marginTop: 30 }}>
          <T>
            MLP đạt PR-AUC cao nhất trên validation và được chọn làm mô hình chính. Tuy nhiên, MLP được tinh chỉnh
            nhiều hơn các mô hình còn lại.
          </T>
        </R>
      </div>
    </Frame>
  );
}

/* ═════════════════════════ 9 · Kết quả phân loại trên test ═════════════════════════ */
function S9() {
  return (
    <Frame bg={bell} pos="50% 50%">
      <Head
        title="Kết quả phân loại trên test"
        sub="31.529 đơn mô hình chưa từng thấy, tỉ lệ hủy 32,0% (mốc PR-AUC của Dummy)"
      />
      <div className="body" style={{ marginTop: 36 }}>
        <Table
          cols="400px repeat(5, 1fr)"
          fs={29}
          py={21}
          d0={420}
          step={140}
          hl={4}
          head={["Mô hình", "Ngưỡng", "PR-AUC", "ROC-AUC", "Precision", "Recall"]}
          colCls={["td-strong", "", "t-brass", "t-brass", "", ""]}
          rows={[
            ["Dummy", "0,99", "0,320", "0,500", "0", "0"],
            ["Logistic Regression", "0,67", "0,594", "0,779", "0,733", "0,097"],
            ["Decision Tree", "0,60", "0,505", "0,731", "0,977", "0,033"],
            ["LightGBM + SMOTENC", "0,58", "0,611", "0,785", "0,684", "0,217"],
            ["MLP", "0,43", "0,616", "0,793", "0,589", "0,495"],
          ]}
        />
        <R k="up" d={1250} className="note" style={{ marginTop: 30 }}>
          <T>
            MLP đứng đầu PR-AUC và ROC-AUC. Tree và LogReg có precision cao nhưng bỏ sót gần hết đơn hủy (recall ≤
            0,10).
          </T>
        </R>
      </div>
    </Frame>
  );
}

/* ═════════════════════════ 10 · Biểu đồ chi phí overbooking ═════════════════════════ */
const CHART_MAX = 12071;
const CHART_PX = 1060; // chiều dài thanh ứng với 12.071 (tỉ lệ từ 0, đúng như bản gốc)
const CHART_LEFT = 48 + 340;
const CHART_ROWS: { label: string; tok: string; v: number; tone: "grey" | "teal" | "orange"; bold?: boolean }[] = [
  { label: "Không overbook", tok: "10.102", v: 10102, tone: "grey" },
  { label: "Logistic Regression", tok: "9.835", v: 9835, tone: "teal" },
  { label: "Decision Tree", tok: "9.781", v: 9781, tone: "teal" },
  { label: "LightGBM + SMOTENC", tok: "9.938", v: 9938, tone: "teal" },
  { label: "MLP v2", tok: "12.071", v: 12071, tone: "orange", bold: true },
];

function S10() {
  const barsStart = 620;
  return (
    <Frame bg={corridor} pos="30% 60%" glow="orange">
      <Head
        title="Chi phí overbooking trên test (r = 2)"
        sub="Không overbook tốn 10.102 (chi phí), bằng số đơn hủy thật. Thấp hơn nghĩa là có lợi"
      />
      <div className="body" style={{ marginTop: 36 }}>
        <R k="wipe" d={300} className="chart">
          <R k="fade" d={barsStart} className="axis" style={{ left: CHART_LEFT, top: 30, bottom: 36 }} />
          <R
            k="fade"
            d={barsStart + 1500}
            className="refline"
            style={{ left: CHART_LEFT + (10102 / CHART_MAX) * CHART_PX, top: 30, bottom: 36 }}
          />
          {CHART_ROWS.map((r, i) => {
            const dl = barsStart - 100 + i * 140;
            const growAt = dl + BASE_DELAY + 380;
            return (
              <div className="crow" key={r.label}>
                <R k="side" d={dl} className={cn("crow-l", r.bold && "b")}>
                  <T>{r.label}</T>
                </R>
                <div className="crow-track">
                  <GrowBar
                    widthPx={(r.v / CHART_MAX) * CHART_PX}
                    delay={growAt}
                    className={cn("bar", `bar-${r.tone}`)}
                  />
                  <R k="fade" d={dl + 300} className={cn("val", r.tone === "orange" && "val-orange")}>
                    <CountUp token={r.tok} delay={growAt} dur={1300} ease={easeOutQuart} />
                  </R>
                </div>
              </div>
            );
          })}
        </R>
        <R k="up" d={2100} className="note" style={{ marginTop: 30 }}>
          <T>
            MLP tốn hơn 19,5%: ngưỡng 0,43 overbook nhầm 3.483 đơn (FP × 2 = 6.966) cộng 5.105 đơn hủy bị bỏ lỡ.
          </T>
        </R>
      </div>
    </Frame>
  );
}

/* ═════════════════════════ 11 · Độ nhạy theo r ═════════════════════════ */
const good = (t: string): Cell => ({ t, cls: "t-teal" });
const bad = (t: string): Cell => ({ t, cls: "t-orange" });

function S11() {
  return (
    <Frame bg={reception} pos="40% 50%" glow="orange">
      <Head title="Độ nhạy theo r" sub="Mỗi r có ngưỡng riêng, chọn trên val và khóa trước khi mở test" />
      <div className="body" style={{ marginTop: 36 }}>
        <Table
          cols="150px 280px 330px 1fr"
          fs={30}
          py={20}
          d0={420}
          step={140}
          hl={2}
          head={["r", "Ngưỡng khóa", "Chi phí test", "So với không overbook (10.102)"]}
          colCls={["td-strong", "", "", ""]}
          rows={[
            ["0,5", "0,18", "5.809", good("tiết kiệm 42,49%")],
            ["1", "0,26", "9.271", good("tiết kiệm 8,23%")],
            ["2", "0,43", "12.071", bad("tệ hơn 19,5%")],
            ["3", "0,57", "10.509", bad("tệ hơn 4,03%")],
            ["5", "0,79", "9.795", good("tiết kiệm 3,04%")],
          ]}
        />
        <R k="up" d={1250} className="note" style={{ marginTop: 32 }}>
          <T>
            Lưu ý: Hiệu quả phụ thuộc vào mức chi phí giả định; kết quả cần được kiểm tra thêm với dữ liệu và chi phí
            thực tế.
          </T>
        </R>
      </div>
    </Frame>
  );
}

/* ═════════════════════════ 12 · SHAP ═════════════════════════ */
function S12() {
  const rk = (t: string): Cell => ({ t, kind: "rank" });
  return (
    <Frame bg={room} pos="50% 60%" glow="teal">
      <Head title="Mô hình dựa vào đâu để dự đoán?" sub="Năm đặc trưng (cột) ảnh hưởng nhiều nhất theo SHAP" />
      <div className="body" style={{ marginTop: 36 }}>
        <Table
          cols="150px 480px 1fr"
          fs={30}
          py={17}
          d0={420}
          step={140}
          head={["Hạng", "Đặc trưng", "Ý nghĩa"]}
          colCls={["", "mono", ""]}
          rows={[
            [rk("1"), "country", "Quốc gia của khách"],
            [rk("2"), "arrival_date_month", "Tháng khách đến"],
            [rk("3"), "agent", "Đại lý đặt phòng"],
            [rk("4"), "lead_time", "Số ngày từ lúc đặt đến lúc đến"],
            [rk("5"), "market_segment", "Phân khúc thị trường"],
          ]}
        />
        <R k="up" d={1250} className="note" style={{ marginTop: 32 }}>
          <T>
            SHAP chỉ mô tả hành vi mô hình, không chứng minh cột nào gây ra việc hủy; tháng và quốc gia cần kiểm tra
            thêm vì val diễn ra sau train.
          </T>
        </R>
      </div>
    </Frame>
  );
}

/* ═════════════════════════ 13 · Web demo ═════════════════════════ */
function S13() {
  return (
    <Frame bg={stairs} pos="40% 40%">
      <Head title="Web demo SmartStay AI" sub="Streamlit, 7 trang, dùng đúng mô hình và ngưỡng đã khóa của protocol-v1" />
      <div className="body" style={{ marginTop: 40 }}>
        <Table
          cols="560px 1fr"
          fs={32}
          py={24}
          d0={420}
          step={130}
          head={["Trang", "Chức năng"]}
          colCls={["td-strong", ""]}
          rows={[
            ["Dự đoán", "Nhập một đơn, xem mức nguy cơ và lý do"],
            ["Chấm hàng loạt", "Tải danh sách đơn, nhận bảng xếp hạng"],
            ["Một tuần vận hành", "Mô phỏng overbook theo mô hình"],
            ["Kết quả mô hình", "Chi phí từng mô hình trên test"],
            ["Thử mức chi phí", "Kéo r, xem đường chi phí theo ngưỡng"],
            ["Giới hạn, Về dự án", "Hạn chế đã biết, giải thích thuật ngữ"],
          ]}
        />
      </div>
    </Frame>
  );
}

/* ═════════════════════════ 14 · Hạn chế ═════════════════════════ */
function S14() {
  const items = [
    "Chi phí r chỉ là giả định, chưa có số liệu thật của khách sạn",
    "Xác suất MLP chưa hiệu chỉnh; tỉ lệ hủy trôi 24% → 28% → 32%",
    "Điểm val lạc quan (33 lần thử); ngưỡng dao động 0,43–0,70 giữa các seed",
    "Train-only: bốn tháng val gần test nhất không dùng để huấn luyện",
    "Chỉ hai khách sạn, giai đoạn 2015–2017",
    "Loại special_requests có thể làm mất 0,05–0,08 PR-AUC",
    "Xóa dòng trùng khi không có mã đặt phòng nên không rõ là bản ghi lặp hay đơn thật",
  ];
  return (
    <Frame bg={checkin} pos="30% 50%" glow="orange">
      <Head title="Hạn chế" sub="Những điều khiến kết quả chưa thể dùng để ra quyết định" />
      <div className="body" style={{ marginTop: 40 }}>
        <R k="zoom" d={300} className="card" style={{ padding: "52px 64px", borderRadius: 28 }}>
          <ul className="list">
            {items.map((t, i) => (
              <R key={i} as="li" k="side" d={520 + i * 190}>
                <T>{t}</T>
              </R>
            ))}
          </ul>
        </R>
      </div>
    </Frame>
  );
}

/* ═════════════════════════ 15 · Kết luận ═════════════════════════ */
function S15() {
  return (
    <Frame bg={lobby} pos="50% 50%" extraDark>
      <Head title="Kết luận" sub="Dự đoán rủi ro và mô phỏng chi phí: kết quả và ý nghĩa" />
      <div className="body" style={{ marginTop: 40 }}>
        <div className="concl-grid">
          <R k="zoom" d={380} className="card" style={{ minHeight: 380 }}>
            <h3 className="card-h" style={{ fontSize: 42 }}>
              <T>Đã thực hiện</T>
            </h3>
            <p className="card-b">
              <T>Xây dựng quy trình từ xử lý dữ liệu, so sánh mô hình, các kịch bản thử nghiệm đến web demo.</T>
            </p>
          </R>
          <R k="zoom" d={560} className="card" style={vars({ minHeight: 380, "--accent": "var(--teal)" })}>
            <h3 className="card-h" style={{ fontSize: 42 }}>
              <T>Kết quả dự đoán</T>
            </h3>
            <p className="card-b">
              <T>MLP đạt PR-AUC 0,616 trên test; nhận diện 49,5% đơn hủy tại ngưỡng 0,43.</T>
            </p>
          </R>
          <R k="zoom" d={740} className="card" style={vars({ minHeight: 380, "--accent": "var(--orange)" })}>
            <h3 className="card-h" style={{ fontSize: 42 }}>
              <T>Kết quả nghiệp vụ</T>
            </h3>
            <p className="card-b">
              <T>Ở r = 2, chi phí MLP là 12.071, tệ hơn 19,5% so với không overbook (chi phí 10.102).</T>
            </p>
          </R>
        </div>
        <div className="close">
          <R k="up" d={1500} as="p" className="close-1">
            <T>Dự đoán tốt chưa chắc tạo ra quyết định có lợi về chi phí.</T>
          </R>
          <R k="up" d={1750} as="p" className="close-2">
            <T>Chi phí dựa trên mô phỏng và các giả định của nhóm.</T>
          </R>
        </div>
      </div>
    </Frame>
  );
}

/* ═════════════════════════ 16 · Hướng phát triển ═════════════════════════ */
function S16() {
  return (
    <Frame bg={bell} pos="60% 50%" glow="teal">
      <Head title="Hướng phát triển tiếp theo" />
      <div className="body" style={{ marginTop: 34 }}>
        <Table
          cols="330px 1fr 520px"
          fs={27}
          py={22}
          d0={300}
          step={150}
          head={["Hướng", "Việc cần làm", "Vấn đề giải quyết"]}
          colCls={["td-strong", "", "t-brass"]}
          rows={[
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
          ]}
        />
      </div>
    </Frame>
  );
}

/* ═════════════════════════ Danh sách slide (đúng thứ tự gốc) ═════════════════════════ */
export const SLIDES: { id: string; Comp: ComponentType }[] = [
  { id: "bia", Comp: Cover },
  { id: "phan-cong", Comp: S2 },
  { id: "bai-toan", Comp: S3 },
  { id: "du-lieu", Comp: S4 },
  { id: "lam-sach", Comp: S5 },
  { id: "chin-kich-ban", Comp: S6 },
  { id: "ket-qua-chin-thuc-nghiem", Comp: S7 },
  { id: "so-sanh-val", Comp: S8 },
  { id: "ket-qua-test", Comp: S9 },
  { id: "chi-phi", Comp: S10 },
  { id: "do-nhay", Comp: S11 },
  { id: "shap", Comp: S12 },
  { id: "web-demo", Comp: S13 },
  { id: "han-che", Comp: S14 },
  { id: "ket-luan", Comp: S15 },
  { id: "huong-phat-trien", Comp: S16 },
];
