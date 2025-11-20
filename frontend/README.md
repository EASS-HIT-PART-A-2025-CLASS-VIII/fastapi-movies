## 🎨 Streamlit Dashboard

The **Streamlit dashboard** provides a simple interface for viewing, adding, deleting, and exporting movies.

### ▶️ Run the Dashboard

Make sure the backend (FastAPI) is running first:

```bash
cd backend
uv run uvicorn app.main:app --reload
```
Then start the dashboard:

```bash
cd frontend
uv run streamlit run app/dashboard.py
```
Access it at http://localhost:8501.

### 🧩 Features
📋 List all movies from the FastAPI backend

➕ Add new movies with input validation (rating between 0–10)

🗑️ Delete existing movies

🔄 Refresh cached data

💾 Export movies to CSV (creates movies_export.csv in the frontend folder)

### ⚙️ Notes
- The dashboard caches data for 30 seconds (st.cache_data).

- Invalid form inputs (like rating > 10) trigger inline error messages and do not send bad data to the backend.

- No authentication is required.