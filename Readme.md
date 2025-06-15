# 🏦 Currency Tracker - Real-time Exchange Rates

A modern, real-time currency tracking application built with GraphQL, Node.js, and Next.js. Track live exchange rates with WebSocket subscriptions and beautiful, responsive UI.

![Currency Tracker](https://img.shields.io/badge/Status-Active-green)
![Node.js](https://img.shields.io/badge/Node.js-18+-green)
![GraphQL](https://img.shields.io/badge/GraphQL-16+-blue)
![Next.js](https://img.shields.io/badge/Next.js-14+-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5+-blue)

## ✨ Features

- 🔄 **Real-time Updates** - Live currency rates updated every 30 seconds
- 📊 **Multiple Base Currencies** - Support for USD, EUR, GBP, JPY, AUD, CAD, CHF, CNY
- 📈 **24h Change Tracking** - See price movements and percentage changes
- 🎯 **GraphQL API** - Modern, efficient data fetching
- 🔌 **WebSocket Subscriptions** - Real-time data streaming
- 📱 **Responsive Design** - Works on desktop, tablet, and mobile
- ⚡ **Fast Performance** - Built with Next.js and optimized caching
- 🎨 **Beautiful UI** - Clean, modern interface with Tailwind CSS

## 🛠️ Technology Stack

### Backend

- **Node.js** - Runtime environment
- **Apollo Server Express** - GraphQL server
- **TypeScript** - Type safety
- **GraphQL Subscriptions** - Real-time updates
- **WebSocket** - Live data streaming
- **Express** - Web framework

### Frontend

- **Next.js 14** - React framework with App Router
- **React 18** - UI library
- **Apollo Client** - GraphQL client
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Lucide React** - Icons

### External APIs

- **ExchangeRate-API** - Free currency exchange rates
- Alternative: Fixer.io, CurrencyAPI

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn
- Git

### Installation

1. **Clone the repository**

   ```bash
   git clone <your-repo-url>
   cd currency-tracker-app
   ```

2. **Setup Backend**

   ```bash
   cd backend
   npm install
   ```

3. **Setup Frontend**

   ```bash
   cd ../frontend
   npm install
   ```

4. **Environment Configuration**

   ```bash
   # Backend (.env)
   cd ../backend
   cp .env.example .env
   ```

   Update `backend/.env`:

   ```env
   PORT=4000
   NODE_ENV=development
   CORS_ORIGIN=http://localhost:3000
   EXCHANGE_RATE_API_URL=https://api.exchangerate-api.com/v4/latest
   ```

### Running the Application

1. **Start Backend Server**

   ```bash
   cd backend
   npm run dev
   ```

   Server will start at `http://localhost:4000`

2. **Start Frontend Server** (new terminal)

   ```bash
   cd frontend
   npm run dev
   ```

   App will open at `http://localhost:3000`

## 🔌 API Documentation

### GraphQL Endpoints

**Server URL:** `http://localhost:4000/graphql`

### Queries

#### Get Exchange Rates

```graphql
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
```

#### Get Currency Pair

```graphql
query GetCurrencyPair($base: String, $target: String!) {
  getCurrencyPair(base: $base, target: $target) {
    code
    name
    rate
    change24h
    changePercent24h
  }
}
```

### Subscriptions

#### Real-time Currency Updates

```graphql
subscription CurrencyRatesUpdated($base: String) {
  currencyRatesUpdated(base: $base) {
    base
    date
    rates {
      code
      name
      rate
      changePercent24h
    }
  }
}
```

## ⚙️ Environment Variables

### Backend (.env)

```env
PORT=4000                                                   # Server port
NODE_ENV=development                                        # Environment
CORS_ORIGIN=http://localhost:3000                          # Frontend URL
EXCHANGE_RATE_API_URL=https://api.exchangerate-api.com/v4/latest # Currency API
```

## 🔧 Available Scripts

### Backend

```bash
npm run dev     # Start development server
npm run build   # Build for production
npm start       # Start production server
```

### Frontend

```bash
npm run dev     # Start development server
npm run build   # Build for production
npm start       # Start production server
npm run lint    # Run ESLint
```

## 🐛 Troubleshooting

### Common Issues

1. **Apollo Studio Connection Error**
   - Use direct GraphQL endpoint: `http://localhost:4000/graphql`
   - Apollo Studio has CORS restrictions with localhost

2. **WebSocket Connection Failed**
   - Ensure backend server is running
   - Check CORS configuration
   - Verify WebSocket support

3. **Currency Data Not Loading**
   - Check internet connection
   - Verify API rate limits
   - Check console for errors

4. **TypeScript Errors**
   - Ensure all dependencies are installed
   - Run `npm install` in both directories
   - Check Node.js version (18+ required)

### Debug Commands

```bash
# Check server health
curl http://localhost:4000/health

# Test GraphQL endpoint
curl -X POST http://localhost:4000/graphql \
  -H "Content-Type: application/json" \
  -d '{"query": "{ getExchangeRates { base } }"}'
```

## 🚀 Deployment

### Backend Deployment

- **Railway**: Connect GitHub repo, auto-deploy
- **Render**: Easy Node.js deployment
- **Heroku**: Classic PaaS option

### Frontend Deployment

- **Vercel**: Optimized for Next.js (recommended)
- **Netlify**: Static site deployment
- **Railway**: Full-stack deployment

### Environment Setup

```bash
# Production environment variables
NODE_ENV=production
PORT=4000
CORS_ORIGIN=https://your-frontend-domain.com
```

## 🔮 Future Enhancements

- [ ] **Historical Charts** - Price history with Chart.js
- [ ] **Price Alerts** - Email/SMS notifications
- [ ] **Favorites** - Save preferred currency pairs
- [ ] **Currency Converter** - Built-in conversion tool
- [ ] **Authentication** - User accounts and preferences
- [ ] **Database Integration** - PostgreSQL/MongoDB for data persistence
- [ ] **Mobile App** - React Native companion
- [ ] **API Rate Limiting** - Implement request throttling
- [ ] **Caching Strategy** - Redis for performance
- [ ] **Dark Mode** - Theme switching

## 📄 License

MIT License - see LICENSE file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📞 Support

For support and questions:

- Open an issue on GitHub
- Check existing documentation
- Review troubleshooting section

---

Built with ❤️ using GraphQL, Node.js, and Next.js
