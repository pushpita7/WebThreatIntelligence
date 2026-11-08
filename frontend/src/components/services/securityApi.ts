import type { SecurityRequest, SecurityResponse } from "../types/security";

const API_URL = "http://127.0.0.1:8000/api/scan/security";

export async function checkWebsiteSecurity(
  data: SecurityRequest
): Promise<SecurityResponse> {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);

    throw new Error(
      errorData?.detail || "Unable to check website security."
    );
  }

  return response.json() as Promise<SecurityResponse>;
}