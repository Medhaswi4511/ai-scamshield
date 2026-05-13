# AI ScamShield 🛡️

AI-powered scam, phishing, and cyber threat detection platform built using Next.js, FastAPI, and a custom Chrome browser extension.

---

# Features

## Web Application

✅ Scam Message Detection  
✅ Phishing URL Scanner  
✅ Screenshot OCR Scam Detection  
✅ Scam Awareness Quiz Mode  
✅ AI Risk Score Analysis  
✅ Modern Cybersecurity Dashboard UI  

---

## Browser Extension

✅ Automatic Background URL Scanning  
✅ Real-Time Phishing Detection  
✅ Red Danger Badge Alerts  
✅ Live Warning Overlay Popups  
✅ Current Website Risk Analysis  

---

# Screenshot OCR Scanner

Upload screenshots of:
- OTP scams
- phishing messages
- fake banking alerts
- suspicious chats

The system:
1. Extracts text using OCR
2. Detects scam indicators
3. Calculates AI risk score
4. Displays phishing analysis

---

# Scam Awareness Quiz

Interactive cybersecurity training mode where users identify:
- phishing attempts
- scam messages
- safe communications

---

# Tech Stack

## Frontend
- Next.js
- React
- Tailwind CSS

## Backend
- FastAPI
- Python
- Pytesseract OCR
- Pillow

## Browser Extension
- JavaScript
- Chrome Extension APIs
- Background Workers
- Content Scripts

---

# Browser Extension Workflow

1. User opens website
2. Extension scans URL automatically
3. AI ScamShield backend analyzes phishing risk
4. Extension displays:
   - warning badge
   - phishing overlay
   - risk alerts

---

# Installation

## Frontend

```bash
cd frontend
npm install
npm run dev
```

## Backend

```bash
cd backend
pip install -r requirements.txt
python -m uvicorn main:app --reload
```

## Browser Extension

1. Open:
```text
chrome://extensions
```

2. Enable:
```text
Developer Mode
```

3. Click:
```text
Load unpacked
```

4. Select:
```text
browser-extension
```

---

# Future Enhancements

- AI NLP scam analysis
- Voice scam call detection
- Community scam reporting
- Scam intelligence heatmaps
- AI explanation engine
- Dangerous website blocking
- ML-based phishing prediction

---

# Author

Medhaswi
