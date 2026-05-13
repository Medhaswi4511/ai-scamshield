from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from PIL import Image
import pytesseract

# Tesseract OCR path
pytesseract.pytesseract.tesseract_cmd = r"C:\Program Files\Tesseract-OCR\tesseract.exe"

app = FastAPI()

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Models
class MessageRequest(BaseModel):
    text: str

class URLRequest(BaseModel):
    url: str

# Scam keywords
scam_keywords = [
    "urgent",
    "click now",
    "otp",
    "bank",
    "account blocked",
    "verify",
    "winner",
    "free money",
    "kyc",
    "reward",
]

# Home route
@app.get("/")
def home():
    return {
        "message": "AI ScamShield backend running"
    }

# Message scanner
@app.post("/detect-scam")
def detect_scam(data: MessageRequest):

    text = data.text.lower()

    risk_score = 0

    reasons = []

    for keyword in scam_keywords:

        if keyword in text:

            risk_score += 15

            reasons.append(
                f"Detected keyword: {keyword}"
            )

    is_scam = risk_score >= 30

    return {
        "input": data.text,
        "risk_score": risk_score,
        "is_scam": is_scam,
        "reasons": reasons
    }

# URL scanner
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

            reasons.append(
                f"Suspicious keyword detected: {keyword}"
            )

    for domain in suspicious_domains:

        if domain in url:

            risk_score += 20

            reasons.append(
                f"Suspicious domain detected: {domain}"
            )

    if len(url) > 40:

        risk_score += 10

        reasons.append(
            "URL length unusually long"
        )

    is_phishing = risk_score >= 30

    return {
        "url": data.url,
        "risk_score": risk_score,
        "is_phishing": is_phishing,
        "reasons": reasons
    }

# Screenshot scanner
@app.post("/scan-image")
async def scan_image(
    file: UploadFile = File(...)
):

    image = Image.open(file.file)

    extracted_text = pytesseract.image_to_string(
        image
    )

    text = extracted_text.lower()

    risk_score = 0

    reasons = []

    for keyword in scam_keywords:

        if keyword in text:

            risk_score += 15

            reasons.append(
                f"Detected keyword: {keyword}"
            )

    is_scam = risk_score >= 30

    return {
        "extracted_text": extracted_text,
        "risk_score": risk_score,
        "is_scam": is_scam,
        "reasons": reasons
    }