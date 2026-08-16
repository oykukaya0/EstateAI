from pathlib import Path

import pandas as pd
import joblib

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from schemas import HouseFeatures
from predictor import predict_price


# =========================================================
# PATHS
# =========================================================

BASE_DIR = Path(__file__).resolve().parent
PROJECT_DIR = BASE_DIR.parent

MODEL_PATH = PROJECT_DIR / "models" / "xgb_model.pkl"
FEATURES_PATH = PROJECT_DIR / "models" / "feature_columns.pkl"

DATA_PATH = PROJECT_DIR / "data" / "processed" / "featured_data.csv"


# =========================================================
# MODEL
# =========================================================

model = joblib.load(MODEL_PATH)
feature_columns = joblib.load(FEATURES_PATH)


# =========================================================
# DATA
# =========================================================

df = pd.read_csv(DATA_PATH)


# İlçe ve mahalle isimlerini temizle
df["district"] = df["district"].astype(str).str.strip()
df["neighborhood"] = df["neighborhood"].astype(str).str.strip()


# =========================================================
# FASTAPI
# =========================================================

app = FastAPI(
    title="EstateAI API",
    description="İstanbul Konut Fiyat Tahmin Sistemi",
    version="1.0.0"
)


# =========================================================
# CORS
# =========================================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "https://estate-ai-lake.vercel.app",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# =========================================================
# HOME
# =========================================================

@app.get("/")
def home():
    return {
        "message": "EstateAI API çalışıyor 🚀"
    }


# =========================================================
# DISTRICTS
# =========================================================

@app.get("/districts")
def get_districts():

    districts = (
        df["district"]
        .dropna()
        .unique()
        .tolist()
    )

    districts.sort()

    return districts


# =========================================================
# NEIGHBORHOODS
# =========================================================

@app.get("/neighborhoods/{district}")
def get_neighborhoods(district: str):

    district_df = df[
        df["district"].str.lower() == district.lower()
    ]

    neighborhoods = (
        district_df["neighborhood"]
        .dropna()
        .unique()
        .tolist()
    )

    neighborhoods.sort()

    return neighborhoods


# =========================================================
# PREDICT
# =========================================================

@app.post("/predict")
def predict(features: HouseFeatures):

    prediction = predict_price(
        features.model_dump()
    )

    return prediction