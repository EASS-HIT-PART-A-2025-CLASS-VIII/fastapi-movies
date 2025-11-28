from sqlmodel import SQLModel, create_engine, Session
import os

# Ensure the data directory exists
os.makedirs("app/data", exist_ok=True)

# Define the database file path
DATABASE_URL = "sqlite:///app/data/movies.db"

# Create the engine
engine = create_engine(DATABASE_URL, echo=True)

# Create tables in db if they don't exist
def create_db_and_tables():
    SQLModel.metadata.create_all(engine)

# Return db session
def get_session():
    with Session(engine) as session:
        yield session
