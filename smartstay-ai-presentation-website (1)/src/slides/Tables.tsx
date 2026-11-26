import bandLobby from "../assets/b-lobby.jpg";
import bandHall from "../assets/b-hall.jpg";
import bandCorridor from "../assets/b-corridor.jpg";
import bandRoom1 from "../assets/b-room1.jpg";
import bandRoom2 from "../assets/b-room2.jpg";
import bandRoom3 from "../assets/b-room3.jpg";
import bandRoom4 from "../assets/b-room4.jpg";
import bandRoom5 from "../assets/b-room5.jpg";
import bandLobby2 from "../assets/b-lobby2.jpg";
import bandLaptop from "../assets/b-laptop.jpg";
import { DataTable, ECode, NoteBar, SlideShell } from "./ui";

const E = (n: string) => <ECode>{n}</ECode>;

/* ------------------------------ Slide 2 ------------------------------ */
export function AssignmentSlide() {
  return (
    <SlideShell
      band={bandLobby}
      title="Phân công công việc"
      subtitle="Mỗi thành viên phụ trách một nhóm mô hình và các thực nghiệm đi kèm"
    >
      <DataTable
        size="md"
        columns={[
          { label: "Thành viên", w: "280px" },
          { label: "Mô hình", w: "1fr" },
          { label: "Thực nghiệm và công việc", w: "1.7fr" },
        ]}
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
          [
            "Trần Hoàng Tùng",
            "MLP",
            "E8 ngưỡng theo chi phí; bootstrap, ngưỡng khóa; web demo Streamlit",
          ],
        ]}
      />
      <NoteBar delay={1000} className="mt-[28px]">
        E1 (so sánh mô hình) và E2 (xử lý mất cân bằng lớp): mỗi thành viên tự chạy trên mô hình của mình.
      </NoteBar>
    </SlideShell>
  );
}

/* ------------------------------ Slide 5 ------------------------------ */
export function CleaningSlide() {
  return (
    <SlideShell
      band={bandHall}
      title="Các quyết định làm sạch quan trọng"
      subtitle="Mỗi quyết định đều ghi vào cleaning log (34 bước), kể cả quyết định giữ lại"
    >
      <DataTable
        size="lg"
        columns={[
          { label: "Quyết định", w: "400px" },
          { label: "Quy mô", w: "250px" },
          { label: "Lý do", w: "1fr" },
        ]}
        rows={[
          ["Xóa dòng trùng hoàn toàn", "31.994 dòng", "Nhóm trùng hủy 63,1% so với 37,0% chung; giữ lại làm điểm đẹp giả (E3)"],
          ["Loại cột rò rỉ nhãn", "6 cột", "Chỉ biết sau khi đặt phòng, như reservation_status"],
          ["Xóa bản ghi bất khả", "166 + 591 dòng", "166 dòng không có khách, 591 dòng 0 đêm"],
          ["Giữ adr = 0", "420 dòng", "Hủy chỉ 13,3%, có thể là đặt phòng tặng, không phải lỗi"],
          ["Bỏ special_requests", "1 cột", "Nghi rò rỉ nhãn; chấp nhận mất 0,05–0,08 PR-AUC (E4)"],
        ]}
      />
    </SlideShell>
  );
}

/* ------------------------------ Slide 6 ------------------------------ */
export function ScenariosSlide() {
  return (
    <SlideShell band={bandCorridor} title="Chín kịch bản thực nghiệm">
      <DataTable
        size="md"
        columns={[
          { label: "#", w: "110px" },
          { label: "Thực nghiệm", w: "520px" },
          { label: "Lý do / mục đích", w: "1fr" },
        ]}
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
    </SlideShell>
  );
}

/* ------------------------------ Slide 7 ------------------------------ */
export function ResultsSlide() {
  return (
    <SlideShell band={bandRoom1} title="Kết quả của chín thực nghiệm">
      <DataTable
        size="xs"
        columns={[
          { label: "#", w: "96px" },
          { label: "Kết quả chính", w: "1fr" },
          { label: "Quyết định / kết luận", w: "540px" },
        ]}
        rows={[
          [E("E1"), "MLP cao nhất, PR-AUC val 0,631; LogReg 0,573, Tree 0,508", "Chọn MLP v2 làm mô hình chính"],
          [E("E2"), "LogReg: recall 0,148 → 0,537, PR-AUC giảm nhẹ; LightGBM: 0,546 → 0,576", "Chỉ SMOTENC có ích, cho LightGBM"],
          [E("E3"), "Giữ trùng: PR-AUC báo cáo 0,803 so với 0,571, kém hơn ~0,01 trên val sạch", "Xóa dòng trùng"],
          [E("E4"), "adr đóng góp nhỏ; special_requests +0,081 (LogReg), +0,049 (RF)", "Giữ adr; loại special_requests (nghi rò rỉ)"],
          [E("E5"), "Random Forest: PR-AUC 0,685 (ngẫu nhiên) so với 0,592 (theo thời gian)", "Chia theo thời gian"],
          [E("E6"), "Random Forest: 0,413 (City → Resort), 0,464 (Resort → City), 0,585 (cả hai)", "Mô hình kém khi chuyển khách sạn"],
          [E("E7"), "LightGBM, sigmoid: Brier 0,210 → 0,185; ROC-AUC không đổi (0,705)", "Không dùng cho mô hình chính"],
          [E("E8"), "Ngưỡng khóa trên val ở r = 2: MLP v2 là 0,43, chi phí val 3.757", "Đánh giá trên test ở các slide sau"],
          [E("E9"), "SHAP top 5: country, tháng đến, agent, lead_time, market_segment", "Sai nhiều nhất ở nhóm không đặt cọc"],
        ]}
      />
    </SlideShell>
  );
}

/* ------------------------------ Slide 8 ------------------------------ */
export function ValidationSlide() {
  return (
    <SlideShell
      band={bandRoom2}
      title="So sánh mô hình trên tập validation (kiểm định)"
      subtitle="Mọi mô hình huấn luyện trên train; điểm dưới đây tính trên val, chọn theo PR-AUC"
    >
      <DataTable
        size="md"
        highlight={[4]}
        columns={[
          { label: "Mô hình", w: "340px" },
          { label: "Đặc điểm mô hình", w: "1fr" },
          { label: "PR-AUC", w: "170px" },
          { label: "ROC-AUC", w: "170px" },
          { label: "Ngưỡng r = 2", w: "250px" },
        ]}
        rows={[
          ["Dummy", "Mốc cơ sở để đối chiếu", "0,284", "0,500", "không đoán hủy"],
          ["Logistic Regression", "Mô hình tuyến tính, dễ diễn giải", "0,573", "0,784", "0,67"],
          ["Decision Tree", "Mô hình dạng cây, dễ quan sát các quy tắc", "0,508", "0,767", "0,60"],
          ["LightGBM + SMOTENC", "Mô hình boosting kết hợp xử lý mất cân bằng lớp", "0,575", "0,771", "0,58"],
          ["MLP", "Mạng nơ-ron học các quan hệ phi tuyến", "0,631", "0,813", "0,43"],
        ]}
      />
      <NoteBar delay={1100} className="mt-[28px]">
        MLP đạt PR-AUC cao nhất trên validation và được chọn làm mô hình chính. Tuy nhiên, MLP được tinh chỉnh nhiều hơn các mô hình còn lại.
      </NoteBar>
    </SlideShell>
  );
}

/* ------------------------------ Slide 9 ------------------------------ */
export function TestResultsSlide() {
  return (
    <SlideShell
      band={bandRoom3}
      title="Kết quả phân loại trên test"
      subtitle="31.529 đơn mô hình chưa từng thấy, tỉ lệ hủy 32,0% (mốc PR-AUC của Dummy)"
    >
      <DataTable
        size="lg"
        highlight={[4]}
        columns={[
          { label: "Mô hình", w: "2fr" },
          { label: "Ngưỡng", w: "1fr" },
          { label: "PR-AUC", w: "1fr" },
          { label: "ROC-AUC", w: "1fr" },
          { label: "Precision", w: "1fr" },
          { label: "Recall", w: "1fr" },
        ]}
        rows={[
          ["Dummy", "0,99", "0,320", "0,500", "0", "0"],
          ["Logistic Regression", "0,67", "0,594", "0,779", "0,733", "0,097"],
          ["Decision Tree", "0,60", "0,505", "0,731", "0,977", "0,033"],
          ["LightGBM + SMOTENC", "0,58", "0,611", "0,785", "0,684", "0,217"],
          ["MLP", "0,43", "0,616", "0,793", "0,589", "0,495"],
        ]}
      />
      <NoteBar delay={1100} className="mt-[28px]">
        MLP đứng đầu PR-AUC và ROC-AUC. Tree và LogReg có precision cao nhưng bỏ sót gần hết đơn hủy (recall ≤ 0,10).
      </NoteBar>
    </SlideShell>
  );
}

/* ------------------------------ Slide 11 ----------------------------- */
const save = (t: string) => <span className="font-semibold text-teal-ink">{t}</span>;
const worse = (t: string) => <span className="font-semibold text-rust">{t}</span>;

export function SensitivitySlide() {
  return (
    <SlideShell
      band={bandRoom4}
      title="Độ nhạy theo r"
      subtitle="Mỗi r có ngưỡng riêng, chọn trên val và khóa trước khi mở test"
    >
      <DataTable
        size="lg"
        highlight={[2]}
        columns={[
          { label: "r", w: "200px" },
          { label: "Ngưỡng khóa", w: "1fr" },
          { label: "Chi phí test", w: "1fr" },
          { label: "So với không overbook (10.102)", w: "1.6fr" },
        ]}
        rows={[
          ["0,5", "0,18", "5.809", save("tiết kiệm 42,49%")],
          ["1", "0,26", "9.271", save("tiết kiệm 8,23%")],
          ["2", "0,43", "12.071", worse("tệ hơn 19,5%")],
          ["3", "0,57", "10.509", worse("tệ hơn 4,03%")],
          ["5", "0,79", "9.795", save("tiết kiệm 3,04%")],
        ]}
      />
      <NoteBar delay={1100} className="mt-[28px]">
        Lưu ý: Hiệu quả phụ thuộc vào mức chi phí giả định; kết quả cần được kiểm tra thêm với dữ liệu và chi phí thực tế.
      </NoteBar>
    </SlideShell>
  );
}

/* ------------------------------ Slide 12 ----------------------------- */
const rank = (n: string) => (
  <span className="inline-flex h-[42px] w-[42px] items-center justify-center rounded-full bg-navy text-[24px] font-bold text-gold-soft">
    {n}
  </span>
);
const feature = (t: string) => <span className="font-mono text-[25px] font-semibold text-teal-ink">{t}</span>;

export function ShapSlide() {
  return (
    <SlideShell
      band={bandLobby2}
      title="Mô hình dựa vào đâu để dự đoán?"
      subtitle="Năm đặc trưng (cột) ảnh hưởng nhiều nhất theo SHAP"
    >
      <DataTable
        size="lg"
        columns={[
          { label: "Hạng", w: "170px" },
          { label: "Đặc trưng", w: "1fr" },
          { label: "Ý nghĩa", w: "1.4fr" },
        ]}
        rows={[
          [rank("1"), feature("country"), "Quốc gia của khách"],
          [rank("2"), feature("arrival_date_month"), "Tháng khách đến"],
          [rank("3"), feature("agent"), "Đại lý đặt phòng"],
          [rank("4"), feature("lead_time"), "Số ngày từ lúc đặt đến lúc đến"],
          [rank("5"), feature("market_segment"), "Phân khúc thị trường"],
        ]}
      />
      <NoteBar delay={1100} className="mt-[28px]">
        SHAP chỉ mô tả hành vi mô hình, không chứng minh cột nào gây ra việc hủy; tháng và quốc gia cần kiểm tra thêm vì val diễn ra sau train.
      </NoteBar>
    </SlideShell>
  );
}

/* ------------------------------ Slide 13 ----------------------------- */
export function DemoSlide() {
  return (
    <SlideShell
      band={bandLaptop}
      title="Web demo SmartStay AI"
      subtitle="Streamlit, 7 trang, dùng đúng mô hình và ngưỡng đã khóa của protocol-v1"
    >
      <DataTable
        size="lg"
        columns={[
          { label: "Trang", w: "520px" },
          { label: "Chức năng", w: "1fr" },
        ]}
        rows={[
          ["Dự đoán", "Nhập một đơn, xem mức nguy cơ và lý do"],
          ["Chấm hàng loạt", "Tải danh sách đơn, nhận bảng xếp hạng"],
          ["Một tuần vận hành", "Mô phỏng overbook theo mô hình"],
          ["Kết quả mô hình", "Chi phí từng mô hình trên test"],
          ["Thử mức chi phí", "Kéo r, xem đường chi phí theo ngưỡng"],
          ["Giới hạn, Về dự án", "Hạn chế đã biết, giải thích thuật ngữ"],
        ]}
      />
    </SlideShell>
  );
}

/* ------------------------------ Slide 16 ----------------------------- */
export function NextStepsSlide() {
  return (
    <SlideShell band={bandRoom5} title="Hướng phát triển tiếp theo">
      <DataTable
        size="md"
        columns={[
          { label: "Hướng", w: "320px" },
          { label: "Việc cần làm", w: "1.6fr" },
          { label: "Vấn đề giải quyết", w: "1fr" },
        ]}
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
    </SlideShell>
  );
}
