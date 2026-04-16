from schema import Transaction
from services.ml_service import score_transaction
from utils.response import success_response


def predict_transaction(data: Transaction) -> dict:
    payload = data.model_dump() if hasattr(data, "model_dump") else data.dict()
    result = score_transaction(payload)
    return success_response(result, "Prediction generated successfully")
