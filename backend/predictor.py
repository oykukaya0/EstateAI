from pathlib import Path

import joblib
import numpy as np
import pandas as pd
import shap


BASE_DIR = Path(__file__).resolve().parent

MODEL_PATH = BASE_DIR.parent / "models" / "xgb_model.pkl"
FEATURES_PATH = BASE_DIR.parent / "models" / "feature_columns.pkl"

model = joblib.load(MODEL_PATH)
feature_columns = joblib.load(FEATURES_PATH)

preprocessor = model.named_steps["preprocessor"]
regressor = model.named_steps["regressor"]

explainer = shap.TreeExplainer(regressor)


def create_features(data: dict) -> dict:

    data = data.copy()

    # -------------------------
    # Feature Engineering
    # -------------------------

    data["total_rooms"] = (
        data["rooms"] + data["halls"]
    )

    data["usable_area_ratio"] = (
        data["net_sqm"] / data["gross_sqm"]
        if data["gross_sqm"] > 0
        else np.nan
    )

    data["sqm_difference"] = (
        data["gross_sqm"] - data["net_sqm"]
    )

    data["bathroom_per_room"] = (
        data["bathroom_count"] / data["total_rooms"]
        if data["total_rooms"] > 0
        else np.nan
    )

    data["floor_ratio"] = (
        data["floor"] / data["total_floors"]
        if data["total_floors"] > 0
        else np.nan
    )

    if (
        data["floor_ratio"] < -1
        or data["floor_ratio"] > 1.5
    ):
        data["floor_ratio"] = np.nan

    data["is_new_building"] = (
        1 if data["building_age"] <= 5 else 0
    )

    data["is_large_house"] = (
        1 if data["net_sqm"] >= 150 else 0
    )

    data["has_multiple_bathrooms"] = (
        1 if data["bathroom_count"] >= 2 else 0
    )

    data["sqm_per_room"] = (
        data["net_sqm"] / data["total_rooms"]
        if data["total_rooms"] > 0
        else np.nan
    )

    # Bina yaş grubu
    if data["building_age"] <= 5:
        data["building_age_group"] = "0-5"
    elif data["building_age"] <= 10:
        data["building_age_group"] = "6-10"
    elif data["building_age"] <= 20:
        data["building_age_group"] = "11-20"
    elif data["building_age"] <= 40:
        data["building_age_group"] = "21-40"
    else:
        data["building_age_group"] = "40+"

    return data


def translate_feature(name):

    # -------------------------
    # Numerical Features
    # -------------------------

    if name.startswith("num__"):

        name = name.replace("num__", "", 1)

        translations = {
            "rooms": "Oda Sayısı",
            "halls": "Salon Sayısı",
            "total_rooms": "Toplam Oda",
            "gross_sqm": "Brüt m²",
            "net_sqm": "Net m²",
            "floor": "Kat",
            "total_floors": "Toplam Kat",
            "building_age": "Bina Yaşı",
            "bathroom_count": "Banyo Sayısı",
            "maintenance_fee": "Aidat",
            "usable_area_ratio": "Kullanılabilir Alan Oranı",
            "sqm_difference": "Brüt-Net Alan Farkı",
            "bathroom_per_room": "Oda Başına Banyo",
            "floor_ratio": "Kat Oranı",
            "is_new_building": "Yeni Bina",
            "is_large_house": "Büyük Ev",
            "has_multiple_bathrooms": "Birden Fazla Banyo",
            "sqm_per_room": "Oda Başına m²",
            "is_in_complex": "Site İçinde",
        }

        return translations.get(name, name)

    # -------------------------
    # Categorical Features
    # -------------------------

    if name.startswith("cat__"):

        name = name.replace("cat__", "", 1)

        categorical_translations = {
            "district": "İlçe",
            "neighborhood": "Mahalle",
            "floor_category": "Kat Kategorisi",
            "building_type": "Bina Tipi",
            "building_condition": "Bina Durumu",
            "heating_type": "Isıtma",
            "fuel_type": "Yakıt Tipi",
            "furnished": "Eşyalı",
            "usage_status": "Kullanım Durumu",
            "orientation": "Cephe",
            "credit_eligible": "Krediye Uygun",
            "deed_status": "Tapu Durumu",
            "exchange": "Takas",
            "building_age_group": "Bina Yaş Grubu",
        }

        value_translations = {

            "heating_type": {
                "Combi Boiler": "Kombi",
                "Central": "Merkezi Sistem",
                "Central (Metered)": "Merkezi Sistem (Sayaçlı)",
                "Underfloor Heating": "Yerden Isıtma",
                "Floor Radiator": "Yerden Radyatör",
                "Air Conditioning": "Klima",
                "Heat Pump": "Isı Pompası",
                "Fireplace": "Şömine",
                "Stove": "Soba",
                "Solar": "Güneş Enerjisi",
                "No Heating": "Isıtma Yok",
                "Not Specified": "Belirtilmemiş",
                "VRV": "VRV",
            },

            "building_condition": {
                "New": "Yeni",
                "Second-hand": "İkinci El",
                "Under Construction": "İnşaat Halinde",
            },

            "deed_status": {
                "Condominium Title": "Kat Mülkiyeti",
                "Construction Easement": "Kat İrtifakı",
                "Land Title": "Arsa Tapusu",
                "Freehold Title": "Müstakil Tapu",
                "Shared Title": "Hisseli Tapu",
                "No Title Deed": "Tapusuz",
                "Cooperative Share": "Kooperatif Hissesi",
                "Foreign Owner": "Yabancı Mülkiyeti",
                "Foundation/Association": "Vakıf/Dernek",
                "Construction Servitude": "Kat İrtifakı",
            },

            "fuel_type": {
                "Natural Gas": "Doğalgaz",
                "Electricity": "Elektrik",
                "Coal-Wood": "Kömür-Odun",
                "Fuel Oil": "Fuel Oil",
            },

            "usage_status": {
                "Owner-occupied": "Ev Sahibi Oturuyor",
                "Tenant-occupied": "Kiracı Oturuyor",
                "Vacant": "Boş",
                "Not Specified": "Belirtilmemiş",
            },

            "furnished": {
                "True": "Evet",
                "False": "Hayır",
            },

            "credit_eligible": {
                "True": "Evet",
                "False": "Hayır",
            },

            "exchange": {
                "True": "Evet",
                "False": "Hayır",
            },

            "building_age_group": {
                "0-5": "0-5",
                "6-10": "6-10",
                "11-20": "11-20",
                "21-40": "21-40",
                "40+": "40+",
            },
        }

        for key, label in categorical_translations.items():

            prefix = key + "_"

            if name.startswith(prefix):

                value = name[len(prefix):]

                if key in value_translations:
                    value = value_translations[key].get(
                        value,
                        value
                    )

                return f"{label}: {value}"

        return name

    return name


def predict_price(features: dict):

    # -------------------------
    # Feature Engineering
    # -------------------------

    features = create_features(features)

    df = pd.DataFrame([features])

    # Modelin beklediği kolonları tamamla
    for column in feature_columns:

        if column not in df.columns:
            df[column] = np.nan

    # Kolon sırasını eğitimdekiyle aynı yap
    df = df[feature_columns]

    # -------------------------
    # Preprocessing
    # -------------------------

    X_transformed = preprocessor.transform(df)

    # -------------------------
    # Prediction
    # -------------------------

    prediction = regressor.predict(X_transformed)

    # -------------------------
    # SHAP
    # -------------------------

    shap_values = explainer.shap_values(X_transformed)

    shap_values = np.asarray(shap_values)

    if shap_values.ndim == 2:
        shap_values = shap_values[0]

    feature_names = preprocessor.get_feature_names_out()

    # -------------------------
    # SHAP Açıklamaları
    # -------------------------

    impacts = []

    categorical_columns = [
        "district",
        "neighborhood",
        "floor_category",
        "building_type",
        "building_condition",
        "heating_type",
        "fuel_type",
        "furnished",
        "usage_status",
        "orientation",
        "credit_eligible",
        "deed_status",
        "exchange",
        "building_age_group",
    ]

    for name, value in zip(feature_names, shap_values):

        # Sadece aktif kategorileri göster
        if name.startswith("cat__"):

            encoded_name = name.replace("cat__", "", 1)

            is_active = False

            for column in categorical_columns:

                prefix = column + "_"

                if encoded_name.startswith(prefix):

                    encoded_value = encoded_name[len(prefix):]

                    original_value = str(
                        features.get(column)
                    )

                    if encoded_value == original_value:
                        is_active = True

                    break

            if not is_active:
                continue

        impacts.append({
            "feature": translate_feature(name),
            "impact": float(value),
        })

    # En etkili özellikler
    impacts.sort(
        key=lambda x: abs(x["impact"]),
        reverse=True
    )

    top_impacts = impacts[:10]

    return {
        "prediction": float(prediction[0]),
        "explanation": top_impacts,
    }