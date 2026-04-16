def clamp(value: float, min_value: float = 0.0, max_value: float = 100.0) -> float:
    return max(min_value, min(max_value, value))


def normalize_percent(value: float) -> float:
    value = float(value)
    if value <= 1:
        return clamp(value * 100.0)
    return clamp(value)


def risk_level(score: float) -> str:
    if score >= 70:
        return "HIGH"
    if score >= 40:
        return "MEDIUM"
    return "LOW"
