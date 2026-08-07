import joblib
import pandas as pd

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import Literal


# ==============================
# Load ML Model
# ==============================

try:
    model = joblib.load("Mental_Health_Model.pkl")
except Exception as e:
    raise RuntimeError(f"Unable to load model: {e}")


# ==============================
# Countries used during training
# ==============================

top_countries = [
    "Other",
    "Canada",
    "USA",
    "India",
    "Australia",
    "UK",
    "Germany",
    "France",
    "Mexico",
    "Turkey"
]


# ==============================
# FastAPI App
# ==============================

app = FastAPI(
    title="Mental Health Prediction API",
    description="Predict Mental Health Score using Machine Learning",
    version="1.0.0"
)


# ==============================
# CORS
# ==============================

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ==============================
# Request Model
# ==============================

class StudentData(BaseModel):

    Age: int = Field(..., ge=10, le=100)

    Gender: Literal["Male", "Female"]

    Country: str

    Academic_Level: Literal[
        "Undergraduate",
        "Graduate",
        "High School"
    ]

    Most_Used_Platform: Literal[
        "Facebook",
        "LinkedIn",
        "Instagram",
        "Snapchat",
        "Twitter",
        "YouTube",
        "TikTok",
        "LINE",
        "KakaoTalk",
        "VKontakte",
        "WhatsApp",
        "WeChat"
    ]

    Purpose_Of_Use: Literal[
        "Networking",
        "Education",
        "Entertainment",
        "News"
    ]

    Avg_Daily_Usage_Hours: float = Field(..., ge=0, le=24)

    Daily_Unlocks: int = Field(..., ge=0)

    Study_Hours: float = Field(..., ge=0, le=24)

    Physical_Activity_Hours: float = Field(..., ge=0, le=24)

    Sleep_Hours_Per_Night: float = Field(..., ge=0, le=24)

    Stress_Level: Literal[
        "Low",
        "Medium",
        "High",
        "Very High"
    ]


# ==============================
# Response Model
# ==============================

class PredictionResponse(BaseModel):
    predicted_Mental_Health_Score: float


# ==============================
# Home
# ==============================

@app.get("/")
def home():
    return {
        "message": "Mental Health Prediction API is running successfully."
    }


# ==============================
# Health Check
# ==============================

@app.get("/health")
def health():
    return {
        "status": "OK"
    }


# ==============================
# Prediction Endpoint
# ==============================

@app.post(
    "/predict",
    response_model=PredictionResponse
)
def predict(data: StudentData):

    try:

        country_group = (
            data.Country
            if data.Country in top_countries
            else "other"
        )

        input_df = pd.DataFrame([{

            "Age": data.Age,

            "Gender": data.Gender,

            "Country": data.Country,

            "Academic_Level": data.Academic_Level,

            "Most_Used_Platform": data.Most_Used_Platform,

            "Purpose_Of_Use": data.Purpose_Of_Use,

            "Avg_Daily_Usage_Hours": data.Avg_Daily_Usage_Hours,

            "Daily_Unlocks": data.Daily_Unlocks,

            "Study_Hours": data.Study_Hours,

            "Physical_Activity_Hours": data.Physical_Activity_Hours,

            "Sleep_Hours_Per_Night": data.Sleep_Hours_Per_Night,

            "Stress_Level": data.Stress_Level,

            "grouped_countrys": country_group

        }])

        prediction = model.predict(input_df)[0]

        return PredictionResponse(
            predicted_Mental_Health_Score=round(float(prediction), 2)
        )

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Prediction Error: {str(e)}"
        )




