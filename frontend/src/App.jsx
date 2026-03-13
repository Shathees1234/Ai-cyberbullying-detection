import { useState } from "react";
import TextInput from "./components/TextInput";
import ResultCard from "./components/ResultCard";
import HistoryPanel from "./components/HistoryPanel";
import BatchAnalyzer from "./components/BatchAnalyzer";
import { useAnalysis } from "./hooks/useAnalysis";
import "./App.css";

export default function App() {
  const { result, loading, error, history, analyze, analyzeBatch, clearResult } = useAnalysis();
  const [tab, setTab] = useState("single");
  const [selectedResult, setSelectedResult] = useState(null);

  const displayResult = selectedResult || result;

  return (
    <div className="app">
      {/* Header */}
      <header className="app-header">
        <div className="header-inner">
          <div className="logo">
            <span className="logo-icon">🛡</span>
            <div>
              <div className="logo-title">CyberGuard AI</div>
              <div className="logo-sub">Powered by Ollama · NLP · LLaMA 3</div>
            </div>
          </div>
          <div className="header-tags">
            <span className="tag">Flask</span>
            <span className="tag">React</span>
            <span className="tag">NLTK</span>
            <span className="tag">Ollama</span>
          </div>
        </div>
      </header>

      <main className="app-main">
        {/* Tabs */}
        <div className="tabs">
          <button className={`tab ${tab === "single" ? "active" : ""}`} onClick={() => setTab("single")}>
            Single Analysis
          </button>
          <button className={`tab ${tab === "batch" ? "active" : ""}`} onClick={() => setTab("batch")}>
            Batch Analysis
          </button>
        </div>

        <div className="content-grid">
          <div className="left-col">
            {tab === "single" ? (
              <>
                <TextInput onAnalyze={analyze} loading={loading} />
                {error && (
                  <div className="error-box">
                    <strong>⚠ Error:</strong> {error}
                  </div>
                )}
                <ResultCard result={displayResult} />
              </>
            ) : (
              <BatchAnalyzer onBatchAnalyze={analyzeBatch} loading={loading} />
            )}
          </div>

          <div className="right-col">
            <div className="info-card">
              <h3 className="info-title">How It Works</h3>
              <div className="pipeline">
                <div className="pipeline-step">
                  <span className="step-num">1</span>
                  <div>
                    <div className="step-title">NLP Preprocessing</div>
                    <div className="step-desc">Tokenization, lemmatization & pattern matching via NLTK</div>
                  </div>
                </div>
                <div className="pipeline-arrow">↓</div>
                <div className="pipeline-step">
                  <span className="step-num">2</span>
                  <div>
                    <div className="step-title">Ollama LLM</div>
                    <div className="step-desc">LLaMA 3 analyzes context and semantics locally</div>
                  </div>
                </div>
                <div className="pipeline-arrow">↓</div>
                <div className="pipeline-step">
                  <span className="step-num">3</span>
                  <div>
                    <div className="step-title">Flask API</div>
                    <div className="step-desc">Results served with confidence score and categories</div>
                  </div>
                </div>
              </div>
            </div>

            <HistoryPanel
              history={history}
              onSelect={(item) => {
                setSelectedResult(item);
                setTab("single");
              }}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
