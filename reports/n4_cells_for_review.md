# Mã nguồn các cell soi kỹ — N4 review (KHÔNG chạy lại)

Trích nguyên văn từ `notebooks/07_final_test.ipynb` (commit dac6d167..HEAD).
Cells FINAL=True **chưa được thực thi**; notebook dừng ở PRE-FLIGHT (Cell 8) khi `FINAL = False`.
Môi trường: Python 3.11.2 • scikit-learn 1.9.1 • numpy 2.4.6 • pandas 3.1.1 • joblib 1.6.0.

## CELL 10 — Đọc test (cell DUY NHẤT chạm test; chỉ chạy khi đổi cờ FINAL)

```python
from src.data import load_split
test = load_split("test", allow_test=True)
X_test = test.drop(columns=["is_canceled"])
y_test = test["is_canceled"]
print(f"n_test = {len(y_test)} | cancel_rate = {y_test.mean():.4f}")   # lan dau nhin nhan test
```

## CELL 13 — Bảng chính (protocol mục 7.1)

```python
import pandas as pd
from sklearn.metrics import brier_score_loss, log_loss
from src.evaluate import evaluate

_frozen = pd.read_csv(FROZEN)
_rows = []
for m in MODELS:
    proba = proba_test[m]
    if m == "dummy":
        t = 0.99
    else:
        t = float(_frozen[(_frozen.model == m) & (_frozen.r == 2.0)]["threshold"].iloc[0])
    ev = evaluate(y_test, proba, threshold=t)
    ev.update({"model": m,
               "brier": brier_score_loss(y_test, proba),
               "log_loss": log_loss(y_test, proba),
               "mean_proba": float(np.mean(proba))})
    _rows.append(ev)

test_final = pd.DataFrame(_rows)[["model", "n", "positive_rate", "threshold", "accuracy",
                                   "precision", "recall", "f1", "roc_auc", "pr_auc",
                                   "tn", "fp", "fn", "tp", "brier", "log_loss", "mean_proba"]]
test_final.to_csv(f"{RESULTS}/test_final.csv", index=False)
print(test_final.to_string(index=False))
```

## CELL 15 — Độ nhạy r (protocol mục 7.3)

```python
from src.cost import cost_at_threshold

_frozen2 = pd.read_csv(FROZEN)
sub = _frozen2[_frozen2.model == "Tung_mlp_v2"]
rows = []
for _, rr in sub.iterrows():
    t = float(rr["threshold"])
    c = cost_at_threshold(y_test, proba_test["Tung_mlp_v2"], t, c_walk=2.0, c_empty=1.0)
    rows.append({"model": "Tung_mlp_v2", "r": float(rr["r"]), "threshold": t,
                 "cost": c["cost"], "cost_per_booking": c["cost_per_booking"]})
sens = pd.DataFrame(rows)
sens.to_csv(f"{RESULTS}/test_final_sensitivity.csv", index=False)
print(sens.to_string(index=False))
```

## CELL 17 — Tách nhóm hotel / arrival_date_month (protocol mục 7.4)

```python
import numpy as np

t_mlp = float(_frozen[(_frozen.model == "Tung_mlp_v2") & (_frozen.r == 2.0)]["threshold"].iloc[0])
proba = proba_test["Tung_mlp_v2"]

for col, fname in [("hotel", "test_final_by_hotel.csv"), ("arrival_date_month", "test_final_by_month.csv")]:
    rows = []
    for g in sorted(X_test[col].unique()):
        mask = (X_test[col] == g).to_numpy()
        yg, pg = y_test.to_numpy()[mask], proba[mask]
        ev = evaluate(yg, pg, threshold=t_mlp)
        c = cost_at_threshold(yg, pg, t_mlp, 2.0, 1.0)["cost"]
        rows.append({"group": g, "model": "Tung_mlp_v2", **ev, "cost_r2_locked": c})
    out = pd.DataFrame(rows)
    out.to_csv(f"{RESULTS}/{fname}", index=False)
    print(fname)
    print(out.to_string(index=False))
print("Luu y: khong suy dien nhan qua; thang la dac trung, khong phai nguyen nhan.")
```

## CELL 18 — Paired bootstrap (protocol mục 7.5)

```python
from pathlib import Path
from src.final_eval import paired_bootstrap

if Path("models/proba_test_lightgbm_smotenc.npy").exists():
    ref = "lightgbm_smotenc"
    note = "so voi lightgbm_smotenc"
else:
    ref = "logreg"
    note = "lightgbm_smotenc khong co trong MODELS lan chay (can quyet dinh chinh thuc cua nhom) — doi chieu tam voi logreg"

pb = paired_bootstrap(y_test.to_numpy(), proba_test["Tung_mlp_v2"], proba_test[ref])
row = {"reference_model": ref, "note": note,
       "n_boot_used": pb["n_boot_used"], "n_boot_skipped": pb["n_boot_skipped"],
       "diff_pr_auc": pb["diff_pr_auc"],
       "ci_pr_auc_lo": pb["ci_pr_auc"][0], "ci_pr_auc_hi": pb["ci_pr_auc"][1],
       "diff_roc_auc": pb["diff_roc_auc"],
       "ci_roc_auc_lo": pb["ci_roc_auc"][0], "ci_roc_auc_hi": pb["ci_roc_auc"][1],
       "frac_boot_a_better_pr": pb["frac_boot_a_better_pr"],
       "frac_boot_a_better_roc": pb["frac_boot_a_better_roc"]}
boot = pd.DataFrame([row])
boot.to_csv(f"{RESULTS}/test_final_bootstrap.csv", index=False)
print(boot.to_string(index=False))
```
