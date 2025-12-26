from sqlmodel import Session
from app.dals.transactions import TransactionDal
from app.schemas.transaction import TransactionUpdate
from app.models.transaction import Transaction
from datetime import datetime, timedelta


class TransactionService:
    def __init__(self, session: Session):
        self.dal = TransactionDal(session)

    def get_dashboard_stats(self, user_id: int):
        now = datetime.now()
        first_of_this_month = now.replace(
            day=1, hour=0, minute=0, second=0, microsecond=0
        )

        last_day_prev_month = first_of_this_month - timedelta(days=1)
        first_of_prev_month = last_day_prev_month.replace(
            day=1, hour=0, minute=0, second=0, microsecond=0
        )
        monthly_burn = self.dal.get_monthly_total(user_id, first_of_this_month)

        total_since_last_month = self.dal.get_monthly_total(
            user_id, first_of_prev_month
        )

        last_month_total = total_since_last_month - monthly_burn

        category_data = self.dal.get_category_breakdown(user_id)
        daily_history = self.dal.get_daily_spending(user_id)

        days_passed = now.day
        daily_avg = monthly_burn / days_passed if days_passed > 0 else 0

        efficiency = max(0, min(100, 100 - (monthly_burn / 100)))

        if last_month_total > 0:
            trend_pct = ((monthly_burn - last_month_total) / last_month_total) * 100
        else:
            trend_pct = 100.0 if monthly_burn > 0 else 0.0

        return {
            "monthly_burn": monthly_burn,
            "daily_avg": daily_avg,
            "trend_pct": round(trend_pct, 1),
            "efficiency_score": round(efficiency),
            "history": [
                {"date": str(h[0]), "amount": float(h[1])} for h in daily_history
            ],
            "categories": [{"name": c[0], "value": float(c[1])} for c in category_data],
        }

    def list_user_transactions(self, user_id: int):
        return self.dal.get_all_by_user(user_id)

    def create_user_transaction(self, transaction_data, user_id: int):
        transaction = Transaction(**transaction_data.model_dump(), user_id=user_id)
        return self.dal.create(transaction)

    def update_user_transaction(
        self, transaction_id: int, transaction_data: TransactionUpdate, user_id: int
    ):
        transaction = self.dal.get_by_id(transaction_id, user_id)
        if not transaction:
            return None

        for field, value in transaction_data.model_dump(exclude_unset=True).items():
            setattr(transaction, field, value)

        return self.dal.update(transaction)

    def delete_user_transaction(self, transaction_id: int, user_id: int):
        transaction = self.dal.get_by_id(transaction_id, user_id)
        if not transaction:
            return False
        self.dal.delete(transaction)
        return True
