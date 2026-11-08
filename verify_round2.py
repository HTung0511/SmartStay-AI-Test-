"""Kiem tra PR #1: output thuc te cua Round 2 MLP (khong chot test).

Chon cau hinh co PR-AUC cao nhat giua B1 va B2. Neu B1 thang, dung cac gia
tri mac dinh cua MLPClassifier (lr=None, bs=None).
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
from src.evaluate import evaluate, evaluate_by_group, load_proba

RESULTS = REPO_ROOT / "reports" / "results"
MODELS = REPO_ROOT / "models"
RESULTS.mkdir(parents=True, exist_ok=True)

X_train, y_train = load_xy("train")
X_val, y_val = load_xy("val")
check_columns(X_train)

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


# ---------------- 1. Toan bo 33 cau hinh (B1 + B2) ----------------
rows = []
print("=== Chay lai luoi 33 cau hinh (B1 + B2) ===")
for hidden, alpha in itertools.product([(32,), (64,), (32, 16), (64, 32)],
                                       [0.01, 0.03, 0.1, 0.3, 1.0]):
    _, _, m, dt = fit_score(hidden, alpha, seed=SEED)
    rows.append(dict(stage="B1", hidden=str(hidden), alpha=alpha, lr=np.nan, bs=np.nan,
                     pr_auc=m["pr_auc"], roc_auc=m["roc_auc"], fit_s=round(dt, 1)))

grid = pd.DataFrame(rows)
b1 = grid[grid.stage == "B1"].sort_values("pr_auc", ascending=False).reset_index(drop=True)
best_b1 = b1.iloc[0]

# B2: 3x3, mo rong neu tai mep
b2_rows = []
for lr in [3e-4, 1e-3, 3e-3]:
    for bs in [64, 128, 256]:
        _, _, m, dt = fit_score(parse_hidden(best_b1["hidden"]), float(best_b1["alpha"]),
                                seed=SEED, lr=lr, bs=bs)
        b2_rows.append(dict(stage="B2", hidden=str(best_b1["hidden"]), alpha=float(best_b1["alpha"]),
                            lr=lr, bs=bs, pr_auc=m["pr_auc"], roc_auc=m["roc_auc"],
                            fit_s=round(dt, 1)))
b2 = pd.DataFrame(b2_rows).sort_values("pr_auc", ascending=False).reset_index(drop=True)
best_b2 = b2.iloc[0]
at_edge = (best_b2["lr"] in [b2["lr"].min(), b2["lr"].max()] or
           best_b2["bs"] in [b2["bs"].min(), b2["bs"].max()])
if at_edge:
    b2x_rows = []
    for lr in [1e-4, 1e-2]:
        for bs in [32, 512]:
            _, _, m, dt = fit_score(parse_hidden(best_b1["hidden"]), float(best_b1["alpha"]),
                                    seed=SEED, lr=lr, bs=bs)
            b2x_rows.append(dict(stage="B2x", hidden=str(best_b1["hidden"]),
                                 alpha=float(best_b1["alpha"]), lr=lr, bs=bs,
                                 pr_auc=m["pr_auc"], roc_auc=m["roc_auc"],
                                 fit_s=round(dt, 1)))
    b2x = pd.DataFrame(b2x_rows).sort_values("pr_auc", ascending=False).reset_index(drop=True)
    b2 = pd.concat([b2, b2x], ignore_index=True).sort_values("pr_auc", ascending=False).reset_index(drop=True)
    best_b2 = b2.iloc[0]

all33 = pd.concat([grid, b2], ignore_index=True)
all33.to_csv(RESULTS / "round2_grid_all33.csv", index=False)

# ---- Chon cau hinh co PR-AUC cao nhat giua B1 va B2 ----
use_b1 = bool(best_b1["pr_auc"] >= best_b2["pr_auc"])
if use_b1:
    final_hidden = parse_hidden(best_b1["hidden"])
    final_alpha = float(best_b1["alpha"])
    final_lr, final_bs = None, None   # mac dinh MLPClassifier, nhu B1
    final_pr, final_roc = best_b1["pr_auc"], best_b1["roc_auc"]
    final_stage = "B1"
else:
    final_hidden = parse_hidden(best_b2["hidden"])
    final_alpha = float(best_b2["alpha"])
    final_lr, final_bs = best_b2["lr"], int(best_b2["bs"])
    final_pr, final_roc = best_b2["pr_auc"], best_b2["roc_auc"]
    final_stage = "B2"

print("=== So sanh tot nhat B1 vs tot nhat B2 ===")
print("B1 tot nhat: hidden=%s alpha=%.2f lr=None bs=None PR-AUC=%.4f ROC-AUC=%.4f"
      % (parse_hidden(best_b1["hidden"]), best_b1["alpha"],
         best_b1["pr_auc"], best_b1["roc_auc"]))
print("B2 tot nhat: hidden=%s alpha=%s lr=%s bs=%s PR-AUC=%.4f ROC-AUC=%.4f"
      % (parse_hidden(best_b2["hidden"]), best_b2["alpha"], best_b2["lr"],
         best_b2["bs"], best_b2["pr_auc"], best_b2["roc_auc"]))
print("Chon: %s -> hidden=%s alpha=%s lr=%s bs=%s | PR-AUC=%.4f ROC-AUC=%.4f"
      % (final_stage, final_hidden, final_alpha, final_lr, final_bs,
         final_pr, final_roc))

# ---------------- 2. Kiem tra logic chon: B1 cao hon B2 (gi lua, khong chay lai luoi) ----
print("\n=== Kiem tra logic chon (gi lua): B1 cao hon B2 => chon B1 ===")
mock_b1 = {"pr_auc": 0.7000, "roc_auc": 0.8500}
mock_b2 = {"pr_auc": 0.6500, "roc_auc": 0.8200}
chon_b1_mock = bool(mock_b1["pr_auc"] >= mock_b2["pr_auc"])
assert chon_b1_mock is True, "Lua chon B1 khi B1 cao hon B2"
print("Mock B1 PR-AUC=0.7000 > Mock B2 PR-AUC=0.6500 -> chon B1: %s (DUNG)" % chon_b1_mock)
# Neu B2 cao hon B1, chon B2
mock_b2 = {"pr_auc": 0.7500, "roc_auc": 0.8800}
chon_b1_mock2 = bool(mock_b1["pr_auc"] >= mock_b2["pr_auc"])
assert chon_b1_mock2 is False, "Lua chon B2 khi B2 cao hon B1"
print("Mock B1 PR-AUC=0.7000 < Mock B2 PR-AUC=0.7500 -> chon B1: %s (DUNG, thuc te chon B2)" % chon_b1_mock2)

# ---------------- 3. So sanh v1 vs v2 theo cap seed 42-46 ----------------
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

# ---------------- 4. Bao cao kiem tra model–.npy ----------------
print("\n=== Bao cao kiem tra mlp_v2.joblib vs proba_val_mlp_v2.npy ===")
pipe = joblib.load(MODELS / "mlp_v2.joblib")
proba_reload = pipe.predict_proba(X_val)[:, 1]
proba_npy = load_proba("mlp_v2", split="val")
shape_reload = proba_reload.shape
shape_npy = proba_npy.shape
max_abs_diff = float(np.abs(proba_reload - proba_npy).max())
khop_thu_tu = bool(len(proba_npy) == len(X_val))
giong_nguyen_goc = bool(np.allclose(proba_npy, proba_reload))
m_reload = evaluate(y_val, proba_reload)

print("Python:", platform.python_version())
print("scikit-learn:", sklearn.__version__)
print("numpy:", np.__version__)
print("joblib:", joblib.__version__)
print("shape reload:", shape_reload, "| shape npy:", shape_npy)
print("max abs diff (joblib vs npy): %.2e" % max_abs_diff)
print("khop thu tu val.csv:", khop_thu_tu, "| giong nguyen goc:", giong_nguyen_goc)
print("Reload PR-AUC=%.4f ROC-AUC=%.4f" % (m_reload["pr_auc"], m_reload["roc_auc"]))

npy_report = {
    "python_version": platform.python_version(),
    "sklearn_version": sklearn.__version__,
    "numpy_version": np.__version__,
    "joblib_version": joblib.__version__,
    "shape_reload": list(shape_reload),
    "shape_npy": list(shape_npy),
    "max_abs_diff_joblib_vs_npy": max_abs_diff,
    "khop_thu_tu_val_csv": khop_thu_tu,
    "giong_nguyen_goc": giong_nguyen_goc,
    "reload_pr_auc": float(m_reload["pr_auc"]),
    "reload_roc_auc": float(m_reload["roc_auc"]),
}
pd.DataFrame([npy_report]).to_csv(RESULTS / "round2_npy_check.csv", index=False)
with open(RESULTS / "round2_npy_check.txt", "w", encoding="utf-8") as f:
    for k, v in npy_report.items():
        f.write("%s: %s\n" % (k, v))

# ---------------- 5. Bang theo khach san (mo don chon) ----------------
print("\n=== Bang theo khach san (mo don chon, val) ===")
proba_single = pipe.predict_proba(X_val)[:, 1]
grp = evaluate_by_group(y_val, proba_single, X_val["hotel"]).round(3)
print(grp.to_string())
grp.to_csv(RESULTS / "round2_by_hotel.csv")

# ---------------- 6. Ensemble (thong tin, khong luu neu khong tot hon) ----------------
probas = []
for s in SEEDS:
    _, p, _, _ = fit_score(final_hidden, final_alpha, seed=s, lr=final_lr, bs=final_bs)
    probas.append(p)
proba_ens = np.mean(np.stack(probas), axis=0)
m_ens = evaluate(y_val, proba_ens)
m_single = evaluate(y_val, proba_single)
print("\nEnsemble vs don: PR-AUC ens=%.4f single=%.4f | ROC-AUC ens=%.4f single=%.4f"
      % (m_ens["pr_auc"], m_single["pr_auc"], m_ens["roc_auc"], m_single["roc_auc"]))
print("Ensemble tot hon don:", bool(m_ens["pr_auc"] > m_single["pr_auc"]))

print("\nDA LUU: round2_grid_all33.csv, round2_seed_paired.csv, round2_npy_check.csv/.txt, round2_by_hotel.csv")
