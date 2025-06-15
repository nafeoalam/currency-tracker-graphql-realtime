import { PubSub, PubSubEngine } from "graphql-subscriptions";
import { CurrencyService } from "../services/currencyService";
import { MAJOR_CURRENCIES } from "../data/currencies";

const pubsub: PubSubEngine = new PubSub();
const currencyService = new CurrencyService();

// Real-time updates every 30 seconds
const startRealTimeUpdates = () => {
  setInterval(async () => {
    try {
      for (const baseCurrency of MAJOR_CURRENCIES) {
        const rates = await currencyService.getExchangeRates(baseCurrency);
        pubsub.publish(`CURRENCY_RATES_${baseCurrency}`, {
          currencyRatesUpdated: rates,
        });
      }
      console.log("✅ Real-time currency rates updated");
    } catch (error) {
      console.error("❌ Error updating real-time rates:", error);
    }
  }, 30000); // 30 seconds
};

// Start real-time updates
startRealTimeUpdates();

export const resolvers = {
  Query: {
    getExchangeRates: async (_: any, { base }: { base?: string }) => {
      return await currencyService.getExchangeRates(base);
    },

    getCurrencyPair: async (
      _: any,
      { base, target }: { base?: string; target: string }
    ) => {
      return await currencyService.getCurrencyPair(base, target);
    },

    getSupportedCurrencies: () => {
      return Object.keys(require("../data/currencies").CURRENCY_INFO);
    },
  },

  Subscription: {
    currencyRatesUpdated: {
      subscribe: (_: any, { base }: { base?: string }) => {
        const baseCurrency = base || "USD";
        return pubsub.asyncIterableIterator([`CURRENCY_RATES_${baseCurrency}`]);
      },
    },
  },
};
