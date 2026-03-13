import { useState, useCallback } from "react";
import { analyzeText, batchAnalyze } from "../services/api";

export function useAnalysis() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [history, setHistory] = useState([]);

  const analyze = useCallback(async (text) => {
    if (!text.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const data = await analyzeText(text);
      setResult(data);
      setHistory((prev) => [{ ...data, id: Date.now() }, ...prev].slice(0, 20));
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const analyzeBatch = useCallback(async (texts) => {
    setLoading(true);
    setError(null);
    try {
      const data = await batchAnalyze(texts);
      return data.results;
    } catch (e) {
      setError(e.message);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const clearResult = useCallback(() => {
    setResult(null);
    setError(null);
  }, []);

  return { result, loading, error, history, analyze, analyzeBatch, clearResult };
}
