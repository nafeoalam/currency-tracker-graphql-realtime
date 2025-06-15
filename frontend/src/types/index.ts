export interface CurrencyRate {
    code: string;
    name: string;
    rate: number;
    lastUpdated: string;
    change24h?: number;
    changePercent24h?: number;
  }
  
  export interface ExchangeRateResponse {
    base: string;
    date: string;
    rates: CurrencyRate[];
    timestamp: number;
  }