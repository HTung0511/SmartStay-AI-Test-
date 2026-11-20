# PHẦN 5/5 — Tự rà cuối và bàn giao cho N4
> Điều kiện: Phần 1–4 đã được N4 nghiệm thu. Nếu chưa → DỪNG.
> **Phần này không thêm code cho test. Chỉ kiểm tra cuối và đóng gói bàn giao.**

## Bước 1 — Tự rà theo checklist
- [ ] `git diff --stat main` chỉ gồm: `src/final_eval.py`, `notebooks/07_final_test.ipynb` (và file tạm không commit).
- [ ] `python -m src.final_eval Tung_mlp_v2` → in 0,18 / 0,26 / **0,43 / 3757** / 0,57 / 0,79 / 0,79 (dán output cuối).
- [ ] `frozen_thresholds.csv` (nếu đã tạo ở Phần 2) — đủ dòng, không trùng, sort (model, r).
- [ ] PRE-FLIGHT FINAL=False: Restart & Run All dừng đúng (dán log).
- [ ] Kiểm tra tĩnh notebook: `allow_test` xuất hiện đúng 1 lần (Cell 10); `FINAL = True` không xuất hiện; `test_final*` không được tạo.
- [ ] Không file nguồn/protocol bị sửa; không tag mới; không file test được tạo.
- [ ] branch Arena sạch, đã push; dán link/SHA cho N4 (PR/merge vào repo nhóm do Tùng quyết).

## Bước 2 — PR và mô tả (dán vào mô tả PR)
```
## SmartStay AI — N4: final_eval + notebook 07 (protocol-v1)
- Phần 1: src/final_eval.py — best_threshold (hoa lay thap nhat) + paired_bootstrap (ghep cap) + CLI;
  nghiem thu Tung_mlp_v2 r=2 -> 0.43 / 3757 (output dan kem duoi)
- Phần 2: frozen_thresholds.csv — <da chay|chua chay> cho <model>
- Phần 3: notebooks/07_final_test.ipynb — GATE 1-6 + PRE-FLIGHT (FINAL=False, dung o Cell 8/9)
- Phần 4: cells FINAL=True VIET NHUNG CHUA CHAY (theo yeu cau protocol)
- KHONG mo test. Libre: <danh sach file>. Ghi chu: <do lech neu co>
```

## Bước 3 — Bàn giao cho N4 (đủ 5 mục)
(a) Link PR + SHA commit cuối.
(b) Output nghiệm thu Phần 1 nguyên văn.
(c) Log PRE-FLIGHT Phần 3 nguyên văn.
(d) Danh sách MỌI quyết định/độ lệch so với prompt + lý do (vd: lightgbm_smotenc thiếu file; phải thay đường dẫn; phiên bản thư viện lệch...).
(e) Phiên bản thực tế: Python, scikit-learn, numpy, pandas, joblib (`pip freeze | grep -Ei 'scikit|numpy|pandas|joblib'`).

## Bước 4 — Sau khi N4 merge
- N4 (không phải AI Building) quyết định: chạy `final_eval` cho logreg/tree (nếu chưa), chuyển file sang repo nhóm, yêu cầu nhóm trưởng `git tag protocol-v1`, rồi N4 mới đổi `FINAL=True` chạy test **đúng một lần** với N1 chứng kiến.
- AI Building chỉ hỗ trợ nếu N4 yêu cầu; không tự ý chạy bất cứ thứ gì với FINAL=True.
