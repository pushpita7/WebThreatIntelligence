
import { useEffect, useState, type FormEvent } from 'react'
import './App.css'

type Report = {
  id: number
  url: string
  category: string
  description: string
  created_at: string
}

const API_URL = 'http://127.0.0.1:8000'

function App() {
  const [url, setUrl] = useState('')
  const [category, setCategory] = useState('')
  const [description, setDescription] = useState('')
  const [reports, setReports] = useState<Report[]>([])
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  // Retrieve reports from the backend
  async function loadReports() {
    try {
      const response = await fetch(`${API_URL}/reports`)

      if (!response.ok) {
        throw new Error('Could not load reports.')
      }

      const data: Report[] = await response.json()
      setReports(data)
    } catch {
      setError('Unable to connect to the backend. Please check that it is running.')
    }
  }

  useEffect(() => {
    loadReports()
  }, [])

  // Submit a new report
  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    setSuccess('')
    setError('')
    setLoading(true)

    try {
      const response = await fetch(`${API_URL}/reports`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          url,
          category,
          description
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(
          typeof data.detail === 'string'
            ? data.detail
            : 'Please check your entered information.'
        )
      }

      setUrl('')
      setCategory('')
      setDescription('')
      setSuccess('Report submitted successfully!')

      await loadReports()
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Something went wrong. Please try again.'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <a className="brand" href="#">
          <span className="brand-mark">W</span>
          <span>Web Threat <span className="brand-light">Intelligence</span></span>
        </a>

        <p className="nav-label">WORKSPACE</p>

        <nav>
          <a href="#report" className="nav-item active">
            <span>＋</span> Submit a report
          </a>
          <a href="#community" className="nav-item">
            <span>☷</span> Community reports
          </a>
        </nav>

        <div className="sidebar-bottom">
          <span className="status-dot"></span>
          Community reporting
          <p>Web safety starts with us.</p>
        </div>
      </aside>

      <main className="main-area">
        <header className="topbar">
          <span>Community / Threat reporting</span>
          <span className="topbar-tag">COMMUNITY SECURITY</span>
        </header>

        <div className="page-content">
          <section className="page-heading">
            <div>
              <p className="eyebrow">COMMUNITY SECURITY CENTER</p>
              <h1>Community threat reporting</h1>
              <p className="subtitle">
                Help make the internet safer by reporting suspicious websites.
              </p>
            </div>
            <div className="heading-icon">✳</div>
          </section>

          <div className="content-grid">
            <section className="card report-card" id="report">
              <div className="card-heading">
                <div>
                  <h2>Submit a website report</h2>
                  <p>Share details about a website you believe may be unsafe.</p>
                </div>
                <span className="card-icon">↗</span>
              </div>

              {success && (
                <div className="success-message" role="status">
                  <strong>✓ {success}</strong>
                  <p>Your report has been saved to the community database.</p>
                </div>
              )}

              {error && (
                <div className="error-message" role="alert">
                  <strong>Unable to complete the request</strong>
                  <p>{error}</p>
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="field">
                  <label htmlFor="website">Website URL <span>*</span></label>
                  <input
                    id="website"
                    type="url"
                    placeholder="https://example.com"
                    value={url}
                    onChange={event => setUrl(event.target.value)}
                    required
                  />
                  <small>Enter the complete website address.</small>
                </div>

                <div className="field">
                  <label htmlFor="category">Threat category <span>*</span></label>
                  <select
                    id="category"
                    value={category}
                    onChange={event => setCategory(event.target.value)}
                    required
                  >
                    <option value="">Select a category</option>
                    <option value="Phishing">Phishing</option>
                    <option value="Scam">Online scam</option>
                    <option value="Malware">Malware</option>
                    <option value="Spam">Spam</option>
                    <option value="Suspicious">Other suspicious activity</option>
                  </select>
                </div>

                <div className="field">
                  <label htmlFor="description">Description <span>*</span></label>
                  <textarea
                    id="description"
                    placeholder="Describe what you noticed about this website..."
                    rows={5}
                    maxLength={1000}
                    value={description}
                    onChange={event => setDescription(event.target.value)}
                    required
                  />
                  <small className="character-count">
                    {description.length}/1000 characters
                  </small>
                </div>

                <div className="privacy-note">
                  ⓘ Do not include passwords or personal information.
                </div>

                <button
                  type="submit"
                  className="submit-button"
                  disabled={loading}
                >
                  {loading ? 'Submitting...' : 'Submit report'}
                  <span>→</span>
                </button>
              </form>
            </section>

            <section className="card community-card" id="community">
              <div className="card-heading">
                <div>
                  <h2>Community reports</h2>
                  <p>Recently submitted websites</p>
                </div>
                <span className="report-total">{reports.length}</span>
              </div>

              {reports.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon">⌕</div>
                  <h3>No reports yet</h3>
                  <p>
                    Submitted websites will appear here.
                    Be the first to contribute.
                  </p>
                </div>
              ) : (
                <div className="report-list">
                  {reports.map(report => (
                    <article className="report-item" key={report.id}>
                      <span className="threat-label">{report.category}</span>
                      <a href={report.url} target="_blank" rel="noreferrer">
                        {report.url}
                      </a>
                      <p>{report.description}</p>
                      <small>
                        {new Date(report.created_at).toLocaleString()}
                      </small>
                    </article>
                  ))}
                </div>
              )}
            </section>
          </div>

          <footer className="footer">
            <span>© 2026 Web Threat Intelligence</span>
            <span>Community-powered website safety</span>
          </footer>
        </div>
      </main>
    </div>
  )
}

export default App
