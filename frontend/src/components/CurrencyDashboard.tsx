"use client";

import { useState, useEffect } from "react";
import { useQuery, useSubscription } from "@apollo/client";
import {
  GET_EXCHANGE_RATES,
  CURRENCY_RATES_SUBSCRIPTION,
} from "@/lib/graphql/queries";
import { ExchangeRateResponse, CurrencyRate } from "@/types";
import { TrendingUp, TrendingDown, RefreshCw } from "lucide-react";

const MAJOR_CURRENCIES = [
  "USD",
  "EUR",
  "GBP",
  "JPY",
  "AUD",
  "CAD",
  "CHF",
  "CNY",
];

export default function CurrencyDashboard() {
  const [baseCurrency, setBaseCurrency] = useState("USD");
  const [exchangeData, setExchangeData] = useState<ExchangeRateResponse | null>(
    null
  );
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  // Query for initial data
  const {
    data: queryData,
    loading,
    error,
    refetch,
  } = useQuery(GET_EXCHANGE_RATES, {
    variables: { base: baseCurrency },
    errorPolicy: "all",
  });

  // Subscription for real-time updates
  const { data: subscriptionData } = useSubscription(
    CURRENCY_RATES_SUBSCRIPTION,
    {
      variables: { base: baseCurrency },
    }
  );

  // Update data when query or subscription data changes
  useEffect(() => {
    if (subscriptionData?.currencyRatesUpdated) {
      setExchangeData(subscriptionData.currencyRatesUpdated);
      setLastUpdated(new Date());
    } else if (queryData?.getExchangeRates) {
      setExchangeData(queryData.getExchangeRates);
      setLastUpdated(new Date());
    }
  }, [queryData, subscriptionData]);

  const handleRefresh = () => {
    refetch();
  };

  const formatRate = (rate: number, code: string) => {
    // Special formatting for currencies like JPY
    const decimals = ["JPY", "KRW"].includes(code) ? 2 : 4;
    return rate.toFixed(decimals);
  };

  const getChangeColor = (change?: number) => {
    if (!change) return "text-gray-500";
    return change >= 0 ? "text-green-600" : "text-red-600";
  };

  const getChangeIcon = (change?: number) => {
    if (!change) return null;
    return change >= 0 ? (
      <TrendingUp className="w-4 h-4" />
    ) : (
      <TrendingDown className="w-4 h-4" />
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Loading currency data...</p>
        </div>
      </div>
    );
  }

  if (error && !exchangeData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center text-red-600">
          <p className="text-lg font-semibold mb-2">
            Error loading currency data
          </p>
          <p className="text-sm mb-4">{error.message}</p>
          <button
            onClick={handleRefresh}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Currency Tracker
              </h1>
              <p className="text-gray-600">
                Real-time exchange rates with live updates
              </p>
            </div>

            <div className="flex items-center gap-4">
              <select
                value={baseCurrency}
                onChange={(e) => setBaseCurrency(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                {MAJOR_CURRENCIES.map((currency) => (
                  <option key={currency} value={currency}>
                    {currency}
                  </option>
                ))}
              </select>

              <button
                onClick={handleRefresh}
                className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                title="Refresh rates"
              >
                <RefreshCw className="w-5 h-5" />
              </button>
            </div>
          </div>

          {lastUpdated && (
            <div className="mt-4 flex items-center gap-2 text-sm text-gray-500">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              Last updated: {lastUpdated.toLocaleTimeString()}
            </div>
          )}
        </header>

        {/* Currency Grid */}
        {exchangeData && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {exchangeData.rates
              .filter((currency) => currency.code !== exchangeData.base)
              .slice(0, 12)
              .map((currency: CurrencyRate) => (
                <div
                  key={currency.code}
                  className="bg-white rounded-xl shadow-sm border border-gray-200 p-2 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {currency.code}
                      </h3>
                      <p className="text-sm text-gray-600 truncate">
                        {currency.name}
                      </p>
                    </div>
                    <div
                      className={`flex items-center gap-1 ${getChangeColor(
                        currency.changePercent24h
                      )}`}
                    >
                      {getChangeIcon(currency.changePercent24h)}
                      <span className="text-sm font-medium">
                        {currency.changePercent24h
                          ? `${currency.changePercent24h > 0 ? "+" : ""}${
                              currency.changePercent24h
                            }%`
                          : "--"}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="text-right">
                      <p className="text-2xl font-bold text-gray-900">
                        {formatRate(currency.rate, currency.code)}
                      </p>
                      <p className="text-xs text-gray-500">
                        1 {exchangeData.base} ={" "}
                        {formatRate(currency.rate, currency.code)}{" "}
                        {currency.code}
                      </p>
                    </div>

                    {currency.change24h && (
                      <div
                        className={`text-right text-sm ${getChangeColor(
                          currency.change24h
                        )}`}
                      >
                        {currency.change24h > 0 ? "+" : ""}
                        {currency.change24h.toFixed(6)}
                      </div>
                    )}
                  </div>
                </div>
              ))}
          </div>
        )}

        {/* Status Bar */}
        <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-gray-600">
                Live updates every 30 seconds
              </span>
            </div>
            <div className="text-gray-500">
              Base: {exchangeData?.base} • {exchangeData?.rates.length}{" "}
              currencies
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
