import { useState } from "react";
import { checkWebsiteSecurity } from "./services/securityApi";

interface SecurityResponse {
  url: string;
  https_available: boolean;
  ssl_valid: boolean;
  certificate_issuer: string | null;
  expiry_date: string | null;
  days_remaining: number | null;
  status: string;
  error?: string | null;
}

function SecurityPanel() {
  const [url, setUrl] = useState("");
  const [result, setResult] = useState<SecurityResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleScan = async () => {
    if (!url.trim()) {
      setError("Please enter a website URL.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setResult(null);

      const data = await checkWebsiteSecurity({ url: url.trim() });
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="security-panel">
      <h2>Website Security Checker</h2>
      <p>Check HTTPS availability and SSL certificate information.</p>

      <div className="security-input">
        <input
          type="text"
          placeholder="Enter website URL (e.g. https://example.com)"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
        <button onClick={handleScan} disabled={loading}>
          {loading ? "Scanning..." : "Check Security"}
        </button>
      </div>

      {error && <p className="security-error">{error}</p>}

      {result && (
        <div className="security-results">
          <h3>Security Results</h3>
          <p><strong>Website:</strong> {result.url}</p>
          <p><strong>HTTPS:</strong> {result.https_available ? "Available" : "Unavailable"}</p>
          <p><strong>SSL Certificate:</strong> {result.ssl_valid ? "Valid" : "Invalid / Unavailable"}</p>
          <p><strong>Certificate Issuer:</strong> {result.certificate_issuer || "Unknown"}</p>
          <p><strong>Expiry Date:</strong> {result.expiry_date ? new Date(result.expiry_date).toLocaleString() : "Unavailable"}</p>
          <p><strong>Days Remaining:</strong> {result.days_remaining ?? "Unavailable"}</p>
          <p><strong>Status:</strong> {result.status}</p>
          {result.error && <p className="security-error">{result.error}</p>}
        </div>
      )}
    </div>
  );
}

export default SecurityPanel;
