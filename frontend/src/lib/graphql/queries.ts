import { gql } from '@apollo/client';

export const GET_EXCHANGE_RATES = gql`
  query GetExchangeRates($base: String) {
    getExchangeRates(base: $base) {
      base
      date
      timestamp
      rates {
        code
        name
        rate
        lastUpdated
        change24h
        changePercent24h
      }
    }
  }
`;

export const GET_CURRENCY_PAIR = gql`
  query GetCurrencyPair($base: String, $target: String!) {
    getCurrencyPair(base: $base, target: $target) {
      code
      name
      rate
      lastUpdated
      change24h
      changePercent24h
    }
  }
`;

export const GET_SUPPORTED_CURRENCIES = gql`
  query GetSupportedCurrencies {
    getSupportedCurrencies
  }
`;

export const CURRENCY_RATES_SUBSCRIPTION = gql`
  subscription CurrencyRatesUpdated($base: String) {
    currencyRatesUpdated(base: $base) {
      base
      date
      timestamp
      rates {
        code
        name
        rate
        lastUpdated
        change24h
        changePercent24h
      }
    }
  }
`;