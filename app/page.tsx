'use client';

import { useState, useEffect } from 'react';
import { Bitcoin, TrendingUp, Wallet, Newspaper, RefreshCw, Loader2 } from 'lucide-react';
import BitcoinHoldingsChart from '@/components/BitcoinHoldingsChart';
import StockIndexCard from '@/components/StockIndexCard';
import NewsCard from '@/components/NewsCard';
import miningHoldings from '../data/mining-holdings.json';

export default function Home() {
  const [cryptoPrices, setCryptoPrices] = useState<any>(null);
  const [stockIndexes, setStockIndexes] = useState<any[]>([]);
  const [news, setNews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [cryptoRes, stockRes, newsRes] = await Promise.all([
        fetch('/api/crypto-prices'),
        fetch('/api/stock-indexes'),
        fetch('/api/news'),
      ]);

      const [cryptoData, stockData, newsData] = await Promise.all([
        cryptoRes.json(),
        stockRes.json(),
        newsRes.json(),
      ]);

      setCryptoPrices(cryptoData);
      setStockIndexes(stockData);
      setNews(newsData);
      setLastUpdate(new Date());
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Failed to load data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();

    // Auto-refresh every 5 minutes
    const interval = setInterval(fetchData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const btcPrice = cryptoPrices?.bitcoin?.usd || 0;
  const btcChange = cryptoPrices?.bitcoin?.usd_24h_change || 0;
  const ethPrice = cryptoPrices?.ethereum?.usd || 0;
  const ethChange = cryptoPrices?.ethereum?.usd_24h_change || 0;

  const mstrTotalValue = miningHoldings.microstrategy.bitcoin.current * btcPrice;
  const bitmineTotalValue =
    miningHoldings.bitmine.bitcoin * btcPrice +
    miningHoldings.bitmine.ethereum.current * ethPrice +
    miningHoldings.bitmine.totalValue;

  // Loading state
  if (loading && !cryptoPrices) {
    return (
      <main className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-16 h-16 animate-spin mx-auto text-orange-500 mb-4" />
          <p className="text-xl">Loading dashboard...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="border-b border-gray-800 p-6 sticky top-0 bg-gray-900/95 backdrop-blur-sm z-10">
        <div className="container mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <Bitcoin className="w-8 h-8 text-orange-500" />
              Crypto & Stock Dashboard
            </h1>
            <p className="text-gray-400 mt-1">
              Real-time tracking of mining companies, crypto prices, and stock indexes
            </p>
          </div>
          <button
            onClick={fetchData}
            disabled={loading}
            className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
            Refresh
          </button>
        </div>
      </header>

      {/* Error Message */}
      {error && (
        <div className="container mx-auto mt-6">
          <div className="bg-red-900/20 border border-red-700 text-red-400 px-4 py-3 rounded-lg">
            {error}
          </div>
        </div>
      )}

      {/* Content */}
      <div className="container mx-auto p-6 space-y-8">
        {/* Live Prices & Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Bitcoin Price</p>
                <p className="text-2xl font-bold text-orange-400 mt-1">
                  ${btcPrice.toLocaleString()}
                </p>
                <p className={`text-sm mt-1 ${btcChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {btcChange >= 0 ? '+' : ''}{btcChange.toFixed(2)}% (24h)
                </p>
              </div>
              <Bitcoin className="w-10 h-10 text-orange-500 opacity-20" />
            </div>
          </div>

          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Ethereum Price</p>
                <p className="text-2xl font-bold text-purple-400 mt-1">
                  ${ethPrice.toLocaleString()}
                </p>
                <p className={`text-sm mt-1 ${ethChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {ethChange >= 0 ? '+' : ''}{ethChange.toFixed(2)}% (24h)
                </p>
              </div>
              <Wallet className="w-10 h-10 text-purple-500 opacity-20" />
            </div>
          </div>

          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">MSTR Total Value</p>
                <p className="text-2xl font-bold text-blue-400 mt-1">
                  ${(mstrTotalValue / 1000000000).toFixed(2)}B
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  714,644 BTC
                </p>
              </div>
              <TrendingUp className="w-10 h-10 text-blue-500 opacity-20" />
            </div>
          </div>

          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">BitMine Total Value</p>
                <p className="text-2xl font-bold text-green-400 mt-1">
                  ${(bitmineTotalValue / 1000000000).toFixed(2)}B
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  4,325,739 ETH + 193 BTC
                </p>
              </div>
              <TrendingUp className="w-10 h-10 text-green-500 opacity-20" />
            </div>
          </div>
        </div>

        {/* Stock Indexes */}
        {stockIndexes.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <TrendingUp className="w-6 h-6" />
              Stock Market Indexes
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {stockIndexes.map((index) => (
                <StockIndexCard key={index.symbol} {...index} />
              ))}
            </div>
          </div>
        )}

        {/* MicroStrategy Section with Chart */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <h2 className="text-2xl font-bold mb-4">
              {miningHoldings.microstrategy.name}
            </h2>
            <div className="space-y-4">
              <div className="bg-gray-700/50 rounded-lg p-4">
                <p className="text-gray-400 text-sm">Bitcoin Holdings</p>
                <p className="text-4xl font-bold text-orange-400 mt-1">
                  {miningHoldings.microstrategy.bitcoin.current.toLocaleString()} BTC
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  {miningHoldings.microstrategy.bitcoin.percentageOfSupply}% of total supply
                </p>
              </div>

              <div className="bg-gray-700/50 rounded-lg p-4">
                <p className="text-gray-400 text-sm">Current Value</p>
                <p className="text-3xl font-bold text-green-400 mt-1">
                  ${(mstrTotalValue / 1000000000).toFixed(2)}B
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  @ ${btcPrice.toLocaleString()} per BTC
                </p>
              </div>

              <div className="bg-gray-700/50 rounded-lg p-4">
                <p className="text-gray-400 text-sm">Data Sources</p>
                <a
                  href={miningHoldings.microstrategy.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:underline text-sm mt-1 block"
                >
                  Official Website →
                </a>
                <a
                  href={miningHoldings.microstrategy.dataSource}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:underline text-sm"
                >
                  Bitbo Treasury →
                </a>
              </div>
            </div>
          </div>

          <BitcoinHoldingsChart history={miningHoldings.microstrategy.history} />
        </div>

        {/* BitMine Section */}
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <h2 className="text-2xl font-bold mb-6">
            {miningHoldings.bitmine.name}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-gray-700/50 rounded-lg p-4">
              <p className="text-gray-400 text-sm">Bitcoin</p>
              <p className="text-3xl font-bold text-orange-400 mt-1">
                {miningHoldings.bitmine.bitcoin} BTC
              </p>
              <p className="text-sm text-gray-500 mt-1">
                ${(miningHoldings.bitmine.bitcoin * btcPrice).toLocaleString()}
              </p>
            </div>

            <div className="bg-gray-700/50 rounded-lg p-4">
              <p className="text-gray-400 text-sm">Ethereum</p>
              <p className="text-3xl font-bold text-purple-400 mt-1">
                {miningHoldings.bitmine.ethereum.current.toLocaleString()} ETH
              </p>
              <p className="text-sm text-gray-500 mt-1">
                ${(miningHoldings.bitmine.ethereum.current * ethPrice).toLocaleString()}
              </p>
            </div>

            <div className="bg-gray-700/50 rounded-lg p-4">
              <p className="text-gray-400 text-sm">Total Crypto Value</p>
              <p className="text-3xl font-bold text-green-400 mt-1">
                ${((miningHoldings.bitmine.bitcoin * btcPrice +
                  miningHoldings.bitmine.ethereum.current * ethPrice) / 1000000000).toFixed(2)}B
              </p>
            </div>

            <div className="bg-gray-700/50 rounded-lg p-4">
              <p className="text-gray-400 text-sm">Total Treasury</p>
              <p className="text-3xl font-bold text-blue-400 mt-1">
                ${(bitmineTotalValue / 1000000000).toFixed(2)}B
              </p>
              <p className="text-sm text-gray-500 mt-1">
                Incl. cash & investments
              </p>
            </div>
          </div>

          <div className="mt-6 flex gap-4">
            <a
              href={miningHoldings.bitmine.website}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:underline text-sm"
            >
              Official Website →
            </a>
            <a
              href={miningHoldings.bitmine.dataSource}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:underline text-sm"
            >
              CoinGecko Treasury →
            </a>
          </div>
        </div>

        {/* News Section */}
        {news.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <Newspaper className="w-6 h-6" />
              Latest News
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {news.map((item, index) => (
                <NewsCard key={index} {...item} />
              ))}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="text-center text-gray-500 text-sm py-8 border-t border-gray-800">
          <p>
            Last updated: {lastUpdate ? lastUpdate.toLocaleString() : 'Loading...'}
          </p>
          <p className="mt-2">
            Data from CoinGecko, Yahoo Finance, Bitbo, and official company sources
          </p>
        </div>
      </div>
    </main>
  );
}
