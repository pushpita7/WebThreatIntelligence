import { useEffect, useState } from "react";
import "./App.css";

interface Scan {
  id: number;
  url: string;
  scanned_at: string;
  risk_score: number | null;
  risk_level: string | null;
  is_phishing: boolean | null;
  scan_details: string | null;
}

function App() {
  const [scans, setScans] = useState<Scan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [selectedScan, setSelectedScan] = useState<Scan | null>(null);

 const loadScans = () => {
  setLoading(true);
  setError("");

  fetch("http://127.0.0.1:8000/history/")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to load history");
      }
      return response.json();
    })
    .then((data: Scan[]) => {
      setScans(data);
      setLoading(false);
    })
    .catch(() => {
      setError("Unable to connect to backend.");
      setLoading(false);
    });
};

useEffect(() => {
  loadScans();
}, []);

  const totalScans = scans.length;

  const safeScans = scans.filter(
    (scan) => scan.is_phishing === false
  ).length;

  const phishingScans = scans.filter(
    (scan) => scan.is_phishing === true
  ).length;

  const filteredScans = scans.filter((scan) => {
    const matchesSearch = scan.url
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesFilter =
      filter === "All" ||
      (filter === "Safe" && scan.is_phishing === false) ||
      (filter === "Phishing" && scan.is_phishing === true);

    return matchesSearch && matchesFilter;
  });

  return (
    <div className="container">

      <h1>Scan History Dashboard</h1>

      <p className="subtitle">
        Monitor your website security scan activities
      </p>
      <button
  className="refresh-button"
  onClick={loadScans}
  disabled={loading}
>
  {loading ? "Refreshing..." : "↻ Refresh History"}
</button>

      {/* Dashboard Statistics */}

      <div className="stats-container">

        <div className="stat-card total">
          <h3>Total Scans</h3>
          <h2>{totalScans}</h2>
        </div>

        <div className="stat-card safe">
          <h3>Safe Websites</h3>
          <h2>{safeScans}</h2>
        </div>

        <div className="stat-card phishing">
          <h3>Phishing Detected</h3>
          <h2>{phishingScans}</h2>
        </div>

      </div>

      <h2 className="history-heading">Recent Scan History</h2>

      {/* Search and Filter */}

      <div className="search-filter">

        <input
          type="text"
          placeholder="Search website URL..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="All">All Scans</option>
          <option value="Safe">Safe Websites</option>
          <option value="Phishing">Phishing Websites</option>
        </select>

      </div>

      {loading && <p>Loading scan history...</p>}

      {error && <p className="error">{error}</p>}

      {!loading && !error && filteredScans.length === 0 && (
        <p>No matching scan records found.</p>
      )}

      {/* Scan History Cards */}

      <div className="scan-list">

        {filteredScans.map((scan) => (

          <div className="scan-card" key={scan.id}>

            <h3>{scan.url}</h3>

            <p>
              Scanned At:{" "}
              {new Date(scan.scanned_at).toLocaleString()}
            </p>

            <p>
              Risk Score: {scan.risk_score ?? "Not available"}
            </p>

            <p>
              Risk Level: {scan.risk_level ?? "Not available"}
            </p>

            <p>
              Status:{" "}
              {scan.is_phishing === null
                ? "Not available"
                : scan.is_phishing
                ? "Phishing Detected"
                : "Safe"}
            </p>

            <button
              className="details-button"
              onClick={() => setSelectedScan(scan)}
            >
              View Details
            </button>

          </div>

        ))}

      </div>

      {/* Individual Scan Details */}
      {selectedScan !== null && (

        <div className="details-box">

          <h2>Scan Details</h2>

          <p><strong>Scan ID:</strong> {selectedScan.id}</p>

          <p><strong>Website:</strong> {selectedScan.url}</p>

          <p>
            <strong>Scanned At:</strong>{" "}
            {new Date(selectedScan.scanned_at).toLocaleString()}
          </p>

          <p>
            <strong>Risk Score:</strong>{" "}
            {selectedScan.risk_score ?? "Not available"}
          </p>

          <p>
            <strong>Risk Level:</strong>{" "}
            {selectedScan.risk_level ?? "Not available"}
          </p>

          <p>
  Status:{" "}
  <span
    className={
      scan.is_phishing === true
        ? "phishing-badge"
        : scan.is_phishing === false
        ? "safe-badge"
        : "unknown-badge"
    }
  >
    {scan.is_phishing === null
      ? "Not available"
      : scan.is_phishing
      ? "Phishing Detected"
      : "Safe"}
  </span>
</p>

          <p>
            <strong>Scan Information:</strong>{" "}
            {selectedScan.scan_details || "No additional details available."}
          </p>

          <button
            className="close-button"
            onClick={() => setSelectedScan(null)}
          >
            Close Details
          </button>

        </div>

      )}

    </div>
  );
}

export default App;