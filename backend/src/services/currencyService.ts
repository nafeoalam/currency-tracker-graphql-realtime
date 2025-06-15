import {
  CurrencyRate,
  ExchangeRateResponse,
  CurrencyApiResponse,
} from "../types";
import { CURRENCY_INFO } from "../data/currencies";

export class CurrencyService {
  private readonly apiUrl: string;
  private cache: Map<
    string,
    { data: ExchangeRateResponse; timestamp: number }
  > = new Map();
  private readonly cacheTimeout = 5 * 60 * 1000; // 5 minutes

  constructor() {
    this.apiUrl =
      process.env.EXCHANGE_RATE_API_URL ||
      "https://api.exchangerate-api.com/v4/latest";
  }

  async getExchangeRates(base: string = "USD"): Promise<ExchangeRateResponse> {
    const cacheKey = `rates_${base}`;
    const cached = this.cache.get(cacheKey);

    // Return cached data if still valid
    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      return cached.data;
    }

    try {
      console.log(`Fetching exchange rates for ${base}...`);
      const response = await fetch(`${this.apiUrl}/${base}`);

      if (!response.ok) {
        throw new Error(
          `API request failed: ${response.status} ${response.statusText}`
        );
      }

      const apiData = await response.json() as CurrencyApiResponse;

      const rates: CurrencyRate[] = Object.entries(apiData.rates).map(
        ([code, rate]) => ({
          code,
          name: CURRENCY_INFO[code] || code,
          rate,
          lastUpdated: apiData.date,
          change24h: this.calculateChange(code, rate), // Mock calculation
          changePercent24h: this.calculatePercentChange(code, rate), // Mock calculation
        })
      );

      const result: ExchangeRateResponse = {
        base: apiData.base,
        date: apiData.date,
        rates,
        timestamp: Date.now(),
      };

      // Cache the result
      this.cache.set(cacheKey, { data: result, timestamp: Date.now() });

      return result;
    } catch (error) {
      console.error("Error fetching exchange rates:", error);

      // Return cached data if available, even if expired
      if (cached) {
        console.log("Returning expired cached data due to API error");
        return cached.data;
      }

      throw new Error(
        "Failed to fetch exchange rates and no cached data available"
      );
    }
  }

  async getCurrencyPair(
    base: string = "USD",
    target: string
  ): Promise<CurrencyRate | null> {
    const data = await this.getExchangeRates(base);
    return data.rates.find((rate) => rate.code === target) || null;
  }

  // Mock calculations - in real app, you'd store historical data
  private calculateChange(code: string, currentRate: number): number {
    // Mock 24h change calculation
    const mockChange = (Math.random() - 0.5) * currentRate * 0.02;
    return Number(mockChange.toFixed(6));
  }

  private calculatePercentChange(code: string, currentRate: number): number {
    // Mock percentage change calculation
    const mockPercent = (Math.random() - 0.5) * 2;
    return Number(mockPercent.toFixed(2));
  }

  clearCache(): void {
    this.cache.clear();
  }
}
