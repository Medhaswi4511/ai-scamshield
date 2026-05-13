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
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Tesseract Path
pytesseract.pytesseract.tesseract_cmd = (
    r"C:\Program Files\Tesseract-OCR\tesseract.exe"
)


# Request Models
class MessageRequest(BaseModel):
    text: str


class URLRequest(BaseModel):
    url: str


# Scam Keywords
SCAM_KEYWORDS = [
    "otp",
    "urgent",
    "verify",
    "bank",
    "blocked",
    "free money",
    "click now",
    "winner",
    "prize",
    "password",
    "login",
    "account suspended",
]


# Safe Keywords
SAFE_KEYWORDS = [
    "ai scamshield",
    "cybersecurity awareness",
    "educational project",
]


# AI Scam Analysis
def analyze_text(text: str):

    lower_text = text.lower()

    # Safe whitelist
    for word in SAFE_KEYWORDS:

        if word in lower_text:

            return {
                "is_scam": False,
                "risk_score": 0,
                "reasons": [
                    "Trusted educational content detected"
                ],
                "ai_explanation":
                "This content appears educational and does not contain harmful scam behavior."
            }

    reasons = []

    explanations = []

    score = 0

    # Keyword detection
    for keyword in SCAM_KEYWORDS:

        if keyword in lower_text:

            reasons.append(
                f"Detected suspicious keyword: {keyword}"
            )

            score += 15

    # AI explanation logic
    if "urgent" in lower_text:

        explanations.append(
            "This message creates urgency to pressure the user into acting quickly."
        )

    if "otp" in lower_text:

        explanations.append(
            "The message asks for OTP-related information which is commonly targeted in scams."
        )

    if (
        "free money" in lower_text
        or "winner" in lower_text
    ):

        explanations.append(
            "The message promises rewards or prizes which is a common scam tactic."
        )

    if (
        "login" in lower_text
        or "password" in lower_text
    ):

        explanations.append(
            "The message attempts to collect login credentials or sensitive information."
        )

    if "bank" in lower_text:

        explanations.append(
            "The message impersonates financial institutions to gain trust."
        )

    score = min(score, 100)

    if len(explanations) == 0:

        explanations.append(
            "No strong scam manipulation patterns detected."
        )

    return {
        "is_scam": score >= 40,
        "risk_score": score,

        "reasons": reasons
        if reasons
        else [
            "No major scam indicators detected"
        ],

        "ai_explanation":
        " ".join(explanations),
    }


# Scam Message Detection
@app.post("/detect-scam")
async def detect_scam(
    request: MessageRequest,
):

    return analyze_text(
        request.text
    )


# URL Detection
@app.post("/detect-url")
async def detect_url(
    request: URLRequest,
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


# Screenshot OCR Detection
@app.post("/scan-image")
async def scan_image(
    file: UploadFile = File(...)
):

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


# Root Route
@app.get("/")
async def root():

    return {
        "message":
        "AI ScamShield Backend Running"
    }