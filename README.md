# SEMI-AI – AI-Based Semiconductor Chip Failure Prediction

> Professional full-stack web application for semiconductor chip failure prediction using
> Random Forest ML and SHAP explainability on the UCI SECOM dataset.

## Project Structure

```
SEMI-AI/
├── frontend/          ← React.js + Vite frontend
│   ├── src/
│   │   ├── components/   (Sidebar, TopBar, StatCard, Charts, …)
│   │   ├── pages/        (Home, Dashboard, ChipPrediction, XAI, Risk, History, About)
│   │   ├── context/      (AppContext – global state)
│   │   └── services/     (api.js – backend calls)
│   └── package.json
│
└── backend/           ← Python Flask REST API
    ├── app.py            (routes)
    ├── model_interface.py(ML + SHAP integration)
    ├── database.py       (SQLite)
    ├── models/           ← DROP YOUR model.pkl HERE
    └── requirements.txt
```

## Quick Start

### Frontend
```bash
cd frontend
npm install
npm run dev
# Opens at http://localhost:5173
```

### Backend
```bash
cd backend
python -m venv venv
venv\Scripts\activate    # Windows
pip install -r requirements.txt
python app.py
# API at http://localhost:5000
```

## Integrating Your Trained Model

Place these files in `backend/models/`:
- `model.pkl`           → trained sklearn pipeline (joblib)
- `shap_explainer.pkl`  → SHAP TreeExplainer (optional)
- `feature_names.json`  → `["feature_0", ...]` (optional)

The frontend will automatically switch from "Model Not Connected" to "Model Ready"
within 15 seconds of the server detecting the model.

## Tech Stack

| Layer     | Technology        |
|-----------|-------------------|
| Frontend  | React.js + Vite   |
| Styling   | Vanilla CSS       |
| Charts    | Chart.js          |
| Backend   | Python Flask      |
| Database  | SQLite            |
| ML        | Scikit-learn      |
| XAI       | SHAP              |
| Dataset   | UCI SECOM         |
