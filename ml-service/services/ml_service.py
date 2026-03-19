from model import predict
from utils.scoring import clamp, normalize_percent, risk_level


def score_transaction(payload: dict) -> dict:
    model_result = predict(payload)

    ml_score = normalize_percent(model_result.get("ml_score", 0))
    rule_score = normalize_percent(model_result.get("rule_score", 0))

    # weighted blend with cap for extreme values
    final_score = clamp((0.6 * ml_score) + (0.4 * rule_score), 0, 100)
    level = risk_level(final_score)

    return {
        "ml_score": round(ml_score, 2),
        "rule_score": round(rule_score, 2),
        "final_score": round(final_score, 2),
        "risk_level": level,
        "is_suspicious": level == "HIGH",
    }
