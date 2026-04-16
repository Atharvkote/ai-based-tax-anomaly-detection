from fastapi import APIRouter

from controllers.ml_controller import predict_transaction
from schema import Transaction

router = APIRouter(prefix="/api/ml", tags=["ML"])


@router.post("/predict")
def predict_api(data: Transaction):
    return predict_transaction(data)
