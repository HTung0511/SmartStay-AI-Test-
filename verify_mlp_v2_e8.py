"""E8: Chi phi overbooking cho mlp_v2 tren val (tai lap lai tren nhang hien tai).

Chi doc dau vào, khong chay lai huan luan, khong mo test.
- Doc models/proba_val_mlp_v2.npy (luu theo thu tu dong val.csv) va nhan val.
- Chay bang gia chi phi cost_table(src.cost) voi 6 ty le r = (0.5, 1, 2, 3, 5, 10).
- Chay bang chi phi theo khach san tai r = 2 (cost_table_by_group).
- Luu 3 file vao reports/results/ (khong ghi de file cu):
    round2_mlp_v2_e8.csv
    round2_mlp_v2_e8_by_hotel.csv
    round2_mlp_v2_e8_meta.json

Con so chi phi la GIA DINH cua nhom, khong phai so lieu thuc. Ket qua chi tren val.
"""
import sys, os, json
from datetime import datetime
from pathlib import Path

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

import numpy as np
import pandas as pd

from src.data import load_xy, REPO_ROOT
from src.evaluate import load_proba
from src.cost import (cost_table, cost_table_by_group, theoretical_threshold,
                      baseline_costs, cost_at_threshold, DEFAULT_THRESHOLDS)

RESULTS = REPO_ROOT / "reports" / "results"
MODELS = REPO_ROOT / "models"
RESULTS.mkdir(parents=True, exist_ok=True)

MODEL = "mlp_v2"
RATIOS = (0.5, 1, 2, 3, 5, 10)  # 6 ty le r, nhu handoff
C_EMPTY = 1.0


def main():
    # Chi doc val (khong moi test).
    X_val, y_val = load_xy("val")
    proba = load_proba(MODEL, split="val")  # thu tu dong val.csv
    assert len(proba) == len(y_val) == len(X_val), "thu tu/do dai khong khop"

    # ---- E8 bang chi phi tat ca 6 ty le r ----
    table = cost_table(y_val, proba, ratios=RATIOS, c_empty=C_EMPTY,
                       thresholds=DEFAULT_THRESHOLDS)
    table_path = RESULTS / "round2_mlp_v2_e8.csv"
    table.to_csv(table_path, index=False)

    # ---- E8 bang chi phi theo khach san tai r = 2 ----
    by_hotel = cost_table_by_group(y_val, proba, X_val["hotel"], ratio=2,
                                   c_empty=C_EMPTY,
                                   thresholds=DEFAULT_THRESHOLDS)
    by_hotel_path = RESULTS / "round2_mlp_v2_e8_by_hotel.csv"
    by_hotel.to_csv(by_hotel_path)

    # ---- Dong hang r = 2 (cua cong) ----
    r2 = table[table["r"] == 2].iloc[0]
    t_best = float(r2["t_best"])
    at_tbest = cost_at_threshold(y_val, proba, t_best, 2 * C_EMPTY, C_EMPTY)
    base = baseline_costs(y_val, 2 * C_EMPTY, C_EMPTY)
    n_canceled = int((y_val == 1).sum())
    n_not = int((y_val == 0).sum())

    meta = {
        "model": MODEL,
        "split": "val",
        "n": int(len(y_val)),
        "n_canceled": n_canceled,
        "n_not_canceled": n_not,
        "cancel_rate": float(np.mean(y_val == 1)),
        "proba_file": str(MODELS / f"proba_val_{MODEL}.npy"),
        "note": "Xac suat luu boi save_proba('mlp_v2', proba, split='val') theo thu tu dong val.csv.",
        "ratios": list(RATIOS),
        "c_empty": C_EMPTY,
        "thresholds": "0.01-0.99 buoc 0.01 (99 ngưỡng), hoa chi phí -> ngưỡng thấp nhất dau tien (idxmin)",
        "t_theory_r2": round(theoretical_threshold(2 * C_EMPTY, C_EMPTY), 3),
        "r2": {
            "t_best": t_best,
            "gap_vs_theory": float(r2["gap_vs_theory"]),
            "fp": int(at_tbest["fp"]),
            "fn": int(at_tbest["fn"]),
            "cost_best": float(at_tbest["cost"]),
            "cost_t0.5": float(r2["cost_t0.5"]),
            "cost_never": float(base["never_overbook"]),
            "cost_always": float(base["always_overbook"]),
            "saving_vs_never": float(r2["saving_vs_never"]),
        },
        "generated_at": datetime.now().strftime("%Y-%m-%d %H:%M"),
        "environment": {
            "python": __import__("platform").python_version(),
            "scikit-learn": __import__("sklearn").__version__,
            "numpy": np.__version__,
        },
        "conso": "Chi phí là giả định của nhóm; kết quả chỉ trên val, chưa mở test.",
    }
    meta_path = RESULTS / "round2_mlp_v2_e8_meta.json"
    with open(meta_path, "w", encoding="utf-8") as f:
        json.dump(meta, f, indent=2, ensure_ascii=False)

    print("=== E8 chi phi overbooking mlp_v2 tren val (tai lap) ===")
    print(table.round(4).to_string(index=False))
    print("\n=== Theo khach san tai r = 2 ===")
    print(by_hotel.round(4).to_string())
    print("\n--- Dong r = 2 (cong) ---")
    print(json.dumps(meta["r2"], indent=2, ensure_ascii=False))
    print("\nDA LUU:")
    print(" ", table_path)
    print(" ", by_hotel_path)
    print(" ", meta_path)


if __name__ == "__main__":
    main()
