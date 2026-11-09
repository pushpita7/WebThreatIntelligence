
import { useEffect, useState } from "react";
import {
  getScanHistory,
  type ScanHistoryItem,
} from "./services/historyApi";

export default function HistoryPanel() {
  const [history, setHistory] = useState<ScanHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadHistory() {
    try {
      setLoading(true);
      setError("");

      const data = await getScanHistory();
      setHistory(data.history);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to load scan history."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadHistory();
  }, []);

  function getRiskColor(level: string) {
    if (level === "High") return "#dc2626";
    if (level === "Medium") return "#d97706";
    return "#16a34a";
  }

  return (
    <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "30px 24px" }}>
      <h2>Scan History</h2>
      <p>View previously analyzed websites and their risk assessments.</p>

      <button
        className="primary-button"
        onClick={loadHistory}
        disabled={loading}
        style={{ marginTop: "16px" }}
      >
        {loading ? "Loading..." : "Refresh History"}
      </button>

      {loading && <p>Loading previous scans...</p>}

      {error && (
        <p style={{ color: "#dc2626", marginTop: "20px" }}>
          {error}
        </p>
      )}

      {!loading && !error && (
        <>
          <h3 style={{ marginTop: "28px" }}>
            Total Scans: {history.length}
          </h3>

          {history.length === 0 ? (
            <p>No scan records found yet.</p>
          ) : (
            <div style={{ overflowX: "auto", marginTop: "20px" }}>
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  textAlign: "left",
                }}
              >
                <thead>
                  <tr>
                    <th style={{ padding: "12px", borderBottom: "1px solid #ddd" }}>Website</th>
                    <th style={{ padding: "12px", borderBottom: "1px solid #ddd" }}>Risk Score</th>
                    <th style={{ padding: "12px", borderBottom: "1px solid #ddd" }}>Risk Level</th>
                    <th style={{ padding: "12px", borderBottom: "1px solid #ddd" }}>Scanned At</th>
                  </tr>
                </thead>

                <tbody>
                  {history.map((scan) => (
                    <tr key={scan.id}>
                      <td style={{ padding: "12px", borderBottom: "1px solid #eee" }}>
                        {scan.original_url}
                      </td>

                      <td style={{ padding: "12px", borderBottom: "1px solid #eee" }}>
                        {scan.risk_score}/100
                      </td>

                      <td style={{ padding: "12px", borderBottom: "1px solid #eee" }}>
                        <strong style={{ color: getRiskColor(scan.risk_level) }}>
                          {scan.risk_level}
                        </strong>
                      </td>

                      <td style={{ padding: "12px", borderBottom: "1px solid #eee" }}>
                        {new Date(scan.scanned_at).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  );
}
