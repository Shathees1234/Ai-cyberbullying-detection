export default function HistoryPanel({ history, onSelect }) {
  if (!history.length) return null;

  const sev2color = {
    none: "#22c55e", mild: "#f59e0b", moderate: "#f97316", severe: "#ef4444"
  };

  return (
    <div className="history-panel">
      <h3 className="history-title">Recent Analyses</h3>
      <div className="history-list">
        {history.map((item) => (
          <button
            key={item.id}
            className="history-item"
            onClick={() => onSelect(item)}
          >
            <span
              className="history-dot"
              style={{ background: sev2color[item.severity] || "#94a3b8" }}
            />
            <span className="history-text">{item.text.slice(0, 60)}{item.text.length > 60 ? "…" : ""}</span>
            <span className="history-badge" style={{ color: sev2color[item.severity] }}>
              {item.severity}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
