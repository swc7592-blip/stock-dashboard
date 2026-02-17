# 🚀 Crypto & Stock Dashboard

Real-time dashboard for tracking:
- Mining company Bitcoin/Ethereum holdings
- Live cryptocurrency prices
- Stock market indexes (Korea & USA)
- Latest crypto news
- Economic calendar with real-time data

## ✨ Features

### 1. 📊 Chart Visualization
- MicroStrategy Bitcoin holdings history chart
- Interactive line chart with tooltips
- Time-series data visualization

### 2. ⚡ Real-Time Price Updates
- Live Bitcoin & Ethereum prices (CoinGecko API)
- Auto-refresh every 5 minutes
- 24h price change indicators
- Total portfolio value calculation

### 3. 📰 News Section
- Latest crypto & mining news
- Filtered for relevant topics
- Links to full articles
- Auto-refresh every 5 minutes

### 4. 🔄 Auto Data Updates
- Update script for mining company data
- Easy to run manually or via cron
- Preserves historical data

### 5. 🇰🇷🇺🇸 Stock Market Indexes
- **Korea:** KOSPI (^KS11), KOSDAQ (^KQ11)
- **USA:** NASDAQ (^IXIC), S&P 500 (^GSPC), Dow Jones (^DJI)
- Live price & change tracking
- Color-coded indicators (green/red)

### 6. 📅 Economic Calendar
- Daily, Weekly, and Monthly views
- Real-time economic data from FRED API (Federal Reserve)
- Actual values for past events (when FRED API is configured)
- Historical data with charts
- 3-star (high importance) events only
- Time zones displayed in KST (Korea Standard Time)

## 🛠️ Tech Stack

- **Frontend:** Next.js 15 + React
- **Styling:** Tailwind CSS
- **Charts:** Recharts
- **Data APIs:**
  - CoinGecko (Crypto prices & News)
  - Yahoo Finance (Stock indexes)
  - Bitbo (MicroStrategy data)
- **Icons:** Lucide React

## 📦 Installation

```bash
npm install
```

## 🚀 Development

```bash
npm run dev
```

Open http://localhost:3000

## 🏗️ Build

```bash
npm run build
npm start
```

## 📝 Update Mining Data

Run the update script to fetch the latest holdings data:

```bash
node scripts/update-mining-data.js
```

### Set up automatic updates (Cron)

**Linux/Mac:**
```bash
# Edit crontab
crontab -e

# Add this line to run daily at midnight
0 0 * * * cd /path/to/stock-dashboard && node scripts/update-mining-data.js
```

**Windows (Task Scheduler):**
- Create a new task
- Set trigger to daily
- Action: Run `node C:\path\to\stock-dashboard\scripts\update-mining-data.js`

## 📁 Project Structure

```
stock-dashboard/
├── app/
│   ├── api/
│   │   ├── crypto-prices/route.ts    # Crypto price API
│   │   ├── stock-indexes/route.ts    # Stock index API
│   │   ├── news/route.ts             # News API
│   │   └── economic-calendar/
│   │       ├── route.ts              # Economic calendar API (main)
│   │       └── fred.ts               # FRED API integration
│   ├── components/                    # React components
│   │   ├── BitcoinHoldingsChart.tsx
│   │   ├── StockIndexCard.tsx
│   │   ├── NewsCard.tsx
│   │   ├── EconomicCalendar.tsx      # Economic calendar component
│   │   ├── EconomicEventCard.tsx     # Individual event card
│   │   └── EconomicEventHistory.tsx  # Event history modal
│   ├── lib/
│   │   └── utils.ts                  # Utility functions
│   ├── ui/
│   │   └── card.tsx                  # UI components
│   ├── layout.tsx
│   └── page.tsx                      # Main dashboard
├── data/
│   └── mining-holdings.json           # Mining company data
├── scripts/
│   └── update-mining-data.js         # Data update script
├── .env.local.example                 # Environment variables template
└── public/
```

## 🔑 API Keys

### Optional APIs (Recommended for Full Features)

**FRED API (Federal Reserve Economic Data) - Recommended**
- Get your free API key: https://fred.stlouisfed.org/docs/api/api_key.html
- Free tier: 120 requests per minute
- Add to `.env.local`:
  ```
  FRED_API_KEY=your_api_key_here
  ```
- Provides real economic data for the Economic Calendar

### Free APIs (No Key Required)
- **CoinGecko:** Free tier (limited requests)
- **Yahoo Finance:** Public endpoints

## 📊 Data Sources

- **MicroStrategy:** https://bitbo.io/treasuries/microstrategy/
- **BitMine:** https://www.coingecko.com/en/treasuries/companies/bitmine
- **Crypto Prices:** CoinGecko API
- **Stock Indexes:** Yahoo Finance API
- **News:** CoinGecko News API
- **Economic Calendar:** FRED API (St. Louis Fed) or mock data fallback

## 🌐 Deployment

This project is optimized for Vercel:
- Zero configuration deployment
- Automatic caching with `revalidate`
- Server-side rendering for SEO

### Deploy to Vercel:
```bash
vercel deploy
```

## 🔄 API Caching

- **Crypto prices:** 60 seconds
- **Stock indexes:** Server-side fetch (no cache)
- **News:** 300 seconds (5 minutes)

## 📈 Future Enhancements

- [ ] Add more mining companies (Marathon, Riot, CleanSpark)
- [ ] Historical price charts
- [ ] Portfolio comparison tool
- [ ] Custom alerts/notifications
- [ ] User authentication & personalized portfolios
- [ ] Mobile app version
- [ ] Economic calendar alerts & notifications
- [ ] More economic indicators (global markets)
- [ ] Integration with Trading Economics API for global data

## 📄 License

MIT

---

Built with ❤️ by 엑스 (X) | Macro Economics Expert
