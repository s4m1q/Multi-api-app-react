// src/types/currency.ts

export interface ExchangeRateResponse {
  result: 'success' | 'error';
  conversion_rates: Record<string, number>;
  time_last_update_utc: string;
  error_type?: string;
}