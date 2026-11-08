"""Kiem tra PR #1: output thuc te cua Round 2 MLP (khong chot test, khong chay lai toan bo lưới).

Doc file CSV da luu tuot lan chay truoc; chi chay lai so sanh v1-v2 theo cap seed
(10 fit, nhanh) va kiem tra nap lai mlp_v2.joblib vs .npy.
"""
import sys, os, platform, time, itertools
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from pathlib import Path
import numpy as np
import pandas as pd
import joblib
import sklearn
from sklearn.neural_network import MLPClassifier
from sklearn.pipeline import Pipeline

from src.data import load_xy, SEED, REPO_ROOT
from src.features import build_preprocessor, check_columns
from src.evaluate import evaluate, load_proba

RESULTS = REPO_ROOT / "reports" / "results"
MODELS = REPO_ROOT / "models"
RESULTS.mkdir(parents=True, exist_ok=True)

SEEDS = [42, 43, 44, 45, 46]


def make_mlp(hidden, alpha, seed=SEED, lr=None, bs=None):
    """lr=None / bs=None => dung gia tri mac dinh cua MLPClassifier (nhu B1)."""
    kw = dict(hidden_layer_sizes=hidden, alpha=alpha, early_stopping=True,
              n_iter_no_change=10, max_iter=200, random_state=seed)
    if lr is not None:
        kw["learning_rate_init"] = lr
    if bs is not None:
        kw["batch_size"] = bs
    return Pipeline([("prep", build_preprocessor("linear")),
                     ("clf", MLPClassifier(**kw))])


def fit_score(hidden, alpha, seed=SEED, lr=None, bs=None):
    t0 = time.time()
    pipe = make_mlp(hidden, alpha, seed=seed, lr=lr, bs=bs).fit(X_train, y_train)
    dt = time.time() - t0
    proba = pipe.predict_proba(X_val)[:, 1]
    m = evaluate(y_val, proba)
    return pipe, proba, m, dt


def parse_hidden(s):
    """Robust: '(32,)' -> (32,), '(32, 16)' -> (32,16), '(64,)' -> (64,)."""
    s = str(s).strip("()")
    if s == "":
        return ()
    parts = [p for p in s.split(",") if p.strip() != ""]
    return tuple(int(p) for p in parts)


# Doc du lieu va grid da luu (khong chay lai toan bo luoi)
X_train, y_train = load_xy("train")
X_val, y_val = load_xy("val")
check_columns(X_train)

grid = pd.read_csv(RESULTS / "round2_grid_all33.csv")
b1 = grid[grid.stage == "B1"].sort_values("pr_auc", ascending=False).reset_index(drop=True)
b2 = grid[grid.stage.isin(["B2", "B2x"])].sort_values("pr_auc", ascending=False).reset_index(drop=True)
best_b1, best_b2 = b1.iloc[0], b2.iloc[0]

# ---- Chon cau hinh co PR-AUC cao nhat giua B1 va B2 ----
b1_hidden = parse_hidden(best_b1["hidden"]); b1_alpha = float(best_b1["alpha"])
b1_lr, b1_bs = None, None  # mac dinh MLPClassifier, nhu B1
b1_pr, b1_roc = best_b1["pr_auc"], best_b1["roc_auc"]

b2_hidden = parse_hidden(best_b2["hidden"]); b2_alpha = float(best_b2["alpha"])
b2_lr = best_b2["lr"] if "lr" in best_b2 and pd.notna(best_b2["lr"]) else None
b2_bs = int(best_b2["bs"]) if "bs" in best_b2 and pd.notna(best_b2["bs"]) else None
b2_pr, b2_roc = best_b2["pr_auc"], best_b2["roc_auc"]

use_b1 = bool(b1_pr >= b2_pr)
if use_b1:
    final_hidden, final_alpha = b1_hidden, b1_alpha
    final_lr, final_bs = b1_lr, b1_bs
    final_pr, final_roc = b1_pr, b1_roc
    final_stage = "B1"
else:
    final_hidden, final_alpha = b2_hidden, b2_alpha
    final_lr, final_bs = b2_lr, b2_bs
    final_pr, final_roc = b2_pr, b2_roc
    final_stage = "B2"

print("=== So sanh tot nhat B1 vs tot nhat B2 (tu file da luu, khong chay lai luoi) ===")
print("B1 tot nhat: hidden=%s alpha=%.2f lr=%s bs=%s PR-AUC=%.4f ROC-AUC=%.4f"
      % (b1_hidden, b1_alpha, b1_lr, b1_bs, b1_pr, b1_roc))
print("B2 tot nhat: hidden=%s alpha=%s lr=%s bs=%s PR-AUC=%.4f ROC-AUC=%.4f"
      % (b2_hidden, b2_alpha, b2_lr, b2_bs, b2_pr, b2_roc))
print("Chon: %s -> hidden=%s alpha=%s lr=%s bs=%s | PR-AUC=%.4f ROC-AUC=%.4f"
      % (final_stage, final_hidden, final_alpha, final_lr, final_bs,
         final_pr, final_roc))


# ---------------- Kiem tra logic chon: ca 2 nhánh B1-thang va B2-thang (gi lua) ----
print("\n=== Kiem tra logic chon (gi lua): kiem tra ca 2 nhánh ===")


def chon(b1, b2):
    """Tra lai dict cua cau hinh duoc chon (max PR-AUC), b2 luon lay thong so tu best_b2."""
    b1h = parse_hidden(b1["hidden"]); b1a = float(b1["alpha"]); b1l, b1b = None, None
    b1p, b1r = b1["pr_auc"], b1["roc_auc"]
    b2h = parse_hidden(b2["hidden"]); b2a = float(b2["alpha"])
    b2l = b2["lr"] if "lr" in b2 and pd.notna(b2["lr"]) else None
    b2b = int(b2["bs"]) if "bs" in b2 and pd.notna(b2["bs"]) else None
    b2p, b2r = b2["pr_auc"], b2["roc_auc"]
    if bool(b1p >= b2p):
        return dict(stage="B1", hidden=b1h, alpha=b1a, lr=b1l, bs=b1b, pr=b1p, roc=b1r,
                    b2_hidden=b2h, b2_alpha=b2a, b2_lr=b2l, b2_bs=b2b, b2_pr=b2p, b2_roc=b2r)
    return dict(stage="B2", hidden=b2h, alpha=b2a, lr=b2l, bs=b2b, pr=b2p, roc=b2r,
                b2_hidden=b2h, b2_alpha=b2a, b2_lr=b2l, b2_bs=b2b, b2_pr=b2p, b2_roc=b2r)


# Nhánh A: B1 cao hon B2 -> chon B1 (lr=None, bs=None); thong so B2 in tu best_b2
rA = chon({"pr_auc": 0.7000, "roc_auc": 0.8500, "hidden": "(64,)", "alpha": 0.01},
          {"pr_auc": 0.6500, "roc_auc": 0.8200, "hidden": "(32,16)", "alpha": 1.0, "lr": 0.003, "bs": 256})
assert rA["stage"] == "B1" and rA["lr"] is None and rA["bs"] is None
assert rA["b2_lr"] == 0.003 and rA["b2_bs"] == 256, "B2 thong so phai luon lay tu best_b2"
print("Nhan A (B1 thang): stage=%s | B2 in tu best_b2: lr=%.3f bs=%d (DUNG)"
      % (rA["stage"], rA["b2_lr"], rA["b2_bs"]))

# Nhánh B: B2 cao hon B1 -> chon B2 (lay lr/bs tu best_b2)
rB = chon({"pr_auc": 0.6500, "roc_auc": 0.8200, "hidden": "(64,)", "alpha": 0.01},
          {"pr_auc": 0.7500, "roc_auc": 0.8800, "hidden": "(32,16)", "alpha": 1.0, "lr": 0.001, "bs": 128})
assert rB["stage"] == "B2" and rB["lr"] == 0.001 and rB["bs"] == 128
print("Nhan B (B2 thang): stage=%s | lr=%.3f bs=%d lay tu best_b2 (DUNG)"
      % (rB["stage"], rB["lr"], rB["bs"]))

# Nhánh C: hoa -> chon B1 (>=)
rC = chon({"pr_auc": 0.7000, "roc_auc": 0.8500, "hidden": "(64,)", "alpha": 0.01},
          {"pr_auc": 0.7000, "roc_auc": 0.8200, "hidden": "(32,16)", "alpha": 1.0, "lr": 0.001, "bs": 128})
assert rC["stage"] == "B1"
print("Nhan C (hoa): stage=%s (duoc: B1) (DUNG)" % rC["stage"])
print("Kiem tra logic chon ca 2 nhánh: TAT CA DUNG")


# ---------------- So sanh v1 vs v2 theo cap seed 42-46 (chay 10 fit, khong chay lai toan bo luoi) ----
print("\n=== So sanh v1 vs v2 theo cap seed 42-46 ===")
v1_hidden, v1_alpha = (64,), 0.01
paired = []
for s in SEEDS:
    _, _, m1, _ = fit_score(v1_hidden, v1_alpha, seed=s)
    _, _, m2, _ = fit_score(final_hidden, final_alpha, seed=s, lr=final_lr, bs=final_bs)
    paired.append(dict(seed=s,
                       v1_pr=m1["pr_auc"], v1_roc=m1["roc_auc"],
                       v2_pr=m2["pr_auc"], v2_roc=m2["roc_auc"],
                       diff_pr=m2["pr_auc"] - m1["pr_auc"],
                       diff_roc=m2["roc_auc"] - m1["roc_auc"]))
paired = pd.DataFrame(paired)
paired.to_csv(RESULTS / "round2_seed_paired.csv", index=False)
print(paired.round(4).to_string())
print("Mean diff PR-AUC = %.4f (std %.4f)" % (paired["diff_pr"].mean(), paired["diff_pr"].std()))
print("Mean diff ROC-AUC = %.4f (std %.4f)" % (paired["diff_roc"].mean(), paired["diff_roc"].std()))


# ---------------- Bao cao kiem tra model–.npy ----------------
print("\n=== Bao cao kiem tra mlp_v2.joblib vs proba_val_mlp_v2.npy ===")
pipe = joblib.load(MODELS / "mlp_v2.joblib")
proba_reload = pipe.predict_proba(X_val)[:, 1]
proba_npy = load_proba("mlp_v2", split="val")
shape_reload = proba_reload.shape
shape_npy = proba_npy.shape
max_abs_diff = float(np.abs(proba_reload - proba_npy).max())
giong_nguyen_goc = bool(np.allclose(proba_npy, proba_reload))
m_reload = evaluate(y_val, proba_reload)

print("Python:", platform.python_version())
print("scikit-learn:", sklearn.__version__)
print("numpy:", np.__version__)
print("joblib:", joblib.__version__)
print("=== Kiem tra model-vs-.npy (preriat, khong su dung do dai de chung minh thu tu) ===")
print("shape reload (joblib.load + predict_proba):", shape_reload)
print("shape .npy:", shape_npy)
print("max abs diff (joblib vs npy): %.2e" % max_abs_diff)
print("giong nguyen goc (np.allclose):", giong_nguyen_goc)
print("Reload PR-AUC=%.4f ROC-AUC=%.4f" % (m_reload["pr_auc"], m_reload["roc_auc"]))
print("Giai thich thu tu: .npy duoc luu boi save_proba('mlp_v2', proba, split='val') theo")
print("thu tu dong cua X_val/val.csv; load_xy('val') cung doc theo thu tu file val.csv,")
print("nen chi so thu i trong .npy tuong ung voi dong thu i cua val.csv.")

npy_report = {
    "python_version": platform.python_version(),
    "sklearn_version": sklearn.__version__,
    "numpy_version": np.__version__,
    "joblib_version": joblib.__version__,
    "shape_reload": list(shape_reload),
    "shape_npy": list(shape_npy),
    "max_abs_diff_joblib_vs_npy": max_abs_diff,
    "giong_nguyen_goc_npy_vs_reload": giong_nguyen_goc,
    "reload_pr_auc": float(m_reload["pr_auc"]),
    "reload_roc_auc": float(m_reload["roc_auc"]),
    "thu_tu_note": ".npy luu theo thu tu dong val.csv (save_proba); khong su dung do dai de chung minh thu tu",
}
pd.DataFrame([npy_report]).to_csv(RESULTS / "round2_npy_check.csv", index=False)
with open(RESULTS / "round2_npy_check.txt", "w", encoding="utf-8") as f:
    for k, v in npy_report.items():
        f.write("%s: %s\n" % (k, v))

print("\nDA LUU: round2_seed_paired.csv, round2_npy_check.csv/.txt")
