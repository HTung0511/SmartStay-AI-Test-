# PHẦN 1/5 — Kiểm tra file khóa (đã đồng bộ) + viết `src/final_eval.py` (chỉ val)

Dán nguyên file này cho AI Building. **Chỉ làm Phần 1; không làm các phần sau cho tới khi được giao.**

## Vai trò và luật vàng
Bạn là AI Building, làm việc cho N4 (Hoàng Tùng) — SmartStay AI. Luật bắt buộc:
1. **KHÔNG mở/đọc `data/processed/test.csv`** (không đọc, không in, không tính gì trên nó). Mọi chạy của bạn dùng `train`/`val`.
2. Không sửa: `src/cost.py`, `src/data.py`, `src/features.py`, `src/evaluate.py`, `src/calibration.py`, `reports/final_protocol.md`, `.gitignore`.
3. Không đổi tên file, naming `Tung_mlp_v2`, file model, `DEFAULT_THRESHOLDS`, quy tắc hòa.
4. Làm trên **đúng branch Arena của phiên** (`git branch --show-current` — KHÔNG `git checkout`/tạo branch khác); không push/merge/tag repo nhóm.
5. **Bất kỳ kiểm tra nào FAIL → DỪNG NGAY, dán nguyên văn output cho N4.** Không thử vòng lặp, không "sửa cho qua". Nếu mâu thuẫn `reports/final_protocol.md` → protocol thắng, dừng hỏi.

## Bước 1 — Kiểm tra workspace (thực hiện ĐÚNG thứ tự; mỗi bước fail → DỪNG + dán output)
Working area = repo cá nhân trên branch Arena hiện tại. Ghi lại: `git branch --show-current`, `git log --oneline -1`.

Repo này **đã đồng bộ với repo nhóm** — mọi file khóa dưới đây nằm sẵn. **KHÔNG clone/fetch repo nhóm.**

1a. **`src/cost.py` có đúng** `DEFAULT_THRESHOLDS = np.round(np.arange(0.01, 1.00, 0.01), 2)` (chỉ kiểm tra, không sửa).

1b. **Model MLP (đã có sẵn):**
```bash
ls -la models/Tung_mlp_v2.joblib
sha256sum models/Tung_mlp_v2.joblib   # PHAI = 5090cbc6273c034ad4446a69b9f8e728217a6a956084de504ca248553759b970
```
Nếu thiếu file hoặc hash lệch → DỪNG, dán output (khả năng `main` chưa hợp nhánh `sync/group-2026-11-20`). **KHÔNG** cp từ `mlp_v2.joblib` thay thế, **KHÔNG** tự tải từ đâu khác.

1c. **Proba val MLP (đã có sẵn):**
```bash
python -c "import numpy as np; a=np.load('models/proba_val_Tung_mlp_v2.npy'); print('len =', len(a))"   # phai = 14400
```
Không có file / len lệch → DỪNG, dán output.

1d. **`reports/final_protocol.md` (đã có sẵn):**
```bash
ls -la reports/final_protocol.md
sha256sum reports/final_protocol.md   # phai = ce19ff7a7d57c9c0941fa3ba7ca0adba627a7cd06b571e6a474c9f8a561a4477
grep -n "ĐÃ CHỐT" reports/final_protocol.md                     # phai thay dong "Trạng thái: ĐÃ CHỐT, phiên bản v1."
grep -c "5090cbc6273c034ad4446a69b9f8e728217a6a956084de504ca248553759b970" reports/final_protocol.md   # phai >= 1
```
Thiếu/lệch → DỪNG, báo N4. **KHÔNG tự viết, KHÔNG chỉnh sửa nội dung protocol.**

1e. (Ghi nhận, không phải gate) `git status` — repo có thể đang có thay đổi của các phiên khác; không sửa/đụng file lạ.

## Bước 2 — Viết `src/final_eval.py` (nội dung mẫu — viết ĐÚNG logic, có thể bổ sung comment)

```python
# Header docstring: "Tao reports/results/frozen_thresholds.csv.
# Nguong chi chon tren VAL. TUYET DOI KHONG doc test.
# Khop src/cost.py: DEFAULT_THRESHOLDS = np.round(np.arange(0.01, 1.00, 0.01), 2)."

import argparse
import sys
import numpy as np
import pandas as pd

from src.cost import DEFAULT_THRESHOLDS, cost_at_threshold, baseline_costs  # dung lai, KHONG nhan ban
from src.data import load_xy

RATIOS = (0.5, 1, 2, 3, 5, 10)
RESULTS_PATH = "reports/results/frozen_thresholds.csv"

def best_threshold(y_true, proba, c_walk: float, c_empty: float = 1.0, thresholds=None) -> dict:
    """Duyet luoi tang dan (mac dinh DEFAULT_THRESHOLDS); cost = c_walk*FP + c_empty*FN.
    Hoa -> nguong THAP NHAT (dung idxmin tren luoi tang dan, giong src/cost.py).
    Tra ve dict: threshold, cost, fp, fn, cost_per_booking."""

def paired_bootstrap(y_true, proba_a, proba_b, n_boot: int = 2000, seed: int = 42) -> dict:
    """Bootstrap GHEP CAP: lay mau lai CHI SO (khong lay mau rieng A/B).
    Moi resample tinh PR-AUC (average_precision_score) va ROC-AUC cho ca A va B tren CUNG resample.
    Bo qua resample chi co 1 lop (dem n_boot_skipped).
    Tra ve: pr_auc_a, pr_auc_b, roc_auc_a, roc_auc_b (diem tren toan bo val),
    diff_pr_auc (a-b), ci_pr_auc [p2.5, p97.5], diff_roc_auc, ci_roc_auc [p2.5, p97.5],
    frac_boot_a_better_pr, frac_boot_a_better_roc, n_boot_used, n_boot_skipped."""

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("model", help="vi du: Tung_mlp_v2, logreg, tree, lightgbm_smotenc")
    args = parser.parse_args()
    _, y_val = load_xy("val")                                   # CHI VAL
    proba = np.load(f"models/proba_val_{args.model}.npy")
    assert len(proba) == len(y_val), f"Do dai xac suat ({len(proba)}) != y_val ({len(y_val)})"
    rows = []
    for r in RATIOS:
        bt = best_threshold(y_val, proba, float(r) * 1.0, 1.0)
        rows.append({"model": args.model, "r": float(r), "threshold": bt["threshold"], "val_cost": bt["cost"]})
    # merge: doc file cu (neu co), xoa dong cua model nay, append dong moi, sort (model, r), ghi lai (index=False).
    # chua co file: tao moi voi header: model,r,threshold,val_cost
    # IN ra bang ket qua cua model.
    # NEU args.model == "Tung_mlp_v2": ASSERT threshold@r==2 == 0.43 va val_cost == 3757; sai -> in loi, sys.exit(1).

if __name__ == "__main__":
    main()
```

Chi tiết bắt buộc:
- Tái sử dụng `src/cost.py` (ưu tiên); không import/sử dụng gì liên quan `test` (`load_split`, `allow_test`).
- `paired_bootstrap`: `sklearn.metrics.average_precision_score`, `roc_auc_score`; `np.random.default_rng(seed)`.

## Bước 3 — Nghiệm thu (dán OUTPUT NGUYÊN VĂN khi bàn giao)
```
python -m src.final_eval Tung_mlp_v2
```
Kết quả bắt buộc: r=0,5 → 0,18 / 2437.5 • r=1 → 0,26 / 3275 • r=2 → **0,43 / 3757** • r=3 → 0,57 / 3874 • r=5 → 0,79 / 3916 • r=10 → 0,79 / 3941.
**Lệch bất kỳ dòng nào → DỪNG, báo N4.** Không tự nới dung sai, không chỉnh code cho ra số mong muốn.

## Bước 4 — Bàn giao Phần 1 cho N4
```
git add src/final_eval.py reports/results/frozen_thresholds.csv
git commit -m "feat(n4): final_eval.py + frozen_thresholds (Tung_mlp_v2, val only)"
git push origin HEAD
```
Nộp: (a) output Bước 3 nguyên văn; (b) `git log --oneline -3` + `git status`; (c) SHA HEAD; (d) phiên bản thư viện thực tế; (e) mọi điểm tự quyết + lý do.
**Không sang Phần 2 cho tới khi N4 duyệt.**

## Lưu ý về phiên AI Building trước (đã lỗi, bỏ dở)
Phiên 6132fca5 đã làm dở Phần 1 rồi hỏng và chưa push; commit `231cbda` không còn truy được từ repo này. **Làm mới hoàn toàn từ Bước 2** — không tìm, không khôi phục gì từ phiên cũ. Nếu lệnh `git log` của bạn tình cờ thấy commit đó → vẫn bỏ qua, làm từ đầu cho sạch.
