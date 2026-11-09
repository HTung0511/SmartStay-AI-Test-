"""E7: Hieu chinh xac suat MLP cho SmartStay (theo ke hoach da duoc duyet).

Quy truan:
  - Doc train, val (KHONG doc test, KHONG dung allow_test=True).
  - Xay dung ngay den tu arrival_date_year/month/day_of_month; sap xep, tim cutoff
    o vi tri 80%. Base MLP fit phan truoc cutoff; calibrator fit phan tu cutoff.
  - Fit MLP cau hinh v2 (hidden=(32,16), alpha=1.0, lr=3e-3, bs=256, seed=42)
    Pipeline('linear') tren phan dau train.
  - Fit sigmoid calibrator bang src/calibration.py tren phan cuoi train.
    KHONG dung mlp_v2.joblib goc lam base.
  - Tren val, ba cot rieng: mlp_v2 goc, base moi chua hieu chinh, cung base moi
    sau hieu chinh. Brier, log loss, PR-AUC, ROC-AUC, mean probability, ty le huy.
  - E8 voi r = 1, 2: nguong tot nhat trong luoi, FP, FN, cost, tiet kiem so voi never.
  - Luu artifact ten phan biet (_e7), KHONG ghi de mlp_v2 hoac ket qua cu.
  - Kiem tra nap lai model va xac suat val. Luu bao cao E7 rieng.

Con so chi phi la GIA DINH cua nhom. Ket qua chi tren val, co the lac quan vi
cau hinh va nguong da duoc chon tren val.
"""
import sys, os, json
from datetime import datetime
from pathlib import Path

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

import numpy as np
import pandas as pd
import joblib
from sklearn.metrics import (average_precision_score, brier_score_loss, log_loss,
                             roc_auc_score)
from sklearn.neural_network import MLPClassifier
from sklearn.pipeline import Pipeline

from src.calibration import fit_calibrator, SigmoidCalibratedModel
from src.data import REPO_ROOT, SEED, load_xy
from src.evaluate import evaluate, log_result, save_proba
from src.features import build_preprocessor, check_columns, NUMERIC, CATEGORICAL
from src.cost import cost_table, cost_at_threshold, baseline_costs, DEFAULT_THRESHOLDS

RESULTS = REPO_ROOT / "reports" / "results"
MODELS = REPO_ROOT / "models"
RESULTS.mkdir(parents=True, exist_ok=True)
MODELS.mkdir(parents=True, exist_ok=True)

# ---- Cau hinh v2 (giong mlp_v2) ----
V2_HIDDEN = (32, 16)
V2_ALPHA = 1.0
V2_LR = 0.003
V2_BS = 256
V2_SEED = SEED  # 42

# ---- Su dung toan bo train de xay dung ngay den (khong doc test) ----
X_train, y_train = load_xy("train")
X_val, y_val = load_xy("val")
check_columns(X_train)
check_columns(X_val)
assert X_train.columns.tolist() == X_val.columns.tolist()

print("=== Xay dung ngay den va chia train theo cach Nguoi 3 ===")
months = {m: i for i, m in enumerate([
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"], 1)}
dates = pd.to_datetime(dict(
    year=X_train.arrival_date_year,
    month=X_train.arrival_date_month.map(months),
    day=X_train.arrival_date_day_of_month))

cutoff = dates.sort_values().iloc[int(len(dates) * 0.80)]
fit_mask = dates < cutoff
cal_mask = ~fit_mask

n_fit = int(fit_mask.sum())
n_cal = int(cal_mask.sum())
print(f"Cutoff: {cutoff.date()} (vi tri 80% sau khi sap xep ngay den)")
print(f"Phan fit (truoc cutoff): {n_fit:,} don, ngay {dates[fit_mask].min().date()} -> {dates[fit_mask].max().date()}, ty le huy {y_train[fit_mask].mean():.2%}")
print(f"Phan cal (tu cutoff):   {n_cal:,} don, ngay {dates[cal_mask].min().date()} -> {dates[cal_mask].max().date()}, ty le huy {y_train[cal_mask].mean():.2%}")
print(f"Khong trung: {bool((fit_mask & cal_mask).sum() == 0)}, cong lai du train: {bool(n_fit + n_cal == len(dates))}")
print(f"Ty le huy toan bo train: {y_train.mean():.2%}")
print("Luu y: ngay den khong dam bao thu tu thoi diem dat (mot dat den sau co the da duoc dat truoc mot don den som).")

# ---- Fit MLP cau hinh v2 tren phan dau train ----
print("\n=== Fit MLP cau hinh v2 tren phan dau train ===")
base_pipe = Pipeline([
    ("prep", build_preprocessor("linear")),
    ("clf", MLPClassifier(
        hidden_layer_sizes=V2_HIDDEN, alpha=V2_ALPHA,
        learning_rate_init=V2_LR, batch_size=V2_BS,
        early_stopping=True, n_iter_no_change=10, max_iter=200,
        random_state=V2_SEED)),
])
base_pipe.fit(X_train.loc[fit_mask], y_train.loc[fit_mask])

# ---- Fit sigmoid calibrator tren phan cuoi train (bang src/calibration.py) ----
print("\n=== Fit sigmoid calibrator tren phan cuoi train ===")
calibrated = fit_calibrator(base_pipe, X_train.loc[cal_mask], y_train.loc[cal_mask])
print(f"Calibrator coef_: {calibrated.calibrator.coef_.ravel()}")
print(f"Calibrator intercept_: {calibrated.calibrator.intercept_.ravel()}")

# ---- Dự đoán trên val cho 3 cot ----
print("\n=== Du doan tren val (3 cot rieng) ===")
p_mlp_v2 = joblib.load(MODELS / "mlp_v2.joblib").predict_proba(X_val)[:, 1]  # mlp_v2 goc (tham chieu)
p_base_new = base_pipe.predict_proba(X_val)[:, 1]                            # base moi chua hieu chinh
p_cal_new = calibrated.predict_proba(X_val)[:, 1]                            # base moi sau hieu chinh

def metrics(y, p):
    m = evaluate(y, p)
    return {
        **m,
        "brier": float(brier_score_loss(y, p)),
        "log_loss": float(log_loss(y, p)),
        "mean_proba": float(np.mean(p)),
        "positive_rate": float(np.mean(y)),
    }

rows = {}
rows["mlp_v2_goc"] = metrics(y_val, p_mlp_v2)
rows["base_moi_chua_hieu_chinh"] = metrics(y_val, p_base_new)
rows["base_moi_sau_hieu_chinh"] = metrics(y_val, p_cal_new)

cmp = pd.DataFrame(rows).T
cmp = cmp[["n", "positive_rate", "threshold", "accuracy", "precision", "recall",
           "f1", "roc_auc", "pr_auc", "brier", "log_loss", "mean_proba",
           "tn", "fp", "fn", "tp"]]
print(cmp.round(6).to_string())

# ---- E8 voi r = 1, 2 ----
print("\n=== E8 chi phi overbooking tren val (r = 1, 2) ===")
e8_rows = {}
for label, p in [("mlp_v2_goc", p_mlp_v2),
                 ("base_moi_chua_hieu_chinh", p_base_new),
                 ("base_moi_sau_hieu_chinh", p_cal_new)]:
    for r in (1, 2):
        c_walk = r * 1.0
        curve = cost_table(y_val, p, ratios=(r,), c_empty=1.0,
                           thresholds=DEFAULT_THRESHOLDS)
        t = float(curve.iloc[0]["t_best"])
        at_t = cost_at_threshold(y_val, p, t, c_walk, 1.0)
        base = baseline_costs(y_val, c_walk, 1.0)
        saving = 1 - at_t["cost"] / base["never_overbook"]
        e8_rows[(label, r)] = {
            "model_variant": label, "r": r,
            "t_theory": round(r / (r + 1), 3), "t_best": t,
            "gap_vs_theory": round(t - r / (r + 1), 3),
            "fp": int(at_t["fp"]), "fn": int(at_t["fn"]),
            "cost_best": float(at_t["cost"]),
            "cost_never": float(base["never_overbook"]),
            "saving_vs_never": float(saving),
        }
e8 = pd.DataFrame(e8_rows.values())
print(e8.round(4).to_string(index=False))

# ---- Xac luong calibrator he so (da in tren) ----

# ---- Luu artifact (ten phan biet, khong ghi de mlp_v2) ----
base_path = MODELS / "mlp_v2_e7_base.joblib"
cal_path = MODELS / "mlp_v2_e7_calibrated.joblib"
joblib.dump(base_pipe, base_path)
joblib.dump(calibrated, cal_path)

save_proba("mlp_v2_e7_base", p_base_new, split="val")
save_proba("mlp_v2_e7_calibrated", p_cal_new, split="val")

# Kiem tra nap lai model va xac suat val
reloaded_base = joblib.load(base_path)
reloaded_cal = joblib.load(cal_path)
p_base_reload = reloaded_base.predict_proba(X_val)[:, 1]
p_cal_reload = reloaded_cal.predict_proba(X_val)[:, 1]
assert np.allclose(p_base_reload, p_base_new, atol=1e-7), "base reload khong khop"
assert np.allclose(p_cal_reload, p_cal_new, atol=1e-7), "calibrated reload khong khop"
print("\nDa kiem tra: nap lai model va xac suat val khop nhau (atol=1e-7).")

# ---- Luu bao cao E7 rieng ----
report = {
    "author": "Tung",
    "experiment": "E7",
    "model": "mlp_v2_e7",
    "split": "val",
    "seed": V2_SEED,
    "config": {
        "hidden_layer_sizes": V2_HIDDEN, "alpha": V2_ALPHA,
        "learning_rate_init": V2_LR, "batch_size": V2_BS,
        "early_stopping": True, "n_iter_no_change": 10, "max_iter": 200,
    },
    "train_split": {
        "cutoff_date": str(cutoff.date()),
        "n_fit_before_cutoff": n_fit,
        "n_cal_from_cutoff": n_cal,
        "fit_date_range": [str(dates[fit_mask].min().date()), str(dates[fit_mask].max().date())],
        "cal_date_range": [str(dates[cal_mask].min().date()), str(dates[cal_mask].max().date())],
        "cancel_rate_fit": float(y_train[fit_mask].mean()),
        "cancel_rate_cal": float(y_train[cal_mask].mean()),
        "cancel_rate_all_train": float(y_train.mean()),
        "no_overlap": bool((fit_mask & cal_mask).sum() == 0),
        "parts_sum_to_train": bool(n_fit + n_cal == len(dates)),
    },
    "note_train_order": "Ngay den duoc dung de chia tap, KHONG duoc dua vao dac trung. Ngay den khong dam bao thu tu thoi diem dat.",
    "calibrator_coef": calibrated.calibrator.coef_.ravel().tolist(),
    "calibrator_intercept": calibrated.calibrator.intercept_.ravel().tolist(),
    "val_comparison": cmp.round(6).to_dict(orient="index"),
    "e8_r1_r2": e8.round(6).to_dict(orient="records"),
    "artifacts": {
        "base_model": str(base_path),
        "calibrated_model": str(cal_path),
        "base_proba_val": str(MODELS / "proba_val_mlp_v2_e7_base.npy"),
        "calibrated_proba_val": str(MODELS / "proba_val_mlp_v2_e7_calibrated.npy"),
    },
    "limitation": "Ket qua val co the lac quan vi cau hinh va nguong da duoc chon tren val. Khong doc test.",
    "generated_at": datetime.now().strftime("%Y-%m-%d %H:%M"),
}
report_path = RESULTS / "mlp_v2_e7_report.json"
with open(report_path, "w", encoding="utf-8") as f:
    json.dump(report, f, indent=2, ensure_ascii=False)

# Log vao Tran_Hoang_Tung.csv (experiment E7, cot rieng, khong ghi de dong cu)
log_result("Tung", "E7", "mlp_v2_e7_base", "val", rows["base_moi_chua_hieu_chinh"],
           "MLP v2 config, base fit tren phan dau train (truoc cutoff 80% ngay den)")
log_result("Tung", "E7", "mlp_v2_e7_calibrated", "val", rows["base_moi_sau_hieu_chinh"],
           f"MLP v2 + sigmoid calibrator tren phan cuoi train (tu {cutoff.date()})")

print(f"\nDa luu bao cao E7: {report_path}")
print(f"Da luu artifacts: {base_path}, {cal_path}")
print(f"Da luu proba val: proba_val_mlp_v2_e7_base.npy, proba_val_mlp_v2_e7_calibrated.npy")
print(f"Da log vao Tran_Hoang_Tung.csv (E7, 2 dong moi)")
