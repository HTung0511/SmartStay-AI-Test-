# PHẦN 0 — Briefing cho AI Building (đọc TRƯỚC Phần 1)
## SmartStay AI • Dành cho AI Building, do N4 (Hoàng Tùng) giao • 20/11/2026

**Một dòng bối cảnh:** nhóm đã **CHỐT protocol đánh giá cuối (v1)**. Bạn viết code và chạy **phần val**, xong bàn giao; **tuyệt đối không mở `test.csv`**. Nguồn chuẩn duy nhất: `reports/final_protocol.md` — nằm sẵn trong repo (đã đồng bộ từ repo nhóm, KHÔNG tự viết, KHÔNG sửa).

## 1. Cách làm việc — điểm dễ sai nhất
- Bạn đang đứng **trong repo cá nhân `HTung0511/SmartStay-AI-Test-`**, trên **branch Arena được gán cho phiên** (vd `arena/xxxx-smartstay-ai-test`). Ghi lại bằng `git branch --show-current` và `git log --oneline -1`.
- **KHÔNG `git checkout`/tạo branch khác** — Arena không ghi nhận thay đổi ngoài branch của phiên và sẽ gây kẹt vòng lặp.
- **Repo đã ĐỒNG BỘ với repo nhóm** (20/11/2026, từ `main` nhóm `3c8bd1b`; nhánh `sync/group-2026-11-20` trên repo cá nhân). Mọi file khóa bạn cần đều **nằm sẵn trong repo** — **KHÔNG clone/fetch repo nhóm**, không có lý do gì để tải thêm.
- **Thiếu/lệch file khóa → DỪNG NGAY, báo N4** (khả năng `main` chưa hợp nhánh `sync/group-2026-11-20`). Không tự đi kiếm file, không tạo file giả, không cập nhật hash cho khớp.
- Mọi deliverable nằm trên branch Arena của bạn; Tùng sẽ chuyển file sang repo nhóm bằng tay. Bạn không push/merge/PR/tag repo nhóm (quyền của `HTung0511` chỉ đủ push branch + PR; merge/tag thuộc nhóm trưởng).

## 2. Trạng thái nhóm (đã kiểm chứng 20/11/2026)
- `reports/final_protocol.md` — **ĐÃ CHỐT v1**: Tung_mlp_v2 là mô hình chính, ngưỡng khóa t = 0,43 (r = 2), phương án A (train-only), E7 chỉ là phân tích phụ.
- Bản sync trong repo cá nhân **byte-identical** với bản nhóm (sha256 `ce19ff7a…a4477`). Hash mục 2: train `4e75d796…`, val `1fcbee5f…`, test `2cac5114…` (chỉ băm), `Tung_mlp_v2.joblib` `5090cbc6…970`. `models/Tung_mlp_v2.joblib` trong repo cá nhân **khớp hash khóa**.
- Đã có sẵn: `models/logreg.joblib`, `tree.joblib`, `models/proba_val_logreg*.npy`, `proba_val_tree*.npy`, `proba_val_rf_*.npy`, `proba_val_Tung_mlp_v2.npy`, `.gitignore`, `reports/results/tuan.csv`, `nguoi2.csv`.
- **Chưa có:** `frozen_thresholds.csv` (bạn sinh ở Phần 2), `notebooks/07_final_test.ipynb` (Phần 3–4), **`lightgbm_smotenc` ở bất cứ đâu** (N3 đang làm — NẾU vẫn thiếu thì bỏ qua và ghi rõ, KHÔNG tạo giả), **tag `protocol-v1`** (nhóm trưởng tạo sau cùng — bạn không được tạo/đụng tag).

## 3. Quy trình làm việc và bàn giao
1. Làm đúng thứ tự bộ prompt: **01 → 02 → 03 → 04 → 05**; mỗi phần chỉ bắt đầu khi N4 duyệt phần trước.
2. Commit nhỏ, message `feat(n4): ...`; push **branch Arena hiện tại** (`git push origin HEAD`); không merge, không PR vào repo nhóm khi chưa được phép.
3. Bàn giao mỗi phần cho N4: (a) output nguyên văn các lệnh nghiệm thu; (b) `git log --oneline -3` + `git status`; (c) SHA HEAD; (d) phiên bản thư viện thực tế; (e) mọi điểm tự quyết + lý do.
4. N4 (cùng nhóm trưởng) review → Tùng chuyển deliverable sang repo nhóm → nhóm trưởng merge/tag `protocol-v1` → N4 mới chạy test **một lần**, trong clone repo nhóm, với N1 chứng kiến.

## 4. Luật bất di bất dịch
1. **KHÔNG đọc/mở/test `data/processed/test.csv`** dưới mọi hình thức; không in vài dòng; không tính gì trên nó.
2. Không sửa: `src/cost.py`, `src/data.py`, `src/features.py`, `src/evaluate.py`, `src/calibration.py`, `reports/final_protocol.md`, `.gitignore`.
3. Không đổi: `DEFAULT_THRESHOLDS`, quy tắc hòa (lấy ngưỡng thấp nhất), r ∈ {0,5; 1; 2; 3; 5; 10}, naming `Tung_mlp_v2`, tên file model, `FINAL = False`.
4. Không tạo `test_final*`, `proba_test_*.npy`, `test_run_log.md` — chúng chỉ xuất hiện khi N4 chạy FINAL=True, trong clone repo nhóm.
5. Mâu thuẫn đặc tả ↔ protocol: **protocol thắng**. Thiếu thông tin/không rõ/kiểm tra FAIL → **DỪNG và dán nguyên văn output cho N4**; không suy đoán, không thử vòng lặp, không "sửa tạm để qua cổng".

## 5. Môi trường
- Python 3.11.2, scikit-learn 1.9.1, numpy 2.4.6, pandas 3.1.1, joblib 1.6.0 (theo `requirements.txt`).
- Nếu máy khác phiên bản → ghi rõ trong bàn giao, không sửa protocol, không tự cài/nâng cấp bừa.
- `data/` và `src/` của repo đã đủ để chạy Phần 1–4 (train/val/test, cost/data/features/evaluate, model MLP). Không tải dataset ngoài, không cài package ngoài requirements.

## 6. Nếu gặp tình huống lạ — nguyên tắc chung
- Bất kỳ lệnh kiểm tra nào FAIL/không khớp kỳ vọng → DỪNG, dán nguyên văn lỗi + output cho N4; không thử đi thử lại.
- Sandbox bị dọn (mất file chưa commit): clone lại repo cá nhân từ origin — mọi file khóa nằm trong repo, không cần tải gì thêm; cẩn thận với `/tmp`.
- `git push` bị từ chối: báo N4, không spam thử.
- Nghi ngờ hash lệch: dừng, dán `sha256sum` output; **không** cập nhật hash cho khớp.
- Lỡ đọc test ngoài luồng: báo N4 ngay lập tức, ghi rõ đã làm gì — giấu là phá protocol, báo thật còn cứu được.
