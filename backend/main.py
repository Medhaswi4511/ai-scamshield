from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from PIL import Image
import pytesseract
import io


app = FastAPI()


# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_origin_regex=".*",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# REQUEST MODELS
class MessageRequest(BaseModel):
    text: str


class URLRequest(BaseModel):
    url: str


# SMART PHISHING KEYWORDS
SCAM_KEYWORDS = [
    "free money",
    "winner",
    "claim prize",
    "crypto giveaway",
    "free reward",
    "otp",
    "urgent",
    "account suspended",
    "verify account",
]


# AI ANALYSIS
def analyze_text(text: str):

    # IMPORTANT FIX
    lower_text = (
        text.lower()
        .replace("-", " ")
        .replace("_", " ")
    )

    reasons = []

    explanations = []

    score = 0

    # KEYWORD DETECTION
    for keyword in SCAM_KEYWORDS:

        if keyword in lower_text:

            reasons.append(
                f"Detected suspicious keyword: {keyword}"
            )

            score += 30

    # AI EXPLANATIONS
    if "urgent" in lower_text:

        explanations.append(
            "This content creates urgency to pressure users."
        )

    if "otp" in lower_text:

        explanations.append(
            "OTP-related requests are common in scams."
        )

    if (
        "free money" in lower_text
        or "winner" in lower_text
        or "claim prize" in lower_text
    ):

        explanations.append(
            "This website promises rewards or prizes which is a common phishing tactic."
        )

    if "verify account" in lower_text:

        explanations.append(
            "The website attempts to collect sensitive account information."
        )

    # LIMIT SCORE
    score = min(score, 100)

    # SAFE RESPONSE
    if score == 0:

        explanations.append(
            "No strong phishing indicators detected."
        )

    return {
        "is_scam": score >= 30,

        "risk_score": score,

        "reasons":
        reasons if reasons else [
            "No major scam indicators detected"
        ],

        "ai_explanation":
        " ".join(explanations),
    }


# MESSAGE DETECTION
@app.post("/detect-scam")
async def detect_scam(
    request: MessageRequest
):

    return analyze_text(
        request.text
    )


# URL DETECTION
@app.post("/detect-url")
async def detect_url(
    request: URLRequest
):

    result = analyze_text(
        request.url
    )

    return {
        "is_phishing":
        result["is_scam"],

        "risk_score":
        result["risk_score"],

        "reasons":
        result["reasons"],

        "ai_explanation":
        result["ai_explanation"],
    }


# IMAGE OCR SCAN
@app.post("/scan-image")
async def scan_image(
    file: UploadFile = File(...)
):

    try:

        image_bytes = await file.read()

        image = Image.open(
            io.BytesIO(image_bytes)
        )

        extracted_text = (
            pytesseract.image_to_string(
                image
            )
        )

        result = analyze_text(
            extracted_text
        )

        return {
            "extracted_text":
            extracted_text,

            "is_scam":
            result["is_scam"],

            "risk_score":
            result["risk_score"],

            "reasons":
            result["reasons"],

            "ai_explanation":
            result["ai_explanation"],
        }

    except Exception:

        return {
            "extracted_text": "",

            "is_scam": False,

            "risk_score": 0,

            "reasons": [
                "OCR unavailable on deployed server"
            ],

            "ai_explanation":
            "Image OCR works locally only."
        }


# ROOT
@app.get("/")
async def root():

    return {
        "message":
        "AI ScamShield Backend Running"
    }