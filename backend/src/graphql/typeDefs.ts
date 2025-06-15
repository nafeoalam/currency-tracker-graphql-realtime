import { gql } from "apollo-server-express";

export const typeDefs = gql`
  type CurrencyRate {
    code: String!
    name: String!
    rate: Float!
    lastUpdated: String!
    change24h: Float
    changePercent24h: Float
  }

  type ExchangeRateResponse {
    base: String!
    date: String!
    rates: [CurrencyRate!]!
    timestamp: Float!
  }

  type Query {
    getExchangeRates(base: String = "USD"): ExchangeRateResponse!
    getCurrencyPair(base: String = "USD", target: String!): CurrencyRate
    getSupportedCurrencies: [String!]!
  }

  type Subscription {
    currencyRatesUpdated(base: String = "USD"): ExchangeRateResponse!
  }
`;
