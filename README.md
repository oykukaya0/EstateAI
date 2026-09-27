# 🏠 EstateAI

### Istanbul Apartment Price Prediction

EstateAI is a web application that estimates apartment listing prices in Istanbul using a machine learning model. Users enter a property's location and characteristics to receive an estimated price.

## 🚀 Live Demo

https://estate-ai-lake.vercel.app

## 🎯 Project Overview

The model uses features such as district, neighborhood, gross and net area, room and bathroom counts, floor, building age, heating type, residential complex status, and deed status.

The project covers data exploration, cleaning, feature engineering, model comparison, prediction serving, and a React interface. The training notebooks compare linear regression, random forest, XGBoost, and CatBoost; the deployed prediction pipeline uses **XGBoost**.

## 🤖 Model Performance

The XGBoost model was evaluated on a held-out 20% split of the dataset:

| Metric | Result |
|---|---:|
| R² | **0.7546** |
| Mean absolute error (MAE) | **TRY 2.76 million** |
| Root mean squared error (RMSE) | **TRY 7.95 million** |

These figures describe performance on apartment listing data. Predictions are estimates, not verified transaction prices or appraisals.

## 🧠 Model Explanations

The training notebook uses **SHAP (SHapley Additive exPlanations)** to examine feature contributions to XGBoost predictions. This helps explore how property characteristics affect an individual prediction; it does not establish that a feature causes a price change.

## 🏗️ Architecture

```text
User input → React frontend (Vercel) → FastAPI backend (Render)
           → feature processing and trained XGBoost model → estimated price
```

## 💻 Technology Stack

| Area | Tools |
|---|---|
| Frontend | React, Vite, JavaScript, CSS, Lucide Icons |
| Backend | Python, FastAPI, Uvicorn, Pydantic |
| Machine learning | XGBoost, scikit-learn, pandas, NumPy, SHAP, Joblib |
| Deployment | Vercel (frontend), Render (backend), GitHub (source control) |

## 📁 Repository Structure

```text
EstateAI/
├── backend/                 # API, input schemas, and prediction logic
├── data/
│   ├── raw/                # Original CSV used in this project
│   └── processed/          # Cleaned and engineered features
├── frontend/               # React application
├── models/                 # Serialized model and feature columns
├── notebooks/
│   ├── 01_data_exploration.ipynb
│   ├── 02_data_cleaning.ipynb
│   ├── 03_feature_engineering.ipynb
│   ├── 04_feature_selection.ipynb
│   └── 05_model_training.ipynb
└── requirements.txt
```
