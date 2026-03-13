import re
import json
import requests
import nltk
from nltk.tokenize import word_tokenize
from nltk.corpus import stopwords
from nltk.stem import WordNetLemmatizer
from collections import Counter

# Download NLTK resources if not present
try:
    nltk.data.find("tokenizers/punkt")
except LookupError:
    nltk.download("punkt", quiet=True)
try:
    nltk.data.find("corpora/stopwords")
except LookupError:
    nltk.download("stopwords", quiet=True)
try:
    nltk.data.find("corpora/wordnet")
except LookupError:
    nltk.download("wordnet", quiet=True)

OLLAMA_URL = "http://localhost:11434/api/generate"
MODEL = "llama3"

TOXIC_PATTERNS = [
    r"\b(kill|die|kys|kms)\b",
    r"\b(hate|hater|disgusting|gross|ugly)\b",
    r"\b(stupid|idiot|dumb|moron|loser|worthless)\b",
    r"\b(fat|ugly|retard|retarded)\b",
    r"\b(nobody likes you|go away|leave|get out)\b",
    r"\b(shut up|shut it|stfu)\b",
]

THREAT_PATTERNS = [
    r"\b(i will|i'll|gonna|going to).{0,30}(hurt|kill|destroy|beat)\b",
    r"\b(watch your back|you're dead|i know where)\b",
]


class NLPPreprocessor:
    def __init__(self):
        self.lemmatizer = WordNetLemmatizer()
        self.stop_words = set(stopwords.words("english"))

    def preprocess(self, text: str) -> dict:
        # Clean
        cleaned = re.sub(r"[^\w\s!?.,]", " ", text.lower())
        tokens = word_tokenize(cleaned)
        filtered = [t for t in tokens if t.isalpha() and t not in self.stop_words]
        lemmatized = [self.lemmatizer.lemmatize(t) for t in filtered]

        # Pattern matching
        toxic_hits = sum(
            1 for p in TOXIC_PATTERNS if re.search(p, text, re.IGNORECASE)
        )
        threat_hits = sum(
            1 for p in THREAT_PATTERNS if re.search(p, text, re.IGNORECASE)
        )

        return {
            "cleaned_text": cleaned,
            "token_count": len(tokens),
            "unique_words": len(set(lemmatized)),
            "toxic_pattern_hits": toxic_hits,
            "threat_pattern_hits": threat_hits,
            "top_words": [w for w, _ in Counter(lemmatized).most_common(5)],
        }


class CyberbullyingDetector:
    def __init__(self):
        self.preprocessor = NLPPreprocessor()

    def _call_ollama(self, text: str, nlp_hints: dict) -> dict:
        prompt = f"""You are a cyberbullying detection AI. Analyze the following message carefully.

Message: "{text}"

NLP Analysis hints:
- Toxic pattern matches: {nlp_hints['toxic_pattern_hits']}
- Threat pattern matches: {nlp_hints['threat_pattern_hits']}
- Key words: {nlp_hints['top_words']}

Respond ONLY with a valid JSON object (no extra text) in this exact format:
{{
  "is_cyberbullying": true or false,
  "confidence": 0.0 to 1.0,
  "severity": "none" | "mild" | "moderate" | "severe",
  "categories": ["harassment", "threats", "hate_speech", "exclusion", "body_shaming"],
  "explanation": "brief explanation in 1-2 sentences",
  "suggestions": ["actionable suggestion 1", "actionable suggestion 2"]
}}

Only include relevant categories. Be accurate and concise."""

        try:
            response = requests.post(
                OLLAMA_URL,
                json={"model": MODEL, "prompt": prompt, "stream": False},
                timeout=60,
            )
            response.raise_for_status()
            raw = response.json().get("response", "")
            # Extract JSON from response
            match = re.search(r"\{.*\}", raw, re.DOTALL)
            if match:
                return json.loads(match.group())
            raise ValueError("No JSON found in Ollama response")
        except requests.exceptions.ConnectionError:
            raise RuntimeError(
                "Cannot connect to Ollama. Make sure it's running: `ollama serve`"
            )
        except json.JSONDecodeError as e:
            raise ValueError(f"Failed to parse Ollama response as JSON: {e}")

    def analyze(self, text: str) -> dict:
        nlp_data = self.preprocessor.preprocess(text)
        ollama_result = self._call_ollama(text, nlp_data)

        return {
            "text": text,
            "is_cyberbullying": ollama_result.get("is_cyberbullying", False),
            "confidence": round(float(ollama_result.get("confidence", 0.0)), 2),
            "severity": ollama_result.get("severity", "none"),
            "categories": ollama_result.get("categories", []),
            "explanation": ollama_result.get("explanation", ""),
            "suggestions": ollama_result.get("suggestions", []),
            "nlp_analysis": {
                "token_count": nlp_data["token_count"],
                "unique_words": nlp_data["unique_words"],
                "toxic_pattern_hits": nlp_data["toxic_pattern_hits"],
                "threat_pattern_hits": nlp_data["threat_pattern_hits"],
                "top_words": nlp_data["top_words"],
            },
        }
