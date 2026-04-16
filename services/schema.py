# schema.py

from pydantic import BaseModel, Field


class Transaction(BaseModel):
    amount: float
    cash_flag: int = Field(ge=0, le=1)
    is_weekend: int = Field(ge=0, le=1)
    tax_gap: float
    transaction_velocity: float
    cash_ratio_monthly: float
    amount_vs_avg_ratio: float
    is_round_amount: int = Field(ge=0, le=1)
    duplicate_transaction_flag: int = Field(ge=0, le=1)
    sudden_spike_flag: int = Field(ge=0, le=1)
    profit_margin: float
    discount_frequency: float
    refund_rate: float
    client_concentration_ratio: float
    same_amount_frequency: float
    bulk_transaction_ratio: float