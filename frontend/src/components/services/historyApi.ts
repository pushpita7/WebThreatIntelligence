
const API_BASE_URL = "http://127.0.0.1:8000";

export interface ScanHistoryItem {
  id: number;
  original_url: string;
  normalized_url: string;
  hostname: string;
  risk_score: number;
  risk_level: "Low" | "Medium" | "High";
  findings: {
    title: string;
    description: string;
    points: number;
  }[];
  scanned_at: string;
}

export interface ScanHistoryResponse {
  success: boolean;
  total_scans: number;
  history: ScanHistoryItem[];
}

export async function getScanHistory(): Promise<ScanHistoryResponse> {
  const response = await fetch(`${API_BASE_URL}/api/history`);

  if (!response.ok) {
    throw new Error("Unable to load scan history.");
  }

  return response.json();
}
