export interface SecurityRequest {
  url: string;
}

export interface SecurityResponse {
  url: string;
  https_available: boolean;
  ssl_valid: boolean;
  certificate_issuer: string | null;
  expiry_date: string | null;
  days_remaining: number | null;
  status: string;
  error?: string | null;
}