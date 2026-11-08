"""E8 chi phí overbooking cho mlp_v2 — chỉ đọc dữ liệu đầu vào, ghi báo cáo mới.

Không mở test; không sửa file v1, dữ liệu hay src/cost.py. Chi phí là GIẢ ĐỊNH
của nhóm (theo src/cost.py), không phải số liệu thật. Kết quả chỉ trên val.
"""
import sys, os, json, platform
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from pathlib import Path
import numpy as np
import pandas as pd
import joblib
import sklearn

from src.data import load_xy, REPO_ROOT
from src.cost import (
    cost_curve, best_threshold, cost_table, theoretical_threshold,
    baseline_costs, cost_table_by_group, DEFAULT_THRESHOLDS,
)
from src.evaluate import load_proba

RESULTS = REPO_ROOT / "reports" / "results"
MODELS = REPO_ROOT / "models"
RESULTS.mkdir(parents=True, exist_ok=True)

RATIOS = (0.5, 1, 2, 3, 5, 10)

# ---------------------------------------------------------------------------
# 1. Doc du lieu va xac suat da luu (thu tu dong val.csv)
# ---------------------------------------------------------------------------
X_val, y_val = load_xy("val")
proba = load_proba("mlp_v2", split="val")   # shape (n_val,), thu tu val.csv

# ---------------------------------------------------------------------------
# 2. Kiem tra truoc khi ghi output (dung neu khong dat)
# ---------------------------------------------------------------------------
failures = []

# 2a. Shape
n_val = int(len(X_val))
n_proba = int(len(proba))
shape_ok = bool(n_proba == n_val)
if not shape_ok:
    failures.append(f"shape khong khop: proba={n_proba}, X_val={n_val}")

# 2b. Xac suat hop le (0 den 1)
proba_valid = bool((proba >= 0.0).all() and (proba <= 1.0).all())
if not proba_valid:
    failures.append("xac suat khong hop le ( ngoai khoang [0,1] )")

# 2c. Model nap lai du so voi .npy
pipe = joblib.load(MODELS / "mlp_v2.joblib")
proba_reload = pipe.predict_proba(X_val)[:, 1]
model_vs_npy_ok = bool(np.allclose(proba_reload, proba))
max_abs_diff = float(np.abs(proba_reload - proba).max())
if not model_vs_npy_ok:
    failures.append(f"model nap lai khong khop .npy, max_abs_diff={max_abs_diff:.2e}")

# 2d. Cong r = 2 da giao (t_best=0.43, FP=240, FN=3277, cost=3757, cost_never=4090, saving~8.14%)
curve_r2 = cost_curve(y_val, proba, c_walk=2.0, c_empty=1.0, thresholds=DEFAULT_THRESHOLDS)
bt_r2 = best_threshold(curve_r2)
r2_pass = (
    abs(float(bt_r2["threshold"]) - 0.43) < 1e-9 and
    int(bt_r2["fp"]) == 240 and
    int(bt_r2["fn"]) == 3277 and
    abs(float(bt_r2["cost"]) - 3757.0) < 1e-9 and
    abs(float(baseline_costs(y_val, c_walk=2.0, c_empty=1.0)["never_overbook"]) - 4090.0) < 1e-9 and
    abs((1 - float(bt_r2["cost"]) / baseline_costs(y_val, c_walk=2.0, c_empty=1.0)["never_overbook"]) - 0.0814) < 5e-4
)
if not r2_pass:
    failures.append(
        f"cong r=2 khong giao: t_best={float(bt_r2['threshold']):.2f}, "
        f"FP={int(bt_r2['fp'])}, FN={int(bt_r2['fn'])}, cost={float(bt_r2['cost']):.1f}"
    )

if failures:
    print("DUNG: cac dieu kien truoc khi ghi khong dat:")
    for fmsg in failures:
        print("  -", fmsg)
    print("Khong ghi file moi, khong ghi de output cu.")
    sys.exit(1)

# ---------------------------------------------------------------------------
# 3. Bang chi phí theo ty le r (bo sung FP, FN tai ngưỡng duoc chon)
# ---------------------------------------------------------------------------
ct = cost_table(y_val, proba, ratios=RATIOS)
ct.insert(0, "model", "mlp_v2")
ct.insert(1, "split", "val")

# Bo sung FP, FN tai ngưỡng duoc chon cho tung ty le r
fp_rows, fn_rows = [], []
for r in RATIOS:
    cur = cost_curve(y_val, proba, c_walk=r * 1.0, c_empty=1.0, thresholds=DEFAULT_THRESHOLDS)
    bt = best_threshold(cur)
    fp_rows.append(int(bt["fp"]))
    fn_rows.append(int(bt["fn"]))
ct["fp"] = fp_rows
ct["fn"] = fn_rows

# ---------------------------------------------------------------------------
# 4. Bang theo khach san tai r = 2 (cot hotel, bo sung FP, FN)
# ---------------------------------------------------------------------------
ctbh = cost_table_by_group(y_val, proba, X_val["hotel"], ratio=2.0)
ctbh = ctbh.reset_index().rename(columns={"index": "hotel"})
ctbh.insert(0, "model", "mlp_v2")
ctbh.insert(1, "split", "val")
ctbh.insert(2, "ratio", 2.0)

# Tinh lai FP, FN tai t_best cua tung khach san (dung ham trong src/cost.py)
fp_hotel, fn_hotel = [], []
for _, row in ctbh.iterrows():
    h = row["hotel"]
    m = X_val["hotel"] == h
    cur_h = cost_curve(
        y_val[m], proba[m], c_walk=2.0, c_empty=1.0, thresholds=DEFAULT_THRESHOLDS
    )
    bt_h = best_threshold(cur_h)
    fp_hotel.append(int(bt_h["fp"]))
    fn_hotel.append(int(bt_h["fn"]))
ctbh["fp"] = fp_hotel
ctbh["fn"] = fn_hotel

# ---------------------------------------------------------------------------
# 5. Chi tiet tai r = 2
# ---------------------------------------------------------------------------
base_r2 = baseline_costs(y_val, c_walk=2.0, c_empty=1.0)
detail_r2 = {
    "model": "mlp_v2",
    "split": "val",
    "ratio": 2.0,
    "c_walk": 2.0,
    "c_empty": 1.0,
    "t_theory": float(theoretical_threshold(2.0, 1.0)),
    "t_best": float(bt_r2["threshold"]),
    "FP": int(bt_r2["fp"]),
    "FN": int(bt_r2["fn"]),
    "cost_best": float(bt_r2["cost"]),
    "cost_t0.5": float(ct.loc[ct["r"] == 2, "cost_t0.5"].iloc[0]),
    "cost_never": float(base_r2["never_overbook"]),
    "cost_always": float(base_r2["always_overbook"]),
    "saving_vs_never": float(1 - float(bt_r2["cost"]) / base_r2["never_overbook"]),
    "gap_vs_theory": float(float(bt_r2["threshold"]) - theoretical_threshold(2.0, 1.0)),
}

# ---------------------------------------------------------------------------
# 6. Luu file moi (khong ghi de v1)
# ---------------------------------------------------------------------------
ct.round(6).to_csv(RESULTS / "round2_mlp_v2_e8.csv", index=False)
ctbh.round(6).to_csv(RESULTS / "round2_mlp_v2_e8_by_hotel.csv", index=False)

meta = {
    "model": "mlp_v2",
    "split": "val",
    "source_proba": "models/proba_val_mlp_v2.npy (load_proba, thu tu dong val.csv)",
    "source_model": "models/mlp_v2.joblib (joblib.load)",
    "n_val": n_val,
    "n_proba": n_proba,
    "proba_mean": float(proba.mean()),
    "proba_min": float(proba.min()),
    "proba_max": float(proba.max()),
    "proba_valid_01": proba_valid,
    "length_check_ok": shape_ok,                 # chi kiem tra do dai, khong chung minh thu tu
    "model_vs_npy_check": model_vs_npy_ok,       # model nap lai du so voi .npy (np.allclose)
    "max_abs_diff_model_vs_npy": max_abs_diff,   # sai lech tuyet doi lon nhat
    "order_note": "thu tu dong val.csv duoc duong bo boi save_proba va load_xy; do dai bang nhau khong chung minh thu tu",
    "threshold_grid": {
        "grid": "DEFAULT_THRESHOLDS = np.round(np.arange(0.01, 1.00, 0.01), 2)",
        "n_thresholds": int(len(DEFAULT_THRESHOLDS)),
        "min": float(DEFAULT_THRESHOLDS.min()),
        "max": float(DEFAULT_THRESHOLDS.max()),
        "tie_rule": "best_threshold -> curve['cost'].idxmin() => neu nhieu nguong cung chi phi, chon nguong THAP NHAT dau tien (luoi sap xep tang dan)",
    },
    "detail_r2": detail_r2,
    "r2_gate_passed": r2_pass,
    "note": "Chi phep la GIA DINH cua nhom (src/cost.py), khong phai so lieu thap. Ket qua chi tren VAL (dung de chon mo hinh va nguong), KHONG la danh gia tren TEST. Khong mo tap test.",
    "library_versions": {
        "python": platform.python_version(),
        "scikit-learn": sklearn.__version__,
        "numpy": np.__version__,
        "joblib": joblib.__version__,
        "pandas": pd.__version__,
    },
}
with open(RESULTS / "round2_mlp_v2_e8_meta.json", "w", encoding="utf-8") as f:
    json.dump(meta, f, ensure_ascii=False, indent=2)

# ---------------------------------------------------------------------------
# 7. In bao cao
# ---------------------------------------------------------------------------
print("================================================================")
print("E8 CHI PHI OVERBOOKING — mlp_v2 (val) — DA LUU FILE MOI")
print("================================================================")
lv = meta["library_versions"]
print(f"Thu vien: Python {lv['python']}, scikit-learn {lv['scikit-learn']}, "
      f"numpy {lv['numpy']}, joblib {lv['joblib']}, pandas {lv['pandas']}")
print(f"Tap: val | n = {n_val} | ty le huy = {y_val.mean():.4%}")
print(f"Mean proba tren TOAN BO val = {float(proba.mean()):.6f}")
print(f"proba min = {float(proba.min()):.6f}, max = {float(proba.max()):.6f}")
print(f"Xac suat hop le [0,1]: {proba_valid}")
print()
print("--- Kiem tra truoc khi ghi (dung neu khong dat) ---")
print(f"so dong proba .npy = {n_proba}, so dong X_val = {n_val}")
print(f"length_check_ok (do dai bang nhau): {shape_ok}")
print(f"model_vs_npy_check (nap lai du so voi .npy): {model_vs_npy_ok}")
print(f"max_abs_diff_model_vs_npy: {max_abs_diff:.2e}")
print(f"Cong r=2 da giao: {r2_pass}")
print()
print("--- Luot nguong da dung ---")
print(json.dumps(meta["threshold_grid"], ensure_ascii=False, indent=2))
print()
print("--- Bang chi phi theo ty le r (bo sung FP, FN) ---")
print(ct.round(4).to_string(index=False))
print()
print("--- Chi tiet tai r = 2 ---")
for k, v in detail_r2.items():
    print(f"  {k}: {v}")
print()
print("--- Bang theo khach san tai r = 2 (cot hotel, bo sung FP, FN) ---")
print(ctbh.round(4).to_string(index=False))
print()
print("--- Luu file moi ---")
for p in sorted([RESULTS / "round2_mlp_v2_e8.csv",
                 RESULTS / "round2_mlp_v2_e8_by_hotel.csv",
                 RESULTS / "round2_mlp_v2_e8_meta.json"]):
    print(f"  - {p.name} ({p.stat().st_size} bytes)")
print()
print("LUU Y: Chi phep la GIA DINH (src/cost.py), khong phai so lieu thap.")
print("Ket qua chi tren VAL (dung de chon mo hinh va nguong), KHONG la danh gia tren TEST.")
print("Khong mo tap test. Khong ket luan ve test hoac trien khai thuc te.")
print("================================================================")
