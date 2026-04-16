from model import predict
from utils.scoring import clamp, risk_level


def score_transaction(payload: dict) -> dict:
    model_result = predict(payload)

    # model.predict returns scores already in 0-100 range
    ml_score_raw = clamp(model_result.get("ml_score", 0), 0, 100)
    rule_score_raw = clamp(model_result.get("rule_score", 0), 0, 100)
    final_score_raw = clamp(model_result.get("final_score", 0), 0, 100)

    # Normalize to 0-1 for the frontend
    ml_score = round(ml_score_raw / 100, 4)
    rule_score = round(rule_score_raw / 100, 4)
    final_score = round(final_score_raw / 100, 4)

    level = risk_level(final_score_raw)

    return {
        "ml_score": ml_score,
        "rule_score": rule_score,
        "final_score": final_score,
        "risk_level": level,
        "is_suspicious": level == "HIGH",
    }
