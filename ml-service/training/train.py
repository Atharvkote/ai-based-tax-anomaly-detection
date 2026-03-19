import os
import warnings

import joblib
import numpy as np
import pandas as pd
from scipy import stats
from sklearn.ensemble import IsolationForest
from sklearn.model_selection import KFold, train_test_split
from sklearn.neighbors import LocalOutlierFactor
from sklearn.preprocessing import RobustScaler

warnings.filterwarnings("ignore")


# ─────────────────────────────────────────────
# GLOBAL CONFIG
# ─────────────────────────────────────────────

SEED = 42
np.random.seed(SEED)

MODELS_BASE_DIR  = "trained_models"    # parent folder for all versions
LABEL_CANDIDATES = ["is_fraud", "tax_evasion_flag", "label", "fraud", "is_evasion"]

FEATURES = [
    "amount", "cash_flag", "is_weekend", "tax_gap",
    "transaction_velocity", "cash_ratio_monthly", "amount_vs_avg_ratio",
    "cash_tax_interaction", "velocity_amount", "tax_gap_ratio",
    "cash_velocity", "is_round_high", "high_amount_cash", "suspicious_pattern",
    "duplicate_transaction_flag", "sudden_spike_flag", "profit_margin",
    "discount_frequency", "refund_rate", "client_concentration_ratio",
    "same_amount_frequency", "bulk_transaction_ratio",
]


# ─────────────────────────────────────────────
# VERSION HELPERS
# ─────────────────────────────────────────────

def next_version(base_dir: str = MODELS_BASE_DIR) -> str:
    """
    Returns the next version string: 'v1' if no versions exist,
    'v2' if v1 exists, 'v3' if v1 and v2 exist, etc.
    Never overwrites an existing version.
    """
    if not os.path.exists(base_dir):
        return "v1"
    existing = [
        d for d in os.listdir(base_dir)
        if d.startswith("v") and d[1:].isdigit()
    ]
    n = max((int(d[1:]) for d in existing), default=0)
    return f"v{n + 1}"


def latest_version(base_dir: str = MODELS_BASE_DIR) -> str:
    """Returns the most recently saved version string (e.g. 'v3')."""
    if not os.path.exists(base_dir):
        raise FileNotFoundError(f"No trained models found in '{base_dir}/'")
    existing = [
        d for d in os.listdir(base_dir)
        if d.startswith("v") and d[1:].isdigit()
    ]
    if not existing:
        raise FileNotFoundError(f"No versions found in '{base_dir}/'")
    n = max(int(d[1:]) for d in existing)
    return f"v{n}"


def version_dir(version: str, base_dir: str = MODELS_BASE_DIR) -> str:
    """Returns full path to a version folder, e.g. 'trained_models/v2'."""
    return os.path.join(base_dir, version)


# ─────────────────────────────────────────────
# 1. DATA + FEATURES
# ─────────────────────────────────────────────

def load_data(path: str) -> pd.DataFrame:
    df = pd.read_csv(path)
    df = df.drop_duplicates().fillna(0)
    print(f"[data]  {len(df):,} rows loaded")
    return df


def engineer_features(df: pd.DataFrame) -> pd.DataFrame:
    df["cash_tax_interaction"] = df["cash_flag"] * df["tax_gap"]
    df["velocity_amount"]      = df["transaction_velocity"] * df["amount"]
    df["tax_gap_ratio"]        = df["tax_gap"] / (df["amount"] + 1)
    df["cash_velocity"]        = df["cash_ratio_monthly"] * df["transaction_velocity"]
    df["high_amount_cash"]     = (df["cash_flag"] == 1).astype(int) * df["amount"]
    df["is_round_high"]        = (
        (df["is_round_amount"] == 1) & (df["amount"] > 10_000)
    ).astype(int)
    df["suspicious_pattern"]   = (
        (df["cash_flag"] == 1).astype(int)
        + (df["tax_gap"] > 20_000).astype(int)
        + (df["transaction_velocity"] > 20).astype(int)
        + (df["amount_vs_avg_ratio"] > 2).astype(int)
        + (df["cash_ratio_monthly"] > 0.6).astype(int)
    )
    print(f"[feat]  {len(FEATURES)} features ready")
    return df


# ─────────────────────────────────────────────
# 2. SPLIT + SCALE
# ─────────────────────────────────────────────

def split_data(df: pd.DataFrame):
    X = df[FEATURES]
    label_col = next((c for c in LABEL_CANDIDATES if c in df.columns), None)
    y = df[label_col] if label_col else None

    X_train, X_test, y_train, y_test = train_test_split(
        X,
        y if y is not None else X,
        test_size=0.2,
        random_state=SEED,
        stratify=y if y is not None else None,
    )
    if y is None:
        y_train = y_test = None

    print(f"[split] Train: {len(X_train):,} | Test: {len(X_test):,}")
    return X_train, X_test, y_train, y_test


def scale(X_train, X_test):
    """Fit scaler on train only — prevents data leakage into test set."""
    scaler = RobustScaler()
    return scaler.fit_transform(X_train), scaler.transform(X_test), scaler


# ─────────────────────────────────────────────
# 3. ENSEMBLE
# ─────────────────────────────────────────────

def _normalize(x: np.ndarray) -> np.ndarray:
    return (x - x.min()) / (x.max() - x.min() + 1e-9) * 100


def train_models(X: np.ndarray):
    """Fit three complementary anomaly detectors on X (train data only)."""
    iso1 = IsolationForest(
        n_estimators=300, contamination=0.08,
        max_features=0.8, bootstrap=True, random_state=SEED,
    )
    iso2 = IsolationForest(
        n_estimators=200, contamination=0.10,
        max_features=1.0, bootstrap=False, random_state=99,
    )
    # novelty=True is required to call score_samples() on unseen test data
    lof = LocalOutlierFactor(n_neighbors=30, contamination=0.08, novelty=True)

    iso1.fit(X)
    iso2.fit(X)
    lof.fit(X)
    return iso1, iso2, lof


def score_models(models, X: np.ndarray) -> np.ndarray:
    """Weighted ensemble anomaly score (0–100). Higher = more anomalous."""
    iso1, iso2, lof = models
    s1 = _normalize(-iso1.score_samples(X))
    s2 = _normalize(-iso2.score_samples(X))
    s3 = _normalize(-lof.score_samples(X))
    return 0.45 * s1 + 0.30 * s2 + 0.25 * s3


# ─────────────────────────────────────────────
# 4. RULE ENGINE
# ─────────────────────────────────────────────

def rule_score(row: pd.Series) -> float:
    """
    Tiered, capped rule-based scorer. Outputs 0–100.
    DO NOT call normalize() on this output — it is already on the correct scale.
    """
    s = 0

    # Tax gap — 3 tiers
    if   row["tax_gap"] > 30_000: s += 35
    elif row["tax_gap"] > 20_000: s += 22
    elif row["tax_gap"] > 10_000: s += 10

    # Cash + amount — 3 tiers
    if   row["cash_flag"] == 1 and row["amount"] > 100_000: s += 30
    elif row["cash_flag"] == 1 and row["amount"] >  50_000: s += 20
    elif row["cash_flag"] == 1 and row["amount"] >  20_000: s += 10

    # Transaction velocity — 2 tiers
    if   row["transaction_velocity"] > 30: s += 25
    elif row["transaction_velocity"] > 20: s += 15

    # Cash ratio monthly — 2 tiers
    if   row["cash_ratio_monthly"] > 0.8: s += 20
    elif row["cash_ratio_monthly"] > 0.6: s += 10

    # Amount vs average — 2 tiers
    if   row["amount_vs_avg_ratio"] > 3: s += 20
    elif row["amount_vs_avg_ratio"] > 2: s += 10

    # Behavioural flags
    if row["duplicate_transaction_flag"]: s += 15
    if row["sudden_spike_flag"]:          s += 10
    if row["suspicious_pattern"] >= 4:    s += 15
    if row["refund_rate"] > 0.3:          s += 10

    return float(min(s, 100))   # hard cap at 100


# ─────────────────────────────────────────────
# 5. VALIDATION
# ─────────────────────────────────────────────

def overfit_check(train_s: np.ndarray, test_s: np.ndarray) -> None:
    drift    = abs(train_s.mean() - test_s.mean())
    ks_p     = stats.ks_2samp(train_s, test_s).pvalue
    drift_ok = drift < 2.0
    print(f"[check] drift={drift:.3f} {'✓' if drift_ok else '⚠'} | "
          f"KS p={ks_p:.4f} "
          f"{'(large-sample sensitivity — use drift instead)' if ks_p < 0.05 else '✓'}")


def cross_validate(df: pd.DataFrame) -> None:
    """
    5-fold CV to validate score stability.
    Threshold is derived from the combined train-fold final_score (ML + rules)
    to keep it in the same score space — same fix as the main pipeline.
    """
    X  = df[FEATURES]
    kf = KFold(n_splits=5, shuffle=True, random_state=SEED)
    means, flag_rates = [], []

    for fold, (tr, te) in enumerate(kf.split(X), 1):
        sc    = RobustScaler()
        Xtr_s = sc.fit_transform(X.iloc[tr])
        Xte_s = sc.transform(X.iloc[te])

        m     = train_models(Xtr_s)
        ml_tr = score_models(m, Xtr_s)
        ml_te = score_models(m, Xte_s)

        rule_tr = np.array([rule_score(df.iloc[i]) for i in X.index[tr]])
        rule_te = np.array([rule_score(df.iloc[i]) for i in X.index[te]])

        final_tr = 0.55 * ml_tr + 0.45 * rule_tr
        final_te = 0.55 * ml_te + 0.45 * rule_te
        thresh   = np.percentile(final_tr, 90)   # threshold from same score space

        means.append(final_te.mean())
        flag_rates.append((final_te >= thresh).mean() * 100)
        print(f"  Fold {fold}: final_mean={final_te.mean():.2f}  "
              f"flag_rate={flag_rates[-1]:.1f}%")

    print(f"[cv]    mean={np.mean(means):.3f} ± {np.std(means):.3f} | "
          f"flag_rate={np.mean(flag_rates):.1f}% ± {np.std(flag_rates):.1f}%")


# ─────────────────────────────────────────────
# 6. SUPERVISED EVALUATION (auto-activates if labels exist)
# ─────────────────────────────────────────────

def evaluate_supervised(y_true, scores: np.ndarray, threshold: float) -> None:
    from sklearn.metrics import (
        accuracy_score, confusion_matrix, f1_score,
        precision_score, recall_score, roc_auc_score,
    )
    preds = (scores >= threshold).astype(int)
    print("\n[eval]  Accuracy  :", round(accuracy_score(y_true, preds), 4))
    print("[eval]  Precision :", round(precision_score(y_true, preds, zero_division=0), 4))
    print("[eval]  Recall    :", round(recall_score(y_true, preds, zero_division=0), 4))
    print("[eval]  F1        :", round(f1_score(y_true, preds, zero_division=0), 4))
    print("[eval]  ROC-AUC   :", round(roc_auc_score(y_true, scores), 4))
    cm = confusion_matrix(y_true, preds)
    print(f"[eval]  Confusion  TN={cm[0,0]}  FP={cm[0,1]}  FN={cm[1,0]}  TP={cm[1,1]}")


# ─────────────────────────────────────────────
# 7. MAIN PIPELINE
# ─────────────────────────────────────────────

def run_pipeline(
    path: str,
    version: str = None,                      # None = auto-increment
    output_csv: str = "results_final.csv",
) -> pd.DataFrame:

    # ── Version setup ──────────────────────────────────────
    ver      = version if version else next_version()
    save_dir = version_dir(ver)
    os.makedirs(save_dir, exist_ok=True)

    print("=" * 52)
    print(f"  Tax Evasion Detection — Final  [{ver}]")
    print("=" * 52)
    print(f"[ver]   Saving to {save_dir}/")

    # ── Load & engineer ────────────────────────────────────
    df = load_data(path)
    df = engineer_features(df)

    # ── Train / test split for validation ─────────────────
    X_train, X_test, y_train, y_test = split_data(df)
    Xtr_s, Xte_s, _ = scale(X_train, X_test)

    models_val = train_models(Xtr_s)
    train_s    = score_models(models_val, Xtr_s)
    test_s     = score_models(models_val, Xte_s)

    overfit_check(train_s, test_s)

    print("[cv]    Running 5-fold cross-validation...")
    cross_validate(df)

    # ── Supervised evaluation (only if labels exist) ───────
    if y_test is not None:
        rule_te     = np.array([rule_score(df.loc[i]) for i in X_test.index])
        final_te    = 0.55 * test_s + 0.45 * rule_te
        rule_tr_arr = np.array([rule_score(df.loc[i]) for i in X_train.index])
        final_tr    = 0.55 * train_s + 0.45 * rule_tr_arr
        thresh_eval = float(pd.Series(final_tr).quantile(0.90))
        evaluate_supervised(y_test, final_te, thresh_eval)
    else:
        print("[eval]  No ground-truth labels — accuracy/ROC not reported.")
        print("        Model validated via CV stability and overfit drift above.")

    # ── Final model: retrain on full dataset ───────────────
    print(f"\n[train] Fitting final models on full dataset...")
    scaler_final = RobustScaler()
    X_all_s      = scaler_final.fit_transform(df[FEATURES])
    final_models = train_models(X_all_s)

    df["ml_score"]  = score_models(final_models, X_all_s)
    df["rule_score"] = df.apply(rule_score, axis=1)          # FIX 2: no normalize()
    df["final_score"] = 0.55 * df["ml_score"] + 0.45 * df["rule_score"]

    # FIX 1: threshold from final_score — same score space, no mismatch
    threshold = float(df["final_score"].quantile(0.90))
    df["is_suspicious"] = df["final_score"] >= threshold

    susp = df["is_suspicious"].sum()
    print(f"[done]  Threshold (90th pct of final_score): {threshold:.3f}")
    print(f"[done]  Flagged: {susp:,} / {len(df):,} ({susp / len(df) * 100:.1f}%)")
    print(f"[done]  Score — mean: {df['final_score'].mean():.2f}  "
          f"std: {df['final_score'].std():.2f}  max: {df['final_score'].max():.2f}")

    # ── Save models into versioned folder ──────────────────
    joblib.dump(scaler_final,  os.path.join(save_dir, "scaler_final.pkl"))
    joblib.dump(final_models,  os.path.join(save_dir, "models_final.pkl"))
    joblib.dump(threshold,     os.path.join(save_dir, "threshold_final.pkl"))
    print(f"[save]  Models → {save_dir}/scaler_final.pkl")
    print(f"[save]          → {save_dir}/models_final.pkl")
    print(f"[save]          → {save_dir}/threshold_final.pkl")

    df.to_csv(output_csv, index=False)
    print(f"[save]  Results → {output_csv}")
    print("=" * 52)
    return df


# ─────────────────────────────────────────────
# 8. BATCH SCORING (inference, no retraining)
# ─────────────────────────────────────────────

def score_new_records(
    new_data_path: str,
    version: str = None,    # None = use latest saved version
) -> pd.DataFrame:
    
    ver      = version if version else latest_version()
    save_dir = version_dir(ver)

    print(f"[infer] Loading models from {save_dir}/")
    scaler    = joblib.load(os.path.join(save_dir, "scaler_final.pkl"))
    models    = joblib.load(os.path.join(save_dir, "models_final.pkl"))
    threshold = joblib.load(os.path.join(save_dir, "threshold_final.pkl"))

    df_new = load_data(new_data_path)
    df_new = engineer_features(df_new)

    X_new_s = scaler.transform(df_new[FEATURES])    # transform only, no fit

    df_new["ml_score"]    = score_models(models, X_new_s)
    df_new["rule_score"]  = df_new.apply(rule_score, axis=1)
    df_new["final_score"] = 0.55 * df_new["ml_score"] + 0.45 * df_new["rule_score"]
    df_new["is_suspicious"] = df_new["final_score"] >= threshold

    susp = df_new["is_suspicious"].sum()
    print(f"[infer] Flagged {susp} / {len(df_new)} records using {ver} (threshold={threshold:.3f})")
    return df_new


# ─────────────────────────────────────────────
# ENTRYPOINT
# ─────────────────────────────────────────────

if __name__ == "__main__":

    df_result = run_pipeline(
        path="tax_evasion_dataset.csv",
        # version="v1",        # uncomment to pin a version manually
        output_csv="results_final.csv",
    )

    print("\n── Top 10 Highest-Risk Records ────────────────────")
    top10 = (
        df_result[df_result["is_suspicious"]]
        .sort_values("final_score", ascending=False)
        .head(10)
    )
    cols = ["business_id", "business_type", "amount",
            "ml_score", "rule_score", "final_score"]
    print(top10[cols].to_string(index=False))

    # ── Score new data using saved model ──────────────────
    # Uncomment when you have new incoming records:
    # df_new = score_new_records("new_records.csv")
    # df_new = score_new_records("new_records.csv", version="v2")  # pin specific version