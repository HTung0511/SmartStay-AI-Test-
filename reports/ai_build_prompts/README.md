# Bộ prompt cho AI Building — chia theo giai đoạn (N4: Hoàng Tùng)
## SmartStay AI • 20/11/2026 • Nguồn chuẩn: `reports/final_protocol.md` (bản thật từ repo nhóm, ĐÃ CHỐT v1)

**CÁCH LÀM VIỆC THẬT (đọc kỹ, mâu thuẫn với file này ⇒ file này đúng):**
- Bạn (AI Building) làm việc **trong repo cá nhân `HTung0511/SmartStay-AI-Test-`**, trên **đúng branch Arena đã gán cho phiên** (vd `arena/xxxx-smartstay-ai-test`). KHÔNG `git checkout`/tạo branch khác — thay đổi ngoài branch của phiên không được Arena ghi nhận và sẽ gây kẹt vòng lặp.
- Repo này **đã đồng bộ với repo nhóm** (20/11/2026, lấy từ `main` nhóm `3c8bd1b`; nhánh `sync/group-2026-11-20` đã được tạo trên repo cá nhân — xem điều kiện tiên quyết bên dưới). Các file khóa đều **nằm sẵn trong repo**: `reports/final_protocol.md` (ĐÃ CHỐT v1), `models/Tung_mlp_v2.joblib` + `models/proba_val_Tung_mlp_v2.npy`, `models/logreg.joblib`, `models/tree.joblib` + proba val tương ứng, `.gitignore`, `reports/results/tuan.csv`, `nguoi2.csv`.
- **KHÔNG clone/fetch repo nhóm.** Mọi file bạn cần đều có sẵn. Nếu phát hiện **thiếu hoặc lệch hash** → DỪNG NGAY, dán output cho N4 (khả năng `main` chưa hợp nhánh sync). Không tự đi tải/copy từ đâu khác.
- Deliverable (code, notebook, `frozen_thresholds.csv`) nằm trên branch Arena; **Tùng chuyển sang repo nhóm bằng tay** (PR/merge/tag thuộc nhóm trưởng). Bạn không push/merge/PR/tag repo nhóm.
- Mọi bước chạy đều **chỉ dùng val**; `test.csv` không bao giờ được đọc.

**Điều kiện tiên quyết (N4 chịu trách nhiệm, bạn chỉ kiểm, không tự xử lý):** `main` của repo cá nhân đã hợp `sync/group-2026-11-20`. Mọi kiểm tra "file có sẵn?" đều phải ĐẠT; không ĐẠT → DỪNG, báo N4.

**Cách dùng bộ prompt:** dán **00_briefing.md TRƯỚC** → sau đó 01 → 05 theo thứ tự; mỗi phần chỉ dán khi phần trước đã nộp và N4 đã duyệt. Mỗi file tự đủ để dán riêng.
Mới: **`AI_BUILDING_CHAT_SOURCE.md`** — chat mở đầu chi tiết; Tùng dán (hoặc để AI Building tự mở) TRƯỚC Phần 0.


| File | Nội dung | Được chạy? | Nghiệm thu |
|---|---|---|---|
| `00_briefing.md` | Briefing: bối cảnh, repo/quyền, trạng thái nhóm, quy trình | Không code | Đọc & xác nhận trước Phần 1 |
| `01_final_eval_core.md` | Kiểm tra file khóa (đã đồng bộ) + viết `src/final_eval.py` | Chỉ **val** | `python -m src.final_eval Tung_mlp_v2` → 0,43 / 3.757 (r=2) |
| `02_frozen_thresholds.md` | Sinh `frozen_thresholds.csv` (logreg/tree/…) | Chỉ **val** | File cuối: đủ dòng, không trùng, MLP r=2 đúng |
| `03_notebook_gates.md` | `07_final_test.ipynb`: cấu hình + GATE + PRE-FLIGHT | Dừng **trước khi đọc test** | Restart & Run All dừng đúng PRE-FLIGHT/GATE |
| `04_notebook_pipeline.md` | Cell FINAL=True (chỉ viết, KHÔNG chạy) | **Không chạy** | Kiểm tra tĩnh đạt |
| `05_handoff_checklist.md` | Tự rà + bàn giao cho N4 | Không thêm việc | Đủ (a)–(e) |

**Luật vàng (nhắc lại ở mọi phần):**
1. **KHÔNG mở/đọc `data/processed/test.csv`.**
2. Không sửa `src/cost.py`, `src/data.py`, `src/features.py`, `src/evaluate.py`, `src/calibration.py`, `reports/final_protocol.md`.
3. Không đổi `DEFAULT_THRESHOLDS`, quy tắc hòa (lấy ngưỡng thấp nhất), r ∈ {0,5; 1; 2; 3; 5; 10}, naming `Tung_mlp_v2`, file model.
4. Không tạo `test_final*` / `proba_test_*.npy` / `test_run_log.md` — chúng chỉ xuất hiện khi N4 chạy FINAL=True (trong clone repo nhóm).
5. **Bất kỳ kiểm tra/nghiệm thu nào FAIL → DỪNG NGAY. Dán nguyên văn output cho N4. KHÔNG thử lặp đi lặp lại, KHÔNG "sửa cho qua cổng".**
6. Thiếu thông tin/mâu thuẫn → DỪNG, hỏi N4 (trừ điểm đã chốt sẵn). Nếu mâu thuẫn `reports/final_protocol.md` → protocol thắng.

**Môi trường chuẩn:** Python 3.11.2, scikit-learn 1.9.1, numpy 2.4.6, pandas 3.1.1, joblib 1.6.0. Khác phiên bản → ghi rõ, không sửa protocol.
