const SEVERITY_CONFIG = {
  none: { color: "#22c55e", label: "No Threat", icon: "✓", bg: "#f0fdf4" },
  mild: { color: "#f59e0b", label: "Mild", icon: "⚠", bg: "#fffbeb" },
  moderate: { color: "#f97316", label: "Moderate", icon: "⚠⚠", bg: "#fff7ed" },
  severe: { color: "#ef4444", label: "Severe", icon: "🚨", bg: "#fef2f2" },
};

const CATEGORY_ICONS = {
  harassment: "👊",
  threats: "⚡",
  hate_speech: "💬",
  exclusion: "🚫",
  body_shaming: "😔",
};

export default function ResultCard({ result }) {
  if (!result) return null;
  const sev = SEVERITY_CONFIG[result.severity] || SEVERITY_CONFIG.none;
  const confPct = Math.round(result.confidence * 100);

  return (
    <div className="result-card" style={{ "--sev-color": sev.color, "--sev-bg": sev.bg }}>
      {/* Header */}
      <div className="result-header" style={{ background: sev.bg, borderColor: sev.color }}>
        <div className="verdict-badge" style={{ background: sev.color }}>
          <span className="verdict-icon">{sev.icon}</span>
          <div>
            <div className="verdict-main">
              {result.is_cyberbullying ? "Cyberbullying Detected" : "Message is Safe"}
            </div>
            <div className="verdict-severity">{sev.label} Severity</div>
          </div>
        </div>
        <div className="confidence-ring">
          <svg viewBox="0 0 64 64" className="ring-svg">
            <circle cx="32" cy="32" r="28" fill="none" stroke="#e5e7eb" strokeWidth="6" />
            <circle
              cx="32" cy="32" r="28"
              fill="none"
              stroke={sev.color}
              strokeWidth="6"
              strokeDasharray={`${confPct * 1.759} 175.9`}
              strokeLinecap="round"
              transform="rotate(-90 32 32)"
            />
          </svg>
          <div className="ring-label">
            <div className="ring-pct">{confPct}%</div>
            <div className="ring-text">confidence</div>
          </div>
        </div>
      </div>

      {/* Explanation */}
      <div className="result-section">
        <h4 className="section-title">🤖 AI Analysis</h4>
        <p className="explanation">{result.explanation}</p>
      </div>

      {/* Categories */}
      {result.categories?.length > 0 && (
        <div className="result-section">
          <h4 className="section-title">📋 Detected Categories</h4>
          <div className="category-tags">
            {result.categories.map((cat) => (
              <span key={cat} className="cat-tag" style={{ borderColor: sev.color }}>
                {CATEGORY_ICONS[cat] || "•"} {cat.replace("_", " ")}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* NLP Stats */}
      <div className="result-section">
        <h4 className="section-title">🔬 NLP Breakdown</h4>
        <div className="nlp-grid">
          <div className="nlp-stat">
            <span className="nlp-val">{result.nlp_analysis?.token_count}</span>
            <span className="nlp-lbl">tokens</span>
          </div>
          <div className="nlp-stat">
            <span className="nlp-val">{result.nlp_analysis?.unique_words}</span>
            <span className="nlp-lbl">unique words</span>
          </div>
          <div className="nlp-stat">
            <span className="nlp-val" style={{ color: result.nlp_analysis?.toxic_pattern_hits > 0 ? "#ef4444" : "#22c55e" }}>
              {result.nlp_analysis?.toxic_pattern_hits}
            </span>
            <span className="nlp-lbl">toxic patterns</span>
          </div>
          <div className="nlp-stat">
            <span className="nlp-val" style={{ color: result.nlp_analysis?.threat_pattern_hits > 0 ? "#ef4444" : "#22c55e" }}>
              {result.nlp_analysis?.threat_pattern_hits}
            </span>
            <span className="nlp-lbl">threat patterns</span>
          </div>
        </div>
        {result.nlp_analysis?.top_words?.length > 0 && (
          <div className="top-words">
            <span className="top-words-label">Key terms:</span>
            {result.nlp_analysis.top_words.map((w) => (
              <span key={w} className="word-chip">{w}</span>
            ))}
          </div>
        )}
      </div>

      {/* Suggestions */}
      {result.suggestions?.length > 0 && (
        <div className="result-section suggestions-section">
          <h4 className="section-title">💡 Recommended Actions</h4>
          <ul className="suggestions-list">
            {result.suggestions.map((s, i) => (
              <li key={i} className="suggestion-item">
                <span className="suggestion-num">{i + 1}</span>
                {s}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
