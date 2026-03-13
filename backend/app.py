from flask import Flask, request, jsonify
from flask_cors import CORS
from detector import CyberbullyingDetector
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app)

detector = CyberbullyingDetector()

@app.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "ok", "model": "ollama/llama3"})

@app.route("/analyze", methods=["POST"])
def analyze():
    data = request.get_json()
    if not data or "text" not in data:
        return jsonify({"error": "Missing 'text' field"}), 400
    text = data["text"].strip()
    if not text:
        return jsonify({"error": "Text cannot be empty"}), 400
    try:
        result = detector.analyze(text)
        return jsonify(result)
    except Exception as e:
        logger.error(f"Analysis error: {e}")
        return jsonify({"error": str(e)}), 500

@app.route("/batch", methods=["POST"])
def batch_analyze():
    data = request.get_json()
    if not data or "texts" not in data:
        return jsonify({"error": "Missing 'texts' field"}), 400
    texts = data["texts"]
    if not isinstance(texts, list) or len(texts) == 0:
        return jsonify({"error": "Texts must be a non-empty list"}), 400
    results = []
    for text in texts[:20]:
        try:
            result = detector.analyze(text)
            results.append({"text": text, **result})
        except Exception as e:
            results.append({"text": text, "error": str(e)})
    return jsonify({"results": results})

if __name__ == "__main__":
    app.run(debug=True, port=5000)
