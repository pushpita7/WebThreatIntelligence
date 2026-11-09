const API_BASE_URL = "http://127.0.0.1:8000";

export interface PhishingFinding {
  title: string;
  description: string;
  points: number;
}

export interface PhishingResponse {
  success: boolean;
  scan_id: number;
  original_url: string;
  normalized_url: string;
  hostname: string;
  risk_score: number;
  risk_level: "Low" | "Medium" | "High";
  indicators: string[];
  findings: PhishingFinding[];
  message: string;
}

export async function scanPhishingUrl(
  url: string
): Promise<PhishingResponse> {
  const response = await fetch(
    `${API_BASE_URL}/api/scan/phishing`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ url }),
    }
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(
      errorData.detail || "Phishing scan failed."
    );
  }

  return response.json();
}