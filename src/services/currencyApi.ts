import type { ExchangeRateResponse } from '../types/currency';

const API_KEY = 'b6942816db80e2e6da36611b';
const BASE_URL = `https://v6.exchangerate-api.com/v6/${API_KEY}`;

export const fetchExchangeRates = async (fromCurrency: string): Promise<ExchangeRateResponse> => {
  const response = await fetch(`${BASE_URL}/latest/${fromCurrency}`);

  if (!response.ok) {
    const errorText = await response.text().catch(() => '');
    throw new Error(`Currency API error (${response.status}): ${errorText}`);
  }

  return response.json();
};