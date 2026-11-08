"""E8 chi phí overbooking cho mlp_v2 — read-only, chỉ dùng val, không mở test.

Kết quả lưu vào reports/results/round2_mlp_v2_e8*.csv (mới, không ghi đè v1).
Chi phí là GIẢ ĐỊNH của nhóm (theo src/cost.py), không phải số liệu thật.
"""
import sys, os, json, platform
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from pathlib import Path
import numpy as np
import pandas as pd
import joblib
import sklearn

from src.data import load_xy, REPO_ROOT, SEED
from src.cost import (
    cost_curve, best_threshold, cost_table, theoretical_threshold,
    baseline_costs, cost_table_by_group, DEFAULT_THRESHOLDS,
)
from src.evaluate import load_proba

RESULTS = REPO_ROOT / "reports" / "results"
MODELS = REPO_ROOT / "models"
RESULTS.mkdir(parents=True, exist_ok=True)

# 1. Load val và xác suất đã lưu (theo thứ tự dòng val.csv)
X_val, y_val = load_xy("val")
proba = load_proba("mlp_v2", split="val")  # shape (n_val,), thứ tự val.csv

# 2. Kiểm tra nạp lại model và dự đoán trên X_val
pipe = joblib.load(MODELS / "mlp_v2.joblib")
proba_reload = pipe.predict_proba(X_val)[:, 1]
max_abs_diff = float(np.abs(proba_reload - proba).max())
n_rows = int(len(proba))
n_val_rows = int(len(X_val))
match_order = bool(n_rows == n_val_rows)
identical = bool(np.allclose(proba_reload, proba))

# 3. Bảng chi phí theo tỷ lệ r
ratios = (0.5, 1, 2, 3, 5, 10)
ct = cost_table(y_val, proba, ratios=ratios)
ct.insert(0, "model", "mlp_v2")
ct.insert(1, "split", "val")

# Lưới ngưỡng và cách xử lý hòa
threshold_grid = {
    "grid": "DEFAULT_THRESHOLDS = np.round(np.arange(0.01, 1.00, 0.01), 2)",
    "n_thresholds": int(len(DEFAULT_THRESHOLDS)),
    "min": float(DEFAULT_THRESHOLDS.min()),
    "max": float(DEFAULT_THRESHOLDS.max()),
    "tie_rule": "best_threshold -> curve['cost'].idxmin() => neu nhieu nguong cung chi phi, chon nguong THAP NHAT dau tien (luoi sap xep tang dan)",
}

# 4. Bảng theo khách sạn tại r = 2
ctbh = cost_table_by_group(y_val, proba, X_val["hotel"], ratio=2.0)
ctbh.insert(0, "model", "mlp_v2")
ctbh.insert(1, "split", "val")
ctbh.insert(2, "ratio", 2.0)

# 5. Chi tiết r = 2
bt_r2 = best_threshold(cost_curve(y_val, proba, c_walk=2.0, c_empty=1.0, thresholds=DEFAULT_THRESHOLDS))
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

# 6. Lưu file mới (không ghi đè v1)
ct.round(6).to_csv(RESULTS / "round2_mlp_v2_e8.csv", index=False)
ctbh.round(6).to_csv(RESULTS / "round2_mlp_v2_e8_by_hotel.csv", index=False)

meta = {
    "model": "mlp_v2",
    "split": "val",
    "source_proba": "models/proba_val_mlp_v2.npy (load_proba, thu tu dong val.csv)",
    "source_model": "models/mlp_v2.joblib (joblib.load)",
    "n_val": n_val_rows,
    "n_proba": n_rows,
    "proba_mean": float(proba.mean()),
    "proba_min": float(proba.min()),
    "proba_max": float(proba.max()),
    "reload_check": {
        "n_rows_reload": n_rows,
        "n_val_rows": n_val_rows,
        "match_order": match_order,
        "identical_reload_vs_npy": identical,
        "max_abs_diff_reload_vs_npy": max_abs_diff,
    },
    "threshold_grid": threshold_grid,
    "detail_r2": detail_r2,
    "note": "Chi phí là GIẢ ĐỊNH của nhóm (src/cost.py), không phải số liệu thật. Ket qua chi trên VAL (dung de chon mo hinh va nguong), KHONG la danh gia tren TEST. Khong mo tap test.",
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

# 7. In báo cáo
print("================================================================")
print("E8 CHI PHI OVERBOOKING — mlp_v2 (val) — DA LUU FILE MOI")
print("================================================================")
print(f"Thu vien: Python {meta['library_versions']['python']}, "
      f"scikit-learn {meta['library_versions']['scikit-learn']}, "
      f"numpy {meta['library_versions']['numpy']}, joblib {meta['library_versions']['joblib']}, "
      f"pandas {meta['library_versions']['pandas']}")
print(f"Tap: val | n = {n_val_rows} | ty le huy = {y_val.mean():.4%}")
print(f"Mean proba tren TOAN BO val = {float(proba.mean()):.6f}")
print(f"proba min = {float(proba.min()):.6f}, max = {float(proba.max()):.6f}")
print()
print("--- Kiem tra nap lai model vs .npy ---")
print(f"so dong proba .npy = {n_rows}, so dong X_val = {n_val_rows}")
print(f"khoa dong giong val.csv: {match_order}")
print(f"giong nguyen goc (np.allclose): {identical}")
print(f"sai lech tuyet doi lon nhat (reload vs npy): {max_abs_diff:.2e}")
print()
print("--- Luot nguong da dung ---")
print(json.dumps(threshold_grid, ensure_ascii=False, indent=2))
print()
print("--- Bang chi phi theo ty le r ---")
print(ct.round(4).to_string(index=False))
print()
print("--- Chi tiet tai r = 2 ---")
for k, v in detail_r2.items():
    print(f"  {k}: {v}")
print()
print("--- Bang theo khach san tai r = 2 ---")
print(ctbh.round(4).to_string())
print()
print("--- Luu file ---")
for p in sorted([RESULTS / "round2_mlp_v2_e8.csv", RESULTS / "round2_mlp_v2_e8_by_hotel.csv", RESULTS / "round2_mlp_v2_e8_meta.json"]):
    print(f"  - {p.name} ({p.stat().st_size} bytes)")
print()
print("LUU Y: Chi phep la GIA DINH (src/cost.py), khong phai so lieu thap.")
print("Ket qua chi tren VAL (dung de chon mo hinh va nguong), KHONG la danh gia tren TEST.")
print("Khong mo tap test. Khong ket luan ve test hoac trien khai thuc te.")
print("================================================================")
