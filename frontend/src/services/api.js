const BASE_URL = "http://localhost:5000";

export async function analyzeText(text) {
  const res = await fetch(`${BASE_URL}/analyze`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "Analysis failed");
  }
  return res.json();
}

export async function batchAnalyze(texts) {
  const res = await fetch(`${BASE_URL}/batch`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ texts }),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "Batch analysis failed");
  }
  return res.json();
}

export async function checkHealth() {
  const res = await fetch(`${BASE_URL}/health`);
  return res.json();
}
