# PHẦN 2/5 — Sinh `reports/results/frozen_thresholds.csv` (chỉ val)
> Điều kiện: Phần 1 đã được N4 nghiệm thu (Tung_mlp_v2 ra 0,43 / 3.757). Nếu chưa → DỪNG, chờ.

## Luật vàng
1. **KHÔNG mở/đọc `data/processed/test.csv`.** Mọi chạy dùng `val` (qua `load_xy("val")` trong `src/final_eval.py`).
2. Không sửa file nguồn; không đổi tên; làm trên branch Arena đã gán; push branch đó; không merge/PR/tag repo nhóm.
3. Thiếu file model/proba → xử lý đúng như mục Bước 1; KHÔNG bịa đường dẫn. Mâu thuẫn → DỪNG, hỏi N4.
4. **Lệnh FAIL/output không khớp → DỪNG, dán nguyên văn cho N4.** Không thử vòng lặp.

## Bước 1 — Kiểm tra proba của LogReg / Tree (đã đồng bộ, nằm sẵn trong repo)
```bash
ls -la models/proba_val_logreg.npy models/proba_val_tree.npy models/proba_val_Tung_mlp_v2.npy
python -c "import numpy as np; [print(f, len(np.load('models/'+f))) for f in ['proba_val_logreg.npy','proba_val_tree.npy','proba_val_Tung_mlp_v2.npy']]"   # phai = 14400 14400 14400
```
Thiếu/lệch → **DỪNG, báo N4** (khả năng `main` chưa hợp nhánh `sync/group-2026-11-20`). **KHÔNG clone/fetch repo nhóm.**
(`lightgbm_smotenc` — **CHƯA TỒN TẠI ở bất cứ đâu**: nếu vẫn thiếu → bỏ qua, ghi "CHƯA CÓ FILE" trong bàn giao, KHÔNG tạo giả.)

## Bước 2 — Chạy từng model (theo thứ tự)
```bash
python -m src.final_eval Tung_mlp_v2     # chay lai de cap nhat/khop
python -m src.final_eval logreg
python -m src.final_eval tree
```

## Bước 3 — Kiểm tra `frozen_thresholds.csv`
```bash
cat reports/results/frozen_thresholds.csv
```
Bắt buộc đủ:
- Header: `model,r,threshold,val_cost`
- Mỗi model đã chạy đúng **6 dòng** (r = 0,5; 1; 2; 3; 5; 10), không trùng, sort theo (model, r). (Tổng 18 dòng cho 3 model; lightgbm chưa có thì thiếu phần của nó — ghi rõ.)
- Dòng MLP (`Tung_mlp_v2`, r=2): `threshold=0.43`, `val_cost=3757`. `val_cost` ở r=0,5 của MLP: `2437.5`.
Sai bất kỳ điều kiện nào → **DỪNG, báo N4**.

## Bước 4 — Commit + bàn giao
```bash
git add reports/results/frozen_thresholds.csv
git commit -m "feat(n4): frozen_thresholds cho logreg/tree/Tung_mlp_v2 (val only)"
git push origin HEAD
```
(proba và model đã nằm trong repo, không add lại.)
Nộp: (a) toàn bộ nội dung `frozen_thresholds.csv` cuối; (b) output từng lệnh chạy nguyên văn; (c) file còn thiếu; (d) `git log --oneline -3` + `git status`; (e) SHA HEAD.
**Không sang Phần 3 cho tới khi N4 duyệt frozen_thresholds.**
