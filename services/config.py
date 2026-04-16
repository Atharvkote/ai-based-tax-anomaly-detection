# config.py

import os

FEATURES = [
    "amount", "cash_flag", "is_weekend", "tax_gap",
    "transaction_velocity", "cash_ratio_monthly", "amount_vs_avg_ratio",
    "cash_tax_interaction", "velocity_amount", "tax_gap_ratio",
    "cash_velocity", "is_round_high", "high_amount_cash", "suspicious_pattern",
    "duplicate_transaction_flag", "sudden_spike_flag", "profit_margin",
    "discount_frequency", "refund_rate", "client_concentration_ratio",
    "same_amount_frequency", "bulk_transaction_ratio",
]

# Use absolute path based on script location
MODEL_BASE_DIR = os.path.join(os.path.dirname(__file__), "training", "trained_models")
ML_WEIGHT = 0.55
RULE_WEIGHT = 0.45