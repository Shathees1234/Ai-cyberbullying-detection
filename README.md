# CyberGuard AI — Cyberbullying Detection System

AI-powered cyberbullying detection using **Python**, **NLP (NLTK + TextBlob)**, **Ollama (LLaMA 3)**, **Flask**, and **React**.

---

## Architecture

```
cyberbullying-detection/
├── backend/
│   ├── app.py           # Flask REST API
│   ├── detector.py      # NLP + Ollama detection engine
│   └── requirements.txt
└── frontend/
    ├── public/index.html
    ├── package.json
    └── src/
        ├── App.jsx              # Main app + UI
        ├── App.css              # Dark cybersecurity theme
        ├── index.js
        ├── components/
        │   ├── ResultCard.jsx   # Detection result display
        │   └── HistoryPanel.jsx # Analysis history
        ├── hooks/
        │   └── useAnalysis.js   # API state management
        └── services/
            └── api.js           # Flask API client
```

---

## How It Works

1. **NLP Preprocessing** (NLTK)
   - Tokenization, lemmatization, stopword removal
   - Keyword matching across 4 threat categories
   - Sentiment analysis via TextBlob

2. **AI Analysis** (Ollama / LLaMA 3)
   - Enriched context sent to local LLM
   - Returns: severity, confidence, categories, recommended action
   - Falls back to rule-based scoring if Ollama is unavailable

3. **Flask REST API**
   - `POST /analyze` — single text
   - `POST /batch-analyze` — up to 20 texts
   - `GET /stats` — usage statistics
   - `GET /health` — health check

4. **React Frontend**
   - Single + batch analysis modes
   - Real-time confidence visualization
   - Keyword highlighting and sentiment display
   - Analysis history (last 50 results)

---

## Setup & Running

### Prerequisites
- Python 3.9+
- Node.js 18+
- [Ollama](https://ollama.ai) installed and running

### 1. Install & Run Ollama
```bash
# Install Ollama from https://ollama.ai
ollama pull llama3
ollama serve   # runs on http://localhost:11434
```

### 2. Backend
```bash
cd backend
pip install -r requirements.txt
python -m textblob.download_corpora    # download TextBlob data
python app.py
# → runs on http://localhost:5000
```

### 3. Frontend
```bash
cd frontend
npm install
npm start
# → opens http://localhost:3000
```

---

## API Examples

```bash
# Single text
curl -X POST http://localhost:5000/analyze \
  -H "Content-Type: application/json" \
  -d '{"text": "You are such an idiot, nobody likes you"}'

# Batch
curl -X POST http://localhost:5000/batch-analyze \
  -H "Content-Type: application/json" \
  -d '{"texts": ["Great work today!", "I will destroy you"]}'
```

### Response Structure
```json
{
  "text": "...",
  "timestamp": "2024-01-01T00:00:00Z",
  "processing_time_ms": 342.5,
  "nlp_features": {
    "sentiment": { "polarity": -0.8, "subjectivity": 0.9, "label": "negative" },
    "keywords_detected": {
      "threats": [], "insults": ["idiot"], "exclusion": [], "harassment": []
    },
    "text_stats": { "word_count": 9, "char_count": 42 }
  },
  "detection": {
    "is_cyberbullying": true,
    "confidence": 0.91,
    "severity": "high",
    "categories": ["insults", "exclusion"],
    "explanation": "The message contains direct insults...",
    "target": "individual",
    "recommended_action": "remove"
  }
}
```

---

## Detection Categories

| Category | Description |
|---|---|
| `threats` | Physical or implied harm threats |
| `insults` | Derogatory or demeaning language |
| `harassment` | Stalking, spreading, exposing |
| `exclusion` | Social isolation, rejection |
| `hate_speech` | Identity-based attacks |
| `sexual_harassment` | Unwanted sexual content |
| `doxxing` | Private info exposure |

## Severity Levels

| Level | Action | Color |
|---|---|---|
| `none` | No action | 🟢 Green |
| `low` | Monitor | 🟡 Lime |
| `medium` | Warn user | 🟠 Amber |
| `high` | Remove content | 🔴 Orange |
| `critical` | Escalate immediately | 🚨 Red |
