import { useContext, type CSSProperties, type ReactNode } from "react";
import { AnimCtx, Rv, T } from "../lib/anim";
import { Cover } from "./Cover";
import reception from "../assets/reception.jpg";
import lobby from "../assets/lobby.jpg";
import room from "../assets/room.jpg";
import sofa from "../assets/sofa.jpg";

const BGS = [reception, lobby, room, sofa];

/* ------------------------------------------------------------------ */
/* Khung slide chung                                                    */
/* ------------------------------------------------------------------ */

function Frame({
  n,
  title,
  sub,
  children,
  tone = "dark",
}: {
  n: number;
  title: string;
  sub?: string;
  children: ReactNode;
  tone?: "dark" | "ink";
}) {
  const animate = useContext(AnimCtx);
  return (
    <div className={`slide ${tone} ${animate ? "anim" : ""}`}>
      <div className="bg" style={{ backgroundImage: `url(${BGS[n % BGS.length]})` }} />
      <div className="veil" />
      <div className="orb o1" />
      <div className="orb o2" />
      <div className="body">
        <header className="head">
          <Rv k="grow" d={0} dur={700} className="rule" />
          <Rv k="wipe" d={60} dur={900} as="h1" className="title">
            <T d={60}>{title}</T>
          </Rv>
          {sub && (
            <Rv k="up" d={260} className="sub">
              <T d={300}>{sub}</T>
            </Rv>
          )}
        </header>
        <div className="content">{children}</div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Bảng                                                                 */
/* ------------------------------------------------------------------ */

type Cell = string | { t: string; cls?: string };

function Table({
  cols,
  widths,
  rows,
  start = 520,
  step = 170,
  hl = {},
  fs = 30,
  py = 16,
  colCls = [],
}: {
  cols: string[];
  widths: string;
  rows: Cell[][];
  start?: number;
  step?: number;
  hl?: Record<number, "warm" | "cool">;
  fs?: number;
  py?: number;
  colCls?: string[];
}) {
  const style = {
    ["--fs" as string]: `${fs}px`,
    ["--py" as string]: `${py}px`,
    ["--cols" as string]: widths,
  } as CSSProperties;
  return (
    <Rv k="zoom" d={start - 180} dur={800} className="tbl" style={style}>
      <div className="tr head">
        {cols.map((c, i) => (
          <div className={`td ${colCls[i] ?? ""}`} key={i}>
            <T d={start}>{c}</T>
          </div>
        ))}
      </div>
      {rows.map((r, i) => {
        const rd = start + 220 + i * step;
        return (
          <Rv k="row" d={rd} dur={650} className={`tr ${hl[i] ?? ""}`} key={i}>
            {r.map((c, j) => {
              const t = typeof c === "string" ? c : c.t;
              const extra = typeof c === "string" ? "" : (c.cls ?? "");
              return (
                <div className={`td ${colCls[j] ?? ""} ${extra}`} key={j}>
                  <T d={rd + 120} dur={1100}>
                    {t}
                  </T>
                </div>
              );
            })}
          </Rv>
        );
      })}
    </Rv>
  );
}

function Callout({ d, children }: { d: number; children: ReactNode }) {
  return (
    <Rv k="up" d={d} dur={800} className="callout">
      {children}
    </Rv>
  );
}

/* ------------------------------------------------------------------ */
/* Từng slide (nội dung giữ nguyên bản gốc)                              */
/* ------------------------------------------------------------------ */

function S2() {
  return (
    <Frame
      n={1}
      title="Phân công công việc"
      sub="Mỗi thành viên phụ trách một nhóm mô hình và các thực nghiệm đi kèm"
    >
      <Table
        cols={["Thành viên", "Mô hình", "Thực nghiệm và công việc"]}
        widths="360px 480px 1fr"
        fs={31}
        py={20}
        start={560}
        step={260}
        colCls={["strong", "", ""]}
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
      <Callout d={1900}>
        E1 (so sánh mô hình) và E2 (xử lý mất cân bằng lớp): mỗi thành viên tự chạy trên mô hình của mình.
      </Callout>
    </Frame>
  );
}

function S3() {
  return (
    <Frame
      n={2}
      title="Bài toán: overbooking khi nào có lợi?"
      sub="Dự đoán hủy chỉ có giá trị khi biến được thành quyết định bán thêm phòng"
    >
      <div className="grid2">
        <Rv k="pop" d={520} dur={800} className="card big">
          <div className="stat">
            <T d={560} dur={1500}>
              37,0%
            </T>
          </div>
          <p>
            <Rv k="fade" as="span" d={900}>
              <T d={900}>đơn đặt phòng gốc bị hủy (27,7% sau làm sạch), mỗi đơn để lại một phòng trống</T>
            </Rv>
          </p>
        </Rv>
        <Rv k="right" d={760} className="card">
          <h3>Dự đoán lúc đặt</h3>
          <p>Mô hình chấm nguy cơ hủy cho từng đơn; vượt ngưỡng thì overbook đúng một phòng</p>
        </Rv>
        <Rv k="left" d={1040} className="card sm warn">
          <h3>FP: overbook nhầm</h3>
          <p>
            <T d={1200}>Khách vẫn đến nhưng hết phòng, tốn r</T>
          </p>
        </Rv>
        <Rv k="right" d={1220} className="card sm good">
          <h3>FN: bỏ lỡ</h3>
          <p>
            <T d={1380}>Khách hủy, phòng trống, tốn 1</T>
          </p>
        </Rv>
      </div>
      <Callout d={1650}>
        <b>Công thức tính chi phí: Cost(t) = r·FP + FN.</b>{" "}
        <T d={1850}>Mức chính r = 2 (giả định của nhóm)</T>
      </Callout>
    </Frame>
  );
}

function S4() {
  return (
    <Frame
      n={3}
      title="Dữ liệu Hotel Booking Demand"
      sub="Antonio, Almeida & Nunes (2019), Data in Brief 22, 41–50. Hai khách sạn City và Resort, 07/2015–08/2017"
    >
      <div className="grid2 tight">
        <Rv k="left" d={560} className="card big compact">
          <div className="stat">
            <T d={640} dur={1700}>
              119.390
            </T>
          </div>
          <p>
            <T d={800}>bản ghi gốc × 32 cột, hủy 37,0%</T>
          </p>
        </Rv>
        <Rv k="right" d={760} className="card big compact">
          <div className="stat">
            <T d={840} dur={1700}>
              86.617
            </T>
          </div>
          <p>
            <T d={1000}>bản ghi × 25 cột sau 34 bước làm sạch, hủy 27,7%</T>
          </p>
        </Rv>
      </div>
      <Rv k="fade" d={1150} className="lbl">
        Chia dữ liệu theo thời gian
      </Rv>
      <Table
        cols={["Tập", "Giai đoạn", "Số dòng", "Tỉ lệ hủy", "Dùng để"]}
        widths="220px 420px 280px 260px 1fr"
        fs={30}
        py={15}
        start={1250}
        step={240}
        colCls={["strong", "", "nm", "nm", ""]}
        rows={[
          ["Train", "07/2015–08/2016", "40.688", "24,0%", "Huấn luyện"],
          ["Val", "09–12/2016", "14.400", "28,4%", "Chọn mô hình, ngưỡng"],
          ["Test", "01–08/2017", "31.529", "32,0%", "Kiểm tra"],
        ]}
      />
    </Frame>
  );
}

function S5() {
  return (
    <Frame
      n={0}
      title="Các quyết định làm sạch quan trọng"
      sub="Mỗi quyết định đều ghi vào cleaning log (34 bước), kể cả quyết định giữ lại"
    >
      <Table
        cols={["Quyết định", "Quy mô", "Lý do"]}
        widths="480px 340px 1fr"
        fs={31}
        py={24}
        start={520}
        step={280}
        colCls={["strong", "amber", ""]}
        rows={[
          ["Xóa dòng trùng hoàn toàn", "31.994 dòng", "Nhóm trùng hủy 63,1% so với 37,0% chung; giữ lại làm điểm đẹp giả (E3)"],
          ["Loại cột rò rỉ nhãn", "6 cột", "Chỉ biết sau khi đặt phòng, như reservation_status"],
          ["Xóa bản ghi bất khả", "166 + 591 dòng", "166 dòng không có khách, 591 dòng 0 đêm"],
          ["Giữ adr = 0", "420 dòng", "Hủy chỉ 13,3%, có thể là đặt phòng tặng, không phải lỗi"],
          ["Bỏ special_requests", "1 cột", "Nghi rò rỉ nhãn; chấp nhận mất 0,05–0,08 PR-AUC (E4)"],
        ]}
      />
    </Frame>
  );
}

function S6() {
  return (
    <Frame n={1} title="Chín kịch bản thực nghiệm">
      <Table
        cols={["#", "Thực nghiệm", "Lý do / mục đích"]}
        widths="130px 640px 1fr"
        fs={30}
        py={17}
        start={400}
        step={190}
        colCls={["tag", "strong", ""]}
        rows={[
          ["E1", "So sánh mô hình", "Chọn mô hình tốt nhất và hiểu vì sao"],
          ["E2", "Xử lý mất cân bằng lớp", "Kiểm tra có cần cân bằng lớp (hủy chiếm 27,7%)"],
          ["E3", "Giữ / xóa dòng trùng", "Xem việc xóa 31.994 dòng trùng ảnh hưởng thế nào"],
          ["E4", "Có / không adr, special_requests", "Đo đóng góp của hai cột vùng xám, nghi rò rỉ"],
          ["E5", "Chia ngẫu nhiên / theo thời gian", "Đo mức điểm bị đẹp giả khi chia ngẫu nhiên"],
          ["E6", "Khách sạn này → khách sạn kia", "Kiểm tra mô hình có tổng quát hóa giữa hai khách sạn"],
          ["E7", "Hiệu chỉnh xác suất", "Xem xác suất có đủ tin cậy để tính chi phí"],
          ["E8", "Ngưỡng theo chi phí, overbooking", "Câu hỏi chính: chọn ngưỡng nào, overbook có lợi không"],
          ["E9", "SHAP và phân tích lỗi", "Biết mô hình dựa vào đâu và sai ở đâu"],
        ]}
      />
    </Frame>
  );
}

function S7() {
  return (
    <Frame n={2} title="Kết quả của chín thực nghiệm">
      <Table
        cols={["#", "Kết quả chính", "Quyết định / kết luận"]}
        widths="110px 1010px 1fr"
        fs={27}
        py={12}
        start={400}
        step={190}
        colCls={["tag", "", "strong"]}
        rows={[
          ["E1", "MLP cao nhất, PR-AUC val 0,631; LogReg 0,573, Tree 0,508", "Chọn MLP v2 làm mô hình chính"],
          ["E2", "LogReg: recall 0,148 → 0,537, PR-AUC giảm nhẹ; LightGBM: 0,546 → 0,576", "Chỉ SMOTENC có ích, cho LightGBM"],
          ["E3", "Giữ trùng: PR-AUC báo cáo 0,803 so với 0,571, kém hơn ~0,01 trên val sạch", "Xóa dòng trùng"],
          ["E4", "adr đóng góp nhỏ; special_requests +0,081 (LogReg), +0,049 (RF)", "Giữ adr; loại special_requests (nghi rò rỉ)"],
          ["E5", "Random Forest: PR-AUC 0,685 (ngẫu nhiên) so với 0,592 (theo thời gian)", "Chia theo thời gian"],
          ["E6", "Random Forest: 0,413 (City → Resort), 0,464 (Resort → City), 0,585 (cả hai)", "Mô hình kém khi chuyển khách sạn"],
          ["E7", "LightGBM, sigmoid: Brier 0,210 → 0,185; ROC-AUC không đổi (0,705)", "Không dùng cho mô hình chính"],
          ["E8", "Ngưỡng khóa trên val ở r = 2: MLP v2 là 0,43, chi phí val 3.757", "Đánh giá trên test ở các slide sau"],
          ["E9", "SHAP top 5: country, tháng đến, agent, lead_time, market_segment", "Sai nhiều nhất ở nhóm không đặt cọc"],
        ]}
      />
    </Frame>
  );
}

function S8() {
  return (
    <Frame
      n={3}
      title="So sánh mô hình trên tập validation (kiểm định)"
      sub="Mọi mô hình huấn luyện trên train; điểm dưới đây tính trên val, chọn theo PR-AUC"
    >
      <Table
        cols={["Mô hình", "Đặc điểm mô hình", "PR-AUC", "ROC-AUC", "Ngưỡng r = 2"]}
        widths="400px 1fr 190px 190px 270px"
        fs={29}
        py={17}
        start={520}
        step={230}
        hl={{ 4: "cool" }}
        colCls={["strong", "", "nm", "nm", "nm"]}
        rows={[
          ["Dummy", "Mốc cơ sở để đối chiếu", "0,284", "0,500", "không đoán hủy"],
          ["Logistic Regression", "Mô hình tuyến tính, dễ diễn giải", "0,573", "0,784", "0,67"],
          ["Decision Tree", "Mô hình dạng cây, dễ quan sát các quy tắc", "0,508", "0,767", "0,60"],
          ["LightGBM + SMOTENC", "Mô hình boosting kết hợp xử lý mất cân bằng lớp", "0,575", "0,771", "0,58"],
          ["MLP", "Mạng nơ-ron học các quan hệ phi tuyến", "0,631", "0,813", "0,43"],
        ]}
      />
      <Callout d={1900}>
        MLP đạt PR-AUC cao nhất trên validation và được chọn làm mô hình chính. Tuy nhiên, MLP được tinh chỉnh nhiều
        hơn các mô hình còn lại.
      </Callout>
    </Frame>
  );
}

function S9() {
  return (
    <Frame
      n={0}
      title="Kết quả phân loại trên test"
      sub="31.529 đơn mô hình chưa từng thấy, tỉ lệ hủy 32,0% (mốc PR-AUC của Dummy)"
    >
      <Table
        cols={["Mô hình", "Ngưỡng", "PR-AUC", "ROC-AUC", "Precision", "Recall"]}
        widths="1fr 190px 190px 200px 210px 190px"
        fs={30}
        py={17}
        start={520}
        step={230}
        hl={{ 4: "cool" }}
        colCls={["strong", "nm", "nm", "nm", "nm", "nm"]}
        rows={[
          ["Dummy", "0,99", "0,320", "0,500", "0", "0"],
          ["Logistic Regression", "0,67", "0,594", "0,779", "0,733", "0,097"],
          ["Decision Tree", "0,60", "0,505", "0,731", "0,977", "0,033"],
          ["LightGBM + SMOTENC", "0,58", "0,611", "0,785", "0,684", "0,217"],
          ["MLP", "0,43", "0,616", "0,793", "0,589", "0,495"],
        ]}
      />
      <Callout d={1900}>
        MLP đứng đầu PR-AUC và ROC-AUC. Tree và LogReg có precision cao nhưng bỏ sót gần hết đơn hủy (recall ≤ 0,10).
      </Callout>
    </Frame>
  );
}

/* Biểu đồ cột: độ dài cột tỉ lệ đúng với giá trị gốc */
const BARS: { label: string; text: string; v: number; tone: string; strong?: boolean }[] = [
  { label: "Không overbook", text: "10.102", v: 10102, tone: "gray" },
  { label: "Logistic Regression", text: "9.835", v: 9835, tone: "teal" },
  { label: "Decision Tree", text: "9.781", v: 9781, tone: "teal" },
  { label: "LightGBM + SMOTENC", text: "9.938", v: 9938, tone: "teal" },
  { label: "MLP v2", text: "12.071", v: 12071, tone: "rust", strong: true },
];
const BAR_MAX = 12071;
const BAR_PX = 940;

function S10() {
  return (
    <Frame
      n={1}
      title="Chi phí overbooking trên test (r = 2)"
      sub="Không overbook tốn 10.102 (chi phí), bằng số đơn hủy thật. Thấp hơn nghĩa là có lợi"
    >
      <Rv k="zoom" d={380} dur={800} className="chart">
        {BARS.map((b, i) => {
          const ld = 600 + i * 170;
          const bd = ld + 420;
          return (
            <div className="bar-row" key={b.label}>
              <Rv k="left" d={ld} dur={600} className={`bar-label ${b.strong ? "strong" : ""}`}>
                {b.label}
              </Rv>
              <div className="bar-track">
                <Rv
                  k="drop"
                  d={bd}
                  dur={1250}
                  className={`bar ${b.tone}`}
                  style={{ width: (b.v / BAR_MAX) * BAR_PX }}
                />
                <Rv k="fade" d={bd} dur={400} className={`bar-val ${b.tone}`}>
                  <T d={bd} dur={1250}>
                    {b.text}
                  </T>
                </Rv>
              </div>
            </div>
          );
        })}
      </Rv>
      <Callout d={2300}>
        <T d={2400}>MLP tốn hơn 19,5%: ngưỡng 0,43 overbook nhầm 3.483 đơn (FP × 2 = 6.966) cộng 5.105 đơn hủy bị bỏ lỡ.</T>
      </Callout>
    </Frame>
  );
}

function S11() {
  return (
    <Frame
      n={2}
      title="Độ nhạy theo r"
      sub="Mỗi r có ngưỡng riêng, chọn trên val và khóa trước khi mở test"
    >
      <Table
        cols={["r", "Ngưỡng khóa", "Chi phí test", "So với không overbook (10.102)"]}
        widths="220px 340px 400px 1fr"
        fs={31}
        py={20}
        start={520}
        step={240}
        hl={{ 2: "warm" }}
        colCls={["nm strong", "nm", "nm", ""]}
        rows={[
          ["0,5", "0,18", "5.809", { t: "tiết kiệm 42,49%", cls: "good" }],
          ["1", "0,26", "9.271", { t: "tiết kiệm 8,23%", cls: "good" }],
          ["2", "0,43", "12.071", { t: "tệ hơn 19,5%", cls: "bad" }],
          ["3", "0,57", "10.509", { t: "tệ hơn 4,03%", cls: "bad" }],
          ["5", "0,79", "9.795", { t: "tiết kiệm 3,04%", cls: "good" }],
        ]}
      />
      <Callout d={2000}>
        Lưu ý: Hiệu quả phụ thuộc vào mức chi phí giả định; kết quả cần được kiểm tra thêm với dữ liệu và chi phí thực tế.
      </Callout>
    </Frame>
  );
}

function S12() {
  return (
    <Frame
      n={3}
      title="Mô hình dựa vào đâu để dự đoán?"
      sub="Năm đặc trưng (cột) ảnh hưởng nhiều nhất theo SHAP"
    >
      <Table
        cols={["Hạng", "Đặc trưng", "Ý nghĩa"]}
        widths="200px 520px 1fr"
        fs={32}
        py={21}
        start={520}
        step={240}
        colCls={["nm strong", "mono", ""]}
        rows={[
          ["1", "country", "Quốc gia của khách"],
          ["2", "arrival_date_month", "Tháng khách đến"],
          ["3", "agent", "Đại lý đặt phòng"],
          ["4", "lead_time", "Số ngày từ lúc đặt đến lúc đến"],
          ["5", "market_segment", "Phân khúc thị trường"],
        ]}
      />
      <Callout d={1950}>
        SHAP chỉ mô tả hành vi mô hình, không chứng minh cột nào gây ra việc hủy; tháng và quốc gia cần kiểm tra thêm vì
        val diễn ra sau train.
      </Callout>
    </Frame>
  );
}

function S13() {
  return (
    <Frame
      n={0}
      title="Web demo SmartStay AI"
      sub="Streamlit, 7 trang, dùng đúng mô hình và ngưỡng đã khóa của protocol-v1"
    >
      <Table
        cols={["Trang", "Chức năng"]}
        widths="560px 1fr"
        fs={33}
        py={23}
        start={520}
        step={230}
        colCls={["strong", ""]}
        rows={[
          ["Dự đoán", "Nhập một đơn, xem mức nguy cơ và lý do"],
          ["Chấm hàng loạt", "Tải danh sách đơn, nhận bảng xếp hạng"],
          ["Một tuần vận hành", "Mô phỏng overbook theo mô hình"],
          ["Kết quả mô hình", "Chi phí từng mô hình trên test"],
          ["Thử mức chi phí", "Kéo r, xem đường chi phí theo ngưỡng"],
          ["Giới hạn, Về dự án", "Hạn chế đã biết, giải thích thuật ngữ"],
        ]}
      />
    </Frame>
  );
}

const LIMITS = [
  "Chi phí r chỉ là giả định, chưa có số liệu thật của khách sạn",
  "Xác suất MLP chưa hiệu chỉnh; tỉ lệ hủy trôi 24% → 28% → 32%",
  "Điểm val lạc quan (33 lần thử); ngưỡng dao động 0,43–0,70 giữa các seed",
  "Train-only: bốn tháng val gần test nhất không dùng để huấn luyện",
  "Chỉ hai khách sạn, giai đoạn 2015–2017",
  "Loại special_requests có thể làm mất 0,05–0,08 PR-AUC",
  "Xóa dòng trùng khi không có mã đặt phòng nên không rõ là bản ghi lặp hay đơn thật",
];

function S14() {
  return (
    <Frame n={1} title="Hạn chế" sub="Những điều khiến kết quả chưa thể dùng để ra quyết định">
      <Rv k="zoom" d={420} dur={800} className="card list">
        <ul>
          {LIMITS.map((t, i) => (
            <Rv as="li" k="left" d={650 + i * 260} dur={700} key={i}>
              <T d={750 + i * 260}>{t}</T>
            </Rv>
          ))}
        </ul>
      </Rv>
    </Frame>
  );
}

function S15() {
  return (
    <Frame n={2} tone="ink" title="Kết luận" sub="Dự đoán rủi ro và mô phỏng chi phí: kết quả và ý nghĩa">
      <div className="grid3">
        <Rv k="up" d={520} className="card glass">
          <h3>Đã thực hiện</h3>
          <p>Xây dựng quy trình từ xử lý dữ liệu, so sánh mô hình, các kịch bản thử nghiệm đến web demo.</p>
        </Rv>
        <Rv k="up" d={780} className="card glass">
          <h3>Kết quả dự đoán</h3>
          <p>
            <T d={950}>MLP đạt PR-AUC 0,616 trên test; nhận diện 49,5% đơn hủy tại ngưỡng 0,43.</T>
          </p>
        </Rv>
        <Rv k="up" d={1040} className="card glass">
          <h3>Kết quả nghiệp vụ</h3>
          <p>
            <T d={1200}>Ở r = 2, chi phí MLP là 12.071, tệ hơn 19,5% so với không overbook (chi phí 10.102).</T>
          </p>
        </Rv>
      </div>
      <div className="closing">
        <Rv k="wipe" d={1700} dur={1100} className="closing-main">
          Dự đoán tốt chưa chắc tạo ra quyết định có lợi về chi phí.
        </Rv>
        <Rv k="fade" d={2300} dur={900} className="closing-note">
          Chi phí dựa trên mô phỏng và các giả định của nhóm.
        </Rv>
      </div>
    </Frame>
  );
}

function S16() {
  return (
    <Frame n={3} title="Hướng phát triển tiếp theo">
      <Table
        cols={["Hướng", "Việc cần làm", "Vấn đề giải quyết"]}
        widths="400px 800px 1fr"
        fs={29}
        py={20}
        start={420}
        step={260}
        colCls={["strong", "", "amber"]}
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
    </Frame>
  );
}

export const SLIDES: (() => ReactNode)[] = [
  () => <Cover />,
  () => <S2 />,
  () => <S3 />,
  () => <S4 />,
  () => <S5 />,
  () => <S6 />,
  () => <S7 />,
  () => <S8 />,
  () => <S9 />,
  () => <S10 />,
  () => <S11 />,
  () => <S12 />,
  () => <S13 />,
  () => <S14 />,
  () => <S15 />,
  () => <S16 />,
];
