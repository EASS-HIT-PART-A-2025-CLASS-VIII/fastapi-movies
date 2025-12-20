from sqlmodel import SQLModel
from datetime import datetime
from typing import Optional


class TransactionBase(SQLModel):
    amount: float
    category: str
    description: str
    date: datetime


class TransactionCreate(TransactionBase):
    pass


class TransactionRead(TransactionBase):
    id: int
    user_id: int


class TransactionUpdate(SQLModel):
    amount: Optional[float] = None
    category: Optional[str] = None
    description: Optional[str] = None
    date: Optional[datetime] = None
