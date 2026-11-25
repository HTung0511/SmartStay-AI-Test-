# Báo cáo SmartStay AI V4: nhật ký biên tập

- Bản biên tập (bản sao): https://docs.google.com/document/d/1onyxO0fKMV6RNlZGceZ8AJk6CyV8QjofQJ4x05poeWc/edit
- Bản gốc: https://docs.google.com/document/d/1ZP1MKfa8M7-hSVKCG0bMFlw-Jz0ewDVVFBrgd9R4tJc/edit (không bị sửa)
- Số liệu đối chiếu với artifact của repo nhóm, tag `protocol-v1` (81096126) và commit FINAL 96c3575: `test_final*.csv`, `test_run_log.md`, `frozen_thresholds.csv`, `final_protocol.md`, `cleaning_log.csv`, `nguoi3_shap_importance.csv`.

## Phần giữ nguyên
- Trang bìa, gồm dòng "Giảng viên: Hoàng Tiểu Bình".
- Bảng phân công.
- Mọi ô [điền].
- Số hiệu Bảng n / Hình n.
- Khung mục và cách đánh số.
- Tài liệu tham khảo [1].
- Mọi con số. Không con số nào được làm tròn, quy đổi hay sửa.
- Không thêm nhận định, ví dụ hay con số mới.

## Thay đổi theo từng mục
| Vị trí | Thay đổi |
|---|---|
| MỞ ĐẦU | Viết lại thành 3 đoạn ngắn: bài toán nghiệp vụ → dự án và E8 → cách chia train/val/test. Định nghĩa r = c_walk/c_empty và train/val/test ngay lần đầu xuất hiện. 4 mục tiêu được rút gọn; giải thích SMOTENC ở mục tiêu 2. |
| Phần I, 1.1 | Tách "Bài toán", "Dữ liệu" và "Rò rỉ dữ liệu" thành từng đoạn riêng. Định nghĩa data leakage một lần. Gộp 4 nguyên tắc Dữ liệu/Mô hình/Đầu ra/Báo cáo. Bỏ đường dẫn file trong câu. |
| Phần I, 1.2–1.6 | Câu ngắn hơn, mỗi gạch đầu dòng một ý. Định nghĩa PR-AUC, ROC-AUC, F1, SHAP và calibration một lần, ở lần dùng đầu. Bỏ nhãn chữ in hoa và nhãn kiểu "(bắt buộc)" (ví dụ "Rò rỉ nhãn — bắt buộc loại" giờ là một câu bình thường). |
| Phần I, 1.6 (dữ liệu) | Giữ đúng một dòng nguồn: "Nguồn số liệu: reports/cleaning_log.csv và reports/results/*.csv; Antonio et al. (2019) [1]". |
| Phần II, 2.1–2.6 | Mỗi đoạn một ý. Bỏ các ghi chú lặp và đường dẫn file trong câu. Giữ nguyên số liệu Bảng 3–6. |
| Phần II, 2.7 | Mô tả cơ chế FINAL/test một lần ở đây và chỉ ở đây: mở test đúng một lần lúc 2026-11-24 12:14; kết quả là kết quả cuối, giữ nguyên. Thêm đoạn "Phân tích sau khi mở test" để gắn nhãn post-hoc (thăm dò), cũng chỉ một lần. |
| Phần III, 2.4.2 | Kết quả bất lợi được nêu một lần, giọng bình thản: MLP tệ hơn never-overbook 19,49% ở r = 2, dù có PR-AUC/ROC-AUC cao nhất. Ô bảng "TỆ HƠN 19,49%" đổi thành "tệ hơn 19,49%". |
| Phần III, 2.4.3–2.4.7, mục 3–4 | Bỏ các câu nhắc lại tính toàn vẹn của test và nhãn post-hoc (đã nêu ở 2.7). Viết lại phần nhận xét thành câu ngắn. |
| Phần IV / Kết luận | Rút gọn. Bỏ phần nhắc lại nhãn post-hoc. |
| Phụ lục | Giữ A (giao thức và mã băm). Gộp B (nhật ký chạy test), C (các bước tái lập) và D (danh sách artifact) thành "Phụ lục B. Tái lập và minh chứng": tóm tắt lần chạy test, 6 bước tái lập, danh sách 12 artifact. E đổi tên thành "Phụ lục C. Ghi chú đọc kết quả" và còn 3 gạch đầu dòng. |

## Việc cần làm thủ công
- MỤC LỤC là mục lục tự sinh nên API không sửa được. Trong Google Docs, bấm vào mục lục rồi bấm "Cập nhật mục lục" để các dòng phụ lục cũ (B–E) thành "Phụ lục B. Tái lập và minh chứng" và "Phụ lục C. Ghi chú đọc kết quả".

## Câu hỏi cần rà soát (chưa sửa trong văn bản)
1. Neo "logreg F1 0,5943" thực ra là PR-AUC của LogReg. Theo test_final.csv, F1 của LogReg là 0,1712.
2. Tỉ lệ hủy của tập train: mục 1.6c ghi 24,0%, mục 2.4.6 ghi khoảng 28%.
3. Câu "Tháng 7 kém nhất trên mọi chỉ số" không đúng. Recall tháng 2 là 0,376, thấp hơn tháng 7 (0,382). Precision tháng 3 là 0,538, thấp hơn tháng 7 (0,555). Văn bản cũng ghi 0,561, trong khi artifact là 0,5612.
4. Bảng 3, các dòng 6–14, lệch so với cleaning_log: "adr > 5.400" (log dùng ngưỡng > 1000); "~770" (tổng là 779); "4 dòng phi thực tế khác".
5. Nhãn "Tỷ lệ tiết kiệm chuẩn hóa" thực chất là chi phí trên mỗi đặt phòng.
6. Câu so sánh City/Resort ở 2.4.4 bị lộn: ROC-AUC của Resort cao hơn (0,822 so với 0,790).
7. Một số số liệu đã làm tròn: 19,5%, 32,0%, 3,5% (artifact là 3,54% / 3,45%).
8. Nhận xét 5 đặt deposit_type lên đầu, nhưng SHAP xếp nó thứ 10. Thứ tự SHAP: country, arrival_date_month, agent, lead_time, market_segment.
9. Mục 2.2 dẫn "mục 5" của protocol. Phương án A nằm ở mục 4.
10. Câu "baseline (E1–E3) → mô hình (E4–E6)" không khớp cách đánh số thí nghiệm ở Bảng 1.
11. Bảng 11 gắn nhãn "ngưỡng 0,43" cho PR-AUC/ROC-AUC, là các chỉ số không phụ thuộc ngưỡng.
12. Câu "MLP thắng ở cả val lẫn test" chỉ đúng với PR-AUC/ROC-AUC, không đúng với chi phí.
13. Protocol nêu hai giá trị xác suất thô trung bình khác nhau (15,7% và 17,9%).
14. Một câu ở mục 2.5 bị bỏ dở giữa chừng.
