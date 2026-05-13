from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class MessageRequest(BaseModel):
    text: str


class URLRequest(BaseModel):
    url: str


scam_keywords = [
    "urgent",
    "click now",
    "otp",
    "bank",
    "account blocked",
    "verify",
    "winner",
    "free money"
]


@app.get("/")
def home():
    return {"message": "AI ScamShield backend running"}


@app.post("/detect-scam")
def detect_scam(data: MessageRequest):
    text = data.text.lower()

    risk_score = 0
    reasons = []

    for keyword in scam_keywords:
        if keyword in text:
            risk_score += 15
            reasons.append(f"Detected keyword: {keyword}")

    is_scam = risk_score >= 30

    return {
        "input": data.text,
        "risk_score": risk_score,
        "is_scam": is_scam,
        "reasons": reasons
    }


@app.post("/detect-url")
def detect_url(data: URLRequest):
    url = data.url.lower()

    risk_score = 0
    reasons = []

    suspicious_keywords = [
        "login",
        "verify",
        "secure",
        "bank",
        "update",
        "free",
        "bonus"
    ]

    suspicious_domains = [
        ".xyz",
        ".tk",
        ".ru"
    ]

    for keyword in suspicious_keywords:
        if keyword in url:
            risk_score += 15
            reasons.append(f"Suspicious keyword detected: {keyword}")

    for domain in suspicious_domains:
        if domain in url:
            risk_score += 20
            reasons.append(f"Suspicious domain detected: {domain}")

    if len(url) > 40:
        risk_score += 10
        reasons.append("URL length unusually long")

    is_phishing = risk_score >= 30

    return {
        "url": data.url,
        "risk_score": risk_score,
        "is_phishing": is_phishing,
        "reasons": reasons
    }