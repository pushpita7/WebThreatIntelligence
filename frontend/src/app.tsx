
import { useState } from "react";
import SecurityPanel from "./components/SecurityPanel";
import PhishingPanel from "./components/PhishingPanel";
import HistoryPanel from "./components/HistoryPanel";

function App() {
  const [activePage, setActivePage] = useState("dashboard");

  return (
    <div className="app">
      <header className="header">
        <div className="logo">
          <span>🛡️</span>
          WebThreat Intelligence
        </div>

        <nav>
          <button onClick={() => setActivePage("dashboard")}>
            Dashboard
          </button>

          <button onClick={() => setActivePage("security")}>
            Website Security
          </button>

          <button onClick={() => setActivePage("phishing")}>
            Phishing Detection
          </button>

          <button onClick={() => setActivePage("history")}>
            Scan History
          </button>
        </nav>
      </header>

      <main>
        {activePage === "dashboard" && (
          <div className="dashboard">
            <section className="hero">
              <span className="badge">WEB SECURITY PLATFORM</span>

              <h1>Protect Your Digital World</h1>

              <p>
                Analyze websites, identify potential threats,
                and understand website security risks.
              </p>

              <button
                className="primary-button"
                onClick={() => setActivePage("security")}
              >
                Scan a Website →
              </button>
            </section>

            <section style={{ padding: "40px 8%" }}>
              <h2 style={{ textAlign: "center", marginBottom: "25px" }}>
                Security Dashboard
              </h2>

              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                gap: "20px"
              }}>
                <div className="security-panel">
                  <h3>🔍 Website Scanner</h3>
                  <p>Check website SSL certificates and HTTPS security.</p>
                  <button
                    className="primary-button"
                    onClick={() => setActivePage("security")}
                  >
                    Open Scanner
                  </button>
                </div>

                <div className="security-panel">
                  <h3>🎣 Phishing Detection</h3>
                  <p>Analyze URLs for suspicious patterns and phishing indicators.</p>
                  <button
                    className="primary-button"
                    onClick={() => setActivePage("phishing")}
                  >
                    Open Phishing Scanner
                  </button>
                </div>

                <div className="security-panel">
                  <h3>🚨 Threat Reports</h3>
                  <p>Community-based website threat reporting.</p>
                  <p>Integration pending.</p>
                </div>

                <div className="security-panel">
                  <h3>📊 Scan History</h3>
                  <p>View previous website security scan records.</p>
                  <button
                    className="primary-button"
                    onClick={() => setActivePage("history")}
                  >
                    View History
                  </button>
                </div>
              </div>
            </section>
          </div>
        )}

        {activePage === "security" && (
          <section className="security-section">
            <SecurityPanel />
          </section>
        )}

        {activePage === "phishing" && (
          <section className="security-section">
            <PhishingPanel />
          </section>
        )}

        {activePage === "history" && (
          <section className="security-section">
            <HistoryPanel />
          </section>
        )}
      </main>

      <footer>
        WebThreat Intelligence © 2026
        <p>Stay aware. Stay protected.</p>
      </footer>
    </div>
  );
}

export default App;
