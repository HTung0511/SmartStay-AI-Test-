# CHAT NGUỒN CHO AI BUILDING — đọc file này trước khi làm bất cứ việc gì
## SmartStay AI • do N4 (Hoàng Tùng) cung cấp • 20/11/2026
> File này nằm trong `reports/ai_build_prompts/` của repo `HTung0511/SmartStay-AI-Test-` trên `main`
> (sau khi PR hợp nhánh `arena/a42eaf75-smartstay-ai-test` được merge).
> AI Building: MỞ FILE NÀY ĐẦU TIÊN, sau đó đọc tiếp `README.md` ở cùng thư mục.

---

## 1. Bạn là ai, làm gì
- Bạn là **AI Building**, người viết code cho N4 (Hoàng Tùng) trong nhóm SmartStay AI.
- Nhiệm vụ: hoàn thiện **final evaluation** cho đề tài dự đoán khách hủy đặt phòng khách sạn, theo **protocol đã CHỐT (v1)**.
- Bạn KHÔNG quyết định thiết kế. Bạn viết code/notebook, chạy **phần val**, bàn giao; phán quyết cuối thuộc N4 + nhóm trưởng.

## 2. Vị trí và nhánh làm việc
- Repo: `HTung0511/SmartStay-AI-Test-` (**repo cá nhân** — KHÔNG phải repo nhóm).
- Bạn làm trên **đúng branch Arena đã gán cho phiên** (vd `arena/<id>-smartstay-ai-test`). Ghi lại: `git branch --show-current`, `git log --oneline -1`.
- **KHÔNG `git checkout`/tạo branch khác** — thay đổi ngoài branch của phiên không được Arena ghi nhận và sẽ gây kẹt.
- Deliverable cuối cùng **do N4 chuyển sang repo nhóm bằng tay** (PR/merge/tag thuộc nhóm trưởng). Bạn không push/merge/tag repo nhóm.
- **KHÔNG clone/fetch repo nhóm** — mọi file cần dùng đã nằm sẵn trong `main` (xem mục 4).

## 3. Đọc theo đúng thứ tự (mỗi bước chỉ khi bước trước N4 duyệt)
1. `reports/ai_build_prompts/README.md` — cách dùng bộ prompt + luật vàng.
2. `reports/ai_build_prompts/00_briefing.md` — bối cảnh, repo/quyền, trạng thái, quy trình.
3. `reports/ai_build_prompts/01_final_eval_core.md` — kiểm tra file khóa + viết `src/final_eval.py`.
4. `reports/ai_build_prompts/02_frozen_thresholds.md` — sinh `reports/results/frozen_thresholds.csv`.
5. `reports/ai_build_prompts/03_notebook_gates.md` — `notebooks/07_final_test.ipynb`: cấu hình + GATE + PRE-FLIGHT (FINAL=False).
6. `reports/ai_build_prompts/04_notebook_pipeline.md` — viết cells FINAL=True (KHÔNG CHẠY).
7. `reports/ai_build_prompts/05_handoff_checklist.md` — tự rà + bàn giao.

## 4. Trạng thái repo tại thời điểm CHỐT THƯ TÍN NÀY
- `main` đã merge `sync/group-2026-11-20` (PR #4, `eca4fc9`), đồng bộ từ **repo nhóm `3c8bd1b`** (20/11/2026).
- ĐÃ CÓ SẴN (nằm trong repo, commit `80fa2bb`):
  - `reports/final_protocol.md` — **ĐÃ CHỐT, phiên bản v1** (sha256 `ce19ff7a7d57c9c0941fa3ba7ca0adba627a7cd06b571e6a474c9f8a561a4477`).
  - `models/Tung_mlp_v2.joblib` (sha256 `5090cbc6273c034ad4446a69b9f8e728217a6a956084de504ca248553759b970`), `models/proba_val_Tung_mlp_v2.npy` (14400 phần tử).
  - `models/logreg.joblib`, `models/tree.joblib`, `models/proba_val_logreg.npy`, `models/proba_val_logreg_SMOTE.npy`, `models/proba_val_logreg_balanced.npy`, `models/proba_val_tree.npy`, `models/proba_val_tree_SMOTE.npy`, `models/proba_val_tree_balanced.npy`, `models/proba_val_tree_none_onehot.npy`, `models/proba_val_rf_balanced.npy`, `models/proba_val_rf_smote.npy`.
  - `reports/results/tuan.csv`, `nguoi2.csv`, notebooks N1/N2 (`04_models_nguoi2.ipynb`, `04_models_tuan.ipynb`, `05_e3_duplicates.ipynb`, `06_e4_adr_requests.ipynb`), hình E9, `.gitignore`.
- CHƯA CÓ: `src/final_eval.py` (bạn viết ở Phần 1), `frozen_thresholds.csv` (Phần 2), `notebooks/07_final_test.ipynb` (Phần 3–4), **`lightgbm_smotenc` ở bất cứ đâu** (N3 chưa xong; thiếu → bỏ qua, ghi "CHƯA CÓ FILE", KHÔNG tạo giả), **tag `protocol-v1`** (nhóm trưởng tạo sau cuối, sau khi mọi thứ bàn giao), **`data/processed/test.csv` chỉ tồn tại để băm — KHÔNG BAO GIỜ được mở**.
- Hash mục 2 protocol: train `4e75d796…`, val `1fcbee5f…`, test `2cac5114…` (chỉ băm, không đọc nội dung), Tung_mlp_v2 `5090cbc6…970`.

## 5. Số nghiệm thu bắt buộc (val)
```
python -m src.final_eval Tung_mlp_v2
```
r=0,5 → 0,18 / 2437.5 • r=1 → 0,26 / 3275.0 • r=2 → **0,43 / 3757.0** • r=3 → 0,57 / 3874.0 • r=5 → 0,79 / 3916.0 • r=10 → 0,79 / 3941.0
Lệch bất kỳ dòng → DỪNG, báo N4. Không nới dung sai, không sửa code cho ra số.

## 6. Luật bất di bất dịch
1. **KHÔNG đọc/mở `data/processed/test.csv`** dưới mọi hình thức (không in, không peek, không tính).
2. Không sửa: `src/cost.py`, `src/data.py`, `src/features.py`, `src/evaluate.py`, `src/calibration.py`, `reports/final_protocol.md`, `.gitignore`.
3. Không đổi: `DEFAULT_THRESHOLDS` (lưới 0.01–0.99), quy tắc hòa (ngưỡng thấp nhất), r ∈ {0,5; 1; 2; 3; 5; 10}, naming `Tung_mlp_v2`, `FINAL = False`, tên file model.
4. Không tạo `test_final*`, `proba_test_*.npy`, `test_run_log.md` — chúng chỉ xuất hiện khi N4 chạy FINAL=True trong clone repo nhóm.
5. Mâu thuẫn đặc tả ↔ protocol ⇒ **protocol thắng**. Thiếu thông tin / FAIL / lệch số ⇒ **DỪNG, dán nguyên văn cho N4** — không thử vòng lặp, không "sửa cho qua".
6. Code chỉ được gọi `load_split("test", allow_test=True)` ở **một chỗ duy nhất** trong `notebooks/07_final_test.ipynb` (Cell 10, Phần 4) — không nơi nào khác.
7. Deliverable chỉ ở branch Arena của bạn; push lỗi → báo N4, không spam.

## 7. Môi trường chuẩn
Python 3.11.2 • scikit-learn 1.9.1 • numpy 2.4.6 • pandas 3.1.1 • joblib 1.6.0 (theo `requirements.txt`).
Khác phiên bản → ghi rõ trong bàn giao; không tự cài/nâng cấp bừa.

## 8. Cách bàn giao mỗi phần (đủ để N4 review)
(a) Output nguyên văn các lệnh nghiệm thu; (b) `git log --oneline -3` + `git status`; (c) SHA HEAD (`git rev-parse HEAD`); (d) phiên bản thư viện thực tế (`pip freeze | grep -Ei 'scikit|numpy|pandas|joblib'`); (e) mọi quyết định/độ lệch so với prompt + lý do.
Commit nhỏ, message `feat(n4): ...`, push branch Arena (`git push origin HEAD`).

## 9. Thứ tự quyết định khi gặp vấn đề
1. Xem lại đúng file prompt của phần đó (mục 3).
2. Mâu thuẫn với `reports/final_protocol.md`? ⇒ protocol thắng; dừng, báo N4.
3. File/hash thiếu? ⇒ DỪNG, dán output cho N4 (khả năng `main` chưa merge / file bị sửa) — KHÔNG tự tải, KHÔNG sửa hash, KHÔNG thay đường dẫn.
4. Không chắc chắn? ⇒ DỪNG và hỏi. Không đoán, không phỏng đoán số liệu, không bịa kết quả.

## 10. Mục tiêu cuối cùng (chỉ để bạn hiểu bức tranh lớn — KHÔNG tự làm)
Sau khi Phần 1–4 được N4 nghiệm thu + bàn giao: N4 chuyển deliverable vào repo nhóm qua PR → nhóm trưởng merge + `git tag protocol-v1` → N4 mới chạy test **đúng một lần** trong clone repo nhóm, có N1 chứng kiến. Bạn không được tag, không merge, không chạy FINAL=True.
