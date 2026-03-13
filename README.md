CyberGuard AI — Cyberbullying Detection System
AI-powered cyberbullying detection using Python, NLP (NLTK + TextBlob), Ollama (LLaMA 3), Flask, and React.

Architecture
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

How It Works

NLP Preprocessing (NLTK)

Tokenization, lemmatization, stopword removal
Keyword matching across 4 threat categories
Sentiment analysis via TextBlob


AI Analysis (Ollama / LLaMA 3)

Enriched context sent to local LLM
Returns: severity, confidence, categories, recommended action
Falls back to rule-based scoring if Ollama is unavailable


Flask REST API

POST /analyze — single text
POST /batch-analyze — up to 20 texts
GET /stats — usage statistics
GET /health — health check


React Frontend

Single + batch analysis modes
Real-time confidence visualization
Keyword highlighting and sentiment display
Analysis history (last 50 results)




Setup & Running
Prerequisites

Python 3.9+
Node.js 18+
Ollama installed and running

1. Install & Run Ollama
bash# Install Ollama from https://ollama.ai
ollama pull llama3
ollama serve   # runs on http://localhost:11434
2. Backend
bashcd backend
pip install -r requirements.txt
python -m textblob.download_corpora    # download TextBlob data
python app.py
# → runs on http://localhost:5000
3. Frontend
bashcd frontend
npm install
npm start
# → opens http://localhost:3000

API Examples
bash# Single text
curl -X POST http://localhost:5000/analyze \
  -H "Content-Type: application/json" \
  -d '{"text": "You are such an idiot, nobody likes you"}'

# Batch
curl -X POST http://localhost:5000/batch-analyze \
  -H "Content-Type: application/json" \
  -d '{"texts": ["Great work today!", "I will destroy you"]}'
Response Structure
json{
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

Detection Categories
CategoryDescriptionthreatsPhysical or implied harm threatsinsultsDerogatory or demeaning languageharassmentStalking, spreading, exposingexclusionSocial isolation, rejectionhate_speechIdentity-based attackssexual_harassmentUnwanted sexual contentdoxxingPrivate info exposure
Severity Levels
LevelActionColornoneNo action🟢 GreenlowMonitor🟡 LimemediumWarn user🟠 AmberhighRemove content🔴 OrangecriticalEscalate immediately🚨 Red
