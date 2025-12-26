import csv
import typer
from datetime import datetime
from sqlmodel import Session, select, delete
from app.database import engine, create_db_and_tables
from app.models.transaction import Transaction
from app.models.user import User

app = typer.Typer(help="SpendWise CLI: Manage financial telemetry and users.")


@app.command()
def seed():
    csv_path = "app/data/transactions.csv"

    with Session(engine) as session:
        statement = select(User).where(User.id == 1)
        db_user = session.exec(statement).first()

        if not db_user:
            typer.echo("❌ Error: User with ID 1 not found. Create a user first.")
            raise typer.Exit(code=1)

        transactions = []
        with open(csv_path, mode="r", encoding="utf-8") as csvfile:
            reader = csv.DictReader(csvfile)
            for row in reader:
                transactions.append(
                    Transaction(
                        amount=float(row["amount"]),
                        category=row["category"],
                        description=row["description"],
                        date=datetime.fromisoformat(row["date"]),
                        user_id=db_user.id,
                    )
                )

        session.add_all(transactions)
        session.commit()
        typer.echo(
            f"🚀 Seeded {len(transactions)} transactions for user {db_user.username}"
        )


@app.command()
def list():
    """List all financial transactions currently in the database."""
    with Session(engine) as session:
        result = session.exec(select(Transaction)).all()
        if not result:
            typer.echo("No transactions found.")
            raise typer.Exit()

        typer.echo(f"{'ID':<4} | {'Amount':<10} | {'Category':<15} | {'Description'}")
        typer.echo("-" * 60)
        for t in result:
            typer.echo(
                f"{t.id:<4} | ${t.amount:<9} | {t.category:<15} | {t.description}"
            )


@app.command()
def reset():
    """Delete all transactions from the database (keeps the schema)."""
    create_db_and_tables()
    with Session(engine) as session:
        t_result = session.execute(delete(Transaction))

        session.commit()

        t_count = t_result.rowcount

        typer.echo(f"🧹 Database Reset: Deleted {t_count} transaction(s).")


if __name__ == "__main__":
    app()
