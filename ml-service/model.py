# model.py

import os
import joblib
import numpy as np
import pandas as pd

from config import FEATURES, MODEL_BASE_DIR, ML_WEIGHT, RULE_WEIGHT
from features import engineer_features


# ─────────────────────────────────────────────
# VERSION LOADING
# ─────────────────────────────────────────────

def get_latest_version():
    versions = [
        d for d in os.listdir(MODEL_BASE_DIR)
        if d.startswith("v") and d[1:].isdigit()
    ]
    if not versions:
        raise Exception("No trained models found")

    latest = max(versions, key=lambda x: int(x[1:]))
    return latest


def load_model(version=None):
    version = version or get_latest_version()
    path = os.path.join(MODEL_BASE_DIR, version)

    scaler = joblib.load(os.path.join(path, "scaler_final.pkl"))
    models = joblib.load(os.path.join(path, "models_final.pkl"))
    threshold = joblib.load(os.path.join(path, "threshold_final.pkl"))

    return scaler, models, threshold


# ─────────────────────────────────────────────
# ML SCORING
# ─────────────────────────────────────────────

def _normalize(x):
    """Normalize anomaly scores to 0-100 range. Always returns array."""
    if isinstance(x, np.ndarray):
        x = x.flatten()
    else:
        x = np.array([x]).flatten()
    
    # For single prediction, use z-score-like normalization instead
    if len(x) == 1:
        return np.array([max(0, min(100, x[0] * 10))])
    
    # For multiple predictions, use percentile normalization
    x_min = x.min()
    x_max = x.max()
    if x_max == x_min:
        return np.full_like(x, 50.0, dtype=float)  # Return middle value if all same
    return (x - x_min) / (x_max - x_min) * 100


def score_models(models, X):
    iso1, iso2, lof = models

    s1 = _normalize(-iso1.score_samples(X))
    s2 = _normalize(-iso2.score_samples(X))
    s3 = _normalize(-lof.score_samples(X))

    return 0.45 * s1 + 0.30 * s2 + 0.25 * s3


# ─────────────────────────────────────────────
# RULE ENGINE
# ─────────────────────────────────────────────

def rule_score(row):
    s = 0

    if row["tax_gap"] > 30000: s += 35
    elif row["tax_gap"] > 20000: s += 22
    elif row["tax_gap"] > 10000: s += 10

    if row["cash_flag"] == 1 and row["amount"] > 100000: s += 30
    elif row["cash_flag"] == 1 and row["amount"] > 50000: s += 20
    elif row["cash_flag"] == 1 and row["amount"] > 20000: s += 10

    if row["transaction_velocity"] > 30: s += 25
    elif row["transaction_velocity"] > 20: s += 15

    if row["cash_ratio_monthly"] > 0.8: s += 20
    elif row["cash_ratio_monthly"] > 0.6: s += 10

    if row["amount_vs_avg_ratio"] > 3: s += 20
    elif row["amount_vs_avg_ratio"] > 2: s += 10

    if row["duplicate_transaction_flag"]: s += 15
    if row["sudden_spike_flag"]: s += 10
    if row["suspicious_pattern"] >= 4: s += 15
    if row["refund_rate"] > 0.3: s += 10

    return min(s, 100)


# ─────────────────────────────────────────────
# PREDICTION
# ─────────────────────────────────────────────

def predict(data: dict, version=None):

    scaler, models, threshold = load_model(version)

    df = pd.DataFrame([data])
    
    # 🔥 CRITICAL: Convert all input values to numeric
    for col in df.columns:
        df[col] = pd.to_numeric(df[col], errors='coerce')
    
    # print("\n INPUT DATA (after type conversion):")
    # print(df.to_dict('records')[0])
    
    df = engineer_features(df)
    
    # print("\n ENGINEERED FEATURES:")
    # print(df[FEATURES].to_dict('records')[0])

    # Ensure all required features exist
    missing_features = [f for f in FEATURES if f not in df.columns]
    if missing_features:
        raise ValueError(f"Missing features after engineering: {missing_features}")
    
    # Check for NaN values
    if df[FEATURES].isna().any().any():
        nan_cols = df[FEATURES].columns[df[FEATURES].isna().any()].tolist()
        raise ValueError(f"NaN values found in features: {nan_cols}")

    X = scaler.transform(df[FEATURES])
    
    # print(f"SCALED INPUT: {X}")

    ml_score = score_models(models, X)[0]
    rule = rule_score(df.iloc[0])
    
    # print(f" ML Score: {ml_score}")
    # print(f" Rule Score: {rule}")

    final_score = ML_WEIGHT * ml_score + RULE_WEIGHT * rule
    is_suspicious = final_score >= threshold

    return {
        "ml_score": float(ml_score),
        "rule_score": float(rule),
        "final_score": float(final_score),
        "is_suspicious": bool(is_suspicious),
        "threshold": float(threshold),
    }