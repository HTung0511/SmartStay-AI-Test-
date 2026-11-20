# PHẦN 4/5 — Viết tiếp cells FINAL=True (KHÔNG CHẠY)
> Điều kiện: Phần 1–3 đã được N4 nghiệm thu (PRE-FLIGHT dừng đúng). Nếu chưa → DỪNG.
> **Phần này CHỈ VIẾT + TỰ KIỂM TRA TĨNH. Bạn KHÔNG đổi FINAL thành True, KHÔNG Restart & Run All để chạy test, KHÔNG tạo test_final*/proba_test*/test_run_log.md.**

## Luật vàng
1. Chỉ **một** chỗ trong toàn notebook được gọi `load_split("test", allow_test=True)` — đó là Cell 10 ở dưới. Không nơi nào khác reference `allow_test`.
2. Không sửa Phần 1–3 đã nghiệm thu (chỉ append cells 10–19); không sửa file nguồn; không đổi tên.
3. Không chạy notebook ở Phần này (Restart & Run All chỉ được dùng để kiểm lỗi cú pháp cell nếu bạn chắc chắn FINAL=False — nhưng khuyến nghị chỉ dùng kiểm tra tĩnh ở Bước 3).
4. Mâu thuẫn đặc tả / tên file lightgbm không khớp → DỪNG, hỏi N4.

## Cells cần viết tiếp (10–19)

**Cell 10 (code) — đọc test (CHỈ khi FINAL=True):**
```python
from src.data import load_split
test = load_split("test", allow_test=True)
X_test = test.drop(columns=["is_canceled"])
y_test = test["is_canceled"]
print(f"n_test = {len(y_test)} | cancel_rate = {y_test.mean():.4f}")   # lan dau nhin nhan test
```

**Cell 11 (code) — đối chiếu phụ trên VAL (an toàn, chỉ val):** nạp lại `models/Tung_mlp_v2.joblib`, predict_proba trên **val**, so với `models/proba_val_Tung_mlp_v2.npy`, in `max_abs_diff` (kỳ vọng ~3e-08); > 1e-06 → dừng, báo N4.

**Cell 12 (code) — predict test:** với mỗi model trong `MODELS`: nếu `dummy` → `proba = np.full(len(y_test), y_train_mean)` với `y_train_mean = load_xy("train")[1].mean()`; ngược lại → `joblib.load(f"models/{m}.joblib").predict_proba(X_test)[:, 1]`. Lưu `np.save(f"models/proba_test_{m}.npy", proba.astype("float32"))`. In `n_test` + dạng mảng mỗi model.

**Cell 13 (code) — bảng chính (protocol mục 7.1):** lấy ngưỡng khóa **r = 2** của từng model từ `FROZEN` (dummy: threshold = 0.99 — không dự đoán hủy, cost = never-overbook). Với mỗi model: `evaluate(y_test, proba, threshold=t)` (import từ `src.evaluate`), bổ sung `brier` (`sklearn.metrics.brier_score_loss`), `log_loss`, `mean_proba`. Ghi `reports/results/test_final.csv` với cột: `model,n,positive_rate,threshold,accuracy,precision,recall,f1,roc_auc,pr_auc,tn,fp,fn,tp,brier,log_loss,mean_proba`.

**Cell 14 (code) — chi phí E8 (mục 7.2):** với mỗi model: `cost_at_threshold(y_test, proba, t_locked_r2, c_walk=2.0, c_empty=1.0)`; thêm `baseline_costs(y_test, 2.0, 1.0)` (never/always); **riêng MLP** in thêm tại t = 0.5 và t = 2/3. Bổ sung vào `test_final.csv`: `cost_r2_locked`, `cost_never`, `saving_vs_never_pct`.

**Cell 15 (code) — độ nhạy r (mục 7.3):** MLP, 6 ngưỡng đã khóa (r ∈ {0.5, 1, 2, 3, 5, 10}): `cost_at_threshold(...)` từng dòng → `reports/results/test_final_sensitivity.csv` với cột `model,r,threshold,cost,cost_per_booking`. Cell md kế tiếp ghi: "Bảng độ nhạy; không dùng để chọn ngưỡng."

**Cell 16 (code) — tách nhóm (mục 7.4):** MLP tại ngưỡng khóa r = 2; tách theo `X_test["hotel"]` (City/Resort) và theo `X_test["arrival_date_month"]`: với từng nhóm, in `evaluate(...)` + cost; ghi `test_final_by_hotel.csv`, `test_final_by_month.csv`. Không suy diễn nhân quả; ghi rõ tháng là đặc trưng.

**Cell 17 (code) — bootstrap (mục 7.5):** `paired_bootstrap(y_test, proba_Tung_mlp_v2, proba_lightgbm_smotenc)` → in và ghi `test_final_bootstrap.csv` (cột: `n_boot_used,n_boot_skipped,diff_pr_auc,ci_pr_auc_lo,ci_pr_auc_hi,diff_roc_auc,ci_roc_auc_lo,ci_roc_auc_hi,frac_boot_a_better_pr,frac_boot_a_better_roc`). Nếu LightGBM bị nhóm bỏ theo quyết định văn bản → thay bằng `logreg` và ghi rõ trong file.

**Cell 18 (code) — mean proba vs thực tế (mục 7.6):** in `y_test.mean()` và mean_proba từng model. Không chỉnh gì.

**Cell 19 (code) — `test_run_log.md`:** append: ngày giờ (`datetime.now().strftime("%Y-%m-%d %H:%M")`), `git rev-parse HEAD`, `git describe --tags`, 4 hash recomputed (so lại với LOCKED_HASHES), `sys.version`, versions numpy/sklearn/pandas/joblib, `FINAL=True`, người chạy `N4`, người chứng kiến `N1`. Sau đó cell md cuối: "Báo cáo đúng như đã chạy, dù xấu; không đổi kết luận chính; phân tích thêm = thăm dò (post-hoc)."

## Bước 3 — Tự kiểm tra TĨNH (không chạy test)
- `python - <<'EOF' ... nbformat.read(...) ... EOF`: parse notebook hợp lệ; liệt kê thứ tự cell types; đếm số lần xuất hiện chuỗi `allow_test` — **phải đúng 1** (Cell 10); chuỗi `FINAL = True` — **không được xuất hiện**; `test_final` chỉ nằm trong các cell viết file.
- `git diff --stat main` — chỉ 2 file: `src/final_eval.py` (không đổi), notebook.
- Xác nhận thủ công: không có file `test_final*`, `proba_test_*.npy`, `test_run_log.md` được tạo.

## Bàn giao Phần 4 cho N4
Nộp: (a) kết quả kiểm tra tĩnh ở Bước 3; (b) screenshot/mã nguồn Cells 10, 13, 15, 17 (N4 sẽ soi kỹ); (c) `git diff --stat main`; (d) SHA nhánh; (e) mọi điểm tự quyết + lý do.
**KHÔNG chạy notebook. Việc đổi FINAL=True và Restart & Run All thuộc N4, sau khi nhóm trưởng tag `protocol-v1`.**
