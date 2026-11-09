import { useState } from "react";
import {
  scanPhishingUrl,
  type PhishingResponse,
} from "./services/phishingApi";

export default function PhishingPanel() {
  const [url, setUrl] = useState("");
  const [result, setResult] = useState<PhishingResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleScan() {
    if (!url.trim()) {
      setError("Please enter a website URL.");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const data = await scanPhishingUrl(url);
      setResult(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  }

  const riskColor =
    result?.risk_level === "High"
      ? "#dc2626"
      : result?.risk_level === "Medium"
        ? "#d97706"
        : "#16a34a";

  return (
    <div style={{ maxWidth: "900px", margin: "0 auto", padding: "24px" }}>
      <h2>Phishing Detection</h2>

      <p>
        Analyze a website URL for suspicious patterns and possible phishing
        indicators.
      </p>

      <div style={{ display: "flex", gap: "12px", marginTop: "24px" }}>
        <input
          type="text"
          value={url}
          onChange={(event) => setUrl(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") handleScan();
          }}
          placeholder="Enter website URL, e.g. https://example.com"
          style={{
            flex: 1,
            padding: "12px",
            border: "1px solid #ccc",
            borderRadius: "8px",
            fontSize: "15px",
          }}
        />

        <button
          onClick={handleScan}
          disabled={loading}
          style={{
            padding: "12px 20px",
            border: "none",
            borderRadius: "8px",
            background: "#2563eb",
            color: "white",
            cursor: loading ? "not-allowed" : "pointer",
          }}
        >
          {loading ? "Scanning..." : "Scan Website"}
        </button>
      </div>

      {error && (
        <p style={{ color: "#dc2626", marginTop: "16px" }}>{error}</p>
      )}

      {result && (
        <div
          style={{
            marginTop: "28px",
            padding: "24px",
            border: "1px solid #ddd",
            borderRadius: "12px",
          }}
        >
          <h3>Scan Result</h3>

          <p><strong>Website:</strong> {result.normalized_url}</p>
          <p><strong>Risk Score:</strong> {result.risk_score}/100</p>

          <p>
            <strong>Risk Level: </strong>
            <span style={{ color: riskColor, fontWeight: "bold" }}>
              {result.risk_level}
            </span>
          </p>

          <h4>Detected Indicators</h4>

          {result.findings.length === 0 ? (
            <p>No suspicious indicators were detected by these checks.</p>
          ) : (
            <ul>
              {result.findings.map((finding, index) => (
                <li key={index} style={{ marginBottom: "14px" }}>
                  <strong>{finding.title}</strong>
                  <p>{finding.description}</p>
                  <small>Risk points: {finding.points}</small>
                </li>
              ))}
            </ul>
          )}

          <p style={{ color: "#666", fontSize: "13px" }}>
            This is a heuristic assessment, not a guarantee that a website is
            safe or malicious.
          </p>
        </div>
      )}
    </div>
  );
}