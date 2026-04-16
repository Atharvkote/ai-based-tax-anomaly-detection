# features.py

import pandas as pd

def engineer_features(df: pd.DataFrame) -> pd.DataFrame:
    """Engineer features from raw transaction data."""
    
    # Create a copy to avoid modifying the original
    df = df.copy()
    
    # Interaction and composite features
    df["cash_tax_interaction"] = df["cash_flag"] * df["tax_gap"]
    df["velocity_amount"]      = df["transaction_velocity"] * df["amount"]
    df["tax_gap_ratio"]        = df["tax_gap"] / (df["amount"] + 1)
    df["cash_velocity"]        = df["cash_ratio_monthly"] * df["transaction_velocity"]
    df["high_amount_cash"]     = (df["cash_flag"] == 1).astype(int) * df["amount"]

    # Binary features
    df["is_round_high"] = (
        (df["is_round_amount"] == 1) & (df["amount"] > 10_000)
    ).astype(int)

    # Pattern detection (count of suspicious indicators)
    df["suspicious_pattern"] = (
        (df["cash_flag"] == 1).astype(int)
        + (df["tax_gap"] > 20_000).astype(int)
        + (df["transaction_velocity"] > 20).astype(int)
        + (df["amount_vs_avg_ratio"] > 2).astype(int)
        + (df["cash_ratio_monthly"] > 0.6).astype(int)
    )

    return df